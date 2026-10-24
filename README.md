# GridMind — Frontend Engineering Foundation (Phase 0)

GridMind is an energy continuity intelligence platform designed for commercial and industrial facilities operating in challenging grid environments (such as Nigeria). It optimizes energy dispatch and protects critical loads across a combination of:
- **National Grid Electricity** (e.g., Ikeja Electric Band A)
- **Prime Diesel Generators** (fuel consumption & runtime cost optimization)
- **Rooftop Solar PV Systems**
- **Battery Energy Storage Systems (BESS)**
- **Prioritized Appliances & Loads** (Critical freezers, Important lighting/IT, Deferrable HVAC)

---

## 1. Quick Start

### Prerequisites
- Node.js `v18.17.0+` (tested on Node `v24.x`)
- npm `v9+`

### Installation
Clone the repository and install dependencies:
```bash
npm install
```

### Environment Configuration
Copy the provided `.env.example` file to create your local environment:
```bash
cp .env.example .env.local
```

Default `.env.local` parameters:
```env
NEXT_PUBLIC_DATA_MODE=mock
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_APP_NAME=GridMind
NEXT_PUBLIC_APP_VERSION=0.1.0-alpha
NEXT_PUBLIC_REFRESH_INTERVAL_MS=15000
```

### Running Locally
Start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 2. Scripts Reference

| Command | Description |
|---|---|
| `npm run dev` | Starts local Next.js development server with hot-reload |
| `npm run build` | Compiles production-optimized Next.js bundle |
| `npm run start` | Starts production server with built artifacts |
| `npm run lint` | Runs Next.js ESLint verification |
| `npm run type-check` | Runs TypeScript compiler in strict mode without emitting files (`tsc --noEmit`) |

---

## 3. Architecture & Directory Structure

```
GridMind/
├── app/
│   ├── globals.css              # Tailwind base, semantic tokens & scrollbar styling
│   ├── layout.tsx               # Root App Router layout & metadata
│   ├── page.tsx                 # Phase 1: Public marketing brand landing page
│   ├── dashboard/
│   │   ├── layout.tsx           # Dashboard shell wrapper (AppShell)
│   │   └── page.tsx             # Operational foundation console
│   ├── login/
│   │   └── page.tsx             # Sign in portal (early access)
│   ├── signup/
│   │   └── page.tsx             # Account onboarding portal
│   ├── privacy/
│   │   └── page.tsx             # Privacy notice
│   └── terms/
│       └── page.tsx             # Terms of service notice
├── components/
│   ├── marketing/
│   │   ├── navbar.tsx           # Sticky responsive marketing navigation with mobile drawer
│   │   ├── hero-dashboard-preview.tsx # High-fidelity interactive operational visual
│   │   ├── interactive-preview.tsx    # Interactive Energy Crisis Simulator preview
│   │   └── footer.tsx           # Dynamic footer with industry & product links
│   ├── layout/
│   │   ├── app-shell.tsx        # Responsive console shell wrapper
│   │   ├── header.tsx           # Telemetry ribbon, system pulse & alert badge
│   │   └── sidebar.tsx          # Brand identity, facility selector & navigation
│   ├── ui/
│   │   ├── badge.tsx            # Semantic badges (healthy, warning, critical, info)
│   │   ├── button.tsx           # Accessible button primitive with states
│   │   ├── card.tsx             # Restrained border card container
│   │   └── metric-card.tsx      # Domain KPI card with explicit unit formatting
│   ├── dashboard/               # Phase 1: Operational visual widgets
│   ├── simulator/               # Phase 1: What-if outage scenario simulator
│   ├── recommendations/         # Phase 1: AI recommendation & approval cards
│   └── analytics/               # Phase 1: Historical cost & runtime analytics
├── config/
│   └── env.ts                   # Centralized type-safe environment configuration
├── features/                    # Domain-specific logic & state machines
├── hooks/
│   └── use-energy-data.ts       # Service-backed reactive polling hook
├── lib/
│   ├── formatters.ts            # Domain unit formatters (kW, kWh, NGN, %, °C)
│   └── utils.ts                 # Tailwind class merging utility (cn)
├── mocks/
│   └── demo-business.ts         # Centralized benchmark dataset (Krystal Ice Cold Storage)
├── services/
│   ├── interfaces.ts            # Strict service contracts for backend alignment
│   ├── mock-service.ts          # Mock implementation with simulated latency
│   ├── api-service.ts           # Future FastAPI integration client
│   └── index.ts                 # Service factory switching based on NEXT_PUBLIC_DATA_MODE
├── types/
│   └── energy.ts                # Strict domain interfaces (zero `any` types)
├── .env.example                 # Sanitized environment template
├── .env.local                   # Local runtime configuration
├── next.config.mjs              # Next.js configuration
├── tailwind.config.ts           # Design tokens (deep forest green #0e1f18, emerald, slate)
└── tsconfig.json                # TypeScript strict mode configuration
```

---

## 4. Mock Data Layer vs. Future API Integration

### How Mock Mode Works (Phase 0 Default)
1. In `config/env.ts`, `dataMode` defaults to `"mock"`.
2. The service factory in `services/index.ts` automatically binds UI queries to `mockServices`.
3. Realistic fictional benchmark data is provided in `mocks/demo-business.ts`:
   - **Facility:** Krystal Ice Cold Storage Ltd. (Ikeja Industrial Zone, Lagos, Nigeria).
   - **Grid:** Ikeja Electric Band A (₦206/kWh).
   - **Generator:** Cummins 160 kVA Prime Diesel (Diesel cost ₦1,250/L; ~₦356/kWh effective cost).
   - **Solar:** 75 kWp Rooftop Monocrystalline PV array.
   - **Storage:** 120 kWh LiFePO4 battery storage bank (currently 68% SOC).
   - **Loads:** Blast freezers, cold rooms, medical refrigerators, LED warehouse lighting, HVAC.
4. All UI components and hooks consume service abstractions (`energyService`, `applianceService`, `recommendationService`) rather than importing raw mock arrays directly.

### How to Switch to API Mode
1. In `.env.local`, set:
   ```env
   NEXT_PUBLIC_DATA_MODE=api
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
   ```
2. Restart the dev server (`npm run dev`).
3. The service factory will immediately route calls through `apiServices` (defined in `services/api-service.ts`), pointing directly to your FastAPI backend.

---

## 5. Backend Contracts Awaiting Confirmation with Team

Before enabling full API mode in Phase 1, the following REST/WebSocket contracts must be finalized with the FastAPI backend teammates:

1. **Telemetry Feed (`/telemetry/dashboard-metrics`)**
   - Confirm polling interval vs. WebSocket push cadence.
   - Confirm property naming: snake_case from FastAPI (`total_load_kw`) vs. camelCase adapter for frontend TypeScript (`totalLoadKw`).
2. **Appliance Control Endpoint (`PATCH /appliances/{id}/state`)**
   - Confirm whether shedding deferrable loads requires an authorization token or role check (`role: "facility_manager"`).
   - Confirm response schema on command acknowledgement.
3. **AI Recommendations & Human-in-the-Loop Approvals (`POST /recommendations/{id}/approve`)**
   - Payload contract for user approval/rejection.
   - Confirmation of how the AI agent calculates estimated financial savings in NGN.
4. **Forecast Ingestion (`GET /forecast/today`)**
   - Structure for solar irradiance predictions and uncertainty bounds (P10 / P50 / P90).

---

## 6. Visual Design System

- **Primary Brand Color:** Deep Forest Green (`#0e1f18` / `brand-950`)
- **System Health & Clean Energy:** Emerald Accents (`#10b981` / `status-healthy`)
- **Warnings & Load Alerts:** Amber (`#f59e0b` / `status-warning`)
- **Critical / Fault Conditions:** Crimson (`#ef4444` / `status-critical`)
- **Surfaces:** Clean slate white (`#ffffff`) and neutral subtle backgrounds (`#f8fafc`)
- **Typography:** Inter with tabular figures for real-time telemetry stability

---

## 7. Authentication Interface Specifications (Phase 2 Alignment)

The frontend authentication layer (`/login`, `/signup`, `/forgot-password`) uses a decoupled service architecture (`IAuthService`). The following interfaces are prepared for alignment with the backend / Supabase team:

### A. Email / Password Login (`POST /auth/login`)
- **Request Payload**:
  ```json
  {
    "email": "operator@krystalice.ng",
    "password": "string",
    "rememberMe": true
  }
  ```
- **Expected Success Response (200 OK)**:
  ```json
  {
    "user": {
      "id": "usr_01",
      "email": "operator@krystalice.ng",
      "fullName": "Engr. Tunde Adeyemi",
      "role": "facility_manager",
      "siteId": "site_krystal_ikeja_01"
    },
    "token": "jwt_token_string"
  }
  ```
- **Expected Error Response (401 Unauthorized / 422 Unprocessable)**:
  ```json
  {
    "message": "Invalid email or password combination."
  }
  ```

### B. Account Registration (`POST /auth/signup`)
- **Request Payload**:
  ```json
  {
    "fullName": "Babatunde Adeyemi",
    "email": "operator@company.com",
    "password": "SecurePassword123!",
    "agreeToTerms": true
  }
  ```
- **Expected Success Response (201 Created)**: Returns `{ user, token }` matching the login schema.

### C. Password Recovery (`POST /auth/forgot-password`)
- **Request Payload**: `{ "email": "operator@company.com" }`
- **Expected Response (200 OK)**: `{ "success": true, "message": "Instructions dispatched." }`

### D. Google OAuth 2.0 / OIDC Flow
- Frontend exposes `loginWithGoogle()`.
- If `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is not configured, the UI cleanly presents an informative disclaimer without simulating a fake session.
- Once client ID is provided by the backend team, the button will initiate the OIDC PKCE / redirect flow to `${NEXT_PUBLIC_API_BASE_URL}/auth/google/authorize`.

