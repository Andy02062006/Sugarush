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
  
  if (currentReading > 180 || currentReading < 70) {
    score = 68;
    status = 'High Risk';
    color = '#EF4444';
  } else if (currentReading > 140) {
    score = 35;
    status = 'Moderate';
    color = '#F59E0B';
  }

  const factors = [
    { name: 'Recent Glucose', impact: 45, value: currentReading > 150 ? 'High' : 'Normal', type: 'warning' },
    { name: 'Weather Effect', impact: 20, value: 'Rain (Low Activity)', type: 'danger' },
    { name: 'Meal Timing', impact: 15, value: 'Good', type: 'success' },
    { name: 'Hydration', impact: 10, value: 'Unknown', type: 'neutral' },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Risk Forecast</h1>
          <p className="text-slate-500 font-medium mt-1">AI-powered insights</p>
        </div>
        <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
          <Activity size={20} />
        </div>
      </header>

      {/* Main Score Card */}
      <Card className="flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-white to-slate-50 relative overflow-hidden">
        {/* Background decorative blob */}
        <div 
          className="absolute opacity-10 blur-3xl rounded-full w-64 h-64 -translate-y-1/2 -translate-x-1/2 top-1/2 left-1/2"
          style={{ backgroundColor: color }}
        ></div>

        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 relative z-10">Current Risk Score</h2>
        
        {/* Animated Score Circle */}
        <div className="relative mb-6 z-10">
          <svg className="w-48 h-48 transform -rotate-90">
            <circle
              cx="96" cy="96" r="88"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="12"
            />
            <motion.circle
              cx="96" cy="96" r="88"
              fill="none"
              stroke={color}
              strokeWidth="12"
              strokeDasharray={2 * Math.PI * 88}
              initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - score / 100) }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
             <span className="text-6xl font-black text-slate-800 tracking-tighter">{score}</span>
             <span className="text-sm font-bold text-slate-400">/ 100</span>
          </div>
        </div>

        <div 
          className="px-4 py-1.5 rounded-full text-sm font-bold backdrop-blur-sm shadow-sm relative z-10"
          style={{ backgroundColor: `${color}20`, color: color }}
        >
          {status}
        </div>
      </Card>

      {/* Factor Breakdown */}
      <div>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
          <AlertTriangle size={16} className="text-amber-500" />
          Contributing Factors
        </h3>
        <div className="space-y-3">
          {factors.map((factor, i) => (
            <Card key={i} className="p-4 flex items-center gap-4 hover:border-slate-300 transition-colors">
               <div className="flex-1">
                 <div className="flex justify-between items-center w-full mb-2">
                   <p className="font-bold text-slate-700">{factor.name}</p>
                   <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                     factor.type === 'success' ? 'bg-green-100 text-green-700' :
                     factor.type === 'warning' ? 'bg-amber-100 text-amber-700' :
                     factor.type === 'danger' ? 'bg-red-100 text-red-700' :
                     'bg-slate-100 text-slate-600'
                   }`}>
                     {factor.value}
                   </span>
                 </div>
                 {/* Progress Bar */}
                 <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${factor.impact}%` }}
                     transition={{ duration: 1, delay: 0.2 + (i * 0.1) }}
                     className="h-full rounded-full"
                     style={{ 
                       backgroundColor: 
                        factor.type === 'success' ? '#22C55E' :
                        factor.type === 'warning' ? '#F59E0B' :
                        factor.type === 'danger' ? '#EF4444' : '#94A3B8'
                     }}
                   />
                 </div>
               </div>
            </Card>
          ))}
        </div>
      </div>

      <Card className="bg-blue-50 border-blue-100 p-5 mt-8">
        <div className="flex items-start gap-4">
          <div className="text-blue-500 mt-0.5"><Info size={24} /></div>
          <div>
            <h4 className="font-bold text-blue-900 mb-1">How is this calculated?</h4>
            <p className="text-sm text-blue-800/80 leading-relaxed font-medium">
              We use a simulated ML model analyzing your historical glucose variability, expected meal patterns, local weather (which impacts natural mobility), and time-in-range.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
