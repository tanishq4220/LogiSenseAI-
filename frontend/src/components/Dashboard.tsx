import React, { useEffect } from 'react';
import KPIBar from './KPIBar';
import { useLogisenseStore } from '../store/useLogisenseStore';

const Dashboard: React.FC = () => {
  const updateKPIs = useLogisenseStore(s => s.updateKPIs);
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (updateKPIs) updateKPIs();
    }, 10000);
    return () => clearInterval(interval);
  }, [updateKPIs]);

  return (
    <div className="p-8 h-full overflow-y-auto bg-[#0f172a]">
      <h2 className="text-2xl font-semibold mb-8 text-white">Dashboard Overview</h2>
      
      <div className="mb-8">
        <KPIBar />
      </div>

      <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700 shadow-lg">
        <h3 className="text-xl font-medium mb-6 text-white">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { id: 1, text: 'Route optimization for FL-01 completed', time: '2 mins ago', status: 'success' },
            { id: 2, text: 'Vehicle V-42 reported slight delay (Traffic)', time: '15 mins ago', status: 'warning' },
            { id: 3, text: 'Carbon footprint reduced by 12% today', time: '1 hour ago', status: 'success' },
            { id: 4, text: 'New delivery batch scheduled for NY zone', time: '3 hours ago', status: 'info' }
          ].map(activity => (
            <div key={activity.id} className="flex items-center p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 transition-colors hover:bg-slate-800">
              <div className={`w-2.5 h-2.5 rounded-full mr-4 ${
                activity.status === 'success' ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]' :
                activity.status === 'warning' ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]' : 
                'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]'
              }`} />
              <div className="flex-1 text-slate-200">{activity.text}</div>
              <div className="text-sm text-slate-500 font-medium">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
