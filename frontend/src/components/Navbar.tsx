import React from 'react';
import { useLogisenseStore } from '../store/useLogisenseStore';
import { LayoutDashboard, Route, BarChart3 } from 'lucide-react';

const Navbar: React.FC = () => {
  const activeTab = useLogisenseStore((s) => s.activeTab);
  const setActiveTab = useLogisenseStore((s) => s.setActiveTab);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} className="mr-2" /> },
    { id: 'optimizer', label: 'Route Optimizer', icon: <Route size={18} className="mr-2" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} className="mr-2" /> },
  ] as const;

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-[#1e293b] border-b border-slate-700 shadow-sm z-50">
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
          L
        </div>
        <h1 className="text-xl font-bold text-white tracking-wide">
          LogiSense <span className="text-blue-400">AI</span>
        </h1>
      </div>
      <div className="flex space-x-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === tab.id 
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.1)]' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
