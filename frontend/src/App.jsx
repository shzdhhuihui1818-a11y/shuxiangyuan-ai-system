import { useState } from 'react';
import NavTabs from './components/NavTabs';
import DataInputPage from './pages/DataInputPage';
import StatsPage from './pages/StatsPage';
import ChartsPage from './pages/ChartsPage';
import DailyReportPage from './pages/DailyReportPage';

const tabs = ['Data Input', 'Statistics', 'Charts', 'Daily Report'];

export default function App() {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <main className="container">
      <h1>ShuXiangYuan AI Restaurant Management Dashboard</h1>
      <NavTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'Data Input' && <DataInputPage />}
      {activeTab === 'Statistics' && <StatsPage />}
      {activeTab === 'Charts' && <ChartsPage />}
      {activeTab === 'Daily Report' && <DailyReportPage />}
    </main>
  );
}
