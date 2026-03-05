import { useEffect, useState } from 'react';
import { api } from '../api';

const today = new Date().toISOString().slice(0, 10);

export default function StatsPage() {
  const [date, setDate] = useState(today);
  const [stats, setStats] = useState(null);

  const load = async () => {
    const result = await api.getStats(date);
    setStats(result);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="panel">
      <h3>Data Statistics</h3>
      <div className="inline">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button onClick={load}>Refresh</button>
      </div>
      {stats && (
        <div className="stats-grid">
          <div><strong>Daily Profit:</strong> {stats.dailyProfit.toFixed(2)}</div>
          <div><strong>Weekly Profit:</strong> {stats.weeklyProfit.toFixed(2)}</div>
          <div><strong>Monthly Profit:</strong> {stats.monthlyProfit.toFixed(2)}</div>
          <div><strong>Daily Revenue:</strong> {stats.revenue.daily.toFixed(2)}</div>
          <div><strong>Weekly Revenue:</strong> {stats.revenue.weekly.toFixed(2)}</div>
          <div><strong>Monthly Revenue:</strong> {stats.revenue.monthly.toFixed(2)}</div>
        </div>
      )}
    </div>
  );
}
