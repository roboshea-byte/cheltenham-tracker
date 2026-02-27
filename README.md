# Cheltenham Festival 2026 — Going & Weather Tracker

Live going reports, weather forecasts, and rail movements for the 2026 Cheltenham Festival.

## Quick Start

```bash
npm install
npm run dev
```

## How to Update

All data lives in **`src/data.js`** — edit that single file to update:

- **CURRENT_GOING** — Latest going report (going description, GoingStick readings)
- **GOING_HISTORY** — Historical going trend data for the chart
- **WEATHER_FORECAST** — 7-day weather outlook
- **FESTIVAL_FORECAST** — Festival week long-range forecast
- **RAIL_MOVEMENTS** — Rail position changes
- **GOING_OUTLOOK** — Your editorial going assessment & prediction

Commit & push to `main` and Vercel will auto-deploy.

## Deploy to Vercel

1. Connect this repo to [Vercel](https://vercel.com)
2. Framework preset: **Vite**
3. Build command: `npm run build`
4. Output directory: `dist`

## Stack

- React 18 + Vite
- Recharts for going trend charts
- Static data (no backend needed)
