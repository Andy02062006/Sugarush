"use client";

import React from 'react';
import { useStore } from '../../store';
import { Avatar } from '../../components/ui/Avatar';
import { XPBar } from '../../components/ui/XPBar';
import { StatusPill } from '../../components/ui/StatusPill';
import { Card } from '../../components/ui/Card';
import { GradientButton } from '../../components/ui/GradientButton';
import { ArrowRight, Plus, Droplet, Activity, Flame, Calendar, CloudRain, Wind } from 'lucide-react';
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
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <header className="flex justify-between items-start mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Hi, {userName} 👋</h1>
          <p className="text-slate-500 font-medium mt-1">Ready to conquer your day?</p>
        </div>
        <Avatar fallback={userName} size="lg" />
      </header>
      
      <XPBar xp={xp} />

      {/* Hero: Current Glucose */}
      <Card noPadding className="bg-primary-gradient text-white border-none shadow-lg shadow-blue-500/20">
        <div className="p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="flex items-center gap-2 text-blue-100 font-semibold mb-1 uppercase tracking-wider text-xs">
                <Droplet size={14} className="fill-current" />
                Latest Reading
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black tracking-tighter">{currentReading}</span>
                <span className="text-xl text-blue-100 font-semibold">mg/dL</span>
              </div>
            </div>
            <StatusPill value={currentReading} />
          </div>
          
          <div className="mt-6 pt-4 border-t border-white/20 flex justify-between items-center relative z-10">
            <span className="text-sm font-medium text-blue-50 bg-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2">
              <Plus size={14} /> Logged 2 hrs ago
            </span>
            <Link href="/glucose">
              <button className="text-sm font-bold bg-white text-blue-600 px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors shadow-sm">
                Add New
              </button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 flex flex-col items-center justify-center text-center gap-2">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><Activity size={20} /></div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Avg Today</p>
            <p className="text-xl font-bold text-slate-800">{avgGlucose}</p>
          </div>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center text-center gap-2">
          <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center"><Calendar size={20} /></div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Logs</p>
            <p className="text-xl font-bold text-slate-800">{todayLogs.length}</p>
          </div>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center text-center gap-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-12 h-12 bg-orange-100/50 rounded-bl-full"></div>
          <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center relative z-10"><Flame size={20} className="fill-current" /></div>
          <div className="relative z-10">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Streak</p>
            <p className="text-xl font-bold text-slate-800">{streak} Days</p>
          </div>
        </Card>
      </div>

      {/* Contextual Insights */}
      <div className="grid grid-cols-2 gap-3">
        {/* Risk Card */}
        <Link href="/risk" className="block outline-none">
          <Card className="p-4 hover:border-purple-300 transition-colors group cursor-pointer h-full border border-purple-100 bg-gradient-to-br from-white to-purple-50/50">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 bg-purple-100 rounded-lg text-purple-700">
                <Activity size={18} />
              </div>
              <StatusPill value={0} type="risk" />
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Risk Forecast</p>
            <p className="text-xl font-bold text-slate-800 group-hover:text-purple-700 transition-colors">Low Risk</p>
            <p className="text-xs text-slate-500 mt-2 font-medium">Click to see AI breakdown</p>
          </Card>
        </Link>
        
        {/* Weather Effect Card */}
        <Card className="p-4 h-full border border-sky-100 bg-gradient-to-br from-white to-sky-50/50">
          <div className="flex justify-between items-start mb-3">
            <div className="p-2 bg-sky-100 rounded-lg text-sky-700">
              <CloudRain size={18} />
            </div>
            <span className="text-xs font-bold text-sky-700 bg-sky-100 px-2 py-1 rounded-md">24°C</span>
          </div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Environment</p>
          <p className="text-[13px] font-semibold text-slate-800 leading-snug">Rain expected. Risk of low mobility today.</p>
        </Card>
      </div>

      {/* Daily Tip */}
      <Card className="p-0 border-yellow-200 overflow-hidden bg-[#FEFce8]">
        <div className="p-4 flex items-start gap-4">
          <div className="text-4xl text-yellow-500 leading-none">💡</div>
          <div>
            <h3 className="font-bold text-yellow-900 mb-1">RushBuddy Tip</h3>
            <p className="text-sm text-yellow-800 font-medium leading-relaxed">{tip}</p>
          </div>
        </div>
      </Card>

      {/* Recent Badges */}
      <section className="pt-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-800">Recent Achievements</h2>
          <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">View All</button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-4 snap-x no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          {badges.filter(b => b.unlockedAt).slice(0, 3).map((badge) => (
            <div key={badge.id} className="snap-start shrink-0 w-32 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-3">
                <span className="text-2xl">🏆</span>
              </div>
              <p className="font-bold text-sm text-slate-800 leading-tight mb-1">{badge.name}</p>
              <p className="text-[10px] text-slate-500 font-medium">Unlocked</p>
            </div>
          ))}
          
          <div className="snap-start shrink-0 w-32 border-2 border-dashed border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center opacity-70">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mb-2">
              <span className="text-slate-400 font-bold">?</span>
            </div>
            <p className="font-bold text-xs text-slate-400 leading-tight">Next Badge</p>
          </div>
        </div>
      </section>

      {/* Desktop Quick Actions (hidden on mobile since bottom nav covers this) */}
      <div className="hidden md:block pt-4">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-4 gap-4">
          <Link href="/glucose">
            <GradientButton variant="secondary" className="w-full flex-col py-6 gap-3">
              <Plus className="text-blue-500" />
              <span>Log Sugar</span>
            </GradientButton>
          </Link>
          <Link href="/food">
            <GradientButton variant="secondary" className="w-full flex-col py-6 gap-3">
              <span className="text-2xl block">🍽️</span>
              <span>Recipes</span>
            </GradientButton>
          </Link>
          <Link href="/chat">
            <GradientButton variant="secondary" className="w-full flex-col py-6 gap-3">
              <span className="text-2xl block">🤖</span>
              <span>Ask Suggy</span>
            </GradientButton>
          </Link>
          <Link href="/emergency">
            <GradientButton variant="outline" className="w-full flex-col py-6 gap-3 border-red-200 text-red-600 hover:bg-red-50">
               <span className="text-2xl block">🚨</span>
              <span>Emergency</span>
            </GradientButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
