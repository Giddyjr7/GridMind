# GridMind — Pre-Production Legal & Regulatory Review Checklist

This document is an **internal compliance and operational checklist** for the GridMind project owner, corporate counsel, and engineering team. 

Before transitioning the GridMind Energy Continuity Intelligence Platform from hackathon/prototype evaluation to a live commercial production service in Nigeria, the following operational and legal facts must be formally verified, resolved, and updated in `/privacy` and `/terms`.

---

## 1. Corporate Identity & Business Registration
- [ ] **Corporate Entity Name**: Replace `[LEGAL_ENTITY_NAME_PENDING_REGISTRATION]` with the officially registered corporate name (e.g. *GridMind Technologies Nigeria Limited*).
- [ ] **CAC Registration**: Verify the Corporate Affairs Commission (CAC) RC Number and replace `[RC_NUMBER_PENDING_CAC_CONFIRMATION]`.
- [ ] **Official Registered Office**: Provide the physical registered business address in Nigeria (replacing `[OFFICIAL_REGISTERED_ADDRESS_LAGOS_NIGERIA]`).
- [ ] **Tax & Regulatory Identifiers**: Confirm Federal Inland Revenue Service (FIRS) Tax Identification Number (TIN) for enterprise invoicing.

## 2. Official Communications & Privacy Contacts
- [ ] **Official Privacy & DPO Email**: Establish and configure a dedicated mailbox (e.g. `privacy@gridmind.ng` or `dpo@gridmind.ng`) replacing `[OFFICIAL_PRIVACY_EMAIL_PENDING]`.
- [ ] **Legal & Contracts Email**: Establish `legal@gridmind.ng` replacing `[OFFICIAL_LEGAL_EMAIL_PENDING]`.
- [ ] **Customer Support Channel**: Configure official support desk (e.g. `support@gridmind.ng`).

## 3. Nigerian Data Protection Compliance (NDPA 2023 & NDPC)
- [ ] **Data Protection Officer (DPO)**: Appoint a qualified Data Protection Officer pursuant to Section 32 of the Nigeria Data Protection Act 2023.
- [ ] **NDPC Registration**: File formal registration with the Nigeria Data Protection Commission (NDPC) if data processing thresholds for "Data Controllers of Major Importance" are met.
- [ ] **Data Protection Audit (DPA)**: Commission an annual Data Protection Compliance Audit through a licensed Data Protection Compliance Organization (DPCO).
- [ ] **Data Subject Request (DSR) SOP**: Document internal Standard Operating Procedures for fulfilling access, rectification, erasure, and portability requests within statutory windows.
- [ ] **Data Processing Agreements (DPAs)**: Draft and execute standard DPAs with commercial facility customers, energy service companies (ESCOs), and cloud service vendors.

## 4. Authentication & Third-Party OAuth Configuration
- [ ] **Google OAuth 2.0 Verification**:
  - Register production project in Google Cloud Console.
  - Complete OAuth consent screen verification for production domains.
  - Populate `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in production environment.
  - Confirm minimal scopes (`openid`, `email`, `profile`).
- [ ] **Session & Token Management**:
  - Implement secure HTTP-only, `SameSite=Lax`, `Secure` session cookies for web and API token rotation.
  - Enforce Multi-Factor Authentication (MFA) for facility electrical actuator controls.

## 5. Industrial IoT Telemetry & Field Ingestion
- [ ] **Physical Telemetry Validation**:
  - Document actual Modbus-RTU, Modbus-TCP, and MQTT telemetry ingested from on-site industrial meters (Schneider, Socomec, DSE).
  - Clarify data schema for active power (kW), reactive power (kVAR), battery voltage, and generator fuel rate.
- [ ] **Air-Gapped Safety Interlocks**:
  - Ensure software never overrides physical breaker trips, mechanical interlocks, or manufacturer BMS protections.
  - Comply with Nigerian Electricity Management Services Agency (NEMSA) inspection and certification guidelines.

## 6. Hosting Infrastructure & Cross-Border Data Transfers
- [ ] **Cloud Provider Confirmation**: Identify the production cloud hosting providers (e.g. AWS, Supabase, Azure, Vercel).
- [ ] **Data Residency & Cross-Border Transfers**:
  - Document international hosting regions (EU, US, South Africa).
  - Confirm compliance with Sections 41–43 of the NDPA 2023 regarding cross-border data transfer mechanisms (Standard Contractual Clauses or NDPC white-listed jurisdictions).
- [ ] **Database Encryption**: Enforce AES-256 encryption at rest and TLS 1.3 in transit across all telemetry and customer databases.

## 7. AI & Optimization Logic Disclosures
- [ ] **Model Inference Providers**: Confirm whether dispatch optimization runs on local server rules or calls external model APIs (e.g. OpenAI, Anthropic, Google Vertex AI).
- [ ] **Zero PII Exposure**: Verify that no personally identifiable information (PII) is included in algorithmic dispatch payloads.
- [ ] **Human-in-the-Loop Safeguards**: Maintain clear UI warnings requiring operator authorization for load curtailment actions.

## 8. Data Retention & Deletion Schedules
- [ ] **Telemetry Downsampling Schedule**: Formally establish retention duration for raw high-frequency sensor readings (e.g. 90-day retention before downsampling to hourly averages).
- [ ] **Account Deletion Protocol**: Define technical procedure for hard-deleting customer records upon subscription termination.
- [ ] **Operational Audit Logs**: Establish retention horizon for compliance records and dispute resolution (e.g. 7 years for financial records under Nigerian tax law).

## 9. Governing Law & Dispute Resolution
- [ ] **Final Jurisdiction Clause**: Verify governing law wording with Nigerian legal counsel (e.g., High Court of Lagos State or Federal High Court of Nigeria).
- [ ] **Commercial Arbitration Protocol**: Review whether binding arbitration under the Arbitration and Mediation Act 2023 (AMA 2023) is preferred for enterprise B2B disputes.

---

*Document Status: Draft v1.0 — Pending Corporate Legal Counsel Sign-off.*
