import React from 'react';
import { cn } from '../../lib/utils';
import { Activity, Droplet } from 'lucide-react';

interface StatusPillProps {
  value: number;
  type?: 'glucose' | 'risk';
}

export function StatusPill({ value, type = 'glucose' }: StatusPillProps) {
  let status = 'normal';
  let colorClass = 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20';
  let text = 'Normal';

  if (type === 'glucose') {
    if (value < 70) {
      status = 'low';
      colorClass = 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20';
      text = 'Low';
    } else if (value > 140 && value <= 180) {
      status = 'elevated';
      colorClass = 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20';
      text = 'Elevated';
    } else if (value > 180) {
      status = 'high';
      colorClass = 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20';
      text = 'High';
    }
  }

  return (
    <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold", colorClass)}>
      {type === 'glucose' ? <Droplet size={14} className="fill-current" /> : <Activity size={14} />}
      {text}
    </div>
  );
}
