import React, { useState } from 'react';
import { useLogisenseStore } from '../store/useLogisenseStore';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

export default function GeminiChatPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: string, content: string}[]>([{
    role: 'ai', content: 'Hello! I am LogiSense Gemini. Ask me to re-optimize routes, summarize disruptions, or identify delayed vehicles.'
  }]);
  const [input, setInput] = useState('');
  const { triggerOptimization, isOptimizing, alerts } = useLogisenseStore();

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    
    if (text.toLowerCase().includes('optimize') || text.toLowerCase().includes('reroute')) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Running full fleet optimization with RL and Disruption priors...' }]);
      await triggerOptimization(text);
      setMessages(prev => [...prev, { role: 'ai', content: 'Optimization complete! The DeckGL map has been updated with new routes.' }]);
    } else if (text.toLowerCase().includes('delay')) {
      const delayed = alerts.delay_alerts.map(a => a.vehicle_id).join(', ');
      setMessages(prev => [...prev, { role: 'ai', content: delayed ? `These vehicles are delayed: ${delayed}` : 'No vehicles are currently delayed.' }]);
    } else {
      setMessages(prev => [...prev, { role: 'ai', content: 'I have logged your request. For immediate action, please use the "Re-optimize" buttons or click a quick action.' }]);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="absolute bottom-6 right-6 bg-blue-600 hover:bg-blue-500 text-white rounded-full p-4 shadow-lg shadow-blue-500/20 transition-transform hover:scale-105 z-30 flex items-center justify-center"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="absolute bottom-6 right-6 w-96 h-[500px] bg-[#1e293b] border border-[#334155] rounded-xl shadow-2xl z-30 flex flex-col overflow-hidden">
      <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-sm">
          <Bot className="w-5 h-5" /> Gemini 1.5 Pro
        </div>
        <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0f172a]">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg p-3 text-sm ${m.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-[#1e293b] text-gray-200 border border-[#334155] rounded-bl-none'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {isOptimizing && (
          <div className="flex justify-start">
            <div className="bg-[#1e293b] text-gray-400 text-xs p-3 rounded-lg border border-[#334155] rounded-bl-none flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 bg-[#1e293b] border-t border-[#334155]">
        <div className="flex flex-wrap gap-2 mb-3">
          <button onClick={() => handleSend("Which vehicle is most delayed?")} className="text-[10px] bg-[#0f172a] hover:bg-gray-800 border border-[#334155] px-2 py-1 rounded text-gray-300">Delayed Vehicles?</button>
          <button onClick={() => handleSend("Re-optimize all routes")} className="text-[10px] bg-[#0f172a] hover:bg-gray-800 border border-[#334155] px-2 py-1 rounded text-gray-300">Re-optimize Fleet</button>
        </div>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend(input)}
            placeholder="Ask Gemini..."
            className="flex-1 bg-[#0f172a] border border-[#334155] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
          />
          <button 
            onClick={() => handleSend(input)}
            className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
