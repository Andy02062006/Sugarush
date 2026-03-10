"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { useStore } from '../../store'; // We keep this strictly to read badges configuration, not XP
import { MOCK_REWARDS, Reward } from '../../lib/mocks';
import { 
  Trophy, Flame, Gift, Star, ChevronRight, 
  MapPin, CheckCircle, Shield, Target, Award,
  Lock, ShoppingCart, Pill, PhoneCall
} from 'lucide-react';
import Confetti from 'react-dom-confetti';
import { GamificationState } from './api/db';

const ICONS = {
  Pill: Pill,
  PhoneCall: PhoneCall,
  ShoppingCart: ShoppingCart,
  Star: Star,
  Footprints: Target, // Fallbacks for badge icons
  Flame: Flame,
  Target: Target,
  Award: Award,
  ChefHat: Award
};

export default function RewardsScreen() {
  const { badges } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'rewards'>('overview');
  
  // Localized API State
  const [gameState, setGameState] = useState<GamificationState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Confetti state
  const [showConfetti, setShowConfetti] = useState(false);

  // Fetch gamification profile securely from local API
  useEffect(() => {
    fetch('/rewards/api')
      .then(res => res.json())
      .then(data => {
        setGameState(data);
        setIsLoading(false);
      })
      .catch(e => {
        console.error("Failed to fetch gamification state:", e);
        setIsLoading(false);
      });
  }, []);

  const xp = gameState?.xp || 0;
  const streak = gameState?.streak || 0;
  const redeemedRewards = gameState?.redeemedRewards || [];

  const level = Math.floor(xp / 1000) + 1;
  const currentLevelXP = xp % 1000;
  const nextLevelXP = 1000;
  const progressPercent = Math.min((currentLevelXP / nextLevelXP) * 100, 100);

  const handleRedeem = async (reward: Reward) => {
    try {
      const res = await fetch('/rewards/api/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rewardId: reward.id })
      });

      if (res.ok) {
        const data = await res.json();
        setGameState(data.gamification);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      } else {
        console.error("Redemption failed securely on backend");
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center h-full min-h-[50vh]">
         <div className="text-slate-400 font-bold uppercase tracking-widest text-[13px] animate-pulse flex items-center gap-2">
            <Trophy size={16} /> Loading Gamification Profile...
         </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500 overflow-x-hidden">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50">
         <Confetti active={showConfetti} config={{ elementCount: 150, spread: 100, colors: ['#A020F0', '#FFD700', '#00FF00', '#FF4500'] }} />
      </div>

      <header className="mb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-500 rounded-md text-[11px] font-bold uppercase tracking-widest mb-4">
          <Trophy size={12} /> Gamification
        </div>
        <h1 className="text-4xl md:text-5xl font-heading font-black text-slate-900 tracking-tight leading-none">
          Rewards <span className="text-slate-400">&</span> XP
        </h1>
        <p className="text-[14px] text-slate-500 font-medium mt-2">
          Earn XP for healthy habits and redeem them for exclusive offers.
        </p>
      </header>

      {/* Tabs */}
      <div className="flex bg-slate-50/50 p-1 rounded-[14px] border border-slate-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[13px] font-bold rounded-[10px] transition-all focus-ring ${
            activeTab === 'overview'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
          }`}
        >
          <Target size={14} /> My Progress
        </button>
        <button
          onClick={() => setActiveTab('rewards')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[13px] font-bold rounded-[10px] transition-all focus-ring ${
            activeTab === 'rewards'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
          }`}
        >
          <Gift size={14} /> Redeem Store
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Level Hub Card */}
              <Card className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden border border-slate-800 shadow-lg">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
                  <div className="flex-1 w-full text-center md:text-left">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">Current Tier</p>
                    <div className="flex items-end justify-center md:justify-start gap-3 mb-6">
                      <h2 className="text-6xl md:text-7xl font-heading font-black tracking-tight leading-none text-white">
                        Lv.{level}
                      </h2>
                      <span className="text-lg font-bold text-slate-400 mb-1">{xp} XP Total</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2 w-full max-w-sm mx-auto md:mx-0">
                      <div className="flex justify-between text-[13px] font-bold text-slate-300">
                        <span>{currentLevelXP} XP</span>
                        <span>{nextLevelXP} XP</span>
                      </div>
                      <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-indigo-500 rounded-full box-shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider text-right">
                        {nextLevelXP - currentLevelXP} XP to Lv.{level + 1}
                      </p>
                    </div>
                  </div>

                  {/* Streak widget */}
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center min-w-[160px] shadow-sm">
                    <Flame size={40} className="text-amber-500 mb-3 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                    <span className="text-4xl font-heading font-black text-white">{streak}</span>
                    <span className="text-[12px] font-bold uppercase tracking-widest text-slate-400 mt-1">Day Streak</span>
                  </div>
                </div>
              </Card>

              {/* Badges Grid */}
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-4">
                  <Shield size={18} className="text-slate-400" />
                  <h3 className="text-[14px] font-bold uppercase tracking-widest text-slate-600">Achievements</h3>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {badges.map(badge => {
                    const isUnlocked = !!badge.unlockedAt;
                    const Icon = ICONS[badge.icon as keyof typeof ICONS] || Award;
                    
                    return (
                      <Card 
                        key={badge.id} 
                        className={`flex flex-col items-center p-5 text-center transition-all ${
                          isUnlocked 
                            ? 'bg-white border-slate-200 shadow-sm border-b-4 border-b-amber-400' 
                            : 'bg-slate-50 border-slate-100 opacity-60 grayscale'
                        }`}
                      >
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-transform ${isUnlocked ? 'bg-amber-100 text-amber-600 scale-110 shadow-inner' : 'bg-slate-200 text-slate-400'}`}>
                          {isUnlocked ? <Icon size={24} /> : <Lock size={20} />}
                        </div>
                        <h4 className={`text-[14px] font-heading font-bold mb-1 ${isUnlocked ? 'text-slate-900' : 'text-slate-500'}`}>
                          {badge.name}
                        </h4>
                        <p className="text-[11px] font-medium text-slate-400 leading-snug">
                          {badge.description}
                        </p>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rewards' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl shadow-sm">
                <Star size={20} className="text-indigo-500 shrink-0" />
                <p className="text-[13px] font-bold text-indigo-800">
                  You currently have <span className="text-[16px] text-indigo-600">{xp} XP</span> available to spend.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_REWARDS.map(reward => {
                   const isRedeemed = redeemedRewards.includes(reward.id);
                   const canAfford = xp >= reward.cost;
                   const Icon = ICONS[reward.icon as keyof typeof ICONS] || Gift;

                   return (
                     <Card 
                       key={reward.id} 
                       className={`p-6 border flex flex-col justify-between ${
                         isRedeemed 
                           ? 'bg-slate-50 border-slate-200 opacity-70' 
                           : canAfford 
                             ? 'bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow' 
                             : 'bg-white border-slate-200 opacity-60'
                       }`}
                     >
                        <div className="flex items-start gap-4 mb-6">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                            isRedeemed ? 'bg-slate-200 text-slate-500' : 'bg-blue-50 text-blue-600'
                          }`}>
                             <Icon size={24} />
                          </div>
                          <div>
                            <h3 className="text-[15px] font-bold text-slate-900 mb-1">{reward.title}</h3>
                            <p className="text-[13px] font-medium text-slate-500 leading-snug">{reward.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                           <span className="text-[14px] font-black text-slate-800 flex items-center gap-1.5">
                              <Star size={14} className={isRedeemed ? 'text-slate-400' : 'text-amber-500'} /> 
                              {reward.cost} XP
                           </span>
                           
                           {isRedeemed ? (
                             <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 text-[12px] font-bold rounded-lg border border-green-200">
                               <CheckCircle size={14} /> Claimed
                             </span>
                           ) : (
                             <button
                               disabled={!canAfford}
                               onClick={() => handleRedeem(reward)}
                               className={`px-4 py-2 text-[13px] font-bold rounded-xl transition-all ${
                                 canAfford
                                   ? 'bg-slate-900 text-white hover:bg-slate-800 focus-ring shadow-sm hover:-translate-y-0.5'
                                   : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                               }`}
                             >
                               {canAfford ? 'Redeem' : 'Need more XP'}
                             </button>
                           )}
                        </div>
                     </Card>
                   );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
