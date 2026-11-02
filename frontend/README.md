# InfyDU Guesstimate – Frontend

React 18 + Vite single-page app for the Spring Boot backend in the parent folder.

## Run

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

Start the backend first (`mvn spring-boot:run`, port 8080). In dev, Vite proxies `/api` to it,
so no CORS or URL setup is needed.

For a production build: `npm run build` (output in `dist/`). If the backend is on another host,
copy `.env.example` to `.env` and set `VITE_API_URL`.

## Screens

| Screen | Backend endpoints |
|---|---|
| Dashboard – totals, volume and revenue charts per LOB, actual-vs-forecast | `GET /api/graph/year-volume`, `/year-revenue` |
| Add Data – monthly volume + revenue for a LOB and quarter | `POST /api/forms` |
| Update Data – load, edit and save a quarter (current year) | `GET /api/volume|revenue/{lob}/{year}/{q}`, `PUT /api/forms/{lob}/{q}` |
| Reports – any LOB/year, all quarters or one | `GET /api/volume|revenue/{lob}/{year}[/{q}]` |
| LOBs – add, edit anchor, delete | `/api/lobs` |

## Notes

- The backend reports validation and business errors as **HTTP 200** with a `{status, message}` body and
  raw message keys (e.g. `Service.LOB_NOT_FOUND`). `src/api.js` detects that shape, throws it as an error,
  and translates known keys into readable text.
- Quarter ↔ month mapping (Q1 = Apr–Jun … Q4 = Jan–Mar) and the "current year only" rule mirror the backend.
- The backend has no authentication endpoints, so there is no sign-up / log-in screen.
