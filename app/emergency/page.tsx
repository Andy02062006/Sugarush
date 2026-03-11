"use client";

import React, { useEffect } from 'react';
import { useStore } from '../../store';
import { Card } from '../../components/ui/Card';
import { Phone, AlertTriangle, User, Activity, Clock, HeartPulse, Info } from 'lucide-react';
import { motion } from 'framer-motion';

import { useSession } from 'next-auth/react';

export default function EmergencyScreen() {
  const { profile, currentReading } = useStore();
  const { data: session } = useSession();

  useEffect(() => {
    // Auto-read on load so visually impaired/shaky users know they're on the right screen
    const utterance = new SpeechSynthesisUtterance("Emergency screen. Tap the large red button to call for help.");
    window.speechSynthesis.speak(utterance);
  }, []);

  const getGlucoseStatus = () => {
    if (currentReading < 70) return { alert: 'SEVERE HYPOGLYCEMIA', color: 'text-red-700', bg: 'bg-red-50', advise: 'Needs fast-acting carbs immediately (15g).' };
    if (currentReading > 250) return { alert: 'SEVERE HYPERGLYCEMIA', color: 'text-orange-700', bg: 'bg-orange-50', advise: 'Monitor for DKA. Seek medical attention if vomiting.' };
    return { alert: 'ABNORMAL GLUCOSE', color: 'text-amber-700', bg: 'bg-amber-50', advise: 'Monitor closely.' };
  };

  const status = getGlucoseStatus();

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex flex-col pt-8 md:pt-12">
      
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-4 shadow-sm">
          <AlertTriangle size={24} />
        </div>
        <h1 className="text-3xl font-heading font-black text-slate-900 tracking-tight">Emergency Aid</h1>
        <p className="text-slate-500 font-medium text-[15px] mt-2 max-w-sm mx-auto">
          Share this screen with first responders or bystanders if you need assistance.
        </p>
      </div>

      {/* Main Call Button */}
      <div className="flex justify-center mb-12">
        <div className="relative">
          <div className="absolute inset-0 bg-red-500 rounded-full opacity-10 animate-pulse-ring"></div>
          <div className="absolute inset-4 bg-red-500 rounded-full opacity-20 animate-pulse-ring" style={{ animationDelay: '0.5s' }}></div>
          <a
            href="tel:108" // Replace with local emergency number
            className="relative flex flex-col items-center justify-center w-40 h-40 bg-red-600 rounded-full text-white shadow-xl hover:scale-105 transition-transform border-4 border-white active:scale-95 focus-ring"
          >
            <Phone size={36} className="fill-current mb-1" />
            <span className="text-[22px] font-heading font-black tracking-widest mt-1">CALL 108</span>
            <span className="text-[10px] font-bold text-red-100 mt-1 uppercase tracking-widest">Ambulance</span>
          </a>
        </div>
      </div>

      {/* Physical Medical ID Card Simulation */}
      <div className="relative w-full max-w-md mx-auto bg-white rounded-2xl shadow-md border border-slate-200 flex flex-col mb-8 transform hover:-translate-y-1 transition-transform duration-300">
        {/* Red Header Bar */}
        <div className="bg-red-600 text-white px-5 py-3 rounded-t-2xl flex justify-between items-center shrink-0">
           <div className="flex items-center gap-2">
             <AlertTriangle size={16} />
             <span className="font-heading font-black tracking-widest text-[16px]">MEDICAL ID</span>
           </div>
           <span className="text-[10px] font-bold opacity-90 uppercase tracking-widest">Emergency Responder Use</span>
        </div>

        <div className="flex-1 p-5 flex gap-4 md:gap-5 bg-white relative">
           
           {/* Profile Picture Placeholder */}
           <div className="w-20 md:w-24 h-24 md:h-28 rounded-[12px] border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0 z-10 overflow-hidden relative">
             <User size={36} className="text-slate-300" />
           </div>

           {/* Details */}
           <div className="flex-1 z-10 flex flex-col justify-between py-1">
             <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Patient Name</p>
               <p className="text-xl md:text-2xl font-heading font-black text-slate-900 leading-none mb-4 break-words tracking-tight">
                 {session?.user?.name || profile?.name || 'JOHN DOE'}
               </p>
               
               <div className="grid grid-cols-2 gap-x-2 gap-y-4">
                 <div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Condition</p>
                   <p className="text-[13px] font-black text-slate-700 leading-none">{profile?.diabetesType || 'T1D'}</p>
                 </div>
                 <div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Age</p>
                   <p className="text-[13px] font-black text-slate-700 leading-none">{profile?.age || '--'}</p>
                 </div>
                 <div className="col-span-2">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Current Status</p>
                   <div className={`inline-flex px-2 py-1 rounded-[6px] text-[11px] font-bold ${status.bg} ${status.color} border border-current/20`}>
                     {status.alert} ({currentReading})
                   </div>
                 </div>
               </div>
             </div>
           </div>
        </div>

        {/* Barcode Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 rounded-b-2xl flex justify-between items-center shrink-0">
          <div className="flex gap-[2px] opacity-70 h-6 items-end">
             {/* Fake barcode lines */}
             {[1,3,1,2,4,1,2,3,1,1,2,1,4,1,2,1,3,2,1,1,2,1].map((w, i) => (
                <div key={i} className="bg-slate-900" style={{ width: `${w * 1.5}px`, height: '100%' }}></div>
             ))}
          </div>
          <p className="text-[10px] font-mono font-bold text-slate-500 tracking-widest">{currentReading || 0}MG-DL-STAT</p>
        </div>
      </div>

      {(currentReading < 70 || currentReading > 250) && (
        <motion.div 
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md max-w-md mx-auto w-full mb-8"
        >
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Info size={16} className="text-amber-500" /> Action Required
          </h3>
          <p className="font-heading font-black text-xl leading-snug mb-4 text-white">
            {status.advise}
          </p>
          {currentReading < 70 && (
            <ul className="text-[13px] font-medium text-slate-300 space-y-2 list-disc pl-4 marker:text-slate-500">
              <li>Check if patient is conscious.</li>
              <li>If conscious, give fruit juice or regular soda (not diet).</li>
              <li>If unconscious, DO NOT force feed. Administer glucagon or call ambulance.</li>
            </ul>
          )}
        </motion.div>
      )}
      
    </div>
  );
}
