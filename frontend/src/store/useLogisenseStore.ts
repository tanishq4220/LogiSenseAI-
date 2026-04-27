import { create } from 'zustand';
import * as api from '../api/logisense';

export interface VehicleData {
  vehicle_id: string;
  current_lat: number;
  current_lng: number;
  speed_kmh: number;
  status: string;
  assigned_route: any[];
  next_stop_index: number;
  original_eta: string;
}

export interface Alert {
  vehicle_id?: string;
  alert_type: string;
  severity: string;
  recommended_action?: string;
  source: string;
  delay_minutes?: number;
}

export interface Disruption {
  type: string;
  location: string;
  severity: string;
  severity_score?: number;
  status: string;
  confidence?: number;
}

export interface KPIData {
  costSaved: number;
  onTimeRate: number;
  activeVehicles: number;
  totalAlerts: number;
}

interface LogisenseState {
  vehicles: Record<string, VehicleData>;
  alerts: { deviation_alerts: Alert[]; delay_alerts: Alert[] };
  disruptions: Disruption[];
  kpis: KPIData;
  optimizationResult: any;
  carbonReport: any;
  carbonTabActive: boolean;
  isOptimizing: boolean;
  selectedVehicleId: string | null;
  pollingIntervals: any[];
  fetchVehicles: () => Promise<void>;
  fetchAlerts: () => Promise<void>;
  fetchDisruptions: () => Promise<void>;
  fetchCarbonReport: () => Promise<void>;
  setCarbonTabActive: (active: boolean) => void;
  triggerOptimization: (context?: string) => Promise<void>;
  startPolling: () => void;
  stopPolling: () => void;
  setSelectedVehicleId: (id: string | null) => void;
}

export const useLogisenseStore = create<LogisenseState>((set, get) => ({
  vehicles: {},
  alerts: { deviation_alerts: [], delay_alerts: [] },
  disruptions: [],
  kpis: { costSaved: 2847, onTimeRate: 94.2, activeVehicles: 5, totalAlerts: 0 },
  optimizationResult: null,
  isOptimizing: false,
  carbonReport: null,
  carbonTabActive: false,
  selectedVehicleId: null,
  pollingIntervals: [],

  fetchVehicles: async () => {
    try {
      const data = await api.getLiveVehicles();
      set({ vehicles: data });
    } catch (e) {
      console.error(e);
    }
  },
  
  fetchAlerts: async () => {
    try {
      const data = await api.getAlerts();
      set((state) => ({ 
        alerts: data,
        kpis: { ...state.kpis, totalAlerts: data.deviation_alerts.length + data.delay_alerts.length }
      }));
    } catch (e) {
      console.error(e);
    }
  },

  setCarbonTabActive: (active) => set({ carbonTabActive: active }),
  fetchCarbonReport: async () => {
    try {
      const data = await api.getCarbonReport();
      set({ carbonReport: data });
    } catch (e) {
      console.error(e);
    }
  },
  fetchDisruptions: async () => {
    try {
      const data = await api.getDisruptions();
      set({ disruptions: data.live_and_predicted_disruptions });
    } catch (e) {
      console.error(e);
    }
  },

  triggerOptimization: async (context?: string) => {
    set({ isOptimizing: true });
    try {
      const state = get();
      const payload = {
        fleet_id: "FL-01",
        current_routes: Object.values(state.vehicles).map(v => ({ id: v.vehicle_id, location: `${v.current_lat},${v.current_lng}`, status: v.status, eta: v.original_eta })),
        disruptions: state.disruptions,
        warehouse_status: { load_percentage: 0.8 },
        context: context
      };
      const res = await api.optimizeFleet(payload);
      set((state) => ({ 
        optimizationResult: res, 
        kpis: { ...state.kpis, costSaved: state.kpis.costSaved + 150 } 
      }));
    } catch (e) {
      console.error(e);
    } finally {
      set({ isOptimizing: false });
    }
  },

  startPolling: () => {
    get().stopPolling();
    get().fetchVehicles();
    get().fetchAlerts();
    get().fetchDisruptions();
    get().fetchCarbonReport();

    const i1 = setInterval(get().fetchVehicles, 5000);
    const i2 = setInterval(get().fetchAlerts, 15000);
    const i3 = setInterval(get().fetchDisruptions, 15000);
    const i4 = setInterval(get().fetchCarbonReport, 30000);
    set({ pollingIntervals: [i1, i2, i3, i4] });
  },

  stopPolling: () => {
    get().pollingIntervals.forEach(clearInterval);
    set({ pollingIntervals: [] });
  },
  
  setSelectedVehicleId: (id) => set({ selectedVehicleId: id })
}));
