import React from 'react';
import { useLogisenseStore } from '../store/useLogisenseStore';
import { X, Navigation, Clock, Activity } from 'lucide-react';

export default function VehicleDetailPanel() {
  const { selectedVehicleId, setSelectedVehicleId, vehicles, triggerOptimization, isOptimizing } = useLogisenseStore();
  
  if (!selectedVehicleId) return null;
  const vehicle = vehicles[selectedVehicleId];
  if (!vehicle) return null;

  return (
    <div className="absolute right-0 top-0 bottom-0 w-80 bg-[#1e293b] border-l border-[#334155] shadow-2xl z-20 flex flex-col transition-transform duration-300 translate-x-0">
      <div className="p-4 border-b border-[#334155] flex justify-between items-center bg-[#0f172a]">
        <h2 className="font-bold text-lg flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${vehicle.status === 'delayed' ? 'bg-yellow-500' : vehicle.status === 'deviated' ? 'bg-red-500' : 'bg-green-500'}`}></div>
          {vehicle.vehicle_id} Details
        </h2>
        <button onClick={() => setSelectedVehicleId(null)} className="text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <div className="space-y-4">
          <div className="bg-[#0f172a] p-3 rounded border border-[#334155]">
            <div className="flex items-center gap-2 text-gray-400 text-xs font-bold mb-1"><Activity className="w-4 h-4"/> STATUS</div>
            <div className="text-sm capitalize font-medium">{vehicle.status.replace('_', ' ')}</div>
          </div>

          <div className="bg-[#0f172a] p-3 rounded border border-[#334155]">
            <div className="flex items-center gap-2 text-gray-400 text-xs font-bold mb-1"><Navigation className="w-4 h-4"/> SPEED & POSITION</div>
            <div className="text-sm">{Math.round(vehicle.speed_kmh)} km/h</div>
            <div className="text-xs text-gray-500 mt-1">{vehicle.current_lat.toFixed(4)}, {vehicle.current_lng.toFixed(4)}</div>
          </div>

          <div className="bg-[#0f172a] p-3 rounded border border-[#334155]">
            <div className="flex items-center gap-2 text-gray-400 text-xs font-bold mb-1"><Clock className="w-4 h-4"/> NEXT STOP & ETA</div>
            <div className="text-sm">
              {vehicle.assigned_route[vehicle.next_stop_index]?.name || "Final Destination"}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              ETA: {new Date(vehicle.original_eta).toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-[#334155] bg-[#0f172a]">
        <button 
          onClick={() => triggerOptimization(`Focus strictly on re-optimizing route for ${vehicle.vehicle_id}`)}
          disabled={isOptimizing}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded text-sm disabled:opacity-50 transition-colors"
        >
          {isOptimizing ? 'Optimizing...' : 'Re-optimize This Vehicle'}
        </button>
      </div>
    </div>
  );
}
