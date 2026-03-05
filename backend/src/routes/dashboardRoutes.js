import express from 'express';
import dayjs from 'dayjs';
import { all, get, run } from '../db/database.js';
import {
  computeProfit,
  computeTotalCost,
  computeTotalRevenue,
  getMonthStart,
  getWeekStart
} from '../services/calculations.js';
import { generateInsights } from '../services/insights.js';

const router = express.Router();

router.post('/revenue', async (req, res) => {
  try {
    const { date, dineInRevenue, deliveryRevenue, customerCount } = req.body;
    const totalRevenue = computeTotalRevenue({ dineInRevenue, deliveryRevenue });

    await run(
      `
      INSERT INTO daily_records (date, dine_in_revenue, delivery_revenue, customer_count, total_revenue)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(date) DO UPDATE SET
      dine_in_revenue = excluded.dine_in_revenue,
      delivery_revenue = excluded.delivery_revenue,
      customer_count = excluded.customer_count,
      total_revenue = excluded.total_revenue
      `,
      [date, dineInRevenue, deliveryRevenue, customerCount, totalRevenue]
    );

    res.json({ message: 'Daily revenue saved.', totalRevenue });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/costs', async (req, res) => {
  try {
    const { periodStart, periodType = 'weekly', ingredientCost, rent, staffSalaries, platformCommission } =
      req.body;

    const totalCost = computeTotalCost({ ingredientCost, rent, staffSalaries, platformCommission });

    await run(
      `
      INSERT INTO cost_records
      (period_start, period_type, ingredient_cost, rent, staff_salaries, platform_commission, total_cost)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(period_start, period_type) DO UPDATE SET
      ingredient_cost = excluded.ingredient_cost,
      rent = excluded.rent,
      staff_salaries = excluded.staff_salaries,
      platform_commission = excluded.platform_commission,
      total_cost = excluded.total_cost
      `,
      [periodStart, periodType, ingredientCost, rent, staffSalaries, platformCommission, totalCost]
    );

    res.json({ message: 'Cost record saved.', totalCost });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date || dayjs().format('YYYY-MM-DD');
    const weekStart = getWeekStart(targetDate);
    const monthStart = getMonthStart(targetDate);

    const dayRevenue =
      (await get('SELECT total_revenue FROM daily_records WHERE date = ?', [targetDate]))?.total_revenue || 0;

    const weekRevenue =
      (
        await get(
          'SELECT COALESCE(SUM(total_revenue), 0) AS revenue FROM daily_records WHERE date BETWEEN ? AND ?',
          [weekStart, targetDate]
        )
      )?.revenue || 0;

    const monthRevenue =
      (
        await get(
          'SELECT COALESCE(SUM(total_revenue), 0) AS revenue FROM daily_records WHERE date BETWEEN ? AND ?',
          [monthStart, targetDate]
        )
      )?.revenue || 0;

    const weekCosts =
      (
        await get(
          'SELECT COALESCE(SUM(total_cost), 0) AS cost FROM cost_records WHERE period_type = ? AND period_start BETWEEN ? AND ?',
          ['weekly', weekStart, targetDate]
        )
      )?.cost || 0;

    const monthCosts =
      (
        await get(
          'SELECT COALESCE(SUM(total_cost), 0) AS cost FROM cost_records WHERE period_type = ? AND period_start BETWEEN ? AND ?',
          ['monthly', monthStart, targetDate]
        )
      )?.cost || 0;

    const dayCost =
      (await get('SELECT COALESCE(total_cost / 7, 0) AS avg_daily_cost FROM cost_records WHERE period_type = ? ORDER BY period_start DESC LIMIT 1', ['weekly']))
        ?.avg_daily_cost || 0;

    res.json({
      targetDate,
      dailyProfit: computeProfit(dayRevenue, dayCost),
      weeklyProfit: computeProfit(weekRevenue, weekCosts),
      monthlyProfit: computeProfit(monthRevenue, monthCosts),
      revenue: {
        daily: dayRevenue,
        weekly: weekRevenue,
        monthly: monthRevenue
      },
      costs: {
        dailyEstimated: dayCost,
        weekly: weekCosts,
        monthly: monthCosts
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/charts', async (_req, res) => {
  try {
    const dailyTrend = await all(
      'SELECT date, dine_in_revenue, delivery_revenue, total_revenue FROM daily_records ORDER BY date ASC LIMIT 30'
    );

    const weeklyProfit = await all(`
      SELECT
        substr(date, 1, 4) || '-W' || strftime('%W', date) AS week,
        SUM(total_revenue) AS revenue
      FROM daily_records
      GROUP BY week
      ORDER BY week ASC
      LIMIT 12
    `);

    const weeklyCosts = await all(`
      SELECT substr(period_start, 1, 4) || '-W' || strftime('%W', period_start) AS week, SUM(total_cost) AS cost
      FROM cost_records
      WHERE period_type = 'weekly'
      GROUP BY week
      ORDER BY week ASC
      LIMIT 12
    `);

    const costByWeek = new Map(weeklyCosts.map((item) => [item.week, item.cost]));

    const weeklyProfitTrend = weeklyProfit.map((item) => ({
      week: item.week,
      profit: computeProfit(item.revenue, costByWeek.get(item.week) || 0)
    }));

    const ratioBase = dailyTrend.reduce(
      (acc, row) => {
        acc.dineIn += row.dine_in_revenue;
        acc.delivery += row.delivery_revenue;
        return acc;
      },
      { dineIn: 0, delivery: 0 }
    );

    res.json({
      dailyTrend,
      weeklyProfitTrend,
      deliveryVsDineIn: ratioBase
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/report/daily', async (req, res) => {
  try {
    const date = req.query.date || dayjs().format('YYYY-MM-DD');
    const today = await get('SELECT * FROM daily_records WHERE date = ?', [date]);
    const yesterday = await get('SELECT * FROM daily_records WHERE date = ?', [dayjs(date).subtract(1, 'day').format('YYYY-MM-DD')]);

    const stats = await (async () => {
      const weekStart = getWeekStart(date);
      const monthStart = getMonthStart(date);

      const weekRevenue =
        (
          await get(
            'SELECT COALESCE(SUM(total_revenue), 0) AS revenue FROM daily_records WHERE date BETWEEN ? AND ?',
            [weekStart, date]
          )
        )?.revenue || 0;
      const monthRevenue =
        (
          await get(
            'SELECT COALESCE(SUM(total_revenue), 0) AS revenue FROM daily_records WHERE date BETWEEN ? AND ?',
            [monthStart, date]
          )
        )?.revenue || 0;

      return { weekRevenue, monthRevenue };
    })();

    const insights = generateInsights({ today, yesterday });

    res.json({
      date,
      today,
      summary: {
        dailyRevenue: today?.total_revenue || 0,
        weeklyRevenue: stats.weekRevenue,
        monthlyRevenue: stats.monthRevenue
      },
      insights
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
