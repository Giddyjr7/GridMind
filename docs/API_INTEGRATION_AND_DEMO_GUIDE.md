# GridMind — Backend API Integration Checklist & Hackathon Demo Guide

> **Phase 7 QA Deliverable**: Frontend contract specifications, backend integration boundary, and deterministic demo demonstration script for **GridMind: AI-Assisted Microgrid Intelligence**.

---

## 1. Mock-to-API Architecture & Configuration Boundary

GridMind frontend is designed with a **decoupled factory pattern** (`services/index.ts`). It operates out-of-the-box without requiring an active backend or live LLM service, ensuring 100% demo stability under conference network conditions.

### Environment Configuration (`.env.local`)

```bash
# Data Mode: 'mock' (default synthetic testbed) or 'api' (live FastAPI backend)
NEXT_PUBLIC_DATA_MODE=mock

# Centralized API Base URL for backend endpoints
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1

# Telemetry polling cadence in milliseconds
NEXT_PUBLIC_REFRESH_INTERVAL_MS=15000

# Application branding
NEXT_PUBLIC_APP_NAME="GridMind Intelligence"
NEXT_PUBLIC_APP_VERSION="1.0.0-rc1"
```

### Security & Secret Isolation
- **Zero Frontend Secret Exposure**: No database credentials, API secret keys, or cloud access tokens are bundled in client JavaScript.
- All requests in `api` mode pass standard JWT Bearer headers managed via `services/auth-service.ts`.
- Backend CORS must allow `http://localhost:3000` (and production Vercel origins) with `GET, POST, PATCH, OPTIONS`.

---

## 2. Backend Team Integration Checklist

| Step | Action Item | Priority | Status |
| :--- | :--- | :---: | :---: |
| **B1** | Implement CORS middleware on FastAPI allowing client origin | P0 | Pending Backend |
| **B2** | Implement `GET /telemetry/dashboard-metrics` matching contract | P0 | Pending Backend |
| **B3** | Implement `GET /appliances` and `PATCH /appliances/{id}/state` | P0 | Pending Backend |
| **B4** | Implement `GET /recommendations` with urgency & telemetry inputs | P0 | Pending Backend |
| **B5** | Implement `POST /recommendations/{id}/approve` & `reject` audit trail | P0 | Pending Backend |
| **B6** | Implement `GET /forecast/today` with 24-hour solar potential curve | P1 | Pending Backend |
| **B7** | Implement `GET /audit/events` disturbance telemetry logging | P1 | Pending Backend |

---

## 3. Proposed Frontend Contracts

*(Marked as proposed contracts until the backend team verifies schemas.)*

### 3.1 Dashboard Telemetry (`GET /telemetry/dashboard-metrics`)
```json
{
  "site": {
    "id": "site_krystal_ikeja_01",
    "name": "Krystal Ice Cold Storage Ltd.",
    "industry": "cold_storage",
    "contractedDemandKw": 150.0,
    "tariffBand": "Band A (₦206/kWh)"
  },
  "telemetry": {
    "currentLoadKw": 74.5,
    "gridImportKw": 36.1,
    "solarGenerationKw": 38.4,
    "batteryFlowKw": 0.0,
    "generatorOutputKw": 0.0,
    "batterySocPct": 68,
    "primaryActiveSource": "grid",
    "gridOnline": true,
    "generatorOnline": false
  },
  "cost": {
    "todayTotalCost": 184500,
    "projectedMonthCost": 5920000,
    "estimatedSavingsMonth": 1240000
  },
  "lastTelemetryTimestamp": "2024-10-24T12:00:00Z"
}
```

### 3.2 Equipment List & Circuit State (`GET /appliances`)
```json
[
  {
    "id": "app_freezer_01",
    "name": "Blast Freezer Room A (Seafood & Poultry)",
    "category": "refrigeration",
    "priority": "critical",
    "state": "running",
    "ratedPowerKw": 32.0,
    "currentPowerKw": 29.8,
    "isControllable": false,
    "temperatureCritical": {
      "currentTempCelsius": -21.4,
      "minAllowedCelsius": -26.0,
      "maxAllowedCelsius": -18.0
    }
  },
  {
    "id": "app_ac_packaging",
    "name": "Packaging Floor HVAC System 1 & 2",
    "category": "cooling_hvac",
    "priority": "deferrable",
    "state": "running",
    "ratedPowerKw": 18.0,
    "currentPowerKw": 16.0,
    "isControllable": true,
    "maxDeferralMinutes": 180
  }
]
```

### 3.3 AI Recommendation Authorization (`POST /recommendations/{id}/approve`)
**Request Body:**
```json
{
  "action": "approve",
  "notes": "Approved automated shedding policy for Packaging HVAC during diesel backup.",
  "performedBy": "Engr. T. Adeyemi (Operations Lead)"
}
```
**Response Body:**
```json
{
  "id": "appr_1729804800000",
  "recommendationId": "rec_opt_002",
  "actionTaken": "approve",
  "performedBy": "Engr. T. Adeyemi (Operations Lead)",
  "timestamp": "2024-10-24T09:30:12Z",
  "notes": "Approved automated shedding policy for Packaging HVAC during diesel backup.",
  "savingsRealizedEstimateNgn": 16800
}
```

---

## 4. Hackathon Live Demonstration Script (3 Minutes)

Follow this deterministic sequence during the jury presentation to showcase the full end-to-end capabilities of GridMind:

### Step 1: Baseline Overview (`/dashboard`)
- **Action**: Open `/dashboard`.
- **Narration**: *"GridMind is an energy continuity intelligence platform designed for Nigerian cold storage facilities. Here is Krystal Ice in Ikeja, running on a 150 kW contracted grid feed with rooftop solar and LiFePO4 battery storage."*
- **Key Visual**: Highlight Key Metrics (74.5 kW total load, 68% battery SOC, 100% cold-chain uptime).

### Step 2: Trigger Simulated Grid Outage (`/dashboard/simulator`)
- **Action**: Navigate to `/dashboard/simulator`. Click **"Simulate Outage"**.
- **Narration**: *"At 14:00, the Ikeja Electric feeder drops offline. Immediately, the microgrid isolates. Notice GridMind's real-time calculations: without intervention, running all HVAC loads on battery would drain reserves within 1.5 hours."*
- **Key Visual**: Total demand remains high, runtime displays warning status, header ribbon reflects `Grid: OFFLINE`.

### Step 3: Evaluate & Authorize Recommendation (`/dashboard/recommendations`)
- **Action**: Navigate to `/dashboard/recommendations`. Open **"Inspect Decision Details"** on *Curtail Packaging HVAC*.
- **Narration**: *"GridMind’s deterministic policy engine generates an audited recommendation: curtail the 18 kW deferrable packaging HVAC to safeguard the -21°C blast freezer and extend battery runtime by 2.2 hours."*
- **Action**: Click **"Approve Action"**.
- **Key Visual**: Recommendation badge flips to `Authorized & Applied`, circuit is immediately throttled in simulation context.

### Step 4: Verify Asset Protection (`/dashboard/equipment`)
- **Action**: Navigate to `/dashboard/equipment`.
- **Narration**: *"In Equipment Management, notice the blast freezers remain locked in Critical priority. If an operator attempts to downgrade a freezer, GridMind's safety guard intercepts with a temperature excursion warning."*
- **Key Visual**: Demonstrate the safety downgrade warning modal on Blast Freezer Room A.

### Step 5: Cost Analytics & Fair Baseline Comparison (`/dashboard/analytics`)
- **Action**: Navigate to `/dashboard/analytics`.
- **Narration**: *"Here is our transparent, audited baseline comparison against a conventional unmanaged auto-generator switch. Under this 4-hour outage, GridMind abates 114 Liters of diesel fuel and saves over ₦142,000, while maintaining 100% cold-chain uptime."*
- **Action**: Click **"Export Analytics (CSV)"** to show working client-side data export.

### Step 6: Immutable Audit Trail (`/dashboard/history`)
- **Action**: Navigate to `/dashboard/history`.
- **Narration**: *"Every single human authorization, system disturbance, and load shedding event is recorded in our immutable audit trail with explicit `[SIMULATED]` provenance and instant CSV export."*

### Step 7: Reset to Benchmark (`/dashboard/settings`)
- **Action**: Navigate to `/dashboard/settings`. Click **"Reset Demo Benchmark"**.
- **Narration**: *"One click restores the initial demo scenario, ready for the next test."*

---

## 5. Frontend Quality & Edge-Case Audit Summary

| Category | Verification Test | Result |
| :--- | :--- | :---: |
| **Battery at 0% SOC** | Total usable energy is 0 kWh; generator handles load or unmet load triggers "Compromised" status | PASSED |
| **Battery at 100% SOC** | Battery absorbs solar excess up to 100% limit without overflow | PASSED |
| **Generator Unavailable** | Generator mode set to "disabled" or "out_of_fuel" results in 0 kW output; overload triggers alarm | PASSED |
| **Zero Load Condition** | Demand at 0 kW safely displays "0.0 kW (No Load)" without divide-by-zero runtime errors | PASSED |
| **Mobile & Tablet Drawer** | Sidebar collapses to hidden drawer on `<768px`; hamburger menu toggles overlay cleanly | PASSED |
| **Repeated Approvals** | Actions are locked once approved/rejected; double clicks do not duplicate audit records | PASSED |
| **CSV Export Functionality** | Fully working client-side RFC 4180 CSV generation for both Analytics and Decision History | PASSED |
