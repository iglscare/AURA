import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'motion/react';
import { formatCurrency } from '../lib/utils';
import { PRODUCTS } from '../data/products';
import { useStore } from '../store/useStore';

gsap.registerPlugin(ScrollTrigger);

export default function CinematicProductSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const storeProducts = useStore((state) => state.products);
  const products = (storeProducts && storeProducts.length > 0 ? storeProducts : PRODUCTS).slice(0, 3);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray('.product-panel');
      
      panels.forEach((panel: any, i) => {
        const image = panel.querySelector('.product-image');
        const content = panel.querySelector('.product-content');
        const bg = panel.querySelector('.product-bg');

        // Image parallax and scale
        gsap.fromTo(image, 
          { scale: 1.2, y: 100, opacity: 0 },
          { 
            scale: 1, 
            y: 0, 
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: panel,
              start: "top 80%",
              end: "top 20%",
              scrub: 1.5,
            }
          }
        );

        // Content reveal
        gsap.fromTo(content,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: panel,
              start: "top 70%",
              end: "top 30%",
              scrub: 1,
            }
          }
        );

        // Background movement
        gsap.to(bg, {
          yPercent: -20,
          ease: "none",
          scrollTrigger: {
            trigger: panel,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-luxury-black">
      {products.map((product, i) => (
        <div 
          key={product.id} 
          className="product-panel relative min-h-screen flex items-center justify-center overflow-hidden py-16 md:py-32"
        >
          {/* Parallax Background */}
          <div className="product-bg absolute inset-0 z-0 opacity-20">
            <img src={product.image} 
              alt="" 
              className="w-full h-full object-cover blur-3xl scale-150"
             referrerPolicy="no-referrer" decoding="async" loading="lazy" />
          </div>

          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 items-center relative z-10">
            {/* Image Side */}
            <div className={`order-2 ${i % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl border border-white/5 group">
                <img src={product.image} 
                  alt={product.name} 
                  className="product-image w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110"
                 referrerPolicy="no-referrer" decoding="async" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/60 to-transparent" />
              </div>
            </div>

            {/* Content Side */}
            <div className={`product-content order-1 ${i % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
              <span className="text-luxury-gold text-xs uppercase tracking-[0.3em] sm:tracking-[0.6em] block mb-4 sm:mb-8 font-light">
                {product.category}
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl md:text-7xl text-white mb-6 sm:mb-10 leading-tight">
                {product.name}
              </h2>
              <p className="text-gray-400 text-base md:text-xl leading-relaxed mb-8 sm:mb-12 font-light max-w-xl">
                {product.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 sm:gap-12">
                <div className="space-y-1">
                  <p className="text-gray-500 text-[10px] uppercase tracking-widest">Investment</p>
                  <p className="text-luxury-gold font-serif text-2xl sm:text-3xl">{formatCurrency(product.price)}</p>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 sm:px-10 py-3.5 sm:py-4 border border-luxury-gold/30 rounded-full text-white text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] hover:bg-luxury-gold hover:text-black transition-all duration-500 font-medium"
                >
                  Discover Detail
                </motion.button>
              </div>

              {/* Specs reveal */}
              <div className="mt-10 sm:mt-16 grid grid-cols-2 gap-4 sm:gap-8 border-t border-white/10 pt-8 sm:pt-12">
                {product.specs.slice(0, 2).map((spec, idx) => (
                  <div key={idx} className="space-y-1 sm:space-y-2">
                    <p className="text-[10px] uppercase tracking-widest text-gray-500">Feature {idx + 1}</p>
                    <p className="text-white text-xs sm:text-sm font-light tracking-wide">{spec}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Decorative Number */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] sm:text-[30vw] font-serif text-white/[0.02] pointer-events-none select-none z-0">
            0{i + 1}
          </div>
        </div>
      ))}
    </section>
  );
}
