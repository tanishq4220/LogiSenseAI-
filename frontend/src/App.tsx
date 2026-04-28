import React, { useEffect } from 'react';
import { useLogisenseStore } from './store/useLogisenseStore';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import RouteOptimizer from './components/RouteOptimizer';
import Analytics from './components/Analytics';
import GeminiChatPanel from './components/GeminiChatPanel';
import VoiceAssistant from './components/VoiceAssistant';

const App: React.FC = () => {
  const startPolling = useLogisenseStore((s) => s.startPolling);
  const stopPolling = useLogisenseStore((s) => s.stopPolling);
  const activeTab = useLogisenseStore((s) => s.activeTab);

  useEffect(() => {
    startPolling();
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0f172a] text-white overflow-hidden font-sans">
      <Navbar />
      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'optimizer' && <RouteOptimizer />}
        {activeTab === 'analytics' && <Analytics />}
        
        {/* Global floating panels */}
        <GeminiChatPanel />
        <VoiceAssistant />
      </div>
    </div>
  );
};

export default App;
