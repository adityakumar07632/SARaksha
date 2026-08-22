/**
 * SARaksha Network State & Connectivity Monitor
 * Detects online/offline transitions, manages sync lifecycle states,
 * and allows programmatic simulation for field testing and SIH demonstrations.
 */

export type NetworkStatus = 'ONLINE' | 'OFFLINE' | 'SYNCING' | 'SYNC_ERROR';

type Listener = (status: NetworkStatus) => void;

class NetworkStateService {
  private status: NetworkStatus = 'ONLINE';
  private simulatedOffline: boolean = false;
  private listeners: Set<Listener> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      this.status = (typeof navigator !== 'undefined' && navigator.onLine === false) ? 'OFFLINE' : 'ONLINE';

      window.addEventListener('online', () => {
        if (!this.simulatedOffline) {
          this.setStatus('ONLINE');
        }
      });

      window.addEventListener('offline', () => {
        this.setStatus('OFFLINE');
      });
    }
  }

  public getStatus(): NetworkStatus {
    if (this.simulatedOffline) return 'OFFLINE';
    return this.status;
  }

  public isOnline(): boolean {
    return this.getStatus() === 'ONLINE';
  }

  public isOffline(): boolean {
    return this.getStatus() === 'OFFLINE';
  }

  public setStatus(newStatus: NetworkStatus) {
    this.status = newStatus;
    this.notify();
  }

  /**
   * Toggles simulated offline mode for field testing or SIH live demonstrations
   */
  public setSimulatedOffline(offline: boolean) {
    this.simulatedOffline = offline;
    this.setStatus(offline ? 'OFFLINE' : 'ONLINE');
  }

  public isSimulatedOffline(): boolean {
    return this.simulatedOffline;
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.getStatus());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const current = this.getStatus();
    this.listeners.forEach((listener) => listener(current));
  }
}

export const networkStateService = new NetworkStateService();
