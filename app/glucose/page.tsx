"use client";

import React, { useState } from 'react';
import { useStore } from '../../store';
import { Card } from '../../components/ui/Card';
import { GradientButton } from '../../components/ui/GradientButton';
import { StatusPill } from '../../components/ui/StatusPill';
import { Plus, Download, ChevronRight, FileText, Droplet } from 'lucide-react';
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
    if (value < 70) return 'border-l-blue-500';
    if (value > 140 && value <= 180) return 'border-l-amber-500';
    if (value > 180) return 'border-l-red-500';
    return 'border-l-green-500';
  };

  const getChartColor = (value: number) => {
    if (value < 70) return '#3B82F6';
    if (value > 180) return '#EF4444';
    if (value > 140) return '#F59E0B';
    return '#22C55E';
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Glucose</h1>
          <p className="text-slate-500 font-medium mt-1">Track and analyze</p>
        </div>
        <GradientButton onClick={() => setShowAddModal(true)} className="py-2.5 px-4 rounded-xl text-sm flex gap-2">
          <Plus size={16} />
          <span className="hidden sm:inline">Add Log</span>
        </GradientButton>
      </header>

      {/* Tabs */}
      <div className="flex bg-slate-200/50 p-1.5 rounded-2xl mb-6">
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
            activeTab === 'history' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          History
        </button>
        <button 
          onClick={() => setActiveTab('weekly')}
          className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
            activeTab === 'weekly' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
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
              <div className="flex justify-between items-center px-1">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Recent Logs</span>
                <button className="text-sm font-semibold text-blue-600 flex items-center gap-1 hover:text-blue-700">
                  <Download size={14} /> Export PDF
                </button>
              </div>

              {logs.map((log) => (
                <Card key={log.id} className={`p-4 border-l-[6px] ${getLogBorderColor(log.value)} hover:shadow-md transition-shadow cursor-pointer`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-2xl font-black text-slate-800 tracking-tight">{log.value} <span className="text-sm font-semibold text-slate-400 tracking-normal">mg/dL</span></span>
                        <StatusPill value={log.value} />
                      </div>
                      <p className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                        {log.mealType}
                      </p>
                      {log.notes && (
                        <p className="text-xs text-slate-500 mt-2 flex items-start gap-1">
                          <FileText size={12} className="mt-0.5 shrink-0" /> {log.notes}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-400">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-xs text-slate-400 mb-2">
                        {new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </p>
                      {log.insulin ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md">
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
              <Card className="p-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Average by Day</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MOCK_WEEKLY_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 12, fill: '#64748B', fontWeight: 600 }} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 12, fill: '#64748B', fontWeight: 600 }}
                      />
                      <Tooltip 
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                      />
                      <Bar dataKey="avg" radius={[6, 6, 0, 0]} maxBarSize={40}>
                         {MOCK_WEEKLY_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getChartColor(entry.avg)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                 <Card className="bg-green-50 border-green-100">
                  <p className="text-xs font-bold text-green-600 uppercase mb-1">Time in Range</p>
                  <p className="text-2xl font-black text-green-700">72%</p>
                  <p className="text-xs text-green-600 font-medium mt-1">↑ 5% from last week</p>
                 </Card>
                 <Card className="bg-blue-50 border-blue-100">
                  <p className="text-xs font-bold text-blue-600 uppercase mb-1">Est. HbA1c</p>
                  <p className="text-2xl font-black text-blue-700">6.1%</p>
                  <p className="text-xs text-blue-600 font-medium mt-1">On target</p>
                 </Card>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Add Log Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-slate-900/40 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 300 }}
              className="bg-white rounded-[32px] w-full max-w-md p-6 shadow-2xl relative"
            >
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-200 rounded-full sm:hidden"></div>
              
              <div className="flex justify-between items-center mb-6 mt-2">
                <h2 className="text-xl font-bold text-slate-800">Add Log</h2>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 font-bold p-2 bg-slate-100 rounded-full">
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveLog} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">Glucose Level</label>
                  <div className="relative flex items-center">
                    <input 
                      type="number" 
                      value={newValue}
                      onChange={e => setNewValue(e.target.value)}
                      className="w-full text-5xl font-black text-slate-800 bg-slate-50 border-2 border-slate-100 rounded-2xl py-6 px-4 pr-20 focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="0"
                      required
                      autoFocus
                    />
                    <span className="absolute right-6 text-xl font-bold text-slate-400">mg/dL</span>
                  </div>
                </div>

                <div>
                   <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">Meal Timer</label>
                   <div className="flex gap-2 overflow-x-auto pb-2 snap-x no-scrollbar shrink-0">
                    {['Fasting', 'Before Meal', 'After Meal', 'Snack', 'Bedtime'].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setNewMealType(type)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap snap-start transition-colors ${
                          newMealType === type
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                   </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wide">Insulin (Units)</label>
                    <span className="font-bold text-purple-600">{newInsulin}U</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="30" 
                    value={newInsulin}
                    onChange={e => setNewInsulin(e.target.value)}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">Notes (Optional)</label>
                  <textarea 
                    value={newNotes}
                    onChange={e => setNewNotes(e.target.value)}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-blue-500 resize-none font-medium text-slate-700"
                    placeholder="E.g., Felt dizzy, ate a donut..."
                    rows={2}
                  ></textarea>
                </div>

                <GradientButton type="submit" fullWidth className="py-4 text-lg">
                  Save Reading
                </GradientButton>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
