import React, { useEffect } from 'react';
import { useLogisenseStore } from './store/useLogisenseStore';
import KPIBar from './components/KPIBar';
import Sidebar from './components/Sidebar';
import Map3D from './components/Map3D';
import VehicleDetailPanel from './components/VehicleDetailPanel';
import GeminiChatPanel from './components/GeminiChatPanel';
import VoiceAssistant from './components/VoiceAssistant';

const App: React.FC = () => {
  const startPolling = useLogisenseStore((s) => s.startPolling);
  const stopPolling = useLogisenseStore((s) => s.stopPolling);

  useEffect(() => {
    startPolling();
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0f172a] text-white overflow-hidden">
      <KPIBar />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        <div className="flex-1 relative">
          <Map3D />
          <VehicleDetailPanel />
          <GeminiChatPanel />
          <VoiceAssistant />
        </div>
      </div>
    </div>
  );
};

export default App;
