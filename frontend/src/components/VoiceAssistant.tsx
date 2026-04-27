import React, { useState, useEffect } from 'react';
import { Mic, Loader2, Activity } from 'lucide-react';
import { useLogisenseStore } from '../store/useLogisenseStore';
import * as api from '../api/logisense';

export default function VoiceAssistant() {
  const [state, setState] = useState<'idle'|'listening'|'processing'|'speaking'>('idle');
  const [transcript, setTranscript] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const { triggerOptimization } = useLogisenseStore();

  const startListening = () => {
    setState('listening');
    setTranscript('');
    
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      setState('idle');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = true;
    
    recognition.onresult = (e: any) => {
      let t = '';
      for (let i = e.resultIndex; i < e.results.length; ++i) {
        t += e.results[i][0].transcript;
      }
      setTranscript(t);
    };
    
    recognition.onend = async () => {
      if (!transcript) {
        setState('idle');
        return;
      }
      setState('processing');
      try {
        const res = await api.sendVoiceCommand({ transcript });
        if (res.intent === 'reoptimize_all') {
          await triggerOptimization('Voice command: Re-optimize all');
        } else if (res.data?.raw_transcript?.toLowerCase().includes('carbon_priority=true')) {
           await triggerOptimization('carbon_priority=true');
        }
        setState('speaking');
        setToastMsg(res.response_text);
        
        const utterance = new SpeechSynthesisUtterance(res.response_text);
        utterance.rate = 0.9;
        utterance.onend = () => setState('idle');
        window.speechSynthesis.speak(utterance);
        
        setTimeout(() => setToastMsg(''), 5000);
      } catch (e) {
        console.error(e);
        setState('idle');
      }
    };
    
    recognition.start();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && state === 'idle' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        startListening();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state, transcript]);

  return (
    <>
      {toastMsg && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-in slide-in-from-top-4">
          {toastMsg}
        </div>
      )}
      
      <div className="fixed bottom-6 left-6 flex flex-col items-center gap-2 z-50">
        {state === 'listening' && (
          <div className="bg-[#1e293b] text-white px-4 py-2 rounded-lg shadow-lg border border-[#334155] text-sm animate-pulse mb-2">
            {transcript || "Listening..."}
          </div>
        )}
        
        <button 
          onClick={startListening}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all ${
            state === 'idle' ? 'bg-gradient-to-r from-blue-600 to-blue-400 hover:scale-105 shadow-blue-500/50' : 
            state === 'listening' ? 'bg-red-500 animate-pulse ring-4 ring-red-500/30' : 
            state === 'processing' ? 'bg-yellow-500' : 'bg-green-500'
          }`}
        >
          {state === 'idle' && <Mic className="w-8 h-8 text-white" />}
          {state === 'listening' && <Mic className="w-8 h-8 text-white" />}
          {state === 'processing' && <Loader2 className="w-8 h-8 text-white animate-spin" />}
          {state === 'speaking' && <Activity className="w-8 h-8 text-white animate-bounce" />}
        </button>
        <div className="text-[10px] text-gray-400 mt-1 font-medium bg-[#0f172a]/80 px-2 rounded">
          🎤 Press SPACE to speak
        </div>
      </div>
    </>
  );
}
