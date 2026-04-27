import React from 'react';
import { useLogisenseStore } from '../store/useLogisenseStore';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Leaf, TreeDeciduous } from 'lucide-react';

export default function CarbonDashboard() {
  const { carbonReport, triggerOptimization } = useLogisenseStore();
  
  if (!carbonReport) return <div className="p-4 text-gray-500 text-sm">Loading Carbon Report...</div>;

  const scoreColor = carbonReport.carbon_score > 70 ? '#22c55e' : carbonReport.carbon_score > 50 ? '#eab308' : '#ef4444';

  const chartData = carbonReport.per_vehicle_breakdown?.map((v: any) => ({
    name: v.vehicle_id,
    saved: v.emissions.co2_saved_kg
  })) || [];

  return (
    <div className="p-4 flex-1 overflow-y-auto">
      <div className="bg-[#1e293b] rounded-lg p-4 mb-4 border border-[#334155] flex flex-col items-center justify-center">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="48" cy="48" r="40" stroke="#334155" strokeWidth="8" fill="none" />
            <circle cx="48" cy="48" r="40" stroke={scoreColor} strokeWidth="8" fill="none" strokeDasharray={`${carbonReport.carbon_score * 2.51} 251`} strokeLinecap="round" className="transition-all duration-1000" />
          </svg>
          <div className="absolute font-bold text-xl">{carbonReport.carbon_score}</div>
        </div>
        <div className="mt-2 font-bold text-sm" style={{color: scoreColor}}>{carbonReport.grade}</div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-[#0f172a] p-3 rounded border border-[#334155]">
          <div className="flex items-center gap-1 text-green-400 text-xs font-bold"><Leaf className="w-3 h-3"/> CO2 SAVED</div>
          <div className="text-sm font-bold mt-1">{carbonReport.total_co2_saved_kg} kg</div>
        </div>
        <div className="bg-[#0f172a] p-3 rounded border border-[#334155]">
          <div className="flex items-center gap-1 text-green-400 text-xs font-bold"><TreeDeciduous className="w-3 h-3"/> TREES</div>
          <div className="text-sm font-bold mt-1">{carbonReport.trees_equivalent} trees</div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-xs font-bold text-gray-400 mb-2">VEHICLE EMISSIONS SAVED (KG)</h3>
        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
              <Tooltip cursor={{fill: '#334155'}} contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155', fontSize: '12px'}} />
              <Bar dataKey="saved" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {carbonReport.green_recommendation && (
        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
          <div className="flex items-center gap-2 text-green-400 font-bold text-xs mb-2">
            <Leaf className="w-4 h-4"/> GREEN RECOMMENDATION
          </div>
          <p className="text-xs text-gray-300 mb-3">
            {carbonReport.green_recommendation.action} (Target: {carbonReport.green_recommendation.worst_route_vehicle_id} for extra {carbonReport.green_recommendation.potential_saving_kg}kg savings)
          </p>
          <button 
            onClick={() => triggerOptimization("carbon_priority=true")}
            className="w-full bg-green-600 hover:bg-green-500 text-white text-xs font-bold py-2 rounded transition-colors"
          >
            Apply Green Optimization
          </button>
        </div>
      )}
    </div>
  );
}
