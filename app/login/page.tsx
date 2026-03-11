"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useStore } from '../../store';
import { motion, AnimatePresence } from 'framer-motion';
import { GradientButton } from '../../components/ui/GradientButton';
import { Activity, ArrowRight, User, HeartPulse, Target, Mail, Lock } from 'lucide-react';
import { UserProfile } from '../../lib/mocks';

export default function LoginScreen() {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
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

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password) return;

    if (mode === 'signup') {
      // Proceed to step 2 to collect profile details
      setStep(2);
    } else {
      // Login mode - try to authenticate immediately
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setErrorMsg('Invalid email or password');
      } else {
        const msg = new SpeechSynthesisUtterance('Welcome back to Sugarush.');
        window.speechSynthesis.speak(msg);
        router.push('/dashboard');
      }
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    // 1. Create the user in the database
    const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email,
            password,
            name: name || 'User',
            diabetesType,
            age,
            minTarget,
            maxTarget
        })
    });

    if (!res.ok) {
        const errorData = await res.json();
        setErrorMsg(errorData.error || 'Registration failed');
        return;
    }

    // 2. Automatically log them in now that the account is built
    await signIn('credentials', {
        email,
        password,
        redirect: false,
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
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute top-0 inset-x-0 h-64 bg-cream-soft rounded-b-[40px] shadow-sm"></div>
      
      <div className="w-16 h-16 bg-card rounded-2xl flex items-center justify-center mb-8 z-10 shadow-lg animate-float">
        <Activity size={32} className="text-teal-primary" />
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
              <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">Welcome to Sugarush</h1>
              <p className="text-text-secondary mb-8">Take control of your diabetes with AI-powered insights, gamification, and ease.</p>
              
              <div className="space-y-6 mb-auto">
                <div className="flex items-start gap-4">
                  <div className="bg-teal-light p-3 rounded-xl text-teal-primary shrink-0"><HeartPulse size={24} /></div>
                  <div>
                    <h3 className="font-semibold text-text-primary">Smart Tracking</h3>
                    <p className="text-sm text-text-secondary">Log glucose easily and see trends without the hassle.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-amber-light p-3 rounded-xl text-amber-accent shrink-0"><Activity size={24} /></div>
                  <div>
                    <h3 className="font-semibold text-text-primary">AI Risk Analysis</h3>
                    <p className="text-sm text-text-secondary">Get personalized insights based on your logs and environment.</p>
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
                className="text-sm text-text-secondary mb-6 w-fit hover:text-text-primary transition-colors font-medium focus-ring rounded-md"
              >
                ← Back
              </button>
              
              <h2 className="text-2xl font-heading font-bold text-text-primary mb-2">
                 {mode === 'login' ? 'Sign In' : 'Create Account'}
              </h2>
              
              <div className="flex bg-slate-50 p-1 rounded-[12px] border border-slate-200 mb-6">
                 <button type="button" onClick={() => setMode('login')} className={`flex-1 py-2 text-sm font-bold rounded-[8px] transition-all ${mode === 'login' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-900'} `}>Log In</button>
                 <button type="button" onClick={() => setMode('signup')} className={`flex-1 py-2 text-sm font-bold rounded-[8px] transition-all ${mode === 'signup' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-900'} `}>Sign Up</button>
              </div>

              {errorMsg && <p className="text-sm text-red-500 font-semibold mb-4 text-center">{errorMsg}</p>}
              
              <form onSubmit={handleAuthSubmit} className="space-y-5 flex-1">
                <div>
                  <label className="block text-sm font-semibold text-text-secondary mb-1.5 focus-within:text-teal-primary transition-colors">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                    <input 
                      type="email" 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-cream-soft border border-border rounded-xl focus-ring outline-none transition-all"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-secondary mb-1.5 focus-within:text-teal-primary transition-colors">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                    <input 
                      type="password" 
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-cream-soft border border-border rounded-xl focus-ring outline-none transition-all"
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
              <h2 className="text-xl font-heading font-bold text-text-primary mb-1">Last step!</h2>
              <p className="text-sm text-text-secondary mb-6">Let's personalize your experience.</p>

              {errorMsg && <p className="text-sm text-red-500 font-semibold mb-4 text-center">{errorMsg}</p>}
              
              <form onSubmit={handleProfileSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-text-secondary mb-1.5">Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <input 
                      type="text" 
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-cream-soft border border-border rounded-xl focus-ring outline-none"
                      placeholder="Your name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-secondary mb-2">Diabetes Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Type 1', 'Type 2', 'Gestational', 'Prediabetes'].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setDiabetesType(type as any)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors border focus-ring ${
                          diabetesType === type 
                            ? 'bg-teal-light border-teal-light text-teal-dark' 
                            : 'bg-card border-border text-text-secondary hover:bg-cream-soft'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-text-secondary mb-1.5">Age</label>
                    <input 
                      type="number" 
                      value={age}
                      onChange={e => setAge(e.target.value)}
                      className="w-full px-3 py-2.5 bg-cream-soft border border-border rounded-xl focus-ring outline-none"
                      required
                    />
                  </div>
                  <div className="flex-[2]">
                    <label className="flex items-center gap-1.5 text-sm font-semibold text-text-secondary mb-1.5">
                      <Target size={14} className="text-teal-primary"/>
                      Target Range (mg/dL)
                    </label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        value={minTarget}
                        onChange={e => setMinTarget(e.target.value)}
                        className="w-full px-3 py-2.5 bg-cream-soft border border-border rounded-xl focus-ring outline-none text-center"
                        required
                      />
                      <span className="text-text-muted">-</span>
                      <input 
                        type="number" 
                        value={maxTarget}
                        onChange={e => setMaxTarget(e.target.value)}
                        className="w-full px-3 py-2.5 bg-cream-soft border border-border rounded-xl focus-ring outline-none text-center"
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
