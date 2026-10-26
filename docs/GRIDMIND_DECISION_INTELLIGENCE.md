# GridMind Decision Intelligence Architecture & Demo Guide

**Project Theme:** Beyond Automation: The Data Powering AI Agents  
**Event:** Ibom Data Connect 3.0  
**Target Facility:** Krystal Ice Cold Storage Ltd, Ikeja Industrial Estate, Lagos, Nigeria  
**Platform Version:** 1.0 (Interactive Decision Intelligence Engine)

---

## 1. Executive Summary

GridMind is an energy continuity and decision-intelligence platform built specifically for commercial and industrial facilities operating under challenging grid conditions in Nigeria.

Traditional microgrid controllers and automatic transfer switches (ATS) operate purely on reactive logic: when utility power fails, they immediately start a diesel generator or discharge batteries until depletion. This unmanaged approach leads to astronomical diesel expenditure, premature battery degradation, and preventable cold-chain spoilage.

GridMind bridges the gap between raw industrial telemetry and constrained AI decision-making. By analyzing real-time electrical data, predictive solar horizons, and thermal inertia constraints, GridMind forecasts energy deficits before they happen and presents auditable, human-in-the-loop recommendations to facility operators.

---

## 2. Business Context: Krystal Ice Cold Storage Ltd

Krystal Ice Cold Storage Ltd is an industrial cold-chain facility located in the Ikeja Industrial Estate in Lagos, Nigeria. The facility maintains perishable goods, pharmaceuticals, and temperature-sensitive inventory across blast freezers and multi-zone cold rooms.

### Technical Baseline Specifications:
- **Contracted Grid Feeder:** 150.0 kW connected load on Ikeja Electric 11kV Industrial Feeder (Band A tariff: ₦206.00/kWh).
- **Rooftop Solar PV Array:** 75.0 kWp monocrystalline array with smart inverter telemetry.
- **Battery Energy Storage System (BESS):** 120.0 kWh Lithium Iron Phosphate (LiFePO4) storage bank, 60.0 kW maximum discharge rate, with a strict 20% minimum state-of-charge (SOC) reserve floor.
- **Backup Generation:** Cummins 160 kVA Prime Industrial Diesel Generator with a 650-liter fuel tank and ₦1,300/liter diesel pricing (specific fuel consumption: 0.28 L/kWh).
- **Critical Equipment:** Commercial blast freezers (-18°C setpoint), cold storage rooms (-4°C setpoint), and facility security lighting.
- **Nonessential Equipment:** Packaging hall air conditioning and administrative office HVAC.

---

## 3. The 5-Stage Agent Pipeline

At Ibom Data Connect 3.0, GridMind demonstrates how AI agents cannot produce reliable decisions without transparent, continuous, and verified telemetry. GridMind visualizes this pipeline directly in the operator dashboard through 5 distinct stages:

```
[ Stage 1: Telemetry Ingest ]
            │
            ▼
[ Stage 2: Predictive Forecast ]
            │
            ▼
[ Stage 3: Constrained Decision Logic ]
            │
            ▼
[ Stage 4: Explainable Recommendation ]
            │
            ▼
[ Stage 5: Human-in-the-Loop Operator Approval ]
```

### Stage 1: Telemetry Ingestion
- Ingests real-time physical readings: 3-phase grid feeder voltage, rooftop solar irradiance and inverter kW output, battery bank state of charge (SOC) and DC bus voltage, and individual appliance power draw via digital power meters.
- Tags every metric with data provenance (such as `Simulated Benchmark` or `Backend Telemetry`) and flags stale or anomalous sensor readings before optimization begins.

### Stage 2: Predictive Forecasting
- Evaluates 6-hour solar irradiance trajectories based on local atmospheric models.
- Tracks utility feeder reliability profiles to calculate real-time blackout probability.
- Models cold-chain thermal decay, calculating the safe thermal holdover window (typically 60 to 90 minutes) before product damage occurs.

### Stage 3: Constrained Decision Logic
- Evaluates operational constraints:
  1. Critical refrigeration loads must never lose power.
  2. Battery state of charge must not breach the 20% reserve floor during routine operation.
  3. Total microgrid power draw must remain within inverter continuous capacity (90 kW).
  4. Diesel generation is dispatched only when solar and usable battery reserves cannot sustain critical loads.

### Stage 4: Explainable Recommendation Generation
- Synthesizes a discrete, transparent operational recommendation for the facility manager.
- Discloses the complete decision rationale: situation, supporting inputs, expected hourly financial savings, runtime extension, trade-offs, and rejected alternatives.

### Stage 5: Human-in-the-Loop Authorization
- Enforces an operational gate where recommendations are queued for operator review.
- The facility engineer or operations supervisor can inspect full telemetry, review alternatives, and either approve or decline the action with logged operator notes.
- Dispatches approved parameters directly to simulated microgrid controls.

---

## 4. Mathematical Model & Dispatch Equations

GridMind employs deterministic equations derived from industrial microgrid operations:

### 1. Usable Battery Energy & Runtime
The usable battery capacity before hitting the preservation cutoff is calculated as:
$$E_{usable} = C_{total} \times \max\left(0, \frac{\text{SOC} - \text{SOC}_{floor}}{100}\right)$$

Where:
- $C_{total} = 120\text{ kWh}$ (Total LiFePO4 capacity)
- $\text{SOC}_{floor} = 20\%$ (Mandatory reserve floor)

The remaining battery runtime at active critical demand $P_{crit}$ is:
$$T_{battery} = \frac{E_{usable} \times \eta_{inverter}}{P_{crit}}$$
Where inverter round-trip efficiency $\eta_{inverter} = 0.92$.

### 2. Diesel Operating Cost & Burn Rate
When the diesel generator is engaged to supply active load $P_{gen}$:
$$\text{Burn Rate } (\text{L/hr}) = P_{gen} \times 0.28\text{ L/kWh}$$
$$\text{Hourly Cost } (\text{₦/hr}) = \text{Burn Rate} \times ₦1,300/\text{liter}$$

### 3. Utility Grid Cost
During utility availability under Band A pricing:
$$\text{Hourly Grid Cost } (\text{₦/hr}) = P_{grid} \times ₦206.00/\text{kWh}$$

### 4. Strategy Benchmark Comparison
GridMind benchmarks its recommendations against a conventional automatic transfer switch (ATS) baseline:
$$\text{Cost Delta } (\text{₦/hr}) = \text{Cost}_{baseline} - \text{Cost}_{proposed}$$
$$\text{Percentage Savings} = \begin{cases} \left(\frac{\text{Cost Delta}}{\text{Cost}_{baseline}}\right) \times 100\% & \text{if } \text{Cost}_{baseline} > 0 \\ 0\% & \text{otherwise} \end{cases}$$

---

## 5. Built-in Scenario Presets

GridMind provides 4 pre-configured operational presets designed for live demonstration:

### Preset 1: Normal Operation (Mains Stable)
- **Feeder Status:** Ikeja 11kV grid synchronized, Band A tariff active.
- **Battery Status:** 68% SOC (healthy buffer).
- **Solar Output:** 48.0 kW (midday generation).
- **Appliances:** Blast freezers, cold rooms, packaging AC, and security lighting all operational.
- **Risk Assessment:** `NORMAL` (Risk Score: 18/100).
- **Core Recommendation:** Pre-cool blast freezers using surplus solar generation to bank thermal energy before evening peak tariffs.

### Preset 2: Unexpected Grid Outage (Microgrid Islanded)
- **Feeder Status:** Utility grid offline (0V blackout).
- **Battery Status:** 58% SOC discharging.
- **Solar Output:** 38.0 kW.
- **Appliances:** All loads attempting to run, including 18.5 kW packaging AC.
- **Risk Assessment:** `ELEVATED RISK` (Risk Score: 58/100).
- **Core Recommendation:** Shed packaging AC to extend battery backup runtime by 2.4 hours and avoid immediate diesel startup.

### Preset 3: Extended Blackout (Low Battery Reserve)
- **Feeder Status:** Utility grid offline for over 4 hours.
- **Battery Status:** 20% SOC (exact reserve floor reached).
- **Solar Output:** 0.0 kW (overcast or evening).
- **Appliances:** Nonessential loads curtailed; blast freezers at risk of temperature excursion.
- **Risk Assessment:** `CRITICAL RISK` (Risk Score: 86/100).
- **Core Recommendation:** Synchronize and crank the 160 kVA diesel generator to supply critical refrigeration while safeguarding the 20% battery floor.

### Preset 4: High Demand Peak (Thermal Stress)
- **Feeder Status:** Utility grid online with facility demand peaking at 88.0 kW.
- **Battery Status:** 45% SOC.
- **Solar Output:** 42.0 kW.
- **Risk Assessment:** `ELEVATED RISK` (Risk Score: 52/100).
- **Core Recommendation:** Discharge battery buffer to shave contracted grid peak demand and avoid utility maximum-demand penalties.

---

## 6. System Transparency & Integrity

To maintain trust with facility engineers and evaluators:
- **No Invisible Black Boxes:** Every recommendation displays the explicit inputs, mathematical calculations, and physical constraints used in its generation.
- **Honest System Status:** The platform clearly displays `DEMO SIMULATION` and `SIMULATED BENCHMARK` tags. It does not falsely claim direct hardware actuator connectivity without certified physical transfer equipment.
- **Auditable History:** All operator approvals, rejections, and notes are recorded in the session audit log with timestamps.

---

## 7. Judge & Evaluator Demonstration Walkthrough (3 Minutes)

Follow this step-by-step sequence to present GridMind to Ibom Data Connect 3.0 judges:

1. **Start on Dashboard Overview (`/dashboard`):**
   - Point out the **Operational Risk Assessment** card at the top, showing the current facility risk score and recommended posture for Krystal Ice Cold Storage.
   - Point out the **5-Stage Agent Decision Pipeline**, demonstrating how raw telemetry flows into forecasts, decision logic, and human approval.
   - Click on the **Stage 5 Gate** to approve the pending recommendation directly from the dashboard, observing the instant dispatch feedback.

2. **Navigate to the Energy Crisis Simulator (`/dashboard/simulator`):**
   - Click the **Unexpected Outage** preset button under Scenario Presets.
   - Observe the live microgrid transition: utility grid drops to 0V, battery begins discharging, and operational risk updates to `ELEVATED RISK`.
   - Review the **Strategy Comparison: Baseline vs GridMind Intelligent Policy** card. Highlight the hourly cost reduction (up to 42% savings) and the +2.4 hour battery runtime extension.
   - Click **View Model Assumptions and Limitations** to demonstrate transparency regarding Band A tariffs, diesel burn rates, and LiFePO4 battery efficiencies.
   - Adjust the **Battery Storage SOC** slider or the **Reserve Floor Cutoff** slider to demonstrate instant recalculation across all dispatch flows.

3. **Navigate to Recommendations (`/dashboard/recommendations`):**
   - Review the queue of explainable recommendations.
   - Click **Inspect Decision Details** on any card to view the modal displaying: Observed System Telemetry, Algorithmic Selection Rationale, Benefits vs Trade-offs, and Alternative Options Considered.
   - Complete an approval or rejection with custom operator notes, verifying the audit trail entry.
