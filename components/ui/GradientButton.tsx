import React from 'react';
import { cn } from '../../lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GradientButtonProps extends Omit<HTMLMotionProps<"button">, "className"> {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

export function GradientButton({
  children,
  className,
  variant = 'primary',
  fullWidth = false,
  ...props
}: GradientButtonProps) {
  const baseClasses = "relative overflow-hidden rounded-[16px] px-6 py-4 font-semibold text-white transition-all duration-300";
  const variants = {
    primary: "bg-primary-gradient shadow-[0_4px_12px_rgba(59,130,246,0.25)] hover:shadow-[0_8px_20px_rgba(59,130,246,0.4)]",
    secondary: "bg-white text-[#0F172A] shadow-[0_1px_6px_rgba(15,23,42,0.05)] border border-[#E2E8F0] hover:bg-gray-50",
    outline: "border-2 border-[#3B82F6] text-[#3B82F6] hover:bg-blue-50",
    ghost: "text-[#475569] hover:bg-gray-100",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        baseClasses,
        variants[variant],
        fullWidth ? "w-full" : "",
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity hover:opacity-100" />
      )}
    </motion.button>
  );
}
