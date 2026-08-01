import React from 'react';
import { motion } from 'motion/react';

interface OvalSectionProps {
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

export default function OvalSection({ title, subtitle, description, image }: OvalSectionProps) {
  return (
    <section className="relative min-h-screen w-full bg-luxury-black flex items-center justify-center py-20 md:py-64 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-32 items-center">
        <div className="relative order-2 lg:order-1">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, filter: 'grayscale(100%)' }}
            whileInView={{ opacity: 1, scale: 1, filter: 'grayscale(0%)' }}
            transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[3/4] w-full max-w-xs sm:max-w-lg mx-auto overflow-hidden"
            style={{ 
              borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
              clipPath: 'ellipse(50% 100% at 50% 100%)'
            }}
          >
            <motion.img 
              initial={{ scale: 1.2 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 3.5, ease: [0.16, 1, 0.3, 1] }}
              src={image} 
              alt={title}
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          {/* Decorative Ring */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 0.1, scale: 1.1 }}
            transition={{ duration: 3, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -inset-8 sm:-inset-16 border border-luxury-gold rounded-full pointer-events-none"
            style={{ clipPath: 'ellipse(50% 100% at 50% 100%)' }}
          />
        </div>
        
        <div className="order-1 lg:order-2 space-y-8 md:space-y-16">
          <div className="space-y-4 sm:space-y-8">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-luxury-gold text-[9px] sm:text-[10px] uppercase tracking-[0.4em] sm:tracking-[1em] font-light block"
            >
              {subtitle}
            </motion.span>
            
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-7xl md:text-9xl text-white font-serif leading-[0.9] sm:leading-[0.8] tracking-tight"
            >
              {title.split(' ').map((word, i) => (
                <span key={i} className={i % 2 === 1 ? 'italic font-light text-white/40' : ''}>
                  {word}{' '}
                  {i === 0 && <br />}
                </span>
              ))}
            </motion.h2>
          </div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-white/40 text-xs sm:text-sm md:text-base leading-relaxed font-light max-w-xl uppercase tracking-[0.15em] sm:tracking-[0.2em]"
          >
            {description}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-6 sm:gap-12"
          >
            <div className="w-12 sm:w-24 h-[1px] bg-white/10" />
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.6em] text-white/20">Established Excellence</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
