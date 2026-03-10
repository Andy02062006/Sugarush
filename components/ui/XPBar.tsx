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
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706] text-white shadow-lg">
        <Trophy size={20} className="fill-white/20" />
      </div>
      <div>
        <div className="flex justify-between text-xs font-semibold text-[#475569] mb-1">
          <span>Level {level}</span>
          <span>{currentLevelXP} / 1000 XP</span>
        </div>
        <div className="h-2 w-32 rounded-full bg-[#E2E8F0] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
