import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const categories = [
  { name: 'Watches', image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=800', desc: 'Timeless Precision' },
  { name: 'Perfumes', image: 'https://images.unsplash.com/photo-1592914610354-fd354ea45e48?auto=format&fit=crop&q=80&w=800', desc: 'Essence of Luxury' },
  { name: 'Glasses', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800', desc: 'Visionary Style' },
  { name: 'Clothing', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800', desc: 'Sartorial Elegance' },
];

export default function CircularCategorySelector() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 20%",
            scrub: 1.5,
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const nextCategory = () => {
    setActiveIndex((prev) => (prev + 1) % categories.length);
  };

  const prevCategory = () => {
    setActiveIndex((prev) => (prev - 1 + categories.length) % categories.length);
  };

  return (
    <section ref={sectionRef} className="py-20 md:py-48 bg-luxury-black overflow-hidden relative min-h-[600px] md:min-h-[900px] flex items-center">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[1000px] h-[600px] md:h-[1000px] rounded-full border border-white/5 opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] md:w-[800px] h-[450px] md:h-[800px] rounded-full border border-white/10 opacity-20 pointer-events-none" />

      <div ref={contentRef} className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10">
        
        {/* Text Content */}
        <div className="order-2 lg:order-1 text-center lg:text-left">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-luxury-gold text-xs uppercase tracking-[0.3em] block mb-4">
              Collection 0{activeIndex + 1}
            </span>
            <h2 className="font-serif text-4xl sm:text-6xl md:text-8xl text-white mb-6">
              {categories[activeIndex].name}
            </h2>
            <p className="text-gray-400 text-base md:text-lg font-light mb-8 lg:mb-10 max-w-md mx-auto lg:mx-0">
              {categories[activeIndex].desc}. Discover our exclusive range designed for those who seek perfection.
            </p>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-8">
              <Link 
                to={`/shop?category=${categories[activeIndex].name}`}
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full text-xs sm:text-sm uppercase tracking-widest hover:bg-luxury-gold transition-colors font-medium"
              >
                Explore <ArrowRight size={16} />
              </Link>
              
              <div className="flex gap-4">
                <button onClick={prevCategory} aria-label="Previous category" className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-luxury-gold hover:text-luxury-gold transition-colors">
                  ←
                </button>
                <button onClick={nextCategory} aria-label="Next category" className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-luxury-gold hover:text-luxury-gold transition-colors">
                  →
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Circular Image Display */}
        <div className="order-1 lg:order-2 relative h-[300px] sm:h-[400px] md:h-[500px] flex items-center justify-center">
           <div className="relative w-full h-full max-w-[320px] sm:max-w-[420px] md:max-w-none mx-auto">
             <AnimatePresence mode="wait">
               <motion.div
                 key={activeIndex}
                 initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                 animate={{ opacity: 1, scale: 1, rotate: 0 }}
                 exit={{ opacity: 0, scale: 1.1, rotate: 10 }}
                 transition={{ duration: 0.8, ease: "circOut" }}
                 className="absolute inset-0 z-10"
               >
                 <div className="relative w-full h-full rounded-full overflow-hidden border-[1px] border-white/10">
                    <img src={categories[activeIndex].image} 
                      alt={categories[activeIndex].name}
                      className="w-full h-full object-cover"
                     referrerPolicy="no-referrer" decoding="async" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/60 to-transparent pointer-events-none" />
                 </div>
               </motion.div>
             </AnimatePresence>
             
             {/* Decorative Ring */}
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
               className="absolute -inset-4 border border-dashed border-white/20 rounded-full z-0"
             />
           </div>
        </div>
      </div>
    </section>
  );
}
