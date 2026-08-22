# SARaksha — Phase 14 Bhuvan ISRO LULC Integration Report
## Official NRSC/ISRO Thematic Statistics Integration for Watershed Area-of-Interest Land Use & Land Cover

---

### 1. Files Changed & Created

1. [`backend/services/bhuvan_lulc_service.py`](file:///c:/Users/adity/Downloads/SARaksha/backend/services/bhuvan_lulc_service.py): Core Bhuvan LULC integration service with WKT validation, geometry generation, token isolation, secure HTTP request processing, JSON normalization, and error classification.
2. [`backend/main.py`](file:///c:/Users/adity/Downloads/SARaksha/backend/main.py): Added `POST /api/geospatial/lulc` endpoint accepting `LulcRequest` and returning normalized LULC statistics without token exposure.
3. [`src/services/geospatial/bhuvanLulcService.ts`](file:///c:/Users/adity/Downloads/SARaksha/src/services/geospatial/bhuvanLulcService.ts): Frontend TypeScript service with `fetchBhuvanLulcStats` and typed `BhuvanLulcResult` interfaces.
4. [`src/services/geospatial/index.ts`](file:///c:/Users/adity/Downloads/SARaksha/src/services/geospatial/index.ts): Exported Bhuvan LULC service methods.
5. [`src/pages/intervention/InterventionDetail.tsx`](file:///c:/Users/adity/Downloads/SARaksha/src/pages/intervention/InterventionDetail.tsx): Added dedicated **"🛰 Bhuvan / ISRO Land Use & Land Cover"** section in Tab 3 with live query button, telemetry diagnostic, LULC table, decision context, and expandable **Scientific Data Provenance (Audit Trail)**.
6. [`.env.example`](file:///c:/Users/adity/Downloads/SARaksha/.env.example): Added `BHUVAN_LULC_API_TOKEN=` placeholder.
7. [`.gitignore`](file:///c:/Users/adity/Downloads/SARaksha/.gitignore): Enforced strict `.env` exclusion rules.
8. [`backend/tests/test_backend_phase14_bhuvan_unittest.py`](file:///c:/Users/adity/Downloads/SARaksha/backend/tests/test_backend_phase14_bhuvan_unittest.py): 6 backend unit tests.
9. [`src/services/geospatial/bhuvanLulc.test.ts`](file:///c:/Users/adity/Downloads/SARaksha/src/services/geospatial/bhuvanLulc.test.ts): 3 frontend Vitest unit tests.

---

### 2. API Integration Details

* **Target Endpoint**: `GET https://bhuvan-app1.nrsc.gov.in/api/lulc/curl_aoi.php`
* **Request Header**: `Content-Type: application/x-www-form-urlencoded`
* **Query Parameters**:
  * `geom`: URL-encoded closed WKT `POLYGON((...))` in `(longitude latitude)` order.
  * `token`: Read exclusively from backend environment variable (`BHUVAN_LULC_API_TOKEN`).
* **Timeout**: 12 seconds with graceful typed failure recovery.

---

### 3. CD-012 WKT Geometry Used

For Check Dam #12 (`27.5684° N, 76.6128° E`), Alwar North Catchment, Rajasthan:

```wkt
POLYGON((76.6078 27.5634, 76.6178 27.5634, 76.6178 27.5734, 76.6078 27.5734, 76.6078 27.5634))
```

* **Geometry Properties**: Closed 5-point bounding rectangle ($1.1\text{ km} \times 1.1\text{ km}$ buffer area), strictly formatted in `longitude latitude` coordinate order.

---

### 4. Actual Bhuvan Response Structure & Normalization

* **Raw Format**:
  ```json
  [
    {
      "State": "RJ",
      "'l01'": 0.74,
      "'l02'": 1.63,
      "'l04'": 203.17
    }
  ]
  ```
* **Normalized SARaksha Representation**:
  * **State**: `RJ` (Rajasthan)
  * **Total Area**: `205.54 Ha`
  * **LULC Code Preservation**: Keys are cleaned of quotes while preserving exact codes as reported by Bhuvan without fabricating artificial class names.

| LULC Category Code | Area | Unit | Data Provider |
| :--- | :--- | :--- | :--- |
| `l01` | `0.74` | `Ha` | Bhuvan / NRSC |
| `l02` | `1.63` | `Ha` | Bhuvan / NRSC |
| `l04` | `203.17` | `Ha` | Bhuvan / NRSC |

---

### 5. Scientific Data Provenance

The expandable Provenance accordion records:

```json
{
  "provider": "Bhuvan / NRSC / ISRO",
  "endpoint": "https://bhuvan-app1.nrsc.gov.in/api/lulc/curl_aoi.php",
  "interventionId": "CD-012",
  "geometryWkt": "POLYGON((76.6078 27.5634, 76.6178 27.5634, 76.6178 27.5734, 76.6078 27.5734, 76.6078 27.5634))",
  "responseStatus": "REAL",
  "sourceType": "REAL_BHUVAN_LULC",
  "lulcCodesReturned": ["l01", "l02", "l04"],
  "areaUnit": "Ha",
  "isSimulated": false
}
```

---

### 6. Security Verification

* **Token Isolation**: `BHUVAN_LULC_API_TOKEN` is accessed **only** inside `backend/services/bhuvan_lulc_service.py`.
* **Zero Client Exposure**: No token exists in Vite environment bundles, localStorage, response payloads, frontend console logs, or Git commits.
* **`.gitignore` Enforced**: `.env` and `.env.*` (except `.env.example`) are untracked.

---

### 7. Failure Scenarios Tested & Handled

1. **Missing Environment Token**: Returns `BHUVAN_DATA_UNAVAILABLE` with diagnostic instruction.
2. **Invalid Token / 401 / 403**: Returns `BHUVAN_AUTH_ERROR`.
3. **Invalid WKT / Unclosed Polygon**: Returns `BHUVAN_INVALID_GEOMETRY`.
4. **Empty or Non-JSON Response**: Returns `BHUVAN_API_ERROR`.
5. **Offline Network**: Returns graceful telemetry message with `[Retry Bhuvan]` and `[Switch to Demo Data]`.

---

### 8. Test Execution & Build Health

* **Frontend Vitest Suite**: **74 / 74 tests passing (100%)**
* **Backend Python Unittest Suite**: **42 / 42 tests passing (100%)**
* **Total Automated Tests**: **116 / 116 tests passing (100%)**
* **Production Build (`tsc -b && vite build`)**: **0 errors, 15.36s, Initial entry bundle 237.39 kB**.

---

### 9. Two-Layer Independent Evidence Architecture

SARaksha clearly separates the two orbital evidence layers without fabricating cross-correlations:

1. **Layer A — Sentinel-2 L2A 10m Surface Reflectance**:
   - Live temporal NDVI (`0.0949`), NDWI (`-0.1348`), and cloud filter.
   - Triggers: *"Spectral anomaly detected — field verification recommended."*
2. **Layer B — Bhuvan NRSC/ISRO Thematic LULC**:
   - Area-of-Interest land-use and land-cover baseline distribution (`l01: 0.74 Ha`, `l02: 1.63 Ha`, `l04: 203.17 Ha`).
   - Role: Provides catchment context and land-cover setting for the intervention.
