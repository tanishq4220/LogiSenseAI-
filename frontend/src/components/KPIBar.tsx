import React from 'react';
import { useLogisenseStore } from '../store/useLogisenseStore';
import { DollarSign, Clock, Truck, AlertTriangle, Leaf } from 'lucide-react';

export default function KPIBar() {
  const { kpis, carbonReport } = useLogisenseStore();

  return (
    <div className="w-full h-16 bg-[#1e293b] border-b border-[#334155] flex items-center px-6 gap-6 shadow-md z-10 relative">
      <div className="flex items-center gap-3 font-bold text-xl mr-auto text-blue-500">
        <Truck className="w-6 h-6" /> LogiSense AI
      </div>

      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3 bg-[#0f172a] px-4 py-2 rounded-lg border border-[#334155]">
          <DollarSign className="w-4 h-4 text-green-400" />
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase font-bold">Cost Saved Today</span>
            <span className="font-medium text-green-400">${kpis.costSaved.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-[#0f172a] px-4 py-2 rounded-lg border border-[#334155]">
          <Clock className="w-4 h-4 text-blue-400" />
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase font-bold">On-Time Rate</span>
            <span className="font-medium text-blue-400">{kpis.onTimeRate}%</span>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-[#0f172a] px-4 py-2 rounded-lg border border-[#334155]">
          <Truck className="w-4 h-4 text-gray-400" />
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase font-bold">Active Fleet</span>
            <span className="font-medium">{kpis.activeVehicles}/5</span>
          </div>
        </div>

        {carbonReport && (
        <div className="flex items-center gap-3 bg-[#0f172a] px-4 py-2 rounded-lg border border-green-500/30">
          <Leaf className="w-4 h-4 text-green-400" />
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase font-bold">Carbon Grade</span>
            <span className="font-medium text-green-400">{carbonReport.grade}</span>
          </div>
        </div>
        )}

        <div className="flex items-center gap-3 bg-[#0f172a] px-4 py-2 rounded-lg border border-[#334155] relative">
          <AlertTriangle className={`w-4 h-4 ${kpis.totalAlerts > 0 ? 'text-red-500' : 'text-gray-400'}`} />
          {kpis.totalAlerts > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>}
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase font-bold">Active Alerts</span>
            <span className={`font-medium ${kpis.totalAlerts > 0 ? 'text-red-500' : ''}`}>{kpis.totalAlerts}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
