import { useState } from 'react';
import { api } from '../api';

const today = new Date().toISOString().slice(0, 10);

export default function DataInputPage() {
  const [message, setMessage] = useState('');
  const [revenueForm, setRevenueForm] = useState({
    date: today,
    dineInRevenue: 0,
    deliveryRevenue: 0,
    customerCount: 0
  });
  const [costForm, setCostForm] = useState({
    periodStart: today,
    periodType: 'weekly',
    ingredientCost: 0,
    rent: 0,
    staffSalaries: 0,
    platformCommission: 0
  });

  const submitRevenue = async (e) => {
    e.preventDefault();
    try {
      const result = await api.saveRevenue(revenueForm);
      setMessage(`Revenue saved. Total daily revenue: ${result.totalRevenue.toFixed(2)}`);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const submitCost = async (e) => {
    e.preventDefault();
    try {
      const result = await api.saveCost(costForm);
      setMessage(`Cost saved. Total cost: ${result.totalCost.toFixed(2)}`);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="grid">
      <form className="panel" onSubmit={submitRevenue}>
        <h3>Revenue Data Recording</h3>
        <label>Date<input type="date" value={revenueForm.date} onChange={(e) => setRevenueForm({ ...revenueForm, date: e.target.value })} /></label>
        <label>Dine-in Revenue<input type="number" value={revenueForm.dineInRevenue} onChange={(e) => setRevenueForm({ ...revenueForm, dineInRevenue: Number(e.target.value) })} /></label>
        <label>Delivery Revenue<input type="number" value={revenueForm.deliveryRevenue} onChange={(e) => setRevenueForm({ ...revenueForm, deliveryRevenue: Number(e.target.value) })} /></label>
        <label>Customer Count<input type="number" value={revenueForm.customerCount} onChange={(e) => setRevenueForm({ ...revenueForm, customerCount: Number(e.target.value) })} /></label>
        <button type="submit">Save Revenue</button>
      </form>

      <form className="panel" onSubmit={submitCost}>
        <h3>Cost Recording</h3>
        <label>Period Start<input type="date" value={costForm.periodStart} onChange={(e) => setCostForm({ ...costForm, periodStart: e.target.value })} /></label>
        <label>Period Type
          <select value={costForm.periodType} onChange={(e) => setCostForm({ ...costForm, periodType: e.target.value })}>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </label>
        <label>Ingredient Purchasing Cost<input type="number" value={costForm.ingredientCost} onChange={(e) => setCostForm({ ...costForm, ingredientCost: Number(e.target.value) })} /></label>
        <label>Rent<input type="number" value={costForm.rent} onChange={(e) => setCostForm({ ...costForm, rent: Number(e.target.value) })} /></label>
        <label>Staff Salaries<input type="number" value={costForm.staffSalaries} onChange={(e) => setCostForm({ ...costForm, staffSalaries: Number(e.target.value) })} /></label>
        <label>Platform Commission Fees<input type="number" value={costForm.platformCommission} onChange={(e) => setCostForm({ ...costForm, platformCommission: Number(e.target.value) })} /></label>
        <button type="submit">Save Cost</button>
      </form>

      {message ? <p className="message">{message}</p> : null}
    </div>
  );
}
