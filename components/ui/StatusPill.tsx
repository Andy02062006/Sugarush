import React from 'react';
import { cn } from '../../lib/utils';
import { Activity, Droplet } from 'lucide-react';

interface StatusPillProps {
  value: number;
  type?: 'glucose' | 'risk';
}

export function StatusPill({ value, type = 'glucose' }: StatusPillProps) {
  let status = 'normal';
  let colorClass = 'bg-status-green/10 text-status-green border-status-green/20';
  let text = 'Normal';

  if (type === 'glucose') {
    if (value < 70) {
      status = 'low';
      colorClass = 'bg-status-sky/10 text-status-sky border-status-sky/20';
      text = 'Low';
    } else if (value > 140 && value <= 180) {
      status = 'elevated';
      colorClass = 'bg-status-amber/10 text-status-amber border-status-amber/20';
      text = 'Elevated';
    } else if (value > 180) {
      status = 'high';
      colorClass = 'bg-status-red/10 text-status-red border-status-red/20';
      text = 'High';
    }
  }

  return (
    <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-label", colorClass)}>
      {type === 'glucose' ? <Droplet size={14} className="fill-current" /> : <Activity size={14} />}
      {text}
    </div>
  );
}
