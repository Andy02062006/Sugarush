"use client";

import React, { useState } from 'react';
import { useStore } from '../../store';
import { Card } from '../../components/ui/Card';
import { GradientButton } from '../../components/ui/GradientButton';
import { StatusPill } from '../../components/ui/StatusPill';
import { Plus, Download, ChevronRight, FileText, Droplet, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MOCK_WEEKLY_DATA } from '../../lib/mocks';

export default function GlucoseScreen() {
  const [activeTab, setActiveTab] = useState<'history' | 'weekly'>('history');
  const [showAddModal, setShowAddModal] = useState(false);
  
  const { logs, addLog, addXP } = useStore();

  // New Log State
  const [newValue, setNewValue] = useState('');
  const [newMealType, setNewMealType] = useState('Fasting');
  const [newInsulin, setNewInsulin] = useState('0');
  const [newNotes, setNewNotes] = useState('');

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (newValue) {
      addLog({
        value: parseInt(newValue),
        timestamp: new Date().toISOString(),
        mealType: newMealType,
        insulin: parseInt(newInsulin) || 0,
        notes: newNotes
      });
      addXP(50); // Gamification reward
      setShowAddModal(false);
      // Reset form
      setNewValue('');
      setNewInsulin('0');
      setNewNotes('');
      
      const msg = new SpeechSynthesisUtterance('Log saved successfully. You earned 50 XP!');
      window.speechSynthesis.speak(msg);
    }
  };

  const getLogBorderColor = (value: number) => {
    if (value < 70) return 'border-l-teal-primary';
    if (value > 140 && value <= 180) return 'border-l-amber-accent';
    if (value > 180) return 'border-l-status-red';
    return 'border-l-status-green';
  };

  const getChartColor = (value: number) => {
    if (value < 70) return '#2A9D8F';
    if (value > 180) return '#EF4444';
    if (value > 140) return '#E07A3A';
    return '#22C55E';
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <header className="mb-8 relative mt-2">
        <div className="flex justify-between items-end relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-500 rounded-md text-[11px] font-bold uppercase tracking-widest mb-4">
              <Activity size={12} /> Analytics
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-black text-slate-900 tracking-tight leading-none">Glucose <span className="text-slate-400">History</span></h1>
          </div>
          <button 
             onClick={() => setShowAddModal(true)}
             className="w-12 h-12 bg-slate-900 text-white font-bold rounded-full flex items-center justify-center shadow-md hover:bg-slate-800 hover:scale-105 transition-all focus-ring"
             aria-label="Add Log"
          >
            <Plus size={20} />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex bg-slate-50/50 p-1 rounded-[14px] mb-8 border border-slate-200">
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2.5 text-[13px] font-bold rounded-[10px] transition-all focus-ring ${
            activeTab === 'history' 
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200' 
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
          }`}
        >
          Activity Logs
        </button>
        <button 
          onClick={() => setActiveTab('weekly')}
          className={`flex-1 py-2.5 text-[13px] font-bold rounded-[10px] transition-all focus-ring ${
            activeTab === 'weekly' 
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200' 
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
          }`}
        >
          Weekly Trends
        </button>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'history' ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Recent Logs</span>
                <button className="text-[13px] font-semibold text-slate-500 flex items-center gap-1.5 hover:text-slate-900 focus-ring rounded-md transition-colors">
                  <Download size={14} /> Export PDF
                </button>
              </div>

              {logs.map((log) => (
                <Card key={log.id} className={`p-5 border-l-[4px] bg-white border border-slate-200 ${getLogBorderColor(log.value)} hover:shadow-md transition-shadow cursor-pointer rounded-2xl`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-3xl font-heading font-black text-slate-900 tracking-tight leading-none">{log.value} <span className="text-[13px] font-bold text-slate-400 tracking-normal ml-0.5">mg/dL</span></span>
                        <StatusPill value={log.value} />
                      </div>
                      <p className="text-[13px] font-bold text-slate-500 flex items-center gap-2 mt-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                        {log.mealType}
                      </p>
                      {log.notes && (
                        <p className="text-[13px] text-slate-500 mt-2 flex items-start gap-1.5 font-medium leading-snug">
                          <FileText size={14} className="mt-0.5 shrink-0 text-slate-400" /> {log.notes}
                        </p>
                      )}
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <p className="text-[13px] font-bold text-slate-900">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                        {new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </p>
                      {log.insulin ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-md uppercase tracking-wider">
                          <Droplet size={10} className="fill-current" /> {log.insulin}U
                        </span>
                      ) : null}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
             <div className="space-y-6">
              <Card className="p-6 bg-white border border-slate-200 shadow-sm rounded-2xl">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6">Average by Day</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MOCK_WEEKLY_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }}
                      />
                      <Tooltip 
                        cursor={{ fill: '#F1F5F9' }}
                        contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontWeight: 'bold', backgroundColor: '#FFFFFF', color: '#0F172A', fontSize: '13px' }}
                      />
                      <Bar dataKey="avg" radius={[4, 4, 0, 0]} maxBarSize={32}>
                         {MOCK_WEEKLY_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getChartColor(entry.avg)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                 <Card className="bg-white border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Time in Range</p>
                  <p className="text-3xl font-heading font-black text-slate-900 tracking-tight">72%</p>
                  <p className="text-[13px] text-green-600 font-bold mt-2">↑ 5% from last week</p>
                 </Card>
                 <Card className="bg-slate-900 border border-slate-800 shadow-sm p-6 hover:shadow-md transition-shadow">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Est. HbA1c</p>
                  <p className="text-3xl font-heading font-black text-white tracking-tight">6.1%</p>
                  <p className="text-[13px] text-slate-300 font-bold mt-2">On target</p>
                 </Card>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Add Log Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[24px] w-full max-w-md p-6 shadow-2xl border border-slate-200 relative"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-heading font-black text-slate-900 tracking-tight">Add Log</h2>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-900 transition-colors p-2 bg-slate-50 rounded-full focus-ring">
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveLog} className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Glucose Level</label>
                  <div className="relative flex items-center">
                    <input 
                      type="number" 
                      value={newValue}
                      onChange={e => setNewValue(e.target.value)}
                      className="w-full text-4xl font-heading font-black text-slate-900 bg-white border border-slate-200 rounded-[16px] py-4 px-4 pr-20 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all shadow-sm h-[80px]"
                      placeholder="0"
                      required
                      autoFocus
                    />
                    <span className="absolute right-6 text-[15px] font-bold text-slate-400">mg/dL</span>
                  </div>
                </div>

                <div>
                   <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Meal Timer</label>
                   <div className="flex gap-2 overflow-x-auto pb-2 snap-x no-scrollbar shrink-0">
                    {['Fasting', 'Before Meal', 'After Meal', 'Snack', 'Bedtime'].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setNewMealType(type)}
                        className={`px-4 py-2 rounded-full text-[13px] font-semibold whitespace-nowrap snap-start transition-all focus-ring ${
                          newMealType === type
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                   </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Insulin (Units)</label>
                    <span className="font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded text-[13px]">{newInsulin}U</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="30" 
                    value={newInsulin}
                    onChange={e => setNewInsulin(e.target.value)}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Notes (Optional)</label>
                  <textarea 
                    value={newNotes}
                    onChange={e => setNewNotes(e.target.value)}
                    className="w-full p-4 bg-white border border-slate-200 rounded-[16px] focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all resize-none shadow-sm text-[14px] text-slate-900 placeholder:text-slate-400"
                    placeholder="E.g., Felt dizzy, ate a donut..."
                    rows={2}
                  ></textarea>
                </div>

                <button type="submit" className="w-full bg-slate-900 text-white font-bold text-[15px] py-4 rounded-[12px] hover:bg-slate-800 transition-colors shadow-sm flex items-center justify-center">
                  Save Reading
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
