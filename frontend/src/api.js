const API_BASE = 'http://localhost:4000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Request failed');
  }
  return response.json();
}

export const api = {
  saveRevenue: (payload) => request('/revenue', { method: 'POST', body: JSON.stringify(payload) }),
  saveCost: (payload) => request('/costs', { method: 'POST', body: JSON.stringify(payload) }),
  getStats: (date) => request(`/stats?date=${date}`),
  getCharts: () => request('/charts'),
  getDailyReport: (date) => request(`/report/daily?date=${date}`)
};
