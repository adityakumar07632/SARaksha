/**
 * SARaksha Frontend Automated Monitoring Service
 * Manages automated Sentinel-2 anomaly monitoring event records for interventions.
 */

export interface MonitoringEvent {
  id: string;
  interventionId: string;
  interventionName: string;
  sceneId: string;
  observationDate: string;
  previousNdvi: number;
  currentNdvi: number;
  percentageChange: number;
  anomalyLevel: 'HIGH_PRIORITY' | 'MODERATE' | 'STABLE';
  status: 'NEW' | 'REVIEW_REQUIRED' | 'VERIFIED' | 'DISMISSED';
  recommendedAction: string;
  createdAt: string;
  provenance: {
    sourceType: string;
    satellite: string;
    cloudCover?: number;
    validPixelPercentage?: number;
  };
}

class MonitoringService {
  private events: MonitoringEvent[] = [
    {
      id: 'EVT-CD012-20241219',
      interventionId: 'CD-012',
      interventionName: 'Check Dam #12',
      sceneId: 'S2C_43RFL_20241219_2_L2A',
      observationDate: '2024-12-19',
      previousNdvi: 0.4900,
      currentNdvi: 0.0949,
      percentageChange: -80.6,
      anomalyLevel: 'HIGH_PRIORITY',
      status: 'REVIEW_REQUIRED',
      recommendedAction: 'Dispatch on-site field officer to inspect downstream apron erosion and silt buildup.',
      createdAt: '2024-12-19T05:41:47Z',
      provenance: {
        sourceType: 'REAL_ORBITAL_RASTER',
        satellite: 'Sentinel-2 Level-2A',
        cloudCover: 0.0066,
        validPixelPercentage: 100.0,
      },
    },
    {
      id: 'EVT-CD012-20240612',
      interventionId: 'CD-012',
      interventionName: 'Check Dam #12',
      sceneId: 'S2B_32VNJ_20240612_0_L2A',
      observationDate: '2024-06-12',
      previousNdvi: 0.38,
      currentNdvi: 0.40,
      percentageChange: 5.3,
      anomalyLevel: 'STABLE',
      status: 'VERIFIED',
      recommendedAction: 'Routine surveillance cycle recorded post-commissioning.',
      createdAt: '2024-06-12T09:30:00Z',
      provenance: {
        sourceType: 'REAL_ORBITAL_RASTER',
        satellite: 'Sentinel-2B L2A',
        cloudCover: 1.1,
        validPixelPercentage: 100.0,
      },
    },
  ];

  public getEvents(interventionId?: string): MonitoringEvent[] {
    if (!interventionId) return this.events;
    return this.events.filter((e) => e.interventionId === interventionId);
  }

  public addEvent(event: MonitoringEvent): void {
    // Deduplication check
    if (!this.events.some((e) => e.sceneId === event.sceneId)) {
      this.events.unshift(event);
    }
  }

  public updateStatus(eventId: string, status: MonitoringEvent['status']): void {
    const target = this.events.find((e) => e.id === eventId);
    if (target) {
      target.status = status;
    }
  }
}

export const monitoringService = new MonitoringService();
