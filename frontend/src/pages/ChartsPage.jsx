import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import { api } from '../api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

export default function ChartsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.getCharts().then(setData);
  }, []);

  if (!data) return <div className="panel">Loading charts...</div>;

  const dailyTrendData = {
    labels: data.dailyTrend.map((row) => row.date),
    datasets: [
      {
        label: 'Total Daily Revenue',
        data: data.dailyTrend.map((row) => row.total_revenue),
        borderColor: '#e85d04',
        backgroundColor: '#e85d04'
      }
    ]
  };

  const weeklyProfitData = {
    labels: data.weeklyProfitTrend.map((row) => row.week),
    datasets: [
      {
        label: 'Weekly Profit',
        data: data.weeklyProfitTrend.map((row) => row.profit),
        borderColor: '#2a9d8f',
        backgroundColor: '#2a9d8f'
      }
    ]
  };

  const ratioData = {
    labels: ['Dine-in', 'Delivery'],
    datasets: [
      {
        data: [data.deliveryVsDineIn.dineIn, data.deliveryVsDineIn.delivery],
        backgroundColor: ['#264653', '#f4a261']
      }
    ]
  };

  return (
    <div className="grid">
      <div className="panel">
        <h3>Daily Revenue Trends</h3>
        <Line data={dailyTrendData} />
      </div>
      <div className="panel">
        <h3>Weekly Profit Trends</h3>
        <Line data={weeklyProfitData} />
      </div>
      <div className="panel">
        <h3>Delivery vs Dine-in Ratio</h3>
        <Pie data={ratioData} />
      </div>
    </div>
  );
}
