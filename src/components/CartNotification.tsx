import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store/useStore';
import { CheckCircle2 } from 'lucide-react';

export default function CartNotification() {
  const { lastAddedItem, setLastAddedItem } = useStore();

  useEffect(() => {
    if (lastAddedItem) {
      const timer = setTimeout(() => {
        setLastAddedItem(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [lastAddedItem, setLastAddedItem]);

  return (
    <AnimatePresence>
      {lastAddedItem && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50, x: '-50%' }}
          animate={{ opacity: 1, scale: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, scale: 0.8, y: -50, x: '-50%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-12 left-1/2 z-[100] bg-white text-black px-8 py-4 rounded-full shadow-2xl flex items-center gap-4 pointer-events-auto border border-black/5"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Added to Bag</span>
            <span className="text-[9px] text-gray-500 uppercase tracking-widest">{lastAddedItem.name}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
