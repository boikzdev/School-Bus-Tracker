# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── bus-tracker/        # School Bus Tracker (Expo mobile app)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## School Bus Tracker App (`artifacts/bus-tracker`)

A React Native (Expo) mobile app for tracking school buses in real time.

### Features
- **Google Maps** with user location + animated bus marker
- **Firebase Realtime Database** integration for 8 buses (Bus_01 to Bus_08)
- **Haversine formula** distance calculation between user and bus
- **BUS IS ARRIVING** alert overlay when bus is within 1km
- **Bus Selection** dropdown to choose which bus to track
- **Simulation Mode** — moves the bus toward user to test notifications
- **Dashboard** showing live distance and estimated arrival time

### Firebase Setup
Update `artifacts/bus-tracker/config/firebase.ts` with your Firebase project credentials, OR set these environment variables:
- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_DATABASE_URL`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`

### Firebase Database Structure
```json
{
  "buses": {
    "Bus_01": { "lat": 3.139, "lng": 101.686 },
    "Bus_02": { "lat": 3.150, "lng": 101.700 },
    ...
  }
}
```

### Key Files
- `app/(tabs)/index.tsx` — Main tracking screen
- `context/BusContext.tsx` — All bus tracking state + Firebase listeners + simulation logic
- `components/MapWrapper.tsx` — Native map (react-native-maps)
- `components/MapWrapper.web.tsx` — Web fallback (no native map support)
- `components/ArrivingAlert.tsx` — Full-screen BUS IS ARRIVING alert
- `components/BusSelector.tsx` — Bus dropdown sheet
- `components/DashboardCard.tsx` — Distance/ETA stat cards
- `config/firebase.ts` — Firebase initialization (update with your credentials)
- `constants/colors.ts` — App theme (Navy blue + Amber accent)

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references
