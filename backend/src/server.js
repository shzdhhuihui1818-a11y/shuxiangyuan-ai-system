import express from 'express';
import cors from 'cors';
import dashboardRoutes from './routes/dashboardRoutes.js';
import { initDb } from './db/database.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use('/api', dashboardRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
});
