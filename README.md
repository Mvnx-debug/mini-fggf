# Mini FGGF - Financial Reports Frontend

Mini FGGF is a React + TypeScript web app for financial report visualization (DRE/DFC), with authentication, role-based access, and report detail charts.

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- Axios
- Recharts
- JSON Server (mock backend)

## Prerequisites

- Node.js 18+ (recommended 20+)
- npm

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the mock API (JSON Server) on port `3001`:

```bash
npx json-server --watch db.json --port 3001
```

3. In another terminal, start the frontend:

```bash
npm run dev
```

4. Open the app:

- http://localhost:5173

## Available Scripts

- `npm run dev`: starts Vite in development mode
- `npm run build`: type-checks and builds production bundle
- `npm run preview`: previews the production build
- `npm run lint`: runs ESLint

## Test Credentials

Use these users from `db.json`:

- Admin:
  - email: `admin@fggf.com`
  - password: `123456`
- Client:
  - email: `cliente@empresa.com`
  - password: `123456`

## Manual Test Guide

### 1. Authentication Flow

1. Open `/login`.
2. Login with admin credentials.
3. Confirm redirect to `/dashboard`.
4. Click `Sair` and verify logout/redirect behavior.

Expected result:
- Valid credentials grant access.
- Invalid credentials show an error message.

### 2. Dashboard Data Loading

1. Login as `admin@fggf.com`.
2. Check that report cards are rendered.
3. Check the counters: Total, DRE, DFC.
4. Login as client user and confirm filtered data by `empresaId`.

Expected result:
- Admin sees all reports.
- Client sees only company-specific reports.

### 3. Report Details Route

1. Click a report card on dashboard.
2. Confirm navigation to `/relatorio/:id`.
3. Confirm detail page shows:
   - report title and date
   - bar chart with `valores`
   - back button
   - export button (current behavior uses browser print)

Expected result:
- Detail page loads correct report by ID.
- Client cannot access reports from other companies.

### 4. Build and Lint Validation

Run:

```bash
npm run lint
npm run build
```

Expected result:
- Lint completes without blocking errors.
- Build completes successfully.

## Project Structure

```text
src/
  components/
  context/
  pages/
    Login/
    dashboard/
    report-details/
  services/
  types/
  utils/
```

## Current Limitations

- No automated unit/integration tests yet (manual QA flow documented above).
- PDF export is currently browser print (`window.print()`), not generated file export.
- Mock backend is local (`db.json` + JSON Server).

## Notes for Development

- Keep API calls inside `src/services` (avoid direct axios calls in UI components).
- Keep strong typing in all API responses.
- Avoid `any` and prefer explicit interfaces in `src/types`.
