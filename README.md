# ShuXiangYuan AI Restaurant System

A modular full-stack web dashboard for restaurant operations management.

## Tech Stack

- **Frontend**: React + Vite + Chart.js
- **Backend**: Node.js + Express
- **Database**: SQLite

## Features

1. **Revenue Data Recording**
   - Daily dine-in revenue
   - Daily delivery revenue
   - Daily customer count
   - Automatic total daily revenue calculation

2. **Cost Recording**
   - Weekly ingredient purchasing cost
   - Rent
   - Staff salaries
   - Platform commission fees
   - Supports weekly and monthly cost entries

3. **Automatic Profit Calculation**
   - Daily profit
   - Weekly profit
   - Monthly profit
   - Formula: `Profit = Revenue - Costs`

4. **Data Visualization**
   - Daily revenue trends line chart
   - Weekly profit trends line chart
   - Delivery vs dine-in pie chart

5. **Business Insight Module**
   - Auto-generated insights based on day-over-day changes
   - Example recommendation for decreased per-customer spend

6. **Admin Dashboard Interface**
   - Data input page
   - Data statistics page
   - Chart visualization page
   - Daily business report page

## Project Structure

```text
.
├── backend/
│   ├── src/
│   │   ├── db/
│   │   ├── routes/
│   │   └── services/
│   └── data.sqlite
├── frontend/
│   └── src/
│       ├── components/
│       └── pages/
└── README.md
```

## Run Locally

### 1) Install dependencies

```bash
npm install
```

### 2) Start backend + frontend together

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:4000

### 3) Production build (frontend)

```bash
npm run build
```

### 4) Start backend only

```bash
npm run start
```

## API Endpoints

- `POST /api/revenue` - save daily revenue data
- `POST /api/costs` - save weekly/monthly costs
- `GET /api/stats?date=YYYY-MM-DD` - daily/weekly/monthly profit statistics
- `GET /api/charts` - chart datasets
- `GET /api/report/daily?date=YYYY-MM-DD` - daily report + insights

