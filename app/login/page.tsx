"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../store';
import { motion, AnimatePresence } from 'framer-motion';
import { GradientButton } from '../../components/ui/GradientButton';
import { Activity, ArrowRight, User, HeartPulse, Target, Mail, Lock } from 'lucide-react';
import { UserProfile } from '../../lib/mocks';

export default function LoginScreen() {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Profile form state
  const [name, setName] = useState('');
  const [diabetesType, setDiabetesType] = useState<UserProfile['diabetesType']>('Type 2');
  const [age, setAge] = useState('35');
  const [minTarget, setMinTarget] = useState('70');
  const [maxTarget, setMaxTarget] = useState('140');
  
  const router = useRouter();
  const setUser = useStore(s => s.setUser);

  useEffect(() => {
    if (step === 0) {
      const msg = new SpeechSynthesisUtterance('Welcome to Sugarush, your sweet life companion.');
      window.speechSynthesis.speak(msg);
    }
  }, [step]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setStep(2);
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      name: name || 'User',
      diabetesType,
      age: parseInt(age) || 35,
      targetRangeMin: parseInt(minTarget) || 70,
      targetRangeMax: parseInt(maxTarget) || 140,
    });
    
    const msg = new SpeechSynthesisUtterance(`Welcome aboard, ${name || 'User'}!`);
    window.speechSynthesis.speak(msg);
    router.push('/dashboard');
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute top-0 inset-x-0 h-64 bg-primary-gradient rounded-b-[40px] shadow-sm"></div>
      
      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 z-10 shadow-lg">
        <Activity size={32} className="text-blue-600" />
      </div>

      <div className="w-full max-w-md relative h-[500px]">
        <AnimatePresence initial={false} custom={1}>
          {step === 0 && (
            <motion.div
              key="step0"
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute inset-0 flex flex-col bg-white rounded-[24px] p-8 shadow-xl border border-slate-100"
            >
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome to Sugarush</h1>
              <p className="text-slate-500 mb-8">Take control of your diabetes with AI-powered insights, gamification, and ease.</p>
              
              <div className="space-y-6 mb-auto">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-xl text-blue-600 shrink-0"><HeartPulse size={24} /></div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Smart Tracking</h3>
                    <p className="text-sm text-slate-500">Log glucose easily and see trends without the hassle.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 p-3 rounded-xl text-purple-600 shrink-0"><Activity size={24} /></div>
                  <div>
                    <h3 className="font-semibold text-slate-800">AI Risk Analysis</h3>
                    <p className="text-sm text-slate-500">Get personalized insights based on your logs and environment.</p>
                  </div>
                </div>
              </div>

              <GradientButton onClick={() => setStep(1)} className="mt-8 py-4">
                Get Started
                <ArrowRight size={20} />
              </GradientButton>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute inset-0 flex flex-col bg-white rounded-[24px] p-8 shadow-xl border border-slate-100"
            >
              <button 
                onClick={() => setStep(0)}
                className="text-sm text-slate-500 mb-6 w-fit hover:text-slate-800 transition-colors font-medium"
              >
                ← Back
              </button>
              
              <h2 className="text-2xl font-bold text-slate-800 mb-8">Sign In</h2>
              
              <form onSubmit={handleLoginSubmit} className="space-y-5 flex-1">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 focus-within:text-blue-600 transition-colors">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="email" 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 focus-within:text-blue-600 transition-colors">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="password" 
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
                <div className="pt-4">
                  <GradientButton type="submit" fullWidth>
                    Continue
                  </GradientButton>
                </div>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute inset-0 flex flex-col bg-white rounded-[24px] p-6 shadow-xl border border-slate-100 overflow-y-auto"
            >
              <h2 className="text-xl font-bold text-slate-800 mb-1">Last step!</h2>
              <p className="text-sm text-slate-500 mb-6">Let's personalize your experience.</p>
              
              <form onSubmit={handleProfileSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Your name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Diabetes Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Type 1', 'Type 2', 'Gestational', 'Prediabetes'].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setDiabetesType(type as any)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors border ${
                          diabetesType === type 
                            ? 'bg-blue-50 border-blue-200 text-blue-700' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Age</label>
                    <input 
                      type="number" 
                      value={age}
                      onChange={e => setAge(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>
                  <div className="flex-[2]">
                    <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-1.5">
                      <Target size={14} className="text-blue-500"/>
                      Target Range (mg/dL)
                    </label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        value={minTarget}
                        onChange={e => setMinTarget(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-center"
                        required
                      />
                      <span className="text-slate-400">-</span>
                      <input 
                        type="number" 
                        value={maxTarget}
                        onChange={e => setMaxTarget(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-center"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <GradientButton type="submit" fullWidth>
                    Complete Profile
                  </GradientButton>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
