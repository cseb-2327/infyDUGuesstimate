import React, { useEffect, useState } from 'react';
import { api } from '../api.js';

/** Dropdown of LOBs loaded from the backend. */
export default function LobSelect({ value, onChange, id }) {
  const [lobs, setLobs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getLobs().then(setLobs).catch((e) => setError(e.message));
  }, []);

  return (
    <>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select LOB…</option>
        {lobs.map((l) => (
          <option key={l.lobName} value={l.lobName}>
            {l.lobName} — {l.duAnchor}
          </option>
        ))}
      </select>
      {error && <small className="field-error">{error}</small>}
      {!error && lobs.length === 0 && <small className="muted">No LOBs yet — add one on the LOBs page.</small>}
    </>
  );
}
