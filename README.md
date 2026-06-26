# FINCAP Admin Dashboard (React)

React + Vite admin panel for the FINCAP Business Finance API.
Consumes the Laravel REST API at `/api/v1` with Sanctum token auth.

## Features
- Token login (Sanctum), auto-attached bearer header, 401 auto-logout.
- Dashboard: total income/expense, profit, pending receivables & payables,
  today's + upcoming due payments, company-wise summary, company filter.
- Reports: monthly income-vs-expense bar chart, expense by category,
  outstanding by client, cash-flow cards (filter by company + year).
- Full CRUD screens for: Companies, Clients, Vendors, Expense Categories,
  Income (with "Record Payment"), Expenses (with bill upload), Receivables,
  Payables, Recurring Expenses, Reminders.
- Reusable config-driven CRUD engine (list, filters, create/edit modal,
  delete, pagination, remote select dropdowns).

## Requirements
- Node 18+
- The FINCAP Laravel API running (default expected at http://127.0.0.1:8000)

## Setup

```bash
npm install
cp .env.example .env   # optional
npm run dev
```

Open http://localhost:5173 and log in with a seeded account:
`admin@fincap.test` / `password`.

## Connecting to the API
By default the Vite dev server proxies `/api` to `http://127.0.0.1:8000`
(see `vite.config.js`), so no CORS setup is needed in development.

To point at a different API host, set in `.env`:
```
VITE_API_BASE_URL=http://your-api-host
```
(The client appends `/api/v1`.) If you set this instead of using the proxy,
enable CORS in Laravel for your dashboard origin.

## Build for production
```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build
```
Serve `dist/` behind any static host. Set `VITE_API_BASE_URL` to your API
URL at build time, and configure Laravel CORS + Sanctum stateful domains.

## Notes
- Role-aware: the API enforces roles (employee can only add expenses/upload).
  The UI shows all actions; the API returns 403 where not permitted.
- Expense bill upload uses multipart with `_method=PUT` on edit.
