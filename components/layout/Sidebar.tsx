import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ScrollText, AlertTriangle, Utensils, MessageCircle, Phone, LogOut } from 'lucide-react';
import { useStore } from '../../store';
import { cn } from '../../lib/utils';

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/glucose', icon: ScrollText, label: 'Glucose' },
  { href: '/risk', icon: AlertTriangle, label: 'Risk' },
  { href: '/recipes', icon: Utensils, label: 'Recipes' },
  { href: '/chat', icon: MessageCircle, label: 'RushBuddy AI' },
];

export function Sidebar() {
  const pathname = usePathname();
  const logout = useStore(s => s.logout);

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 hidden md:flex flex-col z-40 shadow-sm">
      <div className="p-6 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary-gradient flex items-center justify-center text-white font-bold text-xl">S</div>
        <span className="font-bold text-xl text-slate-900 tracking-tight">Sugarush</span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium",
                isActive 
                  ? "bg-blue-50 text-blue-600 shadow-[inset_4px_0_0_#3B82F6]" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon size={20} className={isActive ? "text-blue-600" : ""} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 flex flex-col gap-2">
         <Link
            href="/emergency"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-semibold shadow-sm"
          >
            <Phone size={20} className="animate-pulse" />
            Emergency
          </Link>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors font-medium w-full text-left mt-2"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
