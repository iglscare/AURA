import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Logo from './Logo';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // 2.5 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] bg-luxury-black flex items-center justify-center"
        >
          <div className="relative flex flex-col items-center">
            {/* Pulsing ring background */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 0.1 }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatType: "reverse",
                ease: "linear" 
              }}
              className="absolute w-64 h-64 rounded-full border border-luxury-gold pointer-events-none"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <Logo size="xl" animated={true} />
            </motion.div>
            
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100px" }}
              transition={{ duration: 2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="h-[1px] bg-luxury-gold mt-12"
            />
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ duration: 1, delay: 1.5, ease: "linear" }}
              className="text-[10px] uppercase tracking-[0.8em] text-white mt-6 font-light"
            >
              The Essence of Luxury
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
