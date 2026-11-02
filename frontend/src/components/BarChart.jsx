import React from 'react';

function niceMax(v) {
  if (v <= 0) return 10;
  const pow = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / pow;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * pow;
}

/**
 * Grouped bar chart drawn with plain SVG.
 * data:   [{ label: 'FS', a: 10, b: 20 }]
 * series: [{ key: 'a', name: 'Confident', color: '#...' }]
 */
export default function BarChart({ data, series, yLabel, xLabel }) {
  if (!data || data.length === 0) return <p className="muted">No data to display.</p>;

  const groupW = Math.max(70, series.length * 26 + 24);
  const padL = 56, padR = 16, padT = 16, padB = 46;
  const plotW = Math.max(480, data.length * groupW);
  const W = padL + plotW + padR;
  const H = 300;
  const plotH = H - padT - padB;

  const rawMax = Math.max(...data.flatMap((d) => series.map((s) => d[s.key] || 0)));
  const max = niceMax(rawMax);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(max * t));
  const y = (v) => padT + plotH - (v / max) * plotH;

  const slot = plotW / data.length;
  const barW = Math.min(30, (slot - 18) / series.length);

  return (
    <div>
      <div className="legend">
        {series.map((s) => (
          <span key={s.key}>
            <i style={{ background: s.color }} /> {s.name}
          </span>
        ))}
      </div>
      <div className="chart-scroll">
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" aria-label={yLabel}>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={padL} x2={padL + plotW} y1={y(t)} y2={y(t)} className="gridline" />
              <text x={padL - 8} y={y(t) + 4} textAnchor="end" className="axis">
                {t.toLocaleString('en-US')}
              </text>
            </g>
          ))}
          {data.map((d, i) => {
            const groupWidth = barW * series.length;
            const x0 = padL + i * slot + (slot - groupWidth) / 2;
            return (
              <g key={d.label}>
                {series.map((s, j) => {
                  const v = d[s.key] || 0;
                  const h = plotH - (y(v) - padT);
                  return (
                    <rect
                      key={s.key}
                      x={x0 + j * barW}
                      y={y(v)}
                      width={barW - 2}
                      height={Math.max(h, 0)}
                      rx="3"
                      style={{ fill: s.color }}
                    >
                      <title>{`${d.label} – ${s.name}: ${v.toLocaleString('en-US')}`}</title>
                    </rect>
                  );
                })}
                <text x={padL + i * slot + slot / 2} y={H - padB + 18} textAnchor="middle" className="axis">
                  {d.label.length > 12 ? d.label.slice(0, 11) + '…' : d.label}
                </text>
              </g>
            );
          })}
          {yLabel && (
            <text transform={`translate(12 ${padT + plotH / 2}) rotate(-90)`} textAnchor="middle" className="axis-title">
              {yLabel}
            </text>
          )}
          {xLabel && (
            <text x={padL + plotW / 2} y={H - 4} textAnchor="middle" className="axis-title">
              {xLabel}
            </text>
          )}
        </svg>
      </div>
    </div>
  );
}
