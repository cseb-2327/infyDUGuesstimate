import React from 'react';
import { QUARTERS } from '../utils.js';

/**
 * Editable table with one row per month of the quarter.
 * rows: { Apr: { confident, opportunities, supplySupportNeed, forecastedRevenue, actualRevenue }, ... }
 */
export default function MonthlyForm({ quarter, rows, onChange, errors = {} }) {
  const months = QUARTERS[quarter];

  const cell = (month, field, label) => (
    <td data-label={label}>
      <input
        type="number"
        min="0"
        step="1"
        inputMode="numeric"
        value={rows[month]?.[field] ?? ''}
        className={errors[`${month}.${field}`] ? 'invalid' : ''}
        onChange={(e) => onChange(month, field, e.target.value)}
      />
    </td>
  );

  return (
    <div className="table-wrap">
      <table className="form-table">
        <thead>
          <tr>
            <th rowSpan="2">Month</th>
            <th colSpan="3" className="group">Volume (FTE)</th>
            <th colSpan="2" className="group">Revenue (KUSD)</th>
          </tr>
          <tr>
            <th>Confident</th>
            <th>Opportunities</th>
            <th>Supply support need</th>
            <th>Forecasted</th>
            <th>Actual</th>
          </tr>
        </thead>
        <tbody>
          {months.map((m) => (
            <tr key={m}>
              <th scope="row">{m}</th>
              {cell(m, 'confident', 'Confident')}
              {cell(m, 'opportunities', 'Opportunities')}
              {cell(m, 'supplySupportNeed', 'Supply support need')}
              {cell(m, 'forecastedRevenue', 'Forecasted')}
              {cell(m, 'actualRevenue', 'Actual')}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const emptyRow = () => ({
  confident: '',
  opportunities: '',
  supplySupportNeed: '',
  forecastedRevenue: '',
  actualRevenue: '',
});

export const FIELDS = ['confident', 'opportunities', 'supplySupportNeed', 'forecastedRevenue', 'actualRevenue'];

/** Build the backend payload arrays from the editable rows. */
export function toPayload(quarter, rows) {
  const n = (v) => parseInt(String(v).trim(), 10);
  return {
    quarterVolume: QUARTERS[quarter].map((m) => ({
      month: m,
      confident: n(rows[m].confident),
      opportunities: n(rows[m].opportunities),
      supplySupportNeed: n(rows[m].supplySupportNeed),
    })),
    quarterRevenue: QUARTERS[quarter].map((m) => ({
      month: m,
      forecastedRevenue: n(rows[m].forecastedRevenue),
      actualRevenue: n(rows[m].actualRevenue),
    })),
  };
}
