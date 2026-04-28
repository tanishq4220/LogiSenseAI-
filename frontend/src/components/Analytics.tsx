import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const lineData = [
  { name: 'Mon', time: 120 },
  { name: 'Tue', time: 110 },
  { name: 'Wed', time: 95 },
  { name: 'Thu', time: 85 },
  { name: 'Fri', time: 70 },
  { name: 'Sat', time: 65 },
  { name: 'Sun', time: 60 },
];

const barData = [
  { name: 'Week 1', fuel: 4000 },
  { name: 'Week 2', fuel: 3000 },
  { name: 'Week 3', fuel: 2000 },
  { name: 'Week 4', fuel: 2780 },
];

const pieData = [
  { name: 'Standard', value: 400 },
  { name: 'Express', value: 300 },
  { name: 'Eco', value: 300 },
];
const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

const Analytics: React.FC = () => {
  const [line, setLine] = useState(lineData);
  const [bar, setBar] = useState(barData);

  useEffect(() => {
    const interval = setInterval(() => {
      setLine(prev => prev.map(d => ({ ...d, time: Math.max(50, d.time + (Math.random() > 0.5 ? 5 : -5)) })));
      setBar(prev => prev.map(d => ({ ...d, fuel: Math.max(1000, d.fuel + (Math.random() > 0.5 ? 150 : -150)) })));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 h-full overflow-y-auto bg-[#0f172a]">
      <h2 className="text-2xl font-semibold mb-8 text-white">Analytics & Insights</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700 shadow-lg h-80">
          <h3 className="text-lg font-medium mb-4 text-slate-300">Delivery Time Trend (mins)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={line}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
              <Legend />
              <Line type="monotone" dataKey="time" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700 shadow-lg h-80">
          <h3 className="text-lg font-medium mb-4 text-slate-300">Fuel Usage (Liters)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bar}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
              <Legend />
              <Bar dataKey="fuel" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700 shadow-lg h-80">
          <h3 className="text-lg font-medium mb-4 text-slate-300">Delivery Types</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={{ fill: '#e2e8f0' }}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
