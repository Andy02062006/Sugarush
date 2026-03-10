import React from 'react';
import { Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

interface XPBarProps {
  xp: number;
}

export function XPBar({ xp }: XPBarProps) {
  const level = Math.floor(xp / 1000) + 1;
  const currentLevelXP = xp % 1000;
  const progress = (currentLevelXP / 1000) * 100;

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-accent to-amber-light text-white shadow-sm border border-amber-accent/20">
        <Trophy size={18} className="fill-amber-accent stroke-white mix-blend-multiply opacity-80" />
      </div>
      <div>
        <div className="flex justify-between text-label text-text-secondary mb-1.5">
          <span>Level {level}</span>
          <span>{currentLevelXP} / 1000 XP</span>
        </div>
        <div className="h-2 w-32 rounded-full bg-cream-soft border border-border overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-amber-accent rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
