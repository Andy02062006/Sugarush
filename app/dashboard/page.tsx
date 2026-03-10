"use client";

import React from 'react';
import { useStore } from '../../store';
import { Avatar } from '../../components/ui/Avatar';
import { XPBar } from '../../components/ui/XPBar';
import { StatusPill } from '../../components/ui/StatusPill';
import { Card } from '../../components/ui/Card';
import { GradientButton } from '../../components/ui/GradientButton';
import { ArrowRight, Plus, Droplet, Activity, Flame, Calendar, CloudRain, Wind, Lightbulb, Trophy, Utensils, Bot, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function DashboardScreen() {
  const { profile, currentReading, logs, xp, streak, badges } = useStore();
  const userName = profile?.name || 'User';
  
  // Calculate stats
  const todayLogs = logs.filter(l => new Date(l.timestamp).toDateString() === new Date().toDateString());
  const avgGlucose = todayLogs.length > 0 
    ? Math.round(todayLogs.reduce((acc, l) => acc + l.value, 0) / todayLogs.length) 
    : currentReading;

  // AI Tip
  const tip = "Walking for 10 minutes after a meal can significantly reduce your blood sugar spike.";

  return (
    <div className="p-4 md:p-8 flex flex-col gap-4 md:gap-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">Hi, {userName}</h1>
          <p className="text-text-secondary font-medium mt-1">Ready to conquer your day?</p>
        </div>
        <div className="animate-float">
          <Avatar fallback={userName} size="lg" />
        </div>
      </header>
      
      <XPBar xp={xp} />

      {/* BENTO GRID CONTAINER */}
      <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-min gap-4 md:gap-6">

      {/* Hero: Current Glucose */}
      <Card noPadding className="bg-primary-gradient border-none shadow-md col-span-1 md:col-span-8 md:row-span-2 flex flex-col justify-between h-full min-h-[300px]">
        <div className="p-6 md:p-8 relative overflow-hidden h-full flex flex-col justify-between">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="flex items-center gap-2 text-slate-300 font-semibold mb-2 uppercase tracking-widest text-[11px]">
                <Droplet size={14} className="fill-current" />
                Latest Reading
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-7xl md:text-8xl font-heading font-black leading-none tracking-tighter text-white">{currentReading}</span>
                <span className="text-lg text-slate-400 font-medium">mg/dL</span>
              </div>
            </div>
            <StatusPill value={currentReading} />
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center relative z-10">
            <span className="text-[13px] font-medium text-slate-300 flex items-center gap-2">
              <Activity size={14} className="text-slate-400" /> Logged 2 hrs ago
            </span>
            <Link href="/glucose">
              <button aria-label="Add new log" className="text-[13px] font-semibold bg-white text-slate-900 px-5 py-2.5 rounded-xl hover:bg-slate-50 transition-colors shadow-sm focus-ring">
                Add Reading
              </button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Avg Today */}
      <Card className="p-5 flex flex-col justify-between gap-4 col-span-1 md:col-span-4 md:row-span-1 h-full min-h-[140px] hover:shadow-md transition-shadow border-slate-200">
        <div className="flex justify-between items-start">
           <Activity size={20} className="text-slate-400" />
           <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Avg Today</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-heading font-black text-slate-900 tracking-tight">{avgGlucose}</span>
          <span className="text-sm font-medium text-slate-500">mg/dL</span>
        </div>
      </Card>
      
      {/* Logs */}
      <Card className="p-5 flex flex-col justify-between gap-4 col-span-1 md:col-span-2 md:row-span-1 h-full min-h-[140px] hover:shadow-md transition-shadow border-slate-200">
        <div className="flex justify-between items-start">
           <Calendar size={20} className="text-slate-400" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Logs</p>
          <span className="text-3xl font-heading font-black text-slate-900 tracking-tight">{todayLogs.length}</span>
        </div>
      </Card>
      
      {/* Streak */}
      <Card className="p-5 flex flex-col justify-between gap-4 col-span-1 md:col-span-2 md:row-span-1 h-full min-h-[140px] hover:shadow-md transition-shadow border-slate-200">
        <div className="flex justify-between items-start">
           <Flame size={20} className="text-amber-500" />
        </div>
        <div>
           <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Streak</p>
           <span className="text-3xl font-heading font-black text-slate-900 tracking-tight">{streak}</span>
        </div>
      </Card>

      {/* Risk Card */}
      <Link href="/risk" className="block outline-none col-span-1 md:col-span-4 h-full" aria-label="View Risk Forecast">
        <Card className="p-5 hover:border-slate-300 hover:shadow-md transition-all group cursor-pointer h-full flex flex-col justify-between bg-white border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <AlertTriangle size={20} className="text-slate-400 group-hover:text-status-green transition-colors" />
            <StatusPill value={0} type="risk" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Risk Forecast</p>
            <p className="text-2xl font-heading font-black text-slate-900 tracking-tight">Low Risk</p>
          </div>
        </Card>
      </Link>
      
      {/* Weather Effect Card */}
      <Card className="p-5 border border-slate-200 bg-white col-span-1 md:col-span-4 h-full flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <CloudRain size={20} className="text-slate-400" />
          <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md tracking-wider">24°C</span>
        </div>
        <div>
           <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Environment</p>
           <p className="text-sm font-medium text-slate-700 leading-snug">Rain expected. Risk of low mobility today.</p>
        </div>
      </Card>

      {/* Daily Tip */}
      <Card className="p-5 border-slate-200 bg-slate-50 col-span-1 md:col-span-4 h-full flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 rounded-bl-full -z-0 opacity-50"></div>
        <div className="flex items-start gap-3 relative z-10 mb-2">
          <Lightbulb size={20} className="text-slate-600 shrink-0 mt-0.5" />
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">AI Insight</h3>
        </div>
        <p className="text-[13px] text-slate-700 font-medium leading-relaxed relative z-10">{tip}</p>
      </Card>

      {/* Recent Badges */}
      <section className="col-span-1 md:col-span-12 pt-4 md:pt-6">
        <div className="flex justify-between items-end mb-4 md:mb-5">
          <h2 className="text-lg font-heading font-black text-slate-900 tracking-tight">Recent Achievements</h2>
          <button className="text-[13px] font-semibold text-slate-500 hover:text-slate-900 focus-ring rounded-md transition-colors">View All</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.filter(b => b.unlockedAt).slice(0, 3).map((badge) => (
             <div key={badge.id} className="bg-white w-full rounded-2xl p-5 border border-slate-200 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-4">
                <Trophy size={20} className="text-slate-400" />
              </div>
              <p className="font-heading font-bold text-[14px] text-slate-800 leading-tight mb-1">{badge.name}</p>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-1">Unlocked</p>
            </div>
          ))}
          
          <div className="bg-slate-50/50 border border-dashed border-slate-300 w-full rounded-2xl p-5 flex flex-col items-center justify-center text-center opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm border border-slate-100">
              <span className="text-slate-400 font-heading font-bold">?</span>
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Next</p>
          </div>
        </div>
      </section>

      {/* Desktop Quick Actions (hidden on mobile since bottom nav covers this) */}
      <div className="hidden md:block col-span-1 md:col-span-12 pt-6">
        <h2 className="text-lg font-heading font-black text-slate-900 tracking-tight mb-5">Quick Actions</h2>
        <div className="grid grid-cols-4 gap-4">
          <Link href="/glucose" aria-label="Log Sugar">
            <div className="bg-white border border-slate-200 rounded-2xl w-full flex flex-col items-center py-6 gap-3 hover:shadow-md transition-shadow cursor-pointer">
              <Plus className="text-slate-900" size={24} />
              <span className="text-[13px] font-bold text-slate-700">Log Sugar</span>
            </div>
          </Link>
          <Link href="/rewards" aria-label="Rewards">
            <div className="bg-white border border-slate-200 rounded-2xl w-full flex flex-col items-center py-6 gap-3 hover:shadow-md transition-shadow cursor-pointer">
              <Trophy size={24} className="text-amber-500" />
              <span className="text-[13px] font-bold text-slate-700">Rewards</span>
            </div>
          </Link>
          <Link href="/chat" aria-label="Ask RushBuddy">
            <div className="bg-white border border-slate-200 rounded-2xl w-full flex flex-col items-center py-6 gap-3 hover:shadow-md transition-shadow cursor-pointer">
              <Bot size={24} className="text-slate-900" />
              <span className="text-[13px] font-bold text-slate-700">Ask Suggy</span>
            </div>
          </Link>
          <Link href="/emergency" aria-label="Emergency">
            <div className="bg-white border border-slate-200 rounded-2xl w-full flex flex-col items-center py-6 gap-3 hover:border-status-red/50 hover:bg-status-red/5 transition-colors cursor-pointer group">
               <AlertTriangle size={24} className="text-status-red group-hover:scale-110 transition-transform" />
              <span className="text-[13px] font-bold text-status-red">Emergency</span>
            </div>
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
}
