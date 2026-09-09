# Primon Fumigation Management System — Frontend Demo (v1)

A frontend-only demonstration build of the Primon FMS, for Primon Enterprises Limited.
Built with **Next.js (App Router) + TypeScript + Tailwind CSS**. There is **no backend** —
all data is seeded from `lib/mock-data.ts` and persisted to `localStorage` via a small
context store (`lib/store.tsx`), so interactions (creating a work order, logging a gas
reading, adjusting stock) feel real within a browser session without a database.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** this project uses `next/font/google` (Fraunces + Inter), which fetches
> fonts at build time and therefore requires an internet connection the first time
> you run `npm run dev` or `npm run build`.

## Demo flow

There's no real authentication. Use the **"Demo controls"** button in the bottom-right
corner of any internal/portal page, or the role cards on `/login`, to switch between:

- **Operations Manager** / **Admin** — `/dashboard`: overview, create work orders, review
  flagged readings, manage stock, and triage website submissions.
- **Fumigation Supervisor** — `/dashboard/monitor`: log daily gas readings against the
  600ppm threshold.
- **Client** — `/portal`: track certificate progress, edit shipping instructions, and
  view/download the certified FCC.

A good end-to-end path to demo:

1. `/login` → sign in as **Operations Manager**.
2. **New work order** → step through the FCC wizard (work order → shipping instructions
   → fumigation description → review) and create it. This deducts stock and opens a
   fresh 6-day monitoring window.
3. Open the new work order from **Gas-reading monitor** and log Day 1 (try a value under
   600 to see the critical flag, then log a corrective action to clear it).
4. Once all 6 days are resolved, **Certify FCC** to generate the certificate + QR.
5. Switch to **Client** in the demo controls to see the same certificate from the
   client's read-only view.

## Project structure

```
app/
  page.tsx                     Landing page
  login/page.tsx                Role-based demo sign-in
  dashboard/                    Internal app (Ops Manager / Admin / Supervisor)
    page.tsx                    Overview
    work-orders/new/page.tsx    FCC creation wizard
    monitor/                    Gas-reading monitor (list + per-work-order board)
    inventory/page.tsx          Fumigant stock
    intake/page.tsx             Public-website submissions (RFQ/RFW/work order)
  portal/                       Client portal
  certificate/[id]/page.tsx     Standalone certificate / QR verification view
components/                     Shared UI (button, card, status pills, gas gauge, etc.)
lib/                            Types, mock data, the localStorage-backed demo store
```

## What's simulated vs. real

- **Real:** all UI, layout, interaction states, form logic, the fumigant/formulation/
  crop-type filtering rules, the 600ppm threshold flagging logic, and localStorage
  persistence within a browser session.
- **Simulated:** authentication, email/SMS notifications (shown as in-app toasts only),
  PDF generation/download, and QR codes (visual placeholders, not scannable).

This is the frontend groundwork for the full system described in the accompanying
Requirements Document and System Design Document — the next phase wires this UI to
the real Neon/Drizzle/Vercel backend.
