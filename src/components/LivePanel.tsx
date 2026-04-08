import { useState, useEffect } from 'react';
import { Activity, TrendingUp, Users, Zap, Lock, BarChart3, PieChart as PieChartIcon, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Cell, Pie } from 'recharts';
import { motion } from 'framer-motion';

const MOCK_DATA = [
  { time: '00:00', vibe: 0.4, engagement: 0.6 },
  { time: '05:00', vibe: 0.6, engagement: 0.7 },
  { time: '10:00', vibe: 0.5, engagement: 0.8 },
  { time: '15:00', vibe: 0.8, engagement: 0.9 },
  { time: '20:00', vibe: 0.7, engagement: 0.85 },
  { time: '25:00', vibe: 0.9, engagement: 0.95 },
];

const EMOTION_DISTRIBUTION = [
  { name: 'Joy', value: 400, color: '#22c55e' },
  { name: 'Neutral', value: 300, color: '#94a3b8' },
  { name: 'Sadness', value: 100, color: '#3b82f6' },
  { name: 'Anger', value: 50, color: '#ef4444' },
];

export default function LivePanel({ tier }: { tier: 'free' | 'paid' }) {
  if (tier === 'free') {
    return (
      <div className="w-full max-w-4xl p-12 border-4 border-slate-800 rounded-3xl bg-slate-900/50 flex flex-col items-center justify-center text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="p-6 bg-amber-500 rounded-full shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-4 border-black animate-bounce">
          <Lock className="w-12 h-12 text-black" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white italic">Premium Analytics Locked</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs max-w-md">
            Unlock the Live Panel to access deep emotional insights, historical trends, and advanced RAG memory management.
          </p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-500 border-4 border-black px-10 py-4 rounded-2xl font-black text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-1 active:shadow-none uppercase text-sm flex items-center gap-3">
          <Zap className="w-5 h-5" /> Upgrade to Pro
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-amber-500 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
            <Activity className="w-8 h-8 text-black" />
          </div>
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-amber-400 italic">Live Panel</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Advanced Emotional Intelligence Dashboard</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-slate-800 p-2 rounded-2xl border-2 border-slate-700">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-xl border border-slate-700">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Last 30 Days</span>
          </div>
          <button className="p-2 hover:bg-slate-700 rounded-xl transition-colors">
            <BarChart3 className="w-5 h-5 text-slate-400" />
          </button>
          <button className="p-2 hover:bg-slate-700 rounded-xl transition-colors">
            <PieChartIcon className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Avg Vibe', value: '84%', trend: '+12%', icon: TrendingUp, color: 'text-emerald-400' },
          { label: 'Engagement', value: '92%', trend: '+5%', icon: Users, color: 'text-indigo-400' },
          { label: 'Sessions', value: '24', trend: '+2', icon: Activity, color: 'text-amber-400' },
          { label: 'Insights', value: '156', trend: '+42', icon: Zap, color: 'text-rose-400' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-slate-800 border-4 border-slate-700 rounded-3xl p-6 shadow-xl hover:border-indigo-500/50 transition-colors group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-slate-900 border-2 border-slate-700 group-hover:border-indigo-500/50 transition-colors ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-lg border border-emerald-500/30">
                {stat.trend}
              </span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
            <h4 className="text-3xl font-black text-white italic tracking-tighter">{stat.value}</h4>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-800 border-4 border-slate-700 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black uppercase tracking-widest text-sm text-slate-100">Vibe vs Engagement Trend</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase">Vibe</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase">Engagement</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_DATA}>
                <defs>
                  <linearGradient id="colorVibe" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEng" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '2px solid #334155', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="vibe" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorVibe)" />
                <Area type="monotone" dataKey="engagement" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorEng)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800 border-4 border-slate-700 rounded-3xl p-8 shadow-2xl flex flex-col">
          <h3 className="font-black uppercase tracking-widest text-sm text-slate-100 mb-8">Emotion Distribution</h3>
          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={EMOTION_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {EMOTION_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '2px solid #334155', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8">
            {EMOTION_DISTRIBUTION.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[10px] font-bold text-slate-400 uppercase">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
