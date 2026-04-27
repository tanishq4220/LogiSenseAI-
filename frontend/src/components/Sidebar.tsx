import React from 'react';
import { useLogisenseStore } from '../store/useLogisenseStore';
import { Loader2, Zap, Leaf } from 'lucide-react';
import CarbonDashboard from './CarbonDashboard';

export default function Sidebar() {
  const { vehicles, alerts, disruptions, triggerOptimization, isOptimizing, optimizationResult, carbonTabActive, setCarbonTabActive } = useLogisenseStore();
  
  const vehicleList = Object.values(vehicles);

  return (
    <div className="w-80 h-full bg-[#0f172a] border-r border-[#1e293b] flex flex-col overflow-hidden">
      <div className="flex border-b border-[#1e293b] shrink-0">
        <button onClick={()=>setCarbonTabActive(false)} className={`flex-1 py-3 text-xs font-bold ${!carbonTabActive ? 'text-blue-400 border-b-2 border-blue-400 bg-[#1e293b]' : 'text-gray-500 hover:bg-[#1e293b]/50'}`}>OPS DASHBOARD</button>
        <button onClick={()=>setCarbonTabActive(true)} className={`flex-1 py-3 text-xs font-bold flex justify-center items-center gap-1 ${carbonTabActive ? 'text-green-400 border-b-2 border-green-400 bg-[#1e293b]' : 'text-gray-500 hover:bg-[#1e293b]/50'}`}> <Leaf className="w-3 h-3"/> CARBON</button>
      </div>
      
      {carbonTabActive ? <CarbonDashboard /> : <div className="flex-1 overflow-y-auto flex flex-col">
      <div className="p-4 border-b border-[#1e293b]">
        <h2 className="text-sm font-bold text-gray-400 mb-3">FLEET STATUS</h2>
        {vehicleList.map(v => (
          <div key={v.vehicle_id} className="flex items-center justify-between py-2 border-b border-[#1e293b]/50 last:border-0">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${v.status === 'delayed' ? 'bg-yellow-500' : v.status === 'deviated' ? 'bg-red-500' : 'bg-green-500'}`}></div>
              <span className="font-medium text-sm">{v.vehicle_id}</span>
            </div>
            <span className="text-xs text-gray-500">{Math.round(v.speed_kmh)} km/h</span>
          </div>
        ))}
      </div>

      <div className="p-4 border-b border-[#1e293b]">
        <h2 className="text-sm font-bold text-gray-400 mb-3">ACTIVE ALERTS</h2>
        {[...alerts.deviation_alerts, ...alerts.delay_alerts].map((a, i) => (
          <div key={i} className="mb-2 p-2 bg-[#1e293b] rounded text-xs border-l-2 border-red-500">
            <div className="font-bold text-red-400">⚠️ {a.vehicle_id} {a.alert_type}</div>
            <div className="text-gray-400 mt-1">{a.recommended_action || "Delay detected"}</div>
          </div>
        ))}
        {alerts.deviation_alerts.length === 0 && alerts.delay_alerts.length === 0 && (
          <div className="text-xs text-gray-500">No active alerts</div>
        )}
      </div>

      <div className="p-4 border-b border-[#1e293b]">
        <h2 className="text-sm font-bold text-gray-400 mb-3">DISRUPTION ZONES</h2>
        {disruptions.map((d, i) => (
          <div key={i} className="flex justify-between items-center mb-2 text-xs">
            <span>{d.location} <span className="text-gray-500">({d.status})</span></span>
            <span className={d.severity === 'high' ? 'text-red-500' : 'text-yellow-500'}>{Math.round((d.severity_score || 0)*100)}%</span>
          </div>
        ))}
        {disruptions.length === 0 && (
          <div className="text-xs text-gray-500">No disruptions</div>
        )}
      </div>

      <div className="p-4 mt-auto">
        <button 
          onClick={() => triggerOptimization()}
          disabled={isOptimizing}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
        >
          {isOptimizing ? <Loader2 className="animate-spin w-4 h-4" /> : <Zap className="w-4 h-4" />}
          Run Gemini Optimization
        </button>
        {optimizationResult && (
          <div className="mt-3 text-xs text-green-400 text-center">
            Optimization complete. Routes updated.
          </div>
        )}
      </div>
      </div>)}
    </div>
  );
}
