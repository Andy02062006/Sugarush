"use client";

import React from 'react';
import { Card } from '../../components/ui/Card';
import { GradientButton } from '../../components/ui/GradientButton';
import { Activity, AlertTriangle, CloudRain, ShieldCheck, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../../store';

export default function RiskScreen() {
  const { currentReading } = useStore();
  
  // Calculate mock risk based on glucose
  let score = 12; // Base
  let status = 'Low Risk';
  let color = '#22C55E';
  
  if (currentReading !== null) {
    if (currentReading > 180 || currentReading < 70) {
      score = 68;
      status = 'High Risk';
      color = '#EF4444';
    } else if (currentReading > 140) {
      score = 35;
      status = 'Moderate';
      color = '#E07A3A';
    }
  } else {
    status = 'Unknown';
    color = '#94A3B8';
    score = 0;
  }

  const factors = [
    { name: 'Recent Glucose', impact: 45, value: (currentReading !== null && currentReading > 150) ? 'High' : (currentReading === null ? 'Unknown' : 'Normal'), type: currentReading === null ? 'neutral' : 'warning' },
    { name: 'Weather Effect', impact: 20, value: 'Rain (Low Activity)', type: 'danger' },
    { name: 'Meal Timing', impact: 15, value: 'Good', type: 'success' },
    { name: 'Hydration', impact: 10, value: 'Unknown', type: 'neutral' },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 pb-24 md:pb-8">
      
      <header className="mb-6 relative mt-2">
        <div className="flex justify-between items-end relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-500 rounded-md text-[11px] font-bold uppercase tracking-widest mb-4">
              <Activity size={12} /> Forecast
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-black text-slate-900 tracking-tight leading-none">Risk <span className="text-slate-400">Analysis</span></h1>
          </div>
        </div>
      </header>

      {/* Main Score Card */}
      <Card className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col md:flex-row items-center gap-8 md:gap-12 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.03] blur-3xl transform translate-x-1/3 -translate-y-1/3 rounded-full pointer-events-none" style={{ backgroundColor: color }}></div>
        
        {/* Sleek Score Circle */}
        <div className="relative shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 224 224" className="w-48 h-48 md:w-56 md:h-56 transform -rotate-90 relative z-10">
            <circle
              cx="112" cy="112" r="100"
              fill="none"
              stroke="#F1F5F9"
              strokeWidth="12"
            />
            <motion.circle
              cx="112" cy="112" r="100"
              fill="none"
              stroke={color}
              strokeWidth="12"
              strokeDasharray={2 * Math.PI * 100}
              initial={{ strokeDashoffset: 2 * Math.PI * 100 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 100 * (1 - score / 100) }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
             <span className="text-5xl md:text-6xl font-heading font-black text-slate-900 tracking-tighter leading-none">{score}</span>
             <span className="font-bold text-slate-400 uppercase tracking-widest text-[11px] mt-2">Score</span>
          </div>
        </div>

        <div className="flex-1 text-center md:text-left z-10">
          <div 
            className="inline-block px-4 py-1.5 rounded-md text-[13px] font-black uppercase tracking-wider mb-4"
            style={{ backgroundColor: `${color}15`, color: color }}
          >
            {status}
          </div>
          <p className="text-slate-500 text-[15px] font-medium leading-relaxed max-w-md">
            Based on recent events, your glucose variability indicates a {status.toLowerCase()} for the upcoming hours. Focus on maintaining steady behaviors.
          </p>
        </div>
      </Card>

      {/* Factors */}
      <div>
        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 mt-8">Contributing Factors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {factors.map((factor, i) => (
            <Card key={i} className="p-5 bg-white border border-slate-200 shadow-sm rounded-2xl flex flex-col justify-center transition-shadow hover:shadow-md cursor-pointer group">
               <div className="flex justify-between items-center w-full mb-3">
                 <p className="font-bold text-[14px] text-slate-900">{factor.name}</p>
                 <span className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                   factor.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' :
                   factor.type === 'warning' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                   factor.type === 'danger' ? 'bg-red-50 text-red-600 border border-red-100' :
                   'bg-slate-50 text-slate-500 border border-slate-200'
                 }`}>
                   {factor.value}
                 </span>
               </div>
               
               {/* Progress Bar */}
               <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${factor.impact}%` }}
                   transition={{ duration: 1, delay: 0.2 + (i * 0.1) }}
                   className="h-full rounded-full"
                   style={{ 
                     backgroundColor: 
                      factor.type === 'success' ? '#16A34A' :
                      factor.type === 'warning' ? '#EA580C' :
                      factor.type === 'danger' ? '#DC2626' : '#94A3B8'
                   }}
                 />
               </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Info Card */}
      <Card className="bg-slate-50 border border-slate-200 p-6 rounded-2xl mt-4 shadow-sm flex items-start gap-4">
        <div className="text-slate-400 mt-0.5"><Info size={20} /></div>
        <div>
          <h4 className="font-bold text-[13px] text-slate-900 uppercase tracking-widest mb-1">How is this calculated?</h4>
          <p className="text-[14px] text-slate-500 leading-relaxed font-medium">
            We use a simulated ML model analyzing your historical glucose variability, expected meal patterns, local weather (which impacts natural mobility), and time-in-range.
          </p>
        </div>
      </Card>
    </div>
  );
}
