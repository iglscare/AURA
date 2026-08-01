import React from 'react';
import { motion } from 'motion/react';
import CrownIcon from './CrownIcon';
import { cn } from '../lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}

export default function Logo({ className, size = 'md', animated = true }: LogoProps) {
  const sizes = {
    sm: { crown: 'w-4 h-4', text: 'text-xs tracking-[0.2em]' },
    md: { crown: 'w-6 h-6', text: 'text-sm tracking-[0.3em]' },
    lg: { crown: 'w-10 h-10', text: 'text-xl tracking-[0.4em]' },
    xl: { crown: 'w-16 h-16', text: 'text-3xl tracking-[0.5em]' },
  };

  const currentSize = sizes[size];

  return (
    <div className={cn("flex flex-col items-center gap-1 group", className)}>
      <motion.div
        animate={animated ? {
          y: [0, -6, 0],
        } : {}}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="text-luxury-gold"
      >
        <CrownIcon className={cn(currentSize.crown, "transition-transform duration-500 group-hover:scale-110")} />
      </motion.div>
      
      <motion.span 
        initial={animated ? { opacity: 0, y: -15 } : {}}
        animate={animated ? { opacity: 1, y: 0 } : {}}
        transition={animated ? { 
          type: "spring", 
          stiffness: 300, 
          damping: 12, 
          delay: 0.2 
        } : {}}
        className={cn(
          "font-serif font-bold text-white transition-colors duration-500 group-hover:text-luxury-gold uppercase",
          currentSize.text
        )}
      >
        AURA
      </motion.span>
    </div>
  );
}
