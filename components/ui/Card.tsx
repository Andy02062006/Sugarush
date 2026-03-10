import React from 'react';
import { cn } from '../../lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends Omit<HTMLMotionProps<"div">, "className"> {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function Card({
  children,
  className,
  noPadding = false,
  ...props
}: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "bg-white rounded-[16px] shadow-sm border border-border overflow-hidden transition-all duration-300",
        !noPadding && "p-6",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
