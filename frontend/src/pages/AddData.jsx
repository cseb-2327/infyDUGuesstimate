import React, { useState } from 'react';
import { api } from '../api.js';
import Alert from '../components/Alert.jsx';
import LobSelect from '../components/LobSelect.jsx';
import MonthlyForm, { emptyRow, FIELDS, toPayload } from '../components/MonthlyForm.jsx';
import { QUARTERS, QUARTER_LABELS, currentQuarter, currentYear, isNonNegInt } from '../utils.js';

const blankRows = (q) => Object.fromEntries(QUARTERS[q].map((m) => [m, emptyRow()]));

export default function AddData() {
  const [lob, setLob] = useState('');
  const [quarter, setQuarter] = useState(currentQuarter());
  const [rows, setRows] = useState(() => blankRows(currentQuarter()));
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [busy, setBusy] = useState(false);

  const changeQuarter = (q) => {
    setQuarter(q);
    setRows(blankRows(q));
    setErrors({});
  };

  const changeCell = (month, field, value) =>
    setRows((r) => ({ ...r, [month]: { ...r[month], [field]: value } }));

  const validate = () => {
    const errs = {};
    QUARTERS[quarter].forEach((m) =>
      FIELDS.forEach((f) => {
        if (!isNonNegInt(rows[m][f])) errs[`${m}.${f}`] = true;
      })
    );
    setErrors(errs);
    if (!lob) return 'Please select a LOB.';
    if (Object.keys(errs).length) return 'Every field must be a whole number of 0 or more.';
    return null;
  };

  const submit = async (e) => {
    e.preventDefault();
    const problem = validate();
    if (problem) {
      setAlert({ type: 'error', text: problem });
      return;
    }
    setBusy(true);
    try {
      const msg = await api.postVolumeRevenue({ lob, quarter, year: currentYear, ...toPayload(quarter, rows) });
      setAlert({ type: 'success', text: msg });
      setRows(blankRows(quarter));
    } catch (err) {
      setAlert({ type: 'error', text: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="page-head">
        <h1>Add volume &amp; revenue</h1>
        <p className="muted">Post the monthly numbers for one LOB and quarter. Quarter sums are calculated for you.</p>
      </div>

      <Alert alert={alert} onClose={() => setAlert(null)} />

      <form className="card" onSubmit={submit}>
        <div className="form-row">
          <div className="field">
            <label htmlFor="lob">LOB</label>
            <LobSelect id="lob" value={lob} onChange={setLob} />
          </div>
          <div className="field">
            <label htmlFor="quarter">Quarter</label>
            <select id="quarter" value={quarter} onChange={(e) => changeQuarter(e.target.value)}>
              {Object.keys(QUARTERS).map((q) => (
                <option key={q} value={q}>{QUARTER_LABELS[q]}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="year">Year</label>
            <input id="year" value={currentYear} disabled readOnly />
            <small className="muted">Only the current year is accepted.</small>
          </div>
        </div>

        <MonthlyForm quarter={quarter} rows={rows} onChange={changeCell} errors={errors} />

        <div className="actions" style={{ marginTop: 16 }}>
          <button className="btn" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
          <button type="button" className="btn secondary" onClick={() => { setRows(blankRows(quarter)); setErrors({}); }}>
            Clear
          </button>
        </div>
      </form>
    </>
  );
}
