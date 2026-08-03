import React from 'react';
import { motion } from 'motion/react';

export default function WatermarkLogo() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="fixed bottom-6 right-6 z-40 group pointer-events-auto select-none"
    >
      <div className="relative flex items-center justify-center">
        {/* Outer ambient glow pulse */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500/30 to-blue-600/30 blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Circular frame container */}
        <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full p-[2px] bg-gradient-to-tr from-cyan-400 via-white/50 to-blue-500 shadow-lg shadow-cyan-500/20 backdrop-blur-md group-hover:scale-105 transition-transform duration-300">
          <div className="w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center p-1">
            <img
              src="/watermark-logo.png"
              alt="Watermark Logo"
              className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
