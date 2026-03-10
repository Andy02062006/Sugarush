"use client";

import React, { useEffect } from 'react';
import { useStore } from '../../store';
import { Card } from '../../components/ui/Card';
import { Phone, AlertTriangle, User, Activity, Clock, HeartPulse } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EmergencyScreen() {
  const { profile, currentReading } = useStore();

  useEffect(() => {
    // Auto-read on load so visually impaired/shaky users know they're on the right screen
    const utterance = new SpeechSynthesisUtterance("Emergency screen. Tap the large red button to call for help.");
    window.speechSynthesis.speak(utterance);
  }, []);

  const getGlucoseStatus = () => {
    if (currentReading < 70) return { alert: 'SEVERE HYPOGLYCEMIA', color: 'text-blue-600', bg: 'bg-blue-100', advise: 'Needs fast-acting carbs immediately (15g).' };
    if (currentReading > 250) return { alert: 'SEVERE HYPERGLYCEMIA', color: 'text-red-600', bg: 'bg-red-100', advise: 'Monitor for DKA. Seek medical attention if vomiting.' };
    return { alert: 'ABNORMAL GLUCOSE', color: 'text-amber-600', bg: 'bg-amber-100', advise: 'Monitor closely.' };
  };

  const status = getGlucoseStatus();

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex flex-col pt-12">
      
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4 shadow-sm">
          <AlertTriangle size={32} />
        </div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Emergency Aid</h1>
        <p className="text-slate-500 font-medium mt-2 max-w-sm mx-auto">
          Share this screen with first responders or bystanders if you need assistance.
        </p>
      </div>

      {/* Main Call Button */}
      <div className="flex justify-center mb-12">
        <div className="relative">
          <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20"></div>
          <div className="absolute inset-2 bg-red-500 rounded-full animate-ping opacity-40 delay-75"></div>
          <a
            href="tel:108" // Replace with local emergency number
            className="relative flex flex-col items-center justify-center w-48 h-48 bg-gradient-to-br from-red-500 to-red-600 rounded-full text-white shadow-2xl hover:scale-105 transition-transform border-[6px] border-white active:scale-95"
          >
            <Phone size={48} className="fill-current mb-2" />
            <span className="text-2xl font-black tracking-widest">CALL 108</span>
            <span className="text-xs font-bold text-red-200 mt-1 uppercase tracking-widest">Ambulance</span>
          </a>
        </div>
      </div>

      {/* Medical ID Card */}
      <Card className="border-2 border-red-100 shadow-md relative overflow-hidden flex-1 shrink-0 bg-white">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <HeartPulse size={120} />
        </div>
        
        <h2 className="text-sm font-black text-red-600 uppercase tracking-widest mb-6 border-b border-red-50 pb-3 flex items-center gap-2">
           MEDICAL ID
        </h2>

        <div className="space-y-6 relative z-10">
          
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
               <User size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Patient Name</p>
              <p className="text-xl font-black text-slate-800">{profile?.name || 'Unknown'}</p>
              <p className="text-sm font-bold text-blue-600 mt-1">{profile?.diabetesType || 'Diabetic'} • Age {profile?.age || '--'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
               <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1"><Activity size={14}/> Last Reading</p>
               <p className="text-2xl font-black tracking-tighter text-slate-800">{currentReading} <span className="text-sm tracking-normal text-slate-400 font-semibold">mg/dL</span></p>
             </div>
             <div className={`${status.bg} p-4 rounded-xl border border-transparent`}>
               <p className={`text-xs font-bold uppercase tracking-wide mb-1 flex items-center gap-1 ${status.color}`}><Clock size={14}/> Status</p>
               <p className={`font-black text-sm leading-tight ${status.color}`}>{status.alert}</p>
             </div>
          </div>

          {(currentReading < 70 || currentReading > 250) && (
            <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-slate-900 rounded-xl p-4 text-white shadow-lg"
            >
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide mb-2">First Responder Instructions</h3>
              <p className="font-semibold text-lg leading-snug">{status.advise}</p>
              {currentReading < 70 && (
                <ul className="text-sm text-slate-300 mt-3 space-y-1 list-disc pl-4 marker:text-blue-500">
                  <li>Check if patient is conscious.</li>
                  <li>If conscious, give fruit juice or regular soda (not diet).</li>
                  <li>If unconscious, DO NOT force feed. Administer glucagon or call ambulance.</li>
                </ul>
              )}
            </motion.div>
          )}

        </div>
      </Card>
      
    </div>
  );
}
