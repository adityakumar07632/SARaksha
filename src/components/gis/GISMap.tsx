import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import {
  Layers,
  Compass,
  Maximize2,
  Minimize2,
  Crosshair,
  Plus,
  Minus,
  Trash2,
  ChevronDown,
  ChevronUp,
  X,
  ArrowRight,
} from 'lucide-react';
import { Intervention, Watershed, Alert, FieldEvidence } from '../../types';
import { MOCK_GEOJSON_LAYERS } from '../../data/mockData';
import { ADMINISTRATIVE_BOUNDARIES } from '../../data/administrativeBoundaries';

interface GISMapProps {
  watersheds?: Watershed[];
  interventions?: Intervention[];
  alerts?: Alert[];
  evidenceList?: FieldEvidence[];
  selectedWatershedId?: string;
  selectedInterventionId?: string;
  center?: [number, number];
  zoom?: number;
  height?: string;
  interactive?: boolean;
  onSelectIntervention?: (id: string) => void;
  onSelectEvidence?: (id: string) => void;
}

type BaseMapType = 'satellite' | 'satellite-ref' | 'terrain' | 'dark';

export const GISMap: React.FC<GISMapProps> = ({
  watersheds = [],
  interventions = [],
  alerts = [],
  evidenceList = [],
  selectedWatershedId,
  selectedInterventionId = 'CD-012',
  center = [22.8, 79.2], // National India overview with surrounding regional context
  zoom = 6.0,
  height = '660px',
  interactive = true,
  onSelectIntervention,
  onSelectEvidence,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapWrapperRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const navigate = useNavigate();

  // Active Base Map (Default to Satellite + Reference for clean geographic labels)
  const [baseMap, setBaseMap] = useState<BaseMapType>('satellite-ref');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Panel Collapsible States (Matching reference UI)
  const [showLayerPanel, setShowLayerPanel] = useState<boolean>(true);
  const [showTelemetryPanel, setShowTelemetryPanel] = useState<boolean>(true);
  const [showAdminContext, setShowAdminContext] = useState<boolean>(true);

  // Dynamic Coordinates & Telemetry
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [mapCenterCoords, setMapCenterCoords] = useState<{ lat: number; lng: number }>({
    lat: center[0],
    lng: center[1],
  });
  const [currentZoom, setCurrentZoom] = useState<number>(zoom);

  // Layer Toggle States
  const [layers, setLayers] = useState({
    // Administrative Boundaries
    countryBoundary: true,
    stateBoundaries: true,
    districtBoundaries: true,

    // SARaksha Evidence Layers
    interventions: true,
    watershedBoundary: true,
    drainageNetwork: true,
    waterBodies: true,
    sentinel2Aoi: true,
    fieldEvidence: true,
    alerts: true,
  });

  // Active Leaflet Layer References
  const layerGroupsRef = useRef<{
    satTile?: L.TileLayer;
    labelsTile?: L.TileLayer;
    terrainTile?: L.TileLayer;
    darkTile?: L.TileLayer;
    countryBoundaryGroup?: L.GeoJSON;
    stateBoundaryGroup?: L.GeoJSON;
    districtBoundaryGroup?: L.GeoJSON;
    boundaryGroup?: L.GeoJSON;
    drainageGroup?: L.GeoJSON;
    waterBodiesGroup?: L.GeoJSON;
    markersGroup?: L.LayerGroup;
    evidenceGroup?: L.LayerGroup;
    alertsGroup?: L.LayerGroup;
    aoiGroup?: L.LayerGroup;
  }>({});

  // Active Intervention
  const activeIntervention = interventions.find((i) => i.id === selectedInterventionId);

  // 1. Initialize Map on India Operational Overview (Single Source of Truth)
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [22.8, 79.2], // Frame India + Pakistan + China + Nepal + Bhutan + Bangladesh + Sri Lanka
      zoom: 6.0,
      minZoom: 4,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false,
      fadeAnimation: true,
      zoomAnimation: true,
    });

    // High-Resolution Satellite Basemap (Esri World Imagery)
    const satTile = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 19,
        attribution: 'Tiles &copy; Esri',
      }
    );

    // Reference Places & Boundaries Overlay
    const labelsTile = L.tileLayer(
      'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 19,
        opacity: 0.75,
      }
    );

    // Topographic Basemap (Esri World Topo)
    const terrainTile = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 19,
        attribution: 'Tiles &copy; Esri World Topo',
      }
    );

    // Dark Matter Canvas
    const darkTile = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: '&copy; CARTO',
      }
    );

    satTile.addTo(map);
    labelsTile.addTo(map); // Default Satellite + Reference

    layerGroupsRef.current.satTile = satTile;
    layerGroupsRef.current.labelsTile = labelsTile;
    layerGroupsRef.current.terrainTile = terrainTile;
    layerGroupsRef.current.darkTile = darkTile;

    // Feature Layer Groups
    const countryBoundaryGroup = L.layerGroup().addTo(map);
    const stateBoundaryGroup = L.layerGroup().addTo(map);
    const districtBoundaryGroup = L.layerGroup().addTo(map);
    const markersGroup = L.layerGroup().addTo(map);
    const evidenceGroup = L.layerGroup().addTo(map);
    const alertsGroup = L.layerGroup().addTo(map);
    const aoiGroup = L.layerGroup().addTo(map);

    layerGroupsRef.current.countryBoundaryGroup = countryBoundaryGroup as any;
    layerGroupsRef.current.stateBoundaryGroup = stateBoundaryGroup as any;
    layerGroupsRef.current.districtBoundaryGroup = districtBoundaryGroup as any;
    layerGroupsRef.current.markersGroup = markersGroup;
    layerGroupsRef.current.evidenceGroup = evidenceGroup;
    layerGroupsRef.current.alertsGroup = alertsGroup;
    layerGroupsRef.current.aoiGroup = aoiGroup;

    // Telemetry Event Listeners
    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      setCursorCoords({
        lat: Number(e.latlng.lat.toFixed(4)),
        lng: Number(e.latlng.lng.toFixed(4)),
      });
    });

    map.on('mouseout', () => {
      setCursorCoords(null);
    });

    map.on('move', () => {
      const c = map.getCenter();
      setMapCenterCoords({
        lat: Number(c.lat.toFixed(4)),
        lng: Number(c.lng.toFixed(4)),
      });
    });

    map.on('zoomend', () => {
      setCurrentZoom(Number(map.getZoom().toFixed(1)));
    });

    mapInstanceRef.current = map;

    // Delayed size invalidation to ensure clean rendering within container
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.off();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Base Map Switching
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const { satTile, terrainTile, darkTile, labelsTile } = layerGroupsRef.current;

    // Remove current tiles
    if (satTile && map.hasLayer(satTile)) map.removeLayer(satTile);
    if (terrainTile && map.hasLayer(terrainTile)) map.removeLayer(terrainTile);
    if (darkTile && map.hasLayer(darkTile)) map.removeLayer(darkTile);
    if (labelsTile && map.hasLayer(labelsTile)) map.removeLayer(labelsTile);

    // Apply selected basemap
    if (baseMap === 'satellite' && satTile) {
      satTile.addTo(map);
    } else if (baseMap === 'satellite-ref' && satTile && labelsTile) {
      satTile.addTo(map);
      labelsTile.addTo(map);
    } else if (baseMap === 'terrain' && terrainTile) {
      terrainTile.addTo(map);
    } else if (baseMap === 'dark' && darkTile) {
      darkTile.addTo(map);
    }
  }, [baseMap]);

  // 3. User-Triggered Smooth Fly-To
  const flyToTarget = useCallback((coords: [number, number], targetZoom: number = 13.5) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(coords, targetZoom, {
        animate: true,
        duration: 1.2,
        easeLinearity: 0.25,
      });
    }
  }, []);

  // 4. Administrative Boundary Overlays (Clean, non-intrusive hierarchy)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Country Boundary (Thin, subtle white/light-neutral line, 1.5px, opacity 0.70)
    if (layerGroupsRef.current.countryBoundaryGroup) {
      map.removeLayer(layerGroupsRef.current.countryBoundaryGroup);
    }
    if (layers.countryBoundary && ADMINISTRATIVE_BOUNDARIES.country.features.length > 0) {
      const countryLayer = L.geoJSON(ADMINISTRATIVE_BOUNDARIES.country as any, {
        style: {
          color: '#f8fafc',
          weight: 1.5,
          opacity: 0.70,
          fill: false,
        },
      }).addTo(map);
      layerGroupsRef.current.countryBoundaryGroup = countryLayer;
    }

    // State / UT Boundaries (Thin dashed line, 1.0px, opacity 0.50)
    if (layerGroupsRef.current.stateBoundaryGroup) {
      map.removeLayer(layerGroupsRef.current.stateBoundaryGroup);
    }
    if (layers.stateBoundaries && ADMINISTRATIVE_BOUNDARIES.states.features.length > 0) {
      const stateLayer = L.geoJSON(ADMINISTRATIVE_BOUNDARIES.states as any, {
        style: {
          color: '#cbd5e1',
          weight: 1.0,
          opacity: 0.50,
          dashArray: '5, 4',
          fill: false,
        },
      }).addTo(map);
      layerGroupsRef.current.stateBoundaryGroup = stateLayer;
    }

    // District Boundaries (Very subtle, 0.7px, visible at zoom >= 8)
    if (layerGroupsRef.current.districtBoundaryGroup) {
      map.removeLayer(layerGroupsRef.current.districtBoundaryGroup);
    }
    if (
      layers.districtBoundaries &&
      currentZoom >= 8 &&
      ADMINISTRATIVE_BOUNDARIES.districts.features.length > 0
    ) {
      const districtLayer = L.geoJSON(ADMINISTRATIVE_BOUNDARIES.districts as any, {
        style: {
          color: '#94a3b8',
          weight: 0.7,
          opacity: currentZoom >= 10 ? 0.40 : 0.25,
          dashArray: '3, 3',
          fill: false,
        },
      }).addTo(map);
      layerGroupsRef.current.districtBoundaryGroup = districtLayer;
    }
  }, [layers.countryBoundary, layers.stateBoundaries, layers.districtBoundaries, currentZoom]);

  // 5. Catchment, Drainage & Water Infrastructure
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Catchment Boundary (WS-001) - Subtle cyan/teal outline, 1.5px, no strong fill (Visible at zoom >= 8)
    if (layerGroupsRef.current.boundaryGroup) {
      map.removeLayer(layerGroupsRef.current.boundaryGroup);
    }
    if (layers.watershedBoundary && currentZoom >= 8) {
      const boundaryLayer = L.geoJSON(MOCK_GEOJSON_LAYERS.watershedBoundary as any, {
        style: {
          color: '#06b6d4',
          weight: 1.5,
          opacity: 0.85,
          dashArray: '4, 4',
          fillColor: '#0891b2',
          fillOpacity: currentZoom >= 11 ? 0.06 : 0.0,
        },
        onEachFeature: (feature, layer) => {
          if (currentZoom >= 9) {
            layer.bindTooltip(
              `<div class="font-mono text-[11px]"><strong class="text-cyan-300">ALWAR NORTH CATCHMENT</strong><br/><span class="text-slate-400">WS-001 &bull; 4,250 Ha</span></div>`,
              {
                sticky: true,
                className:
                  'bg-slate-950/95 text-cyan-200 font-mono text-xs px-2.5 py-1 rounded-xl border border-cyan-500/40 shadow-2xl backdrop-blur-md',
              }
            );
          }
        },
      }).addTo(map);
      layerGroupsRef.current.boundaryGroup = boundaryLayer;
    }

    // Drainage Network (Ruparel Tributaries) - Visible at zoom >= 8
    if (layerGroupsRef.current.drainageGroup) {
      map.removeLayer(layerGroupsRef.current.drainageGroup);
    }
    if (layers.drainageNetwork && currentZoom >= 8) {
      const drainageLayer = L.geoJSON(MOCK_GEOJSON_LAYERS.drainageNetwork as any, {
        style: (feature) => ({
          color: feature?.properties.order === 3 ? '#06b6d4' : '#38bdf8',
          weight: feature?.properties.order === 3 ? 1.8 : 1.2,
          opacity: 0.80,
          lineCap: 'round',
        }),
      }).addTo(map);
      layerGroupsRef.current.drainageGroup = drainageLayer;
    }

    // Water Bodies / Storage Basins - Visible at zoom >= 9
    if (layerGroupsRef.current.waterBodiesGroup) {
      map.removeLayer(layerGroupsRef.current.waterBodiesGroup);
    }
    if (layers.waterBodies && currentZoom >= 9) {
      const waterLayer = L.geoJSON(MOCK_GEOJSON_LAYERS.waterBodies as any, {
        style: {
          color: '#0284c7',
          weight: 1.2,
          fillColor: '#38bdf8',
          fillOpacity: 0.25,
        },
      }).addTo(map);
      layerGroupsRef.current.waterBodiesGroup = waterLayer;
    }
  }, [layers.watershedBoundary, layers.drainageNetwork, layers.waterBodies, currentZoom]);

  // 6. Sentinel-2 AOI Window (Only when selected intervention and zoom >= 11)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const aoiGroup = layerGroupsRef.current.aoiGroup;
    if (!map || !aoiGroup) return;

    aoiGroup.clearLayers();

    if (layers.sentinel2Aoi && selectedInterventionId && currentZoom >= 11) {
      const selectedItem = interventions.find((i) => i.id === selectedInterventionId);
      if (selectedItem) {
        const [lat, lon] = selectedItem.coordinates;
        const bounds: L.LatLngBoundsExpression = [
          [lat - 0.0005, lon - 0.0005],
          [lat + 0.0005, lon + 0.0005],
        ];

        const aoiRect = L.rectangle(bounds, {
          color: '#06b6d4',
          weight: 1.2,
          dashArray: '3, 3',
          fillColor: '#0891b2',
          fillOpacity: 0.10,
        });

        aoiRect.bindTooltip(
          `<div class="font-mono text-[11px]"><strong class="text-cyan-400">□ S2 AOI (110 &times; 110 m)</strong><br/>121 Sentinel-2 10m BOA Pixels</div>`,
          {
            sticky: true,
            className:
              'bg-slate-950/95 text-cyan-200 font-mono text-xs px-2.5 py-1.5 rounded-xl border border-cyan-500/40 shadow-2xl backdrop-blur-md',
          }
        );

        aoiGroup.addLayer(aoiRect);
      }
    }
  }, [layers.sentinel2Aoi, selectedInterventionId, currentZoom, interventions]);

  // 7. Render Intervention Markers, Field Evidence & Alerts
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = layerGroupsRef.current.markersGroup;
    const evidenceGroup = layerGroupsRef.current.evidenceGroup;
    const alertsGroup = layerGroupsRef.current.alertsGroup;
    if (!map || !markersGroup || !evidenceGroup || !alertsGroup) return;

    markersGroup.clearLayers();
    evidenceGroup.clearLayers();
    alertsGroup.clearLayers();

    // Sizing based on zoom level: 12px at national view, 18px at regional/catchment view
    const isNationalScale = currentZoom < 8;
    const markerSize = isNationalScale ? 14 : 18;
    const innerDotSize = isNationalScale ? 8 : 10;

    // 1. Interventions Markers
    if (layers.interventions && interventions.length > 0) {
      interventions.forEach((item) => {
        const isSelected = item.id === selectedInterventionId;
        const statusColor =
          item.status === 'HEALTHY'
            ? '#10b981'
            : item.status === 'MODERATE'
            ? '#f59e0b'
            : '#ef4444';

        // CD-012 Callout strictly positioned with breathing room
        const iconHtml = `
          <div class="relative flex flex-col items-center justify-center cursor-pointer group">
            ${
              isSelected
                ? `<div class="absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-xl bg-slate-950/95 border border-cyan-400 text-white font-mono shadow-2xl pointer-events-auto">
                     <div class="text-[11px] font-extrabold text-cyan-300 flex items-center justify-between gap-2">
                       <span>${item.code}</span>
                       <span class="px-1.5 py-0.2 rounded bg-rose-500/30 text-rose-300 text-[8px] font-bold">HIGH PRIORITY</span>
                     </div>
                     <div class="text-[9px] text-slate-300 font-medium">${item.name}</div>
                   </div>`
                : ''
            }
            <div class="relative flex items-center justify-center rounded-full bg-slate-950 border-2 shadow-xl transition-transform hover:scale-125 ${
              isSelected ? 'border-cyan-400 ring-4 ring-cyan-500/30 scale-110' : 'border-slate-300/80'
            }" style="width: ${markerSize}px; height: ${markerSize}px;">
              <span class="rounded-full" style="width: ${innerDotSize}px; height: ${innerDotSize}px; background-color: ${statusColor};"></span>
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-gis-marker',
          iconSize: [markerSize, markerSize],
          iconAnchor: [markerSize / 2, markerSize / 2],
          popupAnchor: [0, -markerSize / 2 - 4],
        });

        const marker = L.marker(item.coordinates, { icon: customIcon });

        marker.on('click', () => {
          if (onSelectIntervention) onSelectIntervention(item.id);
          flyToTarget(item.coordinates, 13.5);
        });

        markersGroup.addLayer(marker);
      });
    }

    // 2. Field Evidence Markers (Camera badges)
    if (layers.fieldEvidence && evidenceList.length > 0) {
      evidenceList.forEach((ev) => {
        const evIconHtml = `
          <div class="relative flex items-center justify-center cursor-pointer">
            <div class="flex items-center justify-center h-4 w-4 rounded-md bg-slate-950/90 border border-indigo-400/80 shadow-md text-indigo-300 hover:scale-125 transition-transform">
              <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </div>
          </div>
        `;

        const evIcon = L.divIcon({
          html: evIconHtml,
          className: 'custom-evidence-marker',
          iconSize: [16, 16],
          iconAnchor: [8, 8],
          popupAnchor: [0, -10],
        });

        const evMarker = L.marker(ev.coordinates, { icon: evIcon });
        evidenceGroup.addLayer(evMarker);
      });
    }

    // 3. Active Alert Markers (Compact red alert nodes)
    if (layers.alerts && alerts.length > 0) {
      alerts.forEach((alert) => {
        const matched = interventions.find((i) => i.id === alert.interventionId);
        if (!matched) return;

        const alertIconHtml = `
          <div class="relative flex items-center justify-center cursor-pointer">
            <div class="relative flex items-center justify-center h-4 w-4 rounded-full bg-rose-600 border border-white text-white font-black text-[9px] shadow-lg">
              !
            </div>
          </div>
        `;

        const alertIcon = L.divIcon({
          html: alertIconHtml,
          className: 'custom-alert-marker',
          iconSize: [16, 16],
          iconAnchor: [8, 8],
          popupAnchor: [0, -10],
        });

        const alertCoords: [number, number] = [
          matched.coordinates[0] + 0.0006,
          matched.coordinates[1] + 0.0006,
        ];

        const alertMarker = L.marker(alertCoords, { icon: alertIcon });
        alertsGroup.addLayer(alertMarker);
      });
    }
  }, [
    interventions,
    evidenceList,
    alerts,
    layers.interventions,
    layers.fieldEvidence,
    layers.alerts,
    selectedInterventionId,
    currentZoom,
    onSelectIntervention,
    flyToTarget,
  ]);

  // Controls Handlers
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetNationalView = () => {
    mapInstanceRef.current?.flyTo([22.8, 79.2], 6.0, {
      animate: true,
      duration: 1.0,
    });
  };

  const handleToggleFullscreen = () => {
    if (!mapWrapperRef.current) return;
    if (!document.fullscreenElement) {
      mapWrapperRef.current.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  const handleClearAllLayers = () => {
    setLayers({
      countryBoundary: false,
      stateBoundaries: false,
      districtBoundaries: false,
      interventions: false,
      watershedBoundary: false,
      drainageNetwork: false,
      waterBodies: false,
      sentinel2Aoi: false,
      fieldEvidence: false,
      alerts: false,
    });
  };

  return (
    <div
      ref={mapWrapperRef}
      className={`relative w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 font-sans ${
        isFullscreen ? 'h-screen w-screen fixed inset-0 z-[9999]' : ''
      }`}
      style={{ height: isFullscreen ? '100vh' : height }}
    >
      {/* 1. Leaflet Interactive Canvas */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Subtle Map Edge Vignette */}
      <div className="absolute inset-0 pointer-events-none border border-slate-800/80 rounded-2xl shadow-[inset_0_0_35px_rgba(2,6,23,0.55)]" />

      {/* 2. Top Header Bar (Overlaid on Map Canvas) */}
      <div className="absolute top-0 left-0 right-0 z-[1000] flex items-center justify-between px-5 py-3 bg-gradient-to-b from-slate-950/95 via-slate-950/80 to-transparent border-b border-slate-800/40 text-xs font-mono backdrop-blur-sm pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-bold text-xs">
              🛡
            </div>
            <div>
              <span className="font-extrabold text-white tracking-wider text-sm">SARaksha</span>
              <span className="text-[10px] text-cyan-400 block -mt-1 font-semibold">Geospatial Monitoring</span>
            </div>
          </div>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <div className="hidden sm:block">
            <span className="text-white font-bold tracking-wide">ALWAR NORTH CATCHMENT</span>
            <span className="text-[10px] text-cyan-400 block -mt-0.5 font-semibold">RAJASTHAN, INDIA</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Satellite Imagery</span>
            <span className="text-slate-500 font-normal">Esri World Imagery</span>
          </div>
          <span className="text-slate-700 hidden lg:inline">|</span>
          <div className="hidden md:block text-slate-400 text-[11px]">
            <span>Last Updated: </span>
            <strong className="text-slate-200 font-semibold">13 May 2025, 10:23 AM IST</strong>
          </div>
          <button
            onClick={handleToggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Command Center'}
            className="px-2.5 py-1 rounded-lg border border-slate-700 hover:border-slate-500 text-slate-200 text-xs font-semibold flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md transition cursor-pointer shadow-lg"
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">Fullscreen</span>
          </button>
        </div>
      </div>

      {/* 3. Left Navigation & Zoom Controls */}
      <div className="absolute top-18 left-4 z-[1000] flex flex-col rounded-xl border border-slate-700/80 bg-slate-950/90 backdrop-blur-md shadow-2xl overflow-hidden">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/80 transition cursor-pointer border-b border-slate-800 flex items-center justify-center"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/80 transition cursor-pointer border-b border-slate-800 flex items-center justify-center"
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          onClick={handleResetNationalView}
          title="Reset to India National Overview"
          className="p-2 text-cyan-400 hover:text-cyan-300 hover:bg-slate-800/80 transition cursor-pointer border-b border-slate-800 flex items-center justify-center"
        >
          <Crosshair className="h-4 w-4" />
        </button>
        <div className="p-2 text-slate-400 flex items-center justify-center pointer-events-none" title="North Arrow">
          <Compass className="h-4 w-4 text-cyan-400" />
        </div>
      </div>

      {/* 4. Bottom-Left Collapsible Administrative Context Card */}
      {showAdminContext && (
        <div className="absolute bottom-16 left-4 z-[1000] w-64 rounded-xl border border-slate-800 bg-slate-950/90 backdrop-blur-md p-3.5 text-xs font-mono shadow-2xl space-y-2.5 hidden sm:block">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              ADMINISTRATIVE CONTEXT
            </span>
            <button
              onClick={() => setShowAdminContext(false)}
              className="text-slate-500 hover:text-slate-300 p-0.5 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div>
            <h4 className="text-sm font-extrabold text-cyan-300">Alwar District</h4>
            <p className="text-[10px] text-slate-400 font-medium">Rajasthan, India</p>
          </div>

          <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-300 border-t border-b border-slate-800/80 py-2">
            <div>Type: <strong className="text-white">District</strong></div>
            <div>State: <strong className="text-white">Rajasthan</strong></div>
            <div>Interventions: <strong className="text-emerald-400">8</strong></div>
            <div>Healthy: <strong className="text-emerald-400">5</strong></div>
            <div>Moderate: <strong className="text-amber-400">2</strong></div>
            <div>Critical: <strong className="text-rose-400">1</strong></div>
            <div className="col-span-2">Field Evidence: <strong className="text-indigo-400">6</strong></div>
          </div>

          <button
            onClick={() => flyToTarget([27.5684, 76.6128], 13.5)}
            className="w-full py-1.5 px-2.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer border border-cyan-500/40"
          >
            <span>View District Dashboard</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* 5. Bottom-Left Responsive Legend Bar */}
      <div className="absolute bottom-8 left-4 z-[1000] max-w-[calc(100%-32px)] sm:max-w-none flex flex-wrap items-center gap-2.5 bg-slate-950/90 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-xl text-[11px] font-mono text-slate-300 shadow-2xl">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>Healthy</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          <span>Moderate</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-rose-500" />
          <span>Critical</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 border-l border-slate-800 pl-2">
          <span className="text-indigo-400">📸 Field Evidence</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 border-l border-slate-800 pl-2">
          <span className="text-rose-400">🚨 Active Alert</span>
        </div>
        <div className="hidden md:flex items-center gap-1.5 border-l border-slate-800 pl-2">
          <span className="text-cyan-400">□ Sentinel-2 AOI</span>
        </div>
      </div>

      {/* 6. Top-Right Collapsible Layers Manager */}
      <div className="absolute top-18 right-4 z-[1000] w-64 rounded-xl border border-slate-800 bg-slate-950/95 backdrop-blur-md p-3.5 shadow-2xl text-xs font-mono space-y-2.5 max-h-[calc(100%-140px)] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="font-extrabold text-white uppercase text-[11px] tracking-wider flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-cyan-400" />
            LAYERS
          </span>
          <button
            onClick={() => setShowLayerPanel(!showLayerPanel)}
            className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
          >
            {showLayerPanel ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>

        {showLayerPanel && (
          <div className="space-y-3 pt-1">
            {/* BASEMAP */}
            <div className="space-y-1">
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
                BASEMAP
              </span>
              <div className="space-y-1 text-slate-300 text-[11px]">
                <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                  <input
                    type="radio"
                    name="basemap-radio-polish"
                    checked={baseMap === 'satellite'}
                    onChange={() => setBaseMap('satellite')}
                    className="text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                  />
                  <span>Satellite</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                  <input
                    type="radio"
                    name="basemap-radio-polish"
                    checked={baseMap === 'satellite-ref'}
                    onChange={() => setBaseMap('satellite-ref')}
                    className="text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                  />
                  <span>Satellite + Reference</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                  <input
                    type="radio"
                    name="basemap-radio-polish"
                    checked={baseMap === 'terrain'}
                    onChange={() => setBaseMap('terrain')}
                    className="text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                  />
                  <span>Terrain</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                  <input
                    type="radio"
                    name="basemap-radio-polish"
                    checked={baseMap === 'dark'}
                    onChange={() => setBaseMap('dark')}
                    className="text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                  />
                  <span>Dark</span>
                </label>
              </div>
            </div>

            {/* ADMINISTRATIVE BOUNDARIES */}
            <div className="space-y-1 pt-1.5 border-t border-slate-800">
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
                ADMINISTRATIVE BOUNDARIES
              </span>
              <div className="space-y-1 text-slate-300 text-[11px]">
                <label className="flex items-center justify-between cursor-pointer hover:text-white">
                  <span>Country Boundary</span>
                  <input
                    type="checkbox"
                    checked={layers.countryBoundary}
                    onChange={(e) => setLayers({ ...layers, countryBoundary: e.target.checked })}
                    className="rounded border-slate-700 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer hover:text-white">
                  <span>State / UT Boundaries</span>
                  <input
                    type="checkbox"
                    checked={layers.stateBoundaries}
                    onChange={(e) => setLayers({ ...layers, stateBoundaries: e.target.checked })}
                    className="rounded border-slate-700 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer hover:text-white">
                  <span>District Boundaries</span>
                  <input
                    type="checkbox"
                    checked={layers.districtBoundaries}
                    onChange={(e) => setLayers({ ...layers, districtBoundaries: e.target.checked })}
                    className="rounded border-slate-700 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* SARAKSHA DATA */}
            <div className="space-y-1 pt-1.5 border-t border-slate-800">
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
                SARAKSHA DATA
              </span>
              <div className="space-y-1 text-slate-300 text-[11px]">
                <label className="flex items-center justify-between cursor-pointer hover:text-white">
                  <span>Interventions</span>
                  <input
                    type="checkbox"
                    checked={layers.interventions}
                    onChange={(e) => setLayers({ ...layers, interventions: e.target.checked })}
                    className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer hover:text-white">
                  <span>Catchment Boundary</span>
                  <input
                    type="checkbox"
                    checked={layers.watershedBoundary}
                    onChange={(e) => setLayers({ ...layers, watershedBoundary: e.target.checked })}
                    className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer hover:text-white">
                  <span>Drainage / Streams</span>
                  <input
                    type="checkbox"
                    checked={layers.drainageNetwork}
                    onChange={(e) => setLayers({ ...layers, drainageNetwork: e.target.checked })}
                    className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer hover:text-white">
                  <span>Water Bodies</span>
                  <input
                    type="checkbox"
                    checked={layers.waterBodies}
                    onChange={(e) => setLayers({ ...layers, waterBodies: e.target.checked })}
                    className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer hover:text-white">
                  <span>Sentinel-2 AOI</span>
                  <input
                    type="checkbox"
                    checked={layers.sentinel2Aoi}
                    onChange={(e) => setLayers({ ...layers, sentinel2Aoi: e.target.checked })}
                    className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer hover:text-white">
                  <span>Field Evidence</span>
                  <input
                    type="checkbox"
                    checked={layers.fieldEvidence}
                    onChange={(e) => setLayers({ ...layers, fieldEvidence: e.target.checked })}
                    className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer hover:text-white">
                  <span>Active Alerts</span>
                  <input
                    type="checkbox"
                    checked={layers.alerts}
                    onChange={(e) => setLayers({ ...layers, alerts: e.target.checked })}
                    className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Clear All Layers Button */}
            <button
              onClick={handleClearAllLayers}
              className="w-full py-1 px-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-[10px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border border-rose-500/30"
            >
              <Trash2 className="h-3 w-3" />
              <span>Clear All Layers</span>
            </button>
          </div>
        )}
      </div>

      {/* 7. Bottom-Right Collapsible Map Telemetry Card */}
      {showTelemetryPanel && (
        <div className="absolute bottom-8 right-4 z-[1000] w-72 rounded-xl border border-slate-800 bg-slate-950/95 backdrop-blur-md p-3 shadow-2xl text-xs font-mono space-y-2 hidden sm:block">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              MAP TELEMETRY
            </span>
            <button
              onClick={() => setShowTelemetryPanel(false)}
              className="text-slate-500 hover:text-slate-300 p-0.5 cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          </div>

          <div>
            <span className="text-[10px] text-cyan-400 font-bold block">Selected Intervention</span>
            <div className="text-white font-extrabold text-[11px]">
              {activeIntervention ? `${activeIntervention.code} • ${activeIntervention.name}` : 'None'}
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              {activeIntervention
                ? `${activeIntervention.coordinates[0].toFixed(4)}° N | ${activeIntervention.coordinates[1].toFixed(4)}° E`
                : '--'}
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-1">
            <span className="text-[10px] text-slate-400 block">Cursor Location</span>
            <div className="text-slate-200 text-[11px] font-bold">
              {cursorCoords
                ? `${cursorCoords.lat.toFixed(4)}° N | ${cursorCoords.lng.toFixed(4)}° E`
                : `${mapCenterCoords.lat.toFixed(4)}° N | ${mapCenterCoords.lng.toFixed(4)}° E`}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-1 text-[10px] text-slate-300 border-t border-slate-800/80 pt-1 text-center">
            <div>
              <span className="text-slate-500 block text-[9px]">Zoom</span>
              <strong>{currentZoom}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px]">Scale</span>
              <strong>{currentZoom <= 6 ? '200 km' : currentZoom <= 10 ? '20 km' : '1 km'}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px]">UTM Zone</span>
              <strong>43N</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px]">CRS</span>
              <strong className="text-cyan-400">EPSG:32643</strong>
            </div>
          </div>
        </div>
      )}

      {/* 8. Bottom Status & Scale Breadcrumb Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-[999] flex items-center justify-between px-4 py-1 bg-slate-950/95 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
        <div className="flex items-center gap-3">
          <span>0 &nbsp; 250 &nbsp; 500 &nbsp; 750 &nbsp; 1000 km</span>
        </div>
        <div className="hidden md:flex items-center gap-1 text-cyan-400 font-semibold">
          <span className="text-slate-400">INDIA</span> &gt;
          <span className="text-slate-400">RAJASTHAN</span> &gt;
          <span className="text-slate-400">ALWAR DISTRICT</span> &gt;
          <span className="text-slate-300">ALWAR NORTH CATCHMENT</span> &gt;
          <span className="text-white font-bold">CD-012</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <span>LAT <strong className="text-white">27.5684° N</strong></span>
          <span>|</span>
          <span>LON <strong className="text-white">76.6128° E</strong></span>
          <span>|</span>
          <span>ALT <strong className="text-emerald-400">415 m</strong></span>
        </div>
      </div>
    </div>
  );
};
