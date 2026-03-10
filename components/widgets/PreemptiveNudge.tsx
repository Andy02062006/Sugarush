"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, MapPin, Wind, ThermometerSun, X, ArrowRight, Activity } from 'lucide-react';
import { useContextualRisk } from '../../hooks/useContextualRisk';
import Link from 'next/link';

export function PreemptiveNudge() {
  const { nudge, env, toggleEnvironmentSimulation } = useContextualRisk();
  const [dismissed, setDismissed] = React.useState(false);

  // If user dismissed it or there's no actionable risk, don't show the banner
  if (dismissed || !nudge) return (
    <div className="flex justify-end mb-2">
      <button 
        onClick={toggleEnvironmentSimulation}
        className="text-[10px] uppercase tracking-widest font-bold text-slate-400 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors"
      >
        Toggle Weather Sim
      </button>
    </div>
  );

  const isCritical = nudge.severity === 'critical';
  const isHigh = nudge.severity === 'high';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, height: 0 }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={{ opacity: 0, y: -20, height: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="mb-6 overflow-hidden"
      >
        <div className={`relative p-5 md:p-6 rounded-3xl border shadow-sm flex flex-col md:flex-row gap-5 items-start md:items-center ${
          isCritical 
            ? 'bg-red-50 border-red-200' 
            : isHigh 
              ? 'bg-orange-50 border-orange-200' 
              : 'bg-indigo-50 border-indigo-200'
        }`}>
          
          {/* Close button */}
          <button 
            onClick={() => setDismissed(true)}
            className={`absolute top-4 right-4 p-1.5 rounded-full backdrop-blur-sm transition-colors ${
               isCritical ? 'text-red-400 hover:bg-red-100' : 'text-slate-400 hover:bg-slate-100'
            }`}
          >
            <X size={16} />
          </button>

          {/* Icon Context */}
          <div className="shrink-0 flex gap-2">
             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
               isCritical ? 'bg-red-500 text-white shadow-red-500/30' : 
               isHigh ? 'bg-orange-500 text-white shadow-orange-500/30' : 
               'bg-indigo-500 text-white shadow-indigo-500/30'
             }`}>
                {isCritical ? <AlertTriangle size={24} /> : <Activity size={24} />}
             </div>
          </div>

          {/* Content */}
          <div className="flex-1 pr-6 md:pr-0">
             <div className="flex items-center gap-3 mb-1.5 flex-wrap">
               <h3 className={`text-[16px] font-heading font-black leading-none ${
                 isCritical ? 'text-red-950' : isHigh ? 'text-orange-950' : 'text-indigo-950'
               }`}>
                 {nudge.title}
               </h3>
               
               {/* Environmental Context Chips */}
               <div className="flex items-center gap-1.5 opacity-80">
                 <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    isCritical ? 'bg-red-100/50 text-red-800' : 'bg-orange-100/50 text-orange-800'
                 }`}>
                   <ThermometerSun size={10} /> {env.temperature}°C
                 </span>
                 <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    isCritical ? 'bg-red-100/50 text-red-800' : 'bg-indigo-100/50 text-indigo-800'
                 }`}>
                   <Wind size={10} /> {env.humidity}% Humid
                 </span>
               </div>
             </div>

             <p className={`text-[14px] font-semibold leading-relaxed mb-4 ${
               isCritical ? 'text-red-800' : isHigh ? 'text-orange-800' : 'text-indigo-800'
             }`}>
               {nudge.message}
             </p>

             {/* Action Button */}
             {nudge.actionText && nudge.actionUrl && (
               <div className="flex items-center gap-4">
                 <Link href={nudge.actionUrl} className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 focus-ring ${
                    isCritical 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : isHigh 
                        ? 'bg-orange-600 hover:bg-orange-700 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                 }`}>
                   {nudge.actionText} <ArrowRight size={14} />
                 </Link>
               </div>
             )}
          </div>

          {/* Developer Tool: Force Trigger Toggle (Absolute positioned for testing) */}
          <div className="absolute bottom-4 right-4">
             <button 
                onClick={toggleEnvironmentSimulation}
                className="text-[10px] uppercase tracking-widest font-bold text-slate-400 hover:text-slate-600 transition-colors"
              >
                Toggle Sim
              </button>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
