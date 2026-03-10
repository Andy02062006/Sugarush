import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ScrollText, AlertTriangle, Utensils, MessageCircle, Phone, LogOut } from 'lucide-react';
import { useStore } from '../../store';
import { cn } from '../../lib/utils';
import { Avatar } from '../ui/Avatar';

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
    <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-border hidden md:flex flex-col z-40">
      <div className="p-6 flex items-center gap-3">
        <div className="animate-float">
          <Avatar fallback="S" size="sm" />
        </div>
        <span className="font-heading font-black text-xl text-text-primary tracking-tight">Sugarush.</span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-[10px] transition-all duration-200 text-sm focus-ring",
                isActive
                  ? "bg-cream-soft text-text-primary font-semibold shadow-sm"
                  : "text-text-secondary hover:bg-cream-soft/50 hover:text-text-primary font-medium"
              )}
            >
              <item.icon size={18} className={isActive ? "text-text-primary" : "text-text-muted"} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border flex flex-col gap-2">
        <Link
          href="/emergency"
          aria-label="Emergency"
          className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] bg-status-red/10 text-status-red hover:bg-status-red/15 transition-colors font-semibold shadow-sm focus-ring text-sm"
        >
          <Phone size={18} className="animate-pulse" />
          Emergency
        </Link>
        <button
          onClick={logout}
          aria-label="Sign Out"
          className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-text-secondary hover:bg-cream-soft/50 hover:text-text-primary transition-colors font-medium w-full text-left mt-1 focus-ring text-sm"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
