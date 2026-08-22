import { MockGeospatialProvider } from './mockProvider';
import { RealSatelliteProvider } from './satelliteProvider';
import { GeospatialProvider } from './types';
import { stacClient } from './stacClient';
import { GEOSPATIAL_CONFIG } from './config';
import { fetchRasterAnalysis, processAoiRasterAnalysis } from './rasterProcessor';
import { monitoringService } from './monitoringService';

// Primary Geospatial Providers
export const mockGeospatialService: GeospatialProvider = new MockGeospatialProvider();
export const realSatelliteService: RealSatelliteProvider = new RealSatelliteProvider();

// Active provider instance
export const geospatialService: GeospatialProvider = realSatelliteService;

export * from './types';
export * from './config';
export * from './calculations';
export * from './stacClient';
export * from './rasterProcessor';
export * from './monitoringService';
export * from './mockProvider';
export * from './satelliteProvider';
export * from './bhuvanLulcService';
