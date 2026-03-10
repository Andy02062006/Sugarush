"use client";

import React, { useEffect, useState } from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { useStore } from '../../store';
import { useRouter, usePathname } from 'next/navigation';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const isLoggedIn = useStore(s => s.isLoggedIn);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoggedIn && pathname !== '/login' && pathname !== '/') {
      router.push('/login');
    }
  }, [isLoggedIn, router, mounted, pathname]);

  // Don't render until hydration is complete to avoid hydration mismatch with Zustand persist
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col md:pl-64 h-screen">
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0 scroll-smooth">
          <div className="max-w-3xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
