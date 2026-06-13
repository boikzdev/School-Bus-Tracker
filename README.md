# 🚌 School Bus Tracker

**Real-time school bus location tracking platform** built as a modern TypeScript monorepo with React, Express, and Firebase integration. Track buses, reduce wait times, and improve school transportation coordination.

[![GitHub Repo](https://img.shields.io/badge/GitHub-boikzdev-blue?logo=github)](https://github.com/boikzdev/School-Bus-Tracker)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Replit-FF0000?logo=replit)](https://replit.com/@boikunthadev/School-Bus-Tracker)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Monorepo](https://img.shields.io/badge/Monorepo-pnpm%20workspaces-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![React Native](https://img.shields.io/badge/React%20Native-Expo-20232A?logo=react&logoColor=61DAFB)](https://expo.dev/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 🎯 Overview

School Bus Tracker is a real-time location tracking solution that solves a critical problem in school transportation: **communication gaps between school administration, parents, and students regarding bus arrival times**.

### The Problem
- Students and parents experience uncertainty about exact bus arrival times
- Long, unproductive wait times at bus stops
- Safety concerns due to unpredictable schedules
- Limited visibility for school administrators

### The Solution
A transparent, real-time dashboard powered by Firebase Realtime Database and modern web technologies, featuring:
- **Live GPS tracking** of multiple school buses
- **Distance calculations** using Haversine formula
- **Arrival alerts** when bus is within 1km
- **Cross-platform support** (Web, iOS, Android via Expo)
- **Minimalist, low-data UI** for areas with limited connectivity

---

## ✨ Key Features

### 🗺️ Real-Time GPS Tracking
- Live location updates powered by **Firebase Realtime Database**
- Animated bus markers on interactive maps
- Support for up to 8 buses (Bus_01 through Bus_08)
- Sub-second location refresh with Realtime Database listeners

### 📱 Cross-Platform Mobile
- **React Native** with **Expo** for web, iOS, and Android
- Native maps using `react-native-maps`
- Web fallback for browser-based tracking
- Responsive, touch-optimized interface

### 🔔 Smart Notifications
- **BUS IS ARRIVING alert** when bus is within 1km radius
- Full-screen alert overlay with audio cues
- Distance and ETA calculations in real-time
- Haversine formula for accurate geodesic distance

### 🎛️ Bus Selection & Filtering
- Dropdown selector to track specific buses
- Quick-switch between bus routes
- Dashboard showing live metrics:
  - Current distance to bus
  - Estimated arrival time (ETA)
  - Bus location (lat/lng)

### 🧪 Simulation Mode
- **Development testing** without real GPS data
- Animated bus movement toward user location
- Perfect for demos and testing notification logic

### 💼 Backend API
- **Express 5** REST API with type-safe handlers
- **PostgreSQL** database with **Drizzle ORM**
- **Zod** schema validation (auto-generated from OpenAPI spec)
- **React Query** hooks for seamless client integration
- CORS-enabled for web clients

### 🎨 Modern UI/UX
- **Tailwind CSS** for responsive styling
- **Navy blue + Amber** accent color scheme
- **Framer Motion** for smooth animations
- **Lucide React** icons for consistent design

---

## 🏗️ Architecture

This is a **pnpm monorepo** with TypeScript project references, designed for scalability and maintainability.

```
School-Bus-Tracker/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express REST API + PostgreSQL
│   ├── bus-tracker/        # React Native (Expo) mobile app
│   └── mockup-sandbox/     # UI/UX prototyping
│
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval code generation
│   ├── api-client-react/   # Generated React Query hooks (from OpenAPI)
│   ├── api-zod/            # Generated Zod schemas (from OpenAPI)
│   └── db/                 # Drizzle ORM schemas + DB connection pool
│
├── scripts/                # Utility TypeScript scripts
│
├── tsconfig.base.json      # Shared TypeScript configuration
├── pnpm-workspace.yaml     # Monorepo workspace definition + security config
└── package.json            # Root workspace with shared devDeps
```

### Monorepo Benefits
- **Unified TypeScript**: Single `tsconfig.base.json` for consistent types
- **Shared dependencies**: Catalog system prevents version conflicts
- **Code generation**: OpenAPI → Zod schemas + React Query hooks
- **Fast builds**: Composite TypeScript projects for incremental compilation
- **Security-first**: Minimum 1-day release age for npm packages (supply-chain attack defense)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Mobile/Web UI** | React Native (Expo), React, TypeScript |
| **Styling** | Tailwind CSS, Framer Motion |
| **Maps** | Google Maps SDK, react-native-maps |
| **Backend** | Express 5, Node.js 24 |
| **Database** | PostgreSQL, Drizzle ORM |
| **Validation** | Zod (from OpenAPI spec via Orval) |
| **Data Layer** | Firebase Realtime Database |
| **Build Tools** | esbuild, Vite |
| **Package Manager** | pnpm workspaces |
| **Type System** | TypeScript 5.9 with project references |
| **Code Gen** | Orval (OpenAPI → TypeScript) |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 24+** (managed by pnpm)
- **pnpm 9+** (install via `npm install -g pnpm`)
- **Firebase Project** (for Realtime Database credentials)
- **Google Maps API Key** (for map rendering)
- **PostgreSQL 15+** (for backend database)

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/boikzdev/School-Bus-Tracker.git
cd School-Bus-Tracker

# Install all workspace dependencies
pnpm install
```

### 2. Configure Environment Variables

#### For the Mobile/Web App (`artifacts/bus-tracker`)
Create or update `artifacts/bus-tracker/config/firebase.ts`:

```typescript
export const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "1:YOUR_APP_ID:web:YOUR_WEB_ID",
};
```

Or set environment variables (Replit/Docker-friendly):
```bash
export EXPO_PUBLIC_FIREBASE_API_KEY="..."
export EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
export EXPO_PUBLIC_FIREBASE_DATABASE_URL="..."
export EXPO_PUBLIC_FIREBASE_PROJECT_ID="..."
export EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
export EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
export EXPO_PUBLIC_FIREBASE_APP_ID="..."
```

#### For the Backend API Server (`artifacts/api-server`)
Create `.env` in `artifacts/api-server/`:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/school_bus_tracker"
NODE_ENV="development"
```

### 3. Start Development

#### Run all packages:
```bash
pnpm run build    # TypeCheck + build all packages
pnpm run typecheck # TypeCheck only
```

#### Run individual packages:

**Mobile App (Expo)**:
```bash
cd artifacts/bus-tracker
pnpm run dev
# Opens Expo dev server at http://localhost:8081
# Scan QR code with Expo Go app on mobile
```

**Backend API**:
```bash
cd artifacts/api-server
pnpm run dev
# API runs on http://localhost:3000
```

### 4. Firebase Database Setup

Your Realtime Database should have this structure:

```json
{
  "buses": {
    "Bus_01": {
      "lat": 3.1390,
      "lng": 101.6869,
      "route": "Route A",
      "lastUpdated": 1712500000000
    },
    "Bus_02": {
      "lat": 3.1500,
      "lng": 101.7000
    },
    ...
    "Bus_08": {
      "lat": 3.1600,
      "lng": 101.7200
    }
  }
}
```

---

## 📱 App Features in Detail

### Main Tracking Screen (`app/(tabs)/index.tsx`)
- **Bus selector dropdown** to choose which bus to follow
- **Google Map** showing:
  - Current user location (blue marker)
  - Selected bus location (animated bus marker)
  - Route line between user and bus
- **Distance dashboard** showing:
  - Current distance (calculated via Haversine formula)
  - Estimated arrival time (distance / avg speed)
  - Bus coordinates

### Bus Context State Management (`context/BusContext.tsx`)
- Firebase Realtime Database listeners for all buses
- Automatic distance calculations
- Simulation mode for testing
- State includes:
  - All buses with live locations
  - Selected bus ID
  - User location (geolocation API)
  - Distance & ETA calculations

### Components
- **`MapWrapper.tsx`** — Native map component (iOS/Android)
- **`MapWrapper.web.tsx`** — Web map fallback (no native maps on web)
- **`ArrivingAlert.tsx`** — Full-screen alert when bus within 1km
- **`BusSelector.tsx`** — Bottom sheet for bus selection
- **`DashboardCard.tsx`** — Metrics cards for distance/ETA

### Color Scheme
- **Primary**: Navy Blue (`#001F3F`)
- **Accent**: Amber (`#FFC107`)
- **Background**: Clean white with subtle gradients

---

## 🔧 API Endpoints

### Bus Routes
```
GET /api/buses                  # List all buses
POST /api/buses                 # Create new bus
GET /api/buses/:id              # Get bus details
PUT /api/buses/:id              # Update bus location
DELETE /api/buses/:id           # Remove bus

GET /api/buses/:id/location     # Get current location
GET /api/buses/:id/distance     # Calculate distance from point
```

### Routes Management
```
GET /api/routes                 # List all routes
POST /api/routes                # Create new route
GET /api/routes/:id             # Get route details
PUT /api/routes/:id             # Update route
DELETE /api/routes/:id          # Remove route
```

**Full API documentation** available in `lib/api-spec/` (OpenAPI 3.0 spec)

---

## 📊 Database Schema (Drizzle ORM)

Located in `lib/db/`:

```typescript
// Buses table
export const buses = pgTable('buses', {
  id: serial('id').primaryKey(),
  busNumber: varchar('bus_number').unique(),
  routeId: integer('route_id').references(() => routes.id),
  latitude: decimal('latitude'),
  longitude: decimal('longitude'),
  status: varchar('status'), // 'active', 'inactive', 'maintenance'
  capacity: integer('capacity'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Routes table
export const routes = pgTable('routes', {
  id: serial('id').primaryKey(),
  name: varchar('name'),
  description: text('description'),
  schools: integer('schools'), // Number of schools on route
  stops: integer('stops'),     // Number of stops
  createdAt: timestamp('created_at').defaultNow(),
});
```

---

## 🔐 Security & DevSecOps

This project implements several security best practices:

### Supply Chain Security
- **Minimum 1-day release age** for npm packages (prevents malicious versions)
- Configured in `pnpm-workspace.yaml`:
  ```yaml
  minimumReleaseAge: 1440  # 24 hours
  ```
- Whitelist trusted orgs for emergency patches

### Firebase Security
- Rules-based access control (configure in Firebase Console)
- API key restrictions by HTTP referrer
- Database rules prevent unauthorized writes

### Roadmap for Enhanced Security
- [ ] Granular API key restrictions and rotation
- [ ] Automated security scanning for Firebase rules
- [ ] AI-driven route optimization with privacy safeguards
- [ ] Real-time anomaly detection for suspicious patterns

---

## 📈 Performance Optimization

### Build & Deploy
- **esbuild** for fast JS bundling
- **TypeScript project references** for incremental builds
- **Platform-specific overrides** in pnpm to reduce bundle size on Replit (linux-x64 only)

### Frontend
- **React Query** for efficient data fetching with caching
- **Expo** for optimized mobile builds
- **Lazy loading** of map components

### Backend
- **Connection pooling** via Drizzle ORM
- **Indexed database queries** for location lookups
- **CORS** optimized for single origin

---

## 🚢 Deployment

### Replit (Current)
- Live at: https://replit.com/@boikunthadev/School-Bus-Tracker
- Auto-deployed from GitHub repository
- `.replit` and `.replitignore` configured for seamless deployment

### Docker
```dockerfile
FROM node:24-alpine
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm run build
EXPOSE 3000
CMD ["pnpm", "run", "dev"]
```

### Vercel / Netlify (Frontend)
```bash
pnpm run build
# Deploy `artifacts/bus-tracker/.expo-shared/` or built output
```

---

## 🧪 Testing & Development

### Type Checking
```bash
pnpm run typecheck        # Full monorepo typecheck
pnpm run typecheck:libs   # Library-only typecheck
```

### Building
```bash
pnpm run build            # Full build (typecheck + build all packages)
```

### Running Scripts
```bash
pnpm --filter @workspace/scripts run hello    # Run hello.ts
pnpm --filter @workspace/api-server run dev   # Start API in dev mode
```

### Debugging
- Enable TypeScript source maps for debugging
- Use `tsx` for TypeScript execution (better errors than `ts-node`)

---

## 📁 Project Structure Explained

### `artifacts/`
**Deployable applications** that can run independently or as services.

- **`api-server/`** — Express.js REST API
  - `src/index.ts` — Entry point with route handlers
  - `build.ts` — esbuild configuration for production bundle
  - Depends on: `@workspace/db`, `@workspace/api-zod`

- **`bus-tracker/`** — React Native (Expo) mobile app
  - `app/` — Expo Router file-based routing
  - `context/` — React Context for global state (buses, location)
  - `components/` — Reusable UI components
  - `config/` — Firebase initialization

- **`mockup-sandbox/`** — UI/UX prototype (Vite + React)

### `lib/`
**Shared libraries** used across artifacts.

- **`db/`** — Database schema and Drizzle ORM setup
  - `schema.ts` — PostgreSQL tables
  - `client.ts` — Connection pool initialization

- **`api-spec/`** — OpenAPI 3.0 specification
  - `openapi.yaml` — Full API contract
  - `orval.config.ts` — Code generation rules

- **`api-zod/`** — Auto-generated Zod schemas from OpenAPI
  - Used for runtime validation
  - Regenerated by: `pnpm run codegen`

- **`api-client-react/`** — Auto-generated React Query hooks
  - Type-safe API calls
  - Built from OpenAPI spec via Orval

### `scripts/`
**Utility TypeScript scripts** for development tasks.

- `src/hello.ts` — Example script
- Run via: `pnpm --filter @workspace/scripts run hello`

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### 1. Fork & Clone
```bash
git clone https://github.com/yourusername/School-Bus-Tracker.git
cd School-Bus-Tracker
```

### 2. Create Feature Branch
```bash
git checkout -b feature/amazing-feature
```

### 3. Make Changes & Test
```bash
pnpm install
pnpm run typecheck
pnpm run build
```

### 4. Commit & Push
```bash
git commit -m "feat: add amazing feature"
git push origin feature/amazing-feature
```

### 5. Open Pull Request
- Describe your changes clearly
- Link any related issues
- Ensure tests pass

### Areas for Contribution
- 🗺️ Enhanced map features (polylines, geofencing)
- 🔔 Improved notification system
- 📊 Analytics dashboard for school admins
- 🌐 Multi-language support (i18n)
- 🧪 Unit & integration tests
- 📱 iOS/Android native features
- 🐛 Bug fixes and performance improvements

---

## 🐛 Troubleshooting

### "Firebase credentials not found"
**Solution**: Ensure environment variables are set correctly or `firebase.ts` is configured.
```bash
echo $EXPO_PUBLIC_FIREBASE_API_KEY
```

### "Database connection failed"
**Solution**: Verify PostgreSQL is running and `DATABASE_URL` is correct.
```bash
psql $DATABASE_URL -c "SELECT 1;"
```

### "pnpm: command not found"
**Solution**: Install pnpm globally.
```bash
npm install -g pnpm
```

### "TypeScript errors during build"
**Solution**: Run full typecheck from root.
```bash
pnpm run typecheck
```

### "Expo app won't load on mobile"
**Solution**: 
1. Ensure device and computer are on same WiFi
2. Check Expo dev server logs for errors
3. Try clearing Expo cache: `pnpm cache clean && pnpm install`

---

## 📚 Resources & Links

- **Expo Documentation**: https://docs.expo.dev/
- **React Native**: https://reactnative.dev/
- **Drizzle ORM**: https://orm.drizzle.team/
- **Express.js**: https://expressjs.com/
- **Firebase Realtime Database**: https://firebase.google.com/docs/database
- **Orval (OpenAPI Codegen)**: https://orval.dev/
- **pnpm Workspaces**: https://pnpm.io/workspaces
- **Tailwind CSS**: https://tailwindcss.com/

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Boikuntha

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
```

---

## 👨‍💻 Author

**Boikuntha** (@boikzdev)
- 🔗 GitHub: [boikzdev](https://github.com/boikzdev)
- 🌐 Replit: [@boikunthadev](https://replit.com/@boikunthadev)
- 🎯 Focus: AI Red Teaming, DevSecOps, Full-Stack Development

---

## 🌟 Support & Feedback

If you find this project helpful:

- ⭐ **Star this repository** on GitHub
- 🐛 **Report bugs** via [GitHub Issues](https://github.com/boikzdev/School-Bus-Tracker/issues)
- 💡 **Suggest features** in discussions
- 🤝 **Contribute code** with pull requests
- 📢 **Share** with your network

---

## 🗺️ Roadmap

### V1 (Current)
- ✅ Real-time bus tracking
- ✅ Firebase Realtime Database integration
- ✅ React Native mobile app
- ✅ Express backend API
- ✅ TypeScript monorepo

### V2 (Planned)
- [ ] Advanced route optimization (AI-driven)
- [ ] Multi-school support
- [ ] Admin dashboard for school coordinators
- [ ] Parent/student SMS notifications
- [ ] Historical analytics & reports
- [ ] Driver mobile app
- [ ] Integration with school information systems (SIS)

### V3+ (Future Vision)
- [ ] Autonomous vehicle compatibility
- [ ] Predictive maintenance alerts
- [ ] Environmental impact tracking
- [ ] Integration with public transit systems
- [ ] AR navigation features

---

**Built with ☕ and curiosity for better school transportation**

[🚌 View on GitHub](https://github.com/boikzdev/School-Bus-Tracker) • [🎮 Live Demo on Replit](https://replit.com/@boikunthadev/School-Bus-Tracker)
