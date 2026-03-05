import dayjs from 'dayjs';

export const toNumber = (value) => Number(value || 0);

export function computeTotalRevenue({ dineInRevenue, deliveryRevenue }) {
  return toNumber(dineInRevenue) + toNumber(deliveryRevenue);
}

export function computeTotalCost({ ingredientCost, rent, staffSalaries, platformCommission }) {
  return (
    toNumber(ingredientCost) +
    toNumber(rent) +
    toNumber(staffSalaries) +
    toNumber(platformCommission)
  );
}

export function getWeekStart(dateStr) {
  const date = dayjs(dateStr);
  const dayOfWeek = date.day();
  const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  return date.subtract(diff, 'day').format('YYYY-MM-DD');
}

export function getMonthStart(dateStr) {
  return dayjs(dateStr).startOf('month').format('YYYY-MM-DD');
}

export function computeProfit(revenue = 0, costs = 0) {
  return toNumber(revenue) - toNumber(costs);
}
