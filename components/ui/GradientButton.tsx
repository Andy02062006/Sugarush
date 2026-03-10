import React from 'react';
import { cn } from '../../lib/utils';

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
  const baseClasses = "relative overflow-hidden rounded-[12px] px-5 py-3 font-medium transition-all duration-200 focus-ring hover:scale-[1.01] active:scale-[0.98]";
  const variants = {
    primary: "bg-text-primary text-white shadow-[0_2px_10px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.12)] border border-text-primary/10",
    secondary: "bg-white text-text-primary shadow-sm border border-border hover:bg-cream-soft",
    outline: "border border-border text-text-secondary hover:text-text-primary hover:bg-cream-soft",
    ghost: "text-text-secondary hover:text-text-primary hover:bg-cream-soft",
  };

  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        fullWidth ? "w-full" : "",
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2 font-body tracking-tight">{children}</span>
    </button>
  );
}
