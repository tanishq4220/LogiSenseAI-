import React, { useState } from 'react';
import { useLogisenseStore } from '../store/useLogisenseStore';
import Map3D from './Map3D';
import VehicleDetailPanel from './VehicleDetailPanel';
import { Loader2 } from 'lucide-react';

const RouteOptimizer: React.FC = () => {
  const isOptimizingRoute = useLogisenseStore((s) => s.isOptimizingRoute);
  const routeMetrics = useLogisenseStore((s) => s.routeMetrics);
  const optimizeRouteAction = useLogisenseStore((s) => s.optimizeRouteAction);
  
  const [source, setSource] = useState('');
  const [dest, setDest] = useState('');
  const [priority, setPriority] = useState('Standard');

  const handleOptimize = () => {
    if (!source || !dest) return;
    optimizeRouteAction(source, dest, priority);
  };

  return (
    <div className="flex h-full w-full">
      {/* Left Panel */}
      <div className="w-[350px] bg-[#1e293b] p-6 border-r border-slate-700 flex flex-col h-full overflow-y-auto z-10 shadow-xl">
        <h2 className="text-2xl font-semibold mb-8 text-white">Route Optimizer</h2>
        
        <div className="space-y-5 mb-8">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Source</label>
            <input 
              type="text" 
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="e.g., Warehouse A"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Destination</label>
            <input 
              type="text" 
              value={dest}
              onChange={(e) => setDest(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="e.g., Pune Central"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Priority</label>
            <select 
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            >
              <option value="Standard">Standard</option>
              <option value="Express">Express</option>
              <option value="Eco">Eco-Friendly</option>
            </select>
          </div>
          
          <button 
            onClick={handleOptimize}
            disabled={isOptimizingRoute || !source || !dest}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-medium py-3.5 rounded-lg flex justify-center items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)]"
          >
            {isOptimizingRoute ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Optimizing route using AI...
              </>
            ) : (
              'Optimize Route'
            )}
          </button>
        </div>

        {routeMetrics && !isOptimizingRoute && (
          <div className="mt-2 p-5 rounded-xl bg-slate-800/80 border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.15)] opacity-0 animate-[pulse_1s_ease-out_forwards]" style={{ animationFillMode: 'forwards', animationName: 'fade-in' }}>
            <style>{`
              @keyframes fade-in {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>
            <h3 className="text-lg font-medium text-blue-400 mb-4">Optimization Results</h3>
            {routeMetrics.summary && (
              <div className="mb-4 p-3 bg-blue-900/40 rounded-lg border border-blue-500/30 text-sm text-blue-100 font-medium">
                {routeMetrics.summary}
              </div>
            )}
            <div className="space-y-3">
              <div className="flex justify-between items-center py-1 border-b border-slate-700/50">
                <span className="text-slate-400">Time Saved</span>
                <span className="font-bold text-green-400">{routeMetrics.timeSaved}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-700/50">
                <span className="text-slate-400">Fuel Saved</span>
                <span className="font-bold text-green-400">{routeMetrics.fuelSaved}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">CO2 Reduction</span>
                <span className="font-bold text-green-400">{routeMetrics.co2Reduced}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Panel */}
      <div className="flex-1 relative bg-slate-900 overflow-hidden">
        <div style={{ height: "100%", width: "100%", position: "absolute", inset: 0 }}>
          <Map3D />
        </div>
        <VehicleDetailPanel />
      </div>
    </div>
  );
};

export default RouteOptimizer;
