import React, { useState } from 'react';
import { api } from '../api.js';
import Alert from '../components/Alert.jsx';
import LobSelect from '../components/LobSelect.jsx';
import BarChart from '../components/BarChart.jsx';
import { QUARTERS, QUARTER_LABELS, currentYear, fmt, pct } from '../utils.js';

const order = (a, b) => a.quarter.localeCompare(b.quarter);

export default function Reports() {
  const [lob, setLob] = useState('');
  const [year, setYear] = useState(String(currentYear));
  const [quarter, setQuarter] = useState('ALL');
  const [data, setData] = useState(null); // { volumes, revenues, notes }
  const [alert, setAlert] = useState(null);
  const [busy, setBusy] = useState(false);

  const search = async (e) => {
    e.preventDefault();
    if (!lob) return setAlert({ type: 'error', text: 'Please select a LOB.' });
    if (!/^\d{4}$/.test(year)) return setAlert({ type: 'error', text: 'Enter a valid 4-digit year.' });

    setBusy(true);
    setAlert(null);
    const one = quarter !== 'ALL';
    const [v, r] = await Promise.allSettled([
      one ? api.getQuarterVolume(lob, year, quarter).then((x) => [x]) : api.getVolumes(lob, year),
      one ? api.getQuarterRevenue(lob, year, quarter).then((x) => [x]) : api.getRevenues(lob, year),
    ]);
    setBusy(false);

    const notes = [v, r].filter((x) => x.status === 'rejected').map((x) => x.reason.message);
    const volumes = v.status === 'fulfilled' ? [...v.value].sort(order) : [];
    const revenues = r.status === 'fulfilled' ? [...r.value].sort(order) : [];
    setData({ volumes, revenues });
    if (volumes.length === 0 && revenues.length === 0) {
      setAlert({ type: 'info', text: notes[0] || 'No data found.' });
      setData(null);
    } else if (notes.length) {
      setAlert({ type: 'info', text: notes.join(' ') });
    }
  };

  const chartVolume = data?.volumes.map((x) => ({
    label: x.quarter, confident: x.confidentSum, opportunities: x.opportunitiesSum, supply: x.supplySupportNeedSum,
  }));
  const chartRevenue = data?.revenues.map((x) => ({
    label: x.quarter, forecast: x.forecastedRevenueSum, actual: x.actualRevenueSum,
  }));

  return (
    <>
      <div className="page-head">
        <h1>Quarterly reports</h1>
        <p className="muted">Look up volume and revenue for any LOB and year, by quarter.</p>
      </div>

      <Alert alert={alert} onClose={() => setAlert(null)} />

      <form className="card" onSubmit={search}>
        <div className="form-row">
          <div className="field">
            <label htmlFor="rlob">LOB</label>
            <LobSelect id="rlob" value={lob} onChange={setLob} />
          </div>
          <div className="field">
            <label htmlFor="ryear">Year</label>
            <input id="ryear" type="number" value={year} onChange={(e) => setYear(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="rquarter">Quarter</label>
            <select id="rquarter" value={quarter} onChange={(e) => setQuarter(e.target.value)}>
              <option value="ALL">All quarters</option>
              {Object.keys(QUARTERS).map((q) => <option key={q} value={q}>{QUARTER_LABELS[q]}</option>)}
            </select>
          </div>
        </div>
        <button className="btn" disabled={busy}>{busy ? 'Loading…' : 'Show report'}</button>
      </form>

      {data && (
        <>
          <div className="grid cols-2">
            <div className="card">
              <h2>Volume by quarter</h2>
              <BarChart
                data={chartVolume}
                xLabel="Quarter" yLabel="FTE"
                series={[
                  { key: 'confident', name: 'Confident', color: 'var(--c1)' },
                  { key: 'opportunities', name: 'Opportunities', color: 'var(--c2)' },
                  { key: 'supply', name: 'Supply support need', color: 'var(--c3)' },
                ]}
              />
            </div>
            <div className="card">
              <h2>Revenue by quarter</h2>
              <BarChart
                data={chartRevenue}
                xLabel="Quarter" yLabel="KUSD"
                series={[
                  { key: 'forecast', name: 'Forecasted', color: 'var(--c2)' },
                  { key: 'actual', name: 'Actual', color: 'var(--c1)' },
                ]}
              />
            </div>
          </div>

          {data.volumes.length > 0 && (
            <div className="card">
              <h2>Volume details</h2>
              {data.volumes.map((v) => (
                <div key={v.volumeRevenueId} style={{ marginBottom: 20 }}>
                  <p><strong>{v.quarter}</strong> <span className="muted">· Anchor: {v.duanchor}</span></p>
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr><th>Month</th><th className="num">Confident</th><th className="num">Opportunities</th><th className="num">Supply support need</th></tr>
                      </thead>
                      <tbody>
                        {v.quarterVolume.map((m) => (
                          <tr key={m.id}>
                            <td>{m.month}</td>
                            <td className="num">{fmt(m.confident)}</td>
                            <td className="num">{fmt(m.opportunities)}</td>
                            <td className="num">{fmt(m.supplySupportNeed)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td>Total</td>
                          <td className="num">{fmt(v.confidentSum)}</td>
                          <td className="num">{fmt(v.opportunitiesSum)}</td>
                          <td className="num">{fmt(v.supplySupportNeedSum)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}

          {data.revenues.length > 0 && (
            <div className="card">
              <h2>Revenue details (KUSD)</h2>
              {data.revenues.map((r) => (
                <div key={r.volumeRevenueId} style={{ marginBottom: 20 }}>
                  <p>
                    <strong>{r.quarter}</strong> <span className="muted">· Anchor: {r.duanchor}</span>{' '}
                    {pct(r.actualRevenueSum, r.forecastedRevenueSum) != null && (
                      <span className="badge">{pct(r.actualRevenueSum, r.forecastedRevenueSum)}% of forecast</span>
                    )}
                  </p>
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr><th>Month</th><th className="num">Forecasted</th><th className="num">Actual</th></tr>
                      </thead>
                      <tbody>
                        {r.quarterRevenue.map((m) => (
                          <tr key={m.id}>
                            <td>{m.month}</td>
                            <td className="num">{fmt(m.forecastedRevenue)}</td>
                            <td className="num">{fmt(m.actualRevenue)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td>Total</td>
                          <td className="num">{fmt(r.forecastedRevenueSum)}</td>
                          <td className="num">{fmt(r.actualRevenueSum)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
