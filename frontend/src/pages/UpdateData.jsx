import React, { useState } from 'react';
import { api } from '../api.js';
import Alert from '../components/Alert.jsx';
import LobSelect from '../components/LobSelect.jsx';
import MonthlyForm, { emptyRow, FIELDS, toPayload } from '../components/MonthlyForm.jsx';
import { QUARTERS, QUARTER_LABELS, currentQuarter, currentYear, isNonNegInt } from '../utils.js';

export default function UpdateData() {
  const [lob, setLob] = useState('');
  const [quarter, setQuarter] = useState(currentQuarter());
  const [rows, setRows] = useState(null); // null until loaded
  const [loaded, setLoaded] = useState(null); // { lob, quarter } that rows belong to
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [busy, setBusy] = useState(false);

  const reset = () => { setRows(null); setLoaded(null); setErrors({}); };

  const load = async () => {
    if (!lob) {
      setAlert({ type: 'error', text: 'Please select a LOB.' });
      return;
    }
    setBusy(true);
    setAlert(null);
    try {
      const [vol, rev] = await Promise.all([
        api.getQuarterVolume(lob, currentYear, quarter),
        api.getQuarterRevenue(lob, currentYear, quarter),
      ]);
      const next = Object.fromEntries(QUARTERS[quarter].map((m) => [m, emptyRow()]));
      (vol.quarterVolume || []).forEach((v) => {
        if (next[v.month]) Object.assign(next[v.month], {
          confident: v.confident, opportunities: v.opportunities, supplySupportNeed: v.supplySupportNeed,
        });
      });
      (rev.quarterRevenue || []).forEach((r) => {
        if (next[r.month]) Object.assign(next[r.month], {
          forecastedRevenue: r.forecastedRevenue, actualRevenue: r.actualRevenue,
        });
      });
      setRows(next);
      setLoaded({ lob, quarter });
      setErrors({});
    } catch (e) {
      reset();
      setAlert({ type: 'error', text: e.message });
    } finally {
      setBusy(false);
    }
  };

  const changeCell = (month, field, value) =>
    setRows((r) => ({ ...r, [month]: { ...r[month], [field]: value } }));

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    QUARTERS[loaded.quarter].forEach((m) =>
      FIELDS.forEach((f) => { if (!isNonNegInt(rows[m][f])) errs[`${m}.${f}`] = true; })
    );
    setErrors(errs);
    if (Object.keys(errs).length) {
      setAlert({ type: 'error', text: 'Every field must be a whole number of 0 or more.' });
      return;
    }
    setBusy(true);
    try {
      const msg = await api.updateVolumeRevenue(loaded.lob, loaded.quarter, toPayload(loaded.quarter, rows));
      setAlert({ type: 'success', text: msg });
    } catch (err) {
      setAlert({ type: 'error', text: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="page-head">
        <h1>Update volume &amp; revenue</h1>
        <p className="muted">Load the current-year data for a LOB and quarter, edit it, and save.</p>
      </div>

      <Alert alert={alert} onClose={() => setAlert(null)} />

      <div className="card">
        <div className="form-row">
          <div className="field">
            <label htmlFor="ulob">LOB</label>
            <LobSelect id="ulob" value={lob} onChange={(v) => { setLob(v); reset(); }} />
          </div>
          <div className="field">
            <label htmlFor="uquarter">Quarter</label>
            <select id="uquarter" value={quarter} onChange={(e) => { setQuarter(e.target.value); reset(); }}>
              {Object.keys(QUARTERS).map((q) => (
                <option key={q} value={q}>{QUARTER_LABELS[q]}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="uyear">Year</label>
            <input id="uyear" value={currentYear} disabled readOnly />
          </div>
        </div>
        <button className="btn" onClick={load} disabled={busy}>{busy && !rows ? 'Loading…' : 'Load data'}</button>
      </div>

      {rows && loaded && (
        <form className="card" onSubmit={submit}>
          <h2>{loaded.lob} · {QUARTER_LABELS[loaded.quarter]} · {currentYear}</h2>
          <MonthlyForm quarter={loaded.quarter} rows={rows} onChange={changeCell} errors={errors} />
          <div className="actions" style={{ marginTop: 16 }}>
            <button className="btn" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button>
            <button type="button" className="btn secondary" onClick={load} disabled={busy}>Discard changes</button>
          </div>
        </form>
      )}
    </>
  );
}
