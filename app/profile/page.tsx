"use client";

import React, { useState, useEffect } from 'react';
import { useStore } from '../../store';
import { Card } from '../../components/ui/Card';
import { User, Mail, Activity, Calendar, Trophy, Flame } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function ProfileScreen() {
  const { profile, xp, streak } = useStore();
  const { data: session, update: updateSession } = useSession();
  const [userName, setUserName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const email = session?.user?.email || 'demo@sugarush.com';

  useEffect(() => {
    if (session?.user?.name && !isEditing && !isSaving) {
      setUserName(session.user.name);
    }
  }, [session?.user?.name, isEditing, isSaving]);

  const handleSaveName = async () => {
    if (!userName.trim() || userName === session?.user?.name) {
      setIsEditing(false);
      return;
    }
    
    setIsSaving(true);
    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: userName }),
      });
      if (res.ok) {
        // Force the NextAuth session hook to refresh 
        await updateSession();
        // Force the Zustand global store to reflect the name change instantly
        useStore.setState(state => ({
          profile: state.profile ? { ...state.profile, name: userName } : null
        }));
      }
    } catch(e) {
      console.error(e);
    } finally {
      setIsEditing(false);
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-3xl mx-auto animate-in fade-in duration-500">
      <header className="mb-8 relative mt-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-500 rounded-md text-[11px] font-bold uppercase tracking-widest mb-4">
          <User size={12} /> Account
        </div>
        <h1 className="text-4xl md:text-5xl font-heading font-black text-slate-900 tracking-tight leading-none">Your <span className="text-slate-400">Profile</span></h1>
      </header>

      <Card className="p-6 md:p-8 bg-white border border-slate-200 shadow-sm rounded-2xl flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
        <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 border-4 border-white shadow-sm shrink-0">
          <User size={48} />
        </div>
        
        <div className="flex-1 space-y-2 w-full">
          <div className="flex items-center justify-center md:justify-start gap-3">
            {isEditing ? (
              <input
                type="text"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                onBlur={handleSaveName}
                onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                disabled={isSaving}
                autoFocus
                className="text-3xl font-heading font-black text-slate-900 border-b-2 border-teal-primary outline-none bg-transparent w-full max-w-[200px]"
              />
            ) : (
              <h2 className="text-3xl font-heading font-black text-slate-900">{userName}</h2>
            )}
            
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)} 
                className="text-xs font-bold text-slate-400 hover:text-teal-primary transition-colors bg-slate-100 hover:bg-teal-50 px-2 py-1 rounded-md"
              >
                Edit
              </button>
            )}
          </div>
          
          <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2">
            <Mail size={16}/> {email}
          </p>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-4 border-t border-slate-100 w-full">
            <div className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl flex flex-col gap-1 items-center md:items-start">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none flex items-center gap-1.5"><Trophy size={12}/> XP</p>
              <p className="text-xl font-heading font-black text-slate-900">{xp}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl flex flex-col gap-1 items-center md:items-start">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none flex items-center gap-1.5"><Flame size={12}/> Streak</p>
              <p className="text-xl font-heading font-black text-slate-900">{streak} Days</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl flex flex-col gap-1 items-center md:items-start">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none flex items-center gap-1.5"><Activity size={12}/> Type</p>
              <p className="text-[15px] mt-1 font-bold text-slate-900">{profile?.diabetesType || 'N/A'}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl flex flex-col gap-1 items-center md:items-start">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none flex items-center gap-1.5"><Calendar size={12}/> Target</p>
              <p className="text-[15px] mt-1 font-bold text-slate-900">{profile?.targetRangeMin}-{profile?.targetRangeMax}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
