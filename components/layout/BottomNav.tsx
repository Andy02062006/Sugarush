import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ScrollText, AlertTriangle, Utensils, MessageCircle, Phone } from 'lucide-react';
import { cn } from '../../lib/utils';

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dash' },
  { href: '/glucose', icon: ScrollText, label: 'Logs' },
  { href: '/risk', icon: AlertTriangle, label: 'Risk' },
  { href: '/chat', icon: MessageCircle, label: 'AI' },
  { href: '/recipes', icon: Utensils, label: 'Food' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 md:hidden pb-safe z-40 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around px-2 h-16 relative">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors",
                isActive ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <item.icon size={22} className={cn("transition-transform", isActive ? "scale-110" : "")} />
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute top-0 w-8 h-1 bg-blue-600 rounded-b-full"></div>
              )}
            </Link>
          );
        })}
      </div>
      
      {/* Floating Emergency Button for Mobile */}
      <Link 
        href="/emergency"
        className="fixed bottom-20 right-4 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-500/30 animate-pulse md:hidden"
      >
        <Phone size={24} />
      </Link>
    </nav>
  );
}
