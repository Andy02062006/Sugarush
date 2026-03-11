"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../store';
import { useSession } from 'next-auth/react';
import { Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Splash() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Artificial delay to show splash screen, but wait for session status to resolve
    if (status === 'loading') return;

    const timer = setTimeout(() => {
      if (session?.user) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [session, status, router]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg text-text-primary overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
      
      <AnimatePresence>
        <motion.div
          key="logo"
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 1 
          }}
          className="flex flex-col items-center z-10"
        >
          <motion.div 
            animate={{ 
              y: [0, -10, 0],
              boxShadow: [
                "0px 10px 30px rgba(0,0,0,0.05)",
                "0px 20px 40px rgba(0,0,0,0.1)",
                "0px 10px 30px rgba(0,0,0,0.05)"
              ]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="w-24 h-24 bg-card rounded-3xl flex items-center justify-center mb-6 animate-float"
          >
            <Activity size={48} className="text-teal-primary" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-heading font-extrabold tracking-tight mb-3 origin-center text-text-primary"
          >
            Sugarush
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-text-secondary font-medium text-lg tracking-wide"
          >
            Your sweet life companion
          </motion.p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
