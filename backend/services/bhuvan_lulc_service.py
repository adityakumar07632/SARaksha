"""
SARaksha Bhuvan / NRSC / ISRO LULC Service (Phase 14)
Authoritative server-side integration for Bhuvan Area-of-Interest (AOI) Land Use & Land Cover Statistics.

Security & Integrity Invariants:
1. The Bhuvan API token is read ONLY from backend environment variable (BHUVAN_LULC_API_TOKEN).
2. The token is NEVER returned in responses, logs, or client-facing objects.
3. If the token is missing, unavailable, or invalid, explicit typed failure states are returned.
4. No fake or simulated LULC values are substituted in the real data path.
"""

import os
import re
import json
import urllib.parse
import urllib.request
import urllib.error
from datetime import datetime, timezone
from typing import Dict, List, Optional, Tuple, Any

BHUVAN_LULC_API_ENDPOINT = "https://bhuvan-app1.nrsc.gov.in/api/lulc/curl_aoi.php"


def validate_wkt_polygon(wkt: str) -> Tuple[bool, Optional[str]]:
    """
    Validates that a string is a closed, well-formed WKT POLYGON with (longitude latitude) order.
    """
    if not wkt or not isinstance(wkt, str):
        return False, "WKT geometry is missing or not a string."

    trimmed = wkt.strip()
    match = re.match(r"^POLYGON\s*\(\(\s*(.+)\s*\)\)$", trimmed, re.IGNORECASE)
    if not match:
        return False, "Invalid WKT format: must match 'POLYGON((x1 y1, x2 y2, ...))'."

    coord_str = match.group(1).strip()
    points_raw = [p.strip() for p in coord_str.split(",") if p.strip()]

    if len(points_raw) < 4:
        return False, f"Invalid polygon: must contain at least 4 coordinate pairs, found {len(points_raw)}."

    coords: List[Tuple[float, float]] = []
    for idx, p_raw in enumerate(points_raw):
        parts = p_raw.split()
        if len(parts) != 2:
            return False, f"Coordinate pair #{idx + 1} '{p_raw}' must have exactly two numbers (longitude latitude)."
        try:
            lng = float(parts[0])
            lat = float(parts[1])
        except ValueError:
            return False, f"Coordinate pair #{idx + 1} contains non-numeric values."

        if not (-180.0 <= lng <= 180.0):
            return False, f"Longitude {lng} in coordinate #{idx + 1} is out of bounds [-180, 180]."
        if not (-90.0 <= lat <= 90.0):
            return False, f"Latitude {lat} in coordinate #{idx + 1} is out of bounds [-90, 90]."

        coords.append((lng, lat))

    # Verify closure: first point must equal last point
    first_pt = coords[0]
    last_pt = coords[-1]
    if abs(first_pt[0] - last_pt[0]) > 1e-6 or abs(first_pt[1] - last_pt[1]) > 1e-6:
        return False, f"Polygon is not closed: first point ({first_pt[0]}, {first_pt[1]}) does not equal last point ({last_pt[0]}, {last_pt[1]})."

    return True, None


def get_intervention_wkt(lat: float, lon: float, buffer_deg: float = 0.005) -> str:
    """
    Generates a closed WKT POLYGON around intervention coordinates (longitude latitude order).
    """
    min_lon = round(lon - buffer_deg, 4)
    max_lon = round(lon + buffer_deg, 4)
    min_lat = round(lat - buffer_deg, 4)
    max_lat = round(lat + buffer_deg, 4)

    return f"POLYGON(({min_lon} {min_lat}, {max_lon} {min_lat}, {max_lon} {max_lat}, {min_lon} {max_lat}, {min_lon} {min_lat}))"


def clean_lulc_key(raw_key: str) -> str:
    """Strips outer single/double quotes from Bhuvan JSON keys e.g. \"'l01'\" -> \"l01\"."""
    return raw_key.strip("'\" \t\r\n")


def parse_bhuvan_raw_response(raw_data: Any) -> Tuple[List[Dict[str, Any]], Optional[str], Optional[float]]:
    """
    Parses and normalizes raw Bhuvan LULC JSON response into structured category items.
    Returns (records, state, total_area).
    """
    if not isinstance(raw_data, list) or len(raw_data) == 0:
        return [], None, None

    records: List[Dict[str, Any]] = []
    state: Optional[str] = None
    total_area: float = 0.0

    for entry in raw_data:
        if not isinstance(entry, dict):
            continue

        for k, v in entry.items():
            clean_k = clean_lulc_key(k)
            if clean_k.lower() == "state":
                state = str(v)
                continue

            try:
                area_val = float(v)
                total_area += area_val
                records.append({
                    "code": clean_k,
                    "area": round(area_val, 2),
                    "unit": "Ha",
                    "source": "Bhuvan / NRSC",
                })
            except (ValueError, TypeError):
                records.append({
                    "code": clean_k,
                    "area": str(v),
                    "unit": "Unknown",
                    "source": "Bhuvan / NRSC",
                })

    return records, state, round(total_area, 2) if total_area > 0 else None


def generate_demo_bhuvan_lulc(
    intervention_id: str = "CD-012",
    polygon_wkt: Optional[str] = None,
) -> Dict[str, Any]:
    """Generates clearly-labeled demo LULC fixture for offline evaluation."""
    wkt = polygon_wkt or "POLYGON((76.6078 27.5634, 76.6178 27.5634, 76.6178 27.5734, 76.6078 27.5734, 76.6078 27.5634))"
    demo_records = [
        {"code": "l01", "area": 0.74, "unit": "Ha", "source": "Bhuvan / NRSC (Demo)"},
        {"code": "l02", "area": 1.63, "unit": "Ha", "source": "Bhuvan / NRSC (Demo)"},
        {"code": "l04", "area": 203.17, "unit": "Ha", "source": "Bhuvan / NRSC (Demo)"},
    ]

    return {
        "sourceType": "SIMULATED",
        "sourceClassification": "DEMO DATA",
        "status": "SIMULATED",
        "provider": "Bhuvan / NRSC / ISRO (Demo Fixture)",
        "endpoint": BHUVAN_LULC_API_ENDPOINT,
        "interventionId": intervention_id,
        "geometry": wkt,
        "state": "RJ",
        "statistics": demo_records,
        "totalArea": 205.54,
        "areaUnit": "Ha",
        "retrievedAt": datetime.now(timezone.utc).isoformat(),
        "contextNotes": "AOI land-use/land-cover composition retrieved for intervention watershed context.",
        "provenance": {
            "sourceType": "SIMULATED",
            "provider": "Bhuvan / NRSC / ISRO",
            "endpoint": BHUVAN_LULC_API_ENDPOINT,
            "interventionId": intervention_id,
            "geometryWkt": wkt,
            "retrievedAt": datetime.now(timezone.utc).isoformat(),
            "responseStatus": "SIMULATED",
            "lulcCodesReturned": ["l01", "l02", "l04"],
            "areaUnit": "Ha",
            "isSimulated": True,
        },
    }


def get_lulc_aoi_stats(
    polygon_wkt: str,
    force_demo: bool = False,
    intervention_id: str = "CD-012",
) -> Dict[str, Any]:
    """
    Executes live query against Bhuvan / NRSC Thematic Statistics API for LULC AOI statistics.
    Never exposes the API token in responses or error logs.
    """
    if force_demo:
        return generate_demo_bhuvan_lulc(intervention_id, polygon_wkt)

    # 1. Geometry Validation
    is_valid, geo_err = validate_wkt_polygon(polygon_wkt)
    if not is_valid:
        return {
            "sourceType": "BHUVAN_INVALID_GEOMETRY",
            "status": "BHUVAN_INVALID_GEOMETRY",
            "provider": "Bhuvan / NRSC / ISRO",
            "interventionId": intervention_id,
            "geometry": polygon_wkt,
            "statistics": [],
            "reason": geo_err or "Invalid WKT polygon geometry.",
            "retrievedAt": datetime.now(timezone.utc).isoformat(),
            "provenance": {
                "sourceType": "BHUVAN_INVALID_GEOMETRY",
                "provider": "Bhuvan / NRSC / ISRO",
                "endpoint": BHUVAN_LULC_API_ENDPOINT,
                "interventionId": intervention_id,
                "geometryWkt": polygon_wkt,
                "retrievedAt": datetime.now(timezone.utc).isoformat(),
                "responseStatus": "BHUVAN_INVALID_GEOMETRY",
                "lulcCodesReturned": [],
                "areaUnit": "Ha",
            },
        }

    # 2. Token Resolution
    token = os.getenv("BHUVAN_LULC_API_TOKEN", "").strip()
    if not token:
        return {
            "sourceType": "BHUVAN_DATA_UNAVAILABLE",
            "status": "BHUVAN_DATA_UNAVAILABLE",
            "provider": "Bhuvan / NRSC / ISRO",
            "interventionId": intervention_id,
            "geometry": polygon_wkt,
            "statistics": [],
            "reason": "Bhuvan LULC API token not configured in backend environment (BHUVAN_LULC_API_TOKEN). Configure token in server environment or switch to Demo Data for offline evaluation.",
            "retrievedAt": datetime.now(timezone.utc).isoformat(),
            "provenance": {
                "sourceType": "BHUVAN_DATA_UNAVAILABLE",
                "provider": "Bhuvan / NRSC / ISRO",
                "endpoint": BHUVAN_LULC_API_ENDPOINT,
                "interventionId": intervention_id,
                "geometryWkt": polygon_wkt,
                "retrievedAt": datetime.now(timezone.utc).isoformat(),
                "responseStatus": "BHUVAN_DATA_UNAVAILABLE",
                "lulcCodesReturned": [],
                "areaUnit": "Ha",
            },
        }

    # 3. Form Request URL
    params = urllib.parse.urlencode({
        "geom": polygon_wkt,
        "token": token,
    })
    target_url = f"{BHUVAN_LULC_API_ENDPOINT}?{params}"

    req = urllib.request.Request(
        target_url,
        headers={
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "SARaksha-Bhuvan-Client/14.0",
        },
    )

    try:
        with urllib.request.urlopen(req, timeout=12) as response:
            status_code = response.getcode()
            body_bytes = response.read()
            body_str = body_bytes.decode("utf-8", errors="replace").strip()

            if status_code in (401, 403) or "unauthorized" in body_str.lower() or "invalid token" in body_str.lower():
                return {
                    "sourceType": "BHUVAN_AUTH_ERROR",
                    "status": "BHUVAN_AUTH_ERROR",
                    "provider": "Bhuvan / NRSC / ISRO",
                    "interventionId": intervention_id,
                    "geometry": polygon_wkt,
                    "statistics": [],
                    "reason": "Bhuvan LULC API authentication failed (401/403 or invalid token).",
                    "retrievedAt": datetime.now(timezone.utc).isoformat(),
                    "provenance": {
                        "sourceType": "BHUVAN_AUTH_ERROR",
                        "provider": "Bhuvan / NRSC / ISRO",
                        "endpoint": BHUVAN_LULC_API_ENDPOINT,
                        "interventionId": intervention_id,
                        "geometryWkt": polygon_wkt,
                        "retrievedAt": datetime.now(timezone.utc).isoformat(),
                        "responseStatus": "BHUVAN_AUTH_ERROR",
                        "lulcCodesReturned": [],
                        "areaUnit": "Ha",
                    },
                }

            try:
                parsed_json = json.loads(body_str)
            except json.JSONDecodeError:
                return {
                    "sourceType": "BHUVAN_API_ERROR",
                    "status": "BHUVAN_API_ERROR",
                    "provider": "Bhuvan / NRSC / ISRO",
                    "interventionId": intervention_id,
                    "geometry": polygon_wkt,
                    "statistics": [],
                    "reason": f"Bhuvan returned non-JSON response: {body_str[:120]}",
                    "retrievedAt": datetime.now(timezone.utc).isoformat(),
                    "provenance": {
                        "sourceType": "BHUVAN_API_ERROR",
                        "provider": "Bhuvan / NRSC / ISRO",
                        "endpoint": BHUVAN_LULC_API_ENDPOINT,
                        "interventionId": intervention_id,
                        "geometryWkt": polygon_wkt,
                        "retrievedAt": datetime.now(timezone.utc).isoformat(),
                        "responseStatus": "BHUVAN_API_ERROR",
                        "lulcCodesReturned": [],
                        "areaUnit": "Ha",
                    },
                }

            records, state, total_area = parse_bhuvan_raw_response(parsed_json)

            if not records:
                return {
                    "sourceType": "BHUVAN_DATA_UNAVAILABLE",
                    "status": "BHUVAN_DATA_UNAVAILABLE",
                    "provider": "Bhuvan / NRSC / ISRO",
                    "interventionId": intervention_id,
                    "geometry": polygon_wkt,
                    "statistics": [],
                    "reason": "Bhuvan returned an empty LULC dataset for the specified geometry.",
                    "retrievedAt": datetime.now(timezone.utc).isoformat(),
                    "provenance": {
                        "sourceType": "BHUVAN_DATA_UNAVAILABLE",
                        "provider": "Bhuvan / NRSC / ISRO",
                        "endpoint": BHUVAN_LULC_API_ENDPOINT,
                        "interventionId": intervention_id,
                        "geometryWkt": polygon_wkt,
                        "retrievedAt": datetime.now(timezone.utc).isoformat(),
                        "responseStatus": "BHUVAN_DATA_UNAVAILABLE",
                        "lulcCodesReturned": [],
                        "areaUnit": "Ha",
                    },
                }

            lulc_codes = [r["code"] for r in records]

            return {
                "sourceType": "REAL_BHUVAN_LULC",
                "sourceClassification": "REAL BHUVAN LULC",
                "status": "REAL",
                "provider": "Bhuvan / NRSC / ISRO",
                "endpoint": BHUVAN_LULC_API_ENDPOINT,
                "interventionId": intervention_id,
                "geometry": polygon_wkt,
                "state": state or "RJ",
                "statistics": records,
                "totalArea": total_area,
                "areaUnit": "Ha",
                "retrievedAt": datetime.now(timezone.utc).isoformat(),
                "contextNotes": "Sentinel-2 provides current spectral observations, while Bhuvan LULC provides land-use/land-cover context for the intervention AOI.",
                "provenance": {
                    "sourceType": "REAL_BHUVAN_LULC",
                    "provider": "Bhuvan / NRSC / ISRO",
                    "endpoint": BHUVAN_LULC_API_ENDPOINT,
                    "interventionId": intervention_id,
                    "geometryWkt": polygon_wkt,
                    "retrievedAt": datetime.now(timezone.utc).isoformat(),
                    "responseStatus": "REAL",
                    "lulcCodesReturned": lulc_codes,
                    "areaUnit": "Ha",
                    "isSimulated": False,
                },
            }

    except urllib.error.HTTPError as http_err:
        status_type = "BHUVAN_AUTH_ERROR" if http_err.code in (401, 403) else "BHUVAN_API_ERROR"
        return {
            "sourceType": status_type,
            "status": status_type,
            "provider": "Bhuvan / NRSC / ISRO",
            "interventionId": intervention_id,
            "geometry": polygon_wkt,
            "statistics": [],
            "reason": f"Bhuvan HTTP error {http_err.code}: {http_err.reason}",
            "retrievedAt": datetime.now(timezone.utc).isoformat(),
            "provenance": {
                "sourceType": status_type,
                "provider": "Bhuvan / NRSC / ISRO",
                "endpoint": BHUVAN_LULC_API_ENDPOINT,
                "interventionId": intervention_id,
                "geometryWkt": polygon_wkt,
                "retrievedAt": datetime.now(timezone.utc).isoformat(),
                "responseStatus": status_type,
                "lulcCodesReturned": [],
                "areaUnit": "Ha",
            },
        }
    except urllib.error.URLError as url_err:
        return {
            "sourceType": "BHUVAN_API_ERROR",
            "status": "BHUVAN_API_ERROR",
            "provider": "Bhuvan / NRSC / ISRO",
            "interventionId": intervention_id,
            "geometry": polygon_wkt,
            "statistics": [],
            "reason": f"Bhuvan connection failed: {url_err.reason}",
            "retrievedAt": datetime.now(timezone.utc).isoformat(),
            "provenance": {
                "sourceType": "BHUVAN_API_ERROR",
                "provider": "Bhuvan / NRSC / ISRO",
                "endpoint": BHUVAN_LULC_API_ENDPOINT,
                "interventionId": intervention_id,
                "geometryWkt": polygon_wkt,
                "retrievedAt": datetime.now(timezone.utc).isoformat(),
                "responseStatus": "BHUVAN_API_ERROR",
                "lulcCodesReturned": [],
                "areaUnit": "Ha",
            },
        }
    except Exception as exc:
        return {
            "sourceType": "BHUVAN_API_ERROR",
            "status": "BHUVAN_API_ERROR",
            "provider": "Bhuvan / NRSC / ISRO",
            "interventionId": intervention_id,
            "geometry": polygon_wkt,
            "statistics": [],
            "reason": f"Bhuvan query failed: {str(exc)}",
            "retrievedAt": datetime.now(timezone.utc).isoformat(),
            "provenance": {
                "sourceType": "BHUVAN_API_ERROR",
                "provider": "Bhuvan / NRSC / ISRO",
                "endpoint": BHUVAN_LULC_API_ENDPOINT,
                "interventionId": intervention_id,
                "geometryWkt": polygon_wkt,
                "retrievedAt": datetime.now(timezone.utc).isoformat(),
                "responseStatus": "BHUVAN_API_ERROR",
                "lulcCodesReturned": [],
                "areaUnit": "Ha",
            },
        }
