export const QUARTERS = {
  Q1: ['Apr', 'May', 'Jun'],
  Q2: ['Jul', 'Aug', 'Sep'],
  Q3: ['Oct', 'Nov', 'Dec'],
  Q4: ['Jan', 'Feb', 'Mar'],
};

export const QUARTER_LABELS = {
  Q1: 'Q1 (Apr – Jun)',
  Q2: 'Q2 (Jul – Sep)',
  Q3: 'Q3 (Oct – Dec)',
  Q4: 'Q4 (Jan – Mar)',
};

export const currentYear = new Date().getFullYear();

/** Quarter that contains today's month, using the Apr–Mar financial year. */
export function currentQuarter() {
  const m = new Date().getMonth(); // 0 = Jan
  if (m >= 3 && m <= 5) return 'Q1';
  if (m >= 6 && m <= 8) return 'Q2';
  if (m >= 9) return 'Q3';
  return 'Q4';
}

export const fmt = (n) => (n == null ? '–' : Number(n).toLocaleString('en-US'));

export const pct = (actual, forecast) =>
  forecast > 0 ? Math.round((actual / forecast) * 100) : null;

/** Non-negative whole number check for form inputs (strings). */
export function isNonNegInt(v) {
  return /^\d+$/.test(String(v).trim());
}
