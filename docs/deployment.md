# SARaksha — Deployment & Operations Guide
*Version 9.0.0 Production Baseline*

---

## 1. Quick Local Docker Deployment

Run the complete full-stack environment (React Frontend + FastAPI Backend + PostGIS Spatial Database):

```bash
docker compose up --build -d
```

### Endpoints:
- **Frontend PWA**: `http://localhost:5173`
- **FastAPI Backend**: `http://localhost:8000`
- **API Swagger Docs**: `http://localhost:8000/docs`
- **PostGIS Spatial Database**: `localhost:5432` (`saraksha_gis`)

---

## 2. Local Development Without Docker

### Step 1: Start FastAPI Backend
```bash
# From repository root
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

### Step 2: Start Vite Frontend
```bash
npm install
npm run dev
```

---

## 3. Automated Test Suites

```bash
# Frontend Vitest Suite (55 tests)
npm test

# Production Build Validation
npm run build

# Backend Python Unittest Suite (18 tests)
py -m unittest discover backend/tests -p "*unittest.py"
```
