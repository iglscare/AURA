import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import heroVideo from '../hero.mp4';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Parallax background
      gsap.to(bgRef.current, {
        yPercent: 15,
        scale: 1.05,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      // Fade out content on scroll
      gsap.to(contentRef.current, {
        opacity: 0,
        y: -100,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "60% top",
          scrub: true
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative h-screen w-full overflow-hidden bg-[#0a0a0a] flex items-center justify-center">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video 
          ref={bgRef}
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-100 scale-105"
        />
      </div>

      {/* Content */}
      <div ref={contentRef} className="relative z-20 w-full h-full flex flex-col items-center justify-center px-4 pt-10">
        


        {/* Bottom CTA Area */}
        <div className="absolute bottom-4 sm:bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center h-40 sm:h-48 justify-end w-full px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 2 }}
            className="flex flex-col items-center relative z-30 w-full max-w-xs sm:max-w-none"
          >
            <Link 
              to="/shop" 
              className="group relative flex flex-col items-center justify-center px-6 sm:px-16 py-4 sm:py-5 rounded-[2.5rem] border border-white/10 bg-[#111]/80 backdrop-blur-md transition-all duration-500 hover:border-white/30 hover:bg-[#1a1a1a]/90 shadow-2xl w-full sm:w-auto"
            >
              <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.3em] sm:tracking-[0.5em] text-white/40 mb-1 sm:mb-2 font-medium">
                Scroll to Explore
              </span>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] sm:tracking-[0.4em] text-white flex items-center gap-2 sm:gap-4 font-medium">
                Enter the Collection
                <ArrowRight size={14} className="transition-transform duration-500 group-hover:translate-x-1 text-white/70 flex-shrink-0" />
              </span>
            </Link>
          </motion.div>
          
          {/* Vertical Line */}
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 60 }}
            transition={{ duration: 1.5, delay: 2.5, ease: "easeOut" }}
            className="w-[1px] bg-gradient-to-b from-[#C5A059] to-transparent mt-0 relative z-20 hidden sm:block"
          />
        </div>
      </div>
    </div>
  );
}
