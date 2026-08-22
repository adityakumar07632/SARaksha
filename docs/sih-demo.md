# SARaksha — Smart India Hackathon (SIH) Evaluation Guide
*Smart Watershed Monitoring & Evidence-Based Decision Support Platform*

---

## 1. Quick Demonstration Workflow (3-Minute Evaluation Script)

### Step 1: Login & Role Selection
1. Navigate to `http://localhost:5173/login`.
2. Click **"Super Admin (National Command)"** quick-fill preset (`admin@saraksha.demo`).
3. Click **"Authenticate Session"** to enter the National Watershed Command Center.

---

### Step 2: Live Sentinel-2 STAC & 10m Raster Analysis
1. In the top notice banner, click **"SIH Demonstration Scenarios"** $\to$ choose **"1. Sentinel-2 Raster Extraction"**.
2. On **Check Dam #12 (`CD-012`)**, observe:
   - **Coordinates**: `27.5684° N, 76.6128° E`
   - **Baseline NDVI**: `0.4912` (Intervention-specific baseline)
3. Click **"Run Real Raster Pixel Analysis"**:
   - Streams 121 Bottom-of-Atmosphere (BOA) 10m pixels across an $11 \times 11$ bounding grid.
   - Calculates **Current Median NDVI** (`0.4206`) and **Median NDWI** (`0.2392`).
   - Triage Engine detects a **$-14.4\%$ spectral deviation** $\to$ flags **HIGH PRIORITY SPECTRAL ANOMALY**.
   - Automatic dispatch alert generated: *"Spectral anomaly detected — field verification recommended"*.

---

### Step 3: Field Officer Offline Evidence Capture
1. Click the top role switcher $\to$ select **"Field Officer"** (`field@saraksha.demo`).
2. On the **Field Officer Mobile Hub**, click the network pill `[ONLINE]` to toggle **`[🔴 OFFLINE (SIM)]`**.
3. Click **"Start Offline Field Inspection"** on Check Dam #12.
4. Click **"Acquire GNSS Lock"** ($\pm 4.8\text{m}$ precision) and select **`🟢 Healthy`**.
5. Click **"Save Evidence & Seal SHA-256 Digest"**:
   - Computes a deterministic 64-character SHA-256 hash.
   - Stored securely in client-side persistence (`📱 STORED ON DEVICE (OFFLINE)`).
6. Click the top network status pill to toggle back to **`[🟢 ONLINE]`**.
7. Observe automatic background queue synchronization:
   - Synchronizes via `POST /api/evidence/sync`.
   - Status updates to **`⚡ STORED ON SERVER — HASH VERIFIED`**.

---

### Step 4: Nodal Reviewer Human Verification & PDF Dossier Export
1. Switch demo role to **"Super Admin"** or **"Normal Admin"**.
2. Open **Check Dam #12** dossier $\to$ Tab 2: **"Field Evidence"**.
3. Click **"Human Verify"** to formally approve the ground inspection.
4. The record becomes **IMMUTABLE** and is cryptographically stamped in the compliance audit trail.
5. In the action bar, click **"Evidence Dossier (PDF)"**:
   - Opens the 19-section Government Audit Dossier with print-ready styling.
   - Click **"Print / Export PDF"** for physical records.

---

## 2. Real vs. Simulated Boundaries

| Component | Real Implementation | Demo Simulation Boundaries |
| :--- | :--- | :--- |
| **STAC Discovery** | Live queries to Element84 Sentinel-2 L2A STAC API | None; live orbital queries active |
| **Raster Processing** | 121 Bottom-of-Atmosphere 10m pixels with $DN / 10,000.0$ scaling | None; exact median statistics computed |
| **Tamper-Evident Hashing** | Real SHA-256 64-character hexadecimal digest calculation | None; standard SHA-256 algorithm |
| **PWA & Offline Queue** | Local persistence, sync state machine, and auto-sync | Network simulation toggle provided for desktop testing |
| **Notifications** | Pluggable Console & Email providers | Marks `UNAVAILABLE` when SMTP env vars are unset |
