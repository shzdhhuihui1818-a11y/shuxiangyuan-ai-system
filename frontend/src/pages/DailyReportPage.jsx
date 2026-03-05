import { useState } from 'react';
import { api } from '../api';

const today = new Date().toISOString().slice(0, 10);

export default function DailyReportPage() {
  const [date, setDate] = useState(today);
  const [report, setReport] = useState(null);

  const load = async () => {
    const result = await api.getDailyReport(date);
    setReport(result);
  };

  return (
    <div className="panel">
      <h3>Daily Business Report</h3>
      <div className="inline">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button onClick={load}>Generate Report</button>
      </div>
      {report && (
        <>
          <p><strong>Date:</strong> {report.date}</p>
          <p><strong>Daily Revenue:</strong> {report.summary.dailyRevenue.toFixed(2)}</p>
          <p><strong>Weekly Revenue:</strong> {report.summary.weeklyRevenue.toFixed(2)}</p>
          <p><strong>Monthly Revenue:</strong> {report.summary.monthlyRevenue.toFixed(2)}</p>
          <h4>Business Insights</h4>
          <ul>
            {report.insights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
