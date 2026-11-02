import React, { useEffect, useState } from 'react';
import { api } from '../api.js';
import BarChart from '../components/BarChart.jsx';
import Alert from '../components/Alert.jsx';
import { currentYear, fmt, pct } from '../utils.js';

const VOLUME_SERIES = [
  { key: 'confident', name: 'Confident', color: 'var(--c1)' },
  { key: 'opportunities', name: 'Opportunities', color: 'var(--c2)' },
  { key: 'supplySupportNeed', name: 'Supply support need', color: 'var(--c3)' },
];
const REVENUE_SERIES = [
  { key: 'forecastedRevenue', name: 'Forecasted', color: 'var(--c2)' },
  { key: 'actualRevenue', name: 'Actual', color: 'var(--c1)' },
];

function badge(p) {
  if (p == null) return <span className="badge">–</span>;
  const cls = p >= 95 ? 'good' : p >= 75 ? 'warn' : 'bad';
  return <span className={`badge ${cls}`}>{p}%</span>;
}

export default function Dashboard({ goto }) {
  const [volume, setVolume] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([api.getYearVolume(), api.getYearRevenue()])
      .then(([v, r]) => {
        if (cancelled) return;
        setVolume(v || []);
        setRevenue(r || []);
      })
      .catch((e) => !cancelled && setError({ type: 'error', text: e.message }))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  const sum = (arr, k) => arr.reduce((a, x) => a + (x[k] || 0), 0);
  const totalForecast = sum(revenue, 'forecastedRevenue');
  const totalActual = sum(revenue, 'actualRevenue');
  const achievement = pct(totalActual, totalForecast);

  // Merge by LOB for the combined table.
  const lobs = [...new Set([...volume.map((v) => v.lob), ...revenue.map((r) => r.lob)])];
  const rows = lobs.map((lob) => {
    const v = volume.find((x) => x.lob === lob) || {};
    const r = revenue.find((x) => x.lob === lob) || {};
    // Each endpoint returns a full GraphDTO (other half zeroed), so pick fields explicitly.
    return {
      lob,
      confident: v.confident,
      opportunities: v.opportunities,
      supplySupportNeed: v.supplySupportNeed,
      forecastedRevenue: r.forecastedRevenue,
      actualRevenue: r.actualRevenue,
    };
  });

  const volumeData = volume.map((v) => ({ label: v.lob, ...v }));
  const revenueData = revenue.map((r) => ({ label: r.lob, ...r }));

  return (
    <>
      <div className="page-head">
        <h1>Dashboard</h1>
        <p className="muted">Progress for {currentYear} across all lines of business.</p>
      </div>

      <Alert alert={error} onClose={() => setError(null)} />
      {loading && <div className="spinner">Loading…</div>}

      {!loading && !error && rows.length === 0 && (
        <div className="card empty">
          <p>No volume or revenue data for {currentYear} yet.</p>
          <div className="actions" style={{ justifyContent: 'center' }}>
            <button className="btn" onClick={() => goto('add')}>Add data</button>
            <button className="btn secondary" onClick={() => goto('lobs')}>Manage LOBs</button>
          </div>
        </div>
      )}

      {!loading && rows.length > 0 && (
        <>
          <div className="grid cols-4" style={{ marginBottom: 20 }}>
            <div className="card stat">
              <div className="label">Confident (FTE)</div>
              <div className="value">{fmt(sum(volume, 'confident'))}</div>
              <div className="sub">Supply for open demand</div>
            </div>
            <div className="card stat">
              <div className="label">Opportunities</div>
              <div className="value">{fmt(sum(volume, 'opportunities'))}</div>
              <div className="sub">Pipeline projects</div>
            </div>
            <div className="card stat">
              <div className="label">Revenue forecast</div>
              <div className="value">{fmt(totalForecast)}</div>
              <div className="sub">KUSD</div>
            </div>
            <div className="card stat">
              <div className="label">Revenue actual</div>
              <div className="value">{fmt(totalActual)}</div>
              <div className="sub">KUSD · {achievement == null ? 'no forecast' : `${achievement}% of forecast`}</div>
            </div>
          </div>

          <div className="grid cols-2">
            <div className="card">
              <h2>Volume by LOB</h2>
              <BarChart data={volumeData} series={VOLUME_SERIES} xLabel="LOB" yLabel="FTE" />
            </div>
            <div className="card">
              <h2>Revenue by LOB</h2>
              <BarChart data={revenueData} series={REVENUE_SERIES} xLabel="LOB" yLabel="KUSD" />
            </div>
          </div>

          <div className="card">
            <h2>LOB summary</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>LOB</th>
                    <th className="num">Confident</th>
                    <th className="num">Opportunities</th>
                    <th className="num">Supply need</th>
                    <th className="num">Forecast (KUSD)</th>
                    <th className="num">Actual (KUSD)</th>
                    <th>Actual vs forecast</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.lob}>
                      <td><strong>{r.lob}</strong></td>
                      <td className="num">{fmt(r.confident ?? 0)}</td>
                      <td className="num">{fmt(r.opportunities ?? 0)}</td>
                      <td className="num">{fmt(r.supplySupportNeed ?? 0)}</td>
                      <td className="num">{fmt(r.forecastedRevenue ?? 0)}</td>
                      <td className="num">{fmt(r.actualRevenue ?? 0)}</td>
                      <td>{badge(pct(r.actualRevenue || 0, r.forecastedRevenue || 0))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
}
