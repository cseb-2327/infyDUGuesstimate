import React, { useState } from 'react';
import Dashboard from './pages/Dashboard.jsx';
import Lobs from './pages/Lobs.jsx';
import AddData from './pages/AddData.jsx';
import UpdateData from './pages/UpdateData.jsx';
import Reports from './pages/Reports.jsx';

const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'add', label: 'Add Data' },
  { id: 'update', label: 'Update Data' },
  { id: 'reports', label: 'Reports' },
  { id: 'lobs', label: 'LOBs' },
];

export default function App() {
  const [tab, setTab] = useState('dashboard');

  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">Infy<span>DU</span> Guesstimate</div>
          <nav className="nav">
            {TABS.map((t) => (
              <button key={t.id} className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)}>
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>
      <main>
        {tab === 'dashboard' && <Dashboard goto={setTab} />}
        {tab === 'add' && <AddData />}
        {tab === 'update' && <UpdateData />}
        {tab === 'reports' && <Reports />}
        {tab === 'lobs' && <Lobs />}
      </main>
    </>
  );
}
