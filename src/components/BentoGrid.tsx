import React from 'react';
import { motion } from 'motion/react';

const bentoItems = [
  {
    title: "The Atelier",
    subtitle: "Geneva",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
    className: "md:col-span-2 md:row-span-2"
  },
  {
    title: "Precision",
    subtitle: "0.01mm",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop",
    className: "md:col-span-1 md:row-span-1"
  },
  {
    title: "Heritage",
    subtitle: "100 Years",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=2080&auto=format&fit=crop",
    className: "md:col-span-1 md:row-span-2"
  },
  {
    title: "Artistry",
    subtitle: "Handcrafted",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop",
    className: "md:col-span-1 md:row-span-1"
  }
];

export default function BentoGrid() {
  return (
    <section className="py-20 md:py-64 bg-luxury-black px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 md:mb-32 text-center">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-luxury-gold text-[9px] sm:text-[10px] uppercase tracking-[0.4em] sm:tracking-[1em] font-light block mb-4 sm:mb-8"
          >
            The Gallery
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-8xl text-white font-serif leading-[0.9] sm:leading-[0.8] tracking-tight"
          >
            A Visual <br />
            <span className="italic font-light text-white/40">Narrative</span>
          </motion.h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 auto-rows-[260px] sm:auto-rows-[350px] md:auto-rows-[400px]">
          {bentoItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`group relative overflow-hidden rounded-xl ${item.className}`}
            >
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent md:opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-end p-6 sm:p-12">
                <span className="text-luxury-gold text-[9px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.6em] mb-2 sm:mb-4">{item.subtitle}</span>
                <h3 className="text-white text-2xl sm:text-3xl font-serif tracking-tight">{item.title}</h3>
              </div>
              
              <div className="absolute inset-0 border border-white/5 pointer-events-none group-hover:border-white/20 transition-colors duration-700 rounded-xl" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
