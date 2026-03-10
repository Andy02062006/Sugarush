import React from 'react';
import { cn } from '../../lib/utils';
import Image from 'next/image';

interface AvatarProps {
  src?: string;
  fallback: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animate?: boolean;
}

export function Avatar({ src, fallback, size = 'md', animate = false, className }: AvatarProps) {
  const sizeMap = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-24 h-24 text-2xl',
  };

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-full bg-amber-light overflow-hidden font-heading font-semibold text-amber-accent shrink-0",
        sizeMap[size],
        animate && "animate-float",
        className
      )}
    >
      {src ? (
        <Image src={src} alt={fallback} fill className="object-cover" />
      ) : (
        <span>{fallback.substring(0, 2).toUpperCase()}</span>
      )}
    </div>
  );
}
