import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SplitSectionProps {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  reversed?: boolean;
  link?: string;
  linkText?: string;
}

export default function SplitSection({ 
  title, 
  subtitle, 
  description, 
  image, 
  reversed = false,
  link = "/shop",
  linkText = "Explore Collection"
}: SplitSectionProps) {
  return (
    <section className="relative min-h-screen w-full flex flex-col md:flex-row bg-luxury-black overflow-hidden">
      <div className={`w-full md:w-1/2 h-[50vh] md:h-screen relative overflow-hidden ${reversed ? 'md:order-last' : ''}`}>
        <motion.img 
          initial={{ scale: 1.2 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
         referrerPolicy="no-referrer" decoding="async" loading="lazy" />
        <div className="absolute inset-0 bg-black/20" />
      </div>
      
      <div className="w-full md:w-1/2 flex flex-col justify-center px-12 md:px-24 py-24 md:py-0">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-luxury-gold text-xs uppercase tracking-[0.6em] mb-8 font-light block"
        >
          {subtitle}
        </motion.span>
        
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl text-white font-serif leading-tight mb-12"
        >
          {title.split(' ').map((word, i) => (
            <span key={i} className={i % 2 === 1 ? 'italic font-light text-white/50' : ''}>
              {word}{' '}
            </span>
          ))}
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-white/60 text-lg md:text-xl leading-relaxed font-light mb-16 max-w-xl"
        >
          {description}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <Link 
            to={link}
            className="group inline-flex items-center gap-8 text-[10px] uppercase tracking-[0.4em] text-white hover:text-luxury-gold transition-all duration-500"
          >
            {linkText}
            <div className="w-12 h-[1px] bg-luxury-gold/50 group-hover:w-24 transition-all duration-700" />
            <ArrowRight size={14} className="group-hover:translate-x-4 transition-transform duration-700" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
