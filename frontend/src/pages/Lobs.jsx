import React, { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';
import Alert from '../components/Alert.jsx';

export default function Lobs() {
  const [lobs, setLobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [form, setForm] = useState({ lobName: '', duAnchor: '' });
  const [editing, setEditing] = useState(null); // lobName being edited
  const [editAnchor, setEditAnchor] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    api.getLobs()
      .then(setLobs)
      .catch((e) => setAlert({ type: 'error', text: e.message }))
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  const run = async (fn, okText) => {
    setBusy(true);
    try {
      const msg = await fn();
      setAlert({ type: 'success', text: okText || (typeof msg === 'string' ? msg : 'Done') });
      load();
      return true;
    } catch (e) {
      setAlert({ type: 'error', text: e.message });
      return false;
    } finally {
      setBusy(false);
    }
  };

  const add = async (e) => {
    e.preventDefault();
    const dto = { lobName: form.lobName.trim(), duAnchor: form.duAnchor.trim() };
    if (!dto.lobName || !dto.duAnchor) {
      setAlert({ type: 'error', text: 'LOB name and DU anchor are both required.' });
      return;
    }
    if (lobs.some((l) => l.lobName.toLowerCase() === dto.lobName.toLowerCase())) {
      setAlert({ type: 'error', text: `LOB "${dto.lobName}" already exists. Edit its anchor instead.` });
      return;
    }
    const ok = await run(() => api.addLob(dto), `LOB "${dto.lobName}" successfully inserted`);
    if (ok) setForm({ lobName: '', duAnchor: '' });
  };

  const save = async (lobName) => {
    if (!editAnchor.trim()) {
      setAlert({ type: 'error', text: 'DU anchor is required.' });
      return;
    }
    const ok = await run(() => api.updateLob(lobName, { lobName, duAnchor: editAnchor.trim() }), 'LOB details updated successfully');
    if (ok) setEditing(null);
  };

  const remove = (lobName) => {
    if (!window.confirm(`Delete LOB "${lobName}"?`)) return;
    run(() => api.deleteLob(lobName), 'LOB details deleted successfully');
  };

  return (
    <>
      <div className="page-head">
        <h1>Lines of Business</h1>
        <p className="muted">Each LOB has a Delivery Unit anchor. LOBs must exist before data can be added for them.</p>
      </div>

      <Alert alert={alert} onClose={() => setAlert(null)} />

      <form className="card" onSubmit={add}>
        <h2>Add LOB</h2>
        <div className="form-row">
          <div className="field">
            <label htmlFor="lobName">LOB name</label>
            <input id="lobName" value={form.lobName} maxLength={100} placeholder="e.g. FS"
              onChange={(e) => setForm({ ...form, lobName: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="duAnchor">DU anchor</label>
            <input id="duAnchor" value={form.duAnchor} maxLength={150} placeholder="e.g. John"
              onChange={(e) => setForm({ ...form, duAnchor: e.target.value })} />
          </div>
        </div>
        <button className="btn" disabled={busy}>Add LOB</button>
      </form>

      <div className="card">
        <h2>All LOBs</h2>
        {loading ? (
          <div className="spinner">Loading…</div>
        ) : lobs.length === 0 ? (
          <div className="empty">No LOBs yet.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>LOB</th><th>DU anchor</th><th style={{ width: 200 }}>Actions</th></tr>
              </thead>
              <tbody>
                {lobs.map((l) => (
                  <tr key={l.lobName}>
                    <td><strong>{l.lobName}</strong></td>
                    <td>
                      {editing === l.lobName ? (
                        <input value={editAnchor} autoFocus maxLength={150}
                          onChange={(e) => setEditAnchor(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && save(l.lobName)} />
                      ) : (
                        l.duAnchor
                      )}
                    </td>
                    <td>
                      <div className="actions">
                        {editing === l.lobName ? (
                          <>
                            <button className="btn sm" disabled={busy} onClick={() => save(l.lobName)}>Save</button>
                            <button className="btn sm secondary" onClick={() => setEditing(null)}>Cancel</button>
                          </>
                        ) : (
                          <>
                            <button className="btn sm secondary" onClick={() => { setEditing(l.lobName); setEditAnchor(l.duAnchor); }}>Edit</button>
                            <button className="btn sm danger" disabled={busy} onClick={() => remove(l.lobName)}>Delete</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
