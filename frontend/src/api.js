const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export class ApiError extends Error {}

const FRIENDLY = {
  'Service.LOB_NOT_FOUND': 'That LOB was not found. Add it on the LOBs page first.',
  'Service.YEAR_INVALID': 'The year must be the current year.',
  'Service.QUARTER_INVALID': 'Quarter must be one of Q1, Q2, Q3 or Q4.',
  'Service.VOLUMEID_NOT_FOUND': 'No volume details found for this LOB and year.',
  'Service.REVENUEID_NOT_FOUND': 'No revenue details found for this LOB and year.',
  'Service.VOLUMELOBQUARTER_NOT_FOUND': 'No volume details found for this LOB, year and quarter.',
  'Service.REVENUELOBQUARTER_NOT_FOUND': 'No revenue details found for this LOB, year and quarter.',
  'Service.VOLUMEREVENUEIDQUARTER_NOT_FOUND':
    'No data exists yet for this LOB and quarter in the current year. Use "Add Data" first.',
};

const MONTHS_HINT = {
  Q1: 'Apr, May, Jun',
  Q2: 'Jul, Aug, Sep',
  Q3: 'Oct, Nov, Dec',
  Q4: 'Jan, Feb, Mar',
};

/** The backend sends message keys such as "Service.Q1_INVALID"; turn them into sentences. */
export function friendlyMessage(message) {
  if (!message) return 'Something went wrong.';
  if (FRIENDLY[message]) return FRIENDLY[message];
  const m = /^Service\.(Q[1-4])_INVALID$/.exec(message);
  if (m) return `Months do not match ${m[1]}. Allowed months: ${MONTHS_HINT[m[1]]}.`;
  return message;
}

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(BASE + path, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new ApiError('Cannot reach the server. Is the Spring Boot backend running on port 8080?');
  }

  const text = await res.text();
  let data = text;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    /* plain-text success message */
  }

  // The backend reports business/validation errors as HTTP 200 with {status, message}.
  const looksLikeError =
    data &&
    typeof data === 'object' &&
    !Array.isArray(data) &&
    'status' in data &&
    'message' in data &&
    Object.keys(data).length === 2;

  if (looksLikeError) throw new ApiError(friendlyMessage(data.message));
  if (!res.ok) throw new ApiError(friendlyMessage(typeof data === 'string' ? data : `Request failed (${res.status})`));
  return data;
}

const enc = encodeURIComponent;
const json = (method, body) => ({ method, body: JSON.stringify(body) });

export const api = {
  // LOBs
  getLobs: () => request('/api/lobs'),
  addLob: (dto) => request('/api/lobs', json('POST', dto)),
  updateLob: (lob, dto) => request(`/api/lobs/${enc(lob)}`, json('PUT', dto)),
  deleteLob: (lob) => request(`/api/lobs/${enc(lob)}`, { method: 'DELETE' }),

  // Forms
  postVolumeRevenue: (dto) => request('/api/forms', json('POST', dto)),
  updateVolumeRevenue: (lob, quarter, dto) =>
    request(`/api/forms/${enc(lob)}/${enc(quarter)}`, json('PUT', dto)),

  // Volume / revenue
  getVolumes: (lob, year) => request(`/api/volume/${enc(lob)}/${year}`),
  getQuarterVolume: (lob, year, q) => request(`/api/volume/${enc(lob)}/${year}/${q}`),
  getRevenues: (lob, year) => request(`/api/revenue/${enc(lob)}/${year}`),
  getQuarterRevenue: (lob, year, q) => request(`/api/revenue/${enc(lob)}/${year}/${q}`),

  // Graphs
  getYearVolume: () => request('/api/graph/year-volume'),
  getYearRevenue: () => request('/api/graph/year-revenue'),
};
