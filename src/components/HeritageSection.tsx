import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'motion/react';

gsap.registerPlugin(ScrollTrigger);

export default function HeritageSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(() => {});
        } else {
          videoRef.current?.pause();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Parallax background
      gsap.to(bgRef.current, {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      // Content reveal
      gsap.fromTo(contentRef.current,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 20%",
            scrub: 1
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[80vh] w-full overflow-hidden bg-luxury-black flex items-center justify-center">
      {/* Background Video */}
      <div ref={bgRef} className="absolute inset-0 z-0 scale-125">
        <video 
          ref={videoRef}
          loop 
          muted 
          playsInline
          preload="none"
          className="w-full h-full object-cover opacity-30"
        >
          <source src="https://cdn.pixabay.com/video/2021/04/12/70874-537443193_large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-luxury-black" />
      </div>

      {/* Content */}
      <div ref={contentRef} className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <span className="text-luxury-gold text-xs uppercase tracking-[0.6em] block mb-8 font-light">
          A Century of Excellence
        </span>
        <h2 className="font-serif text-5xl md:text-7xl text-white mb-10 leading-tight">
          The Heritage of <span className="italic">Aura</span>
        </h2>
        <p className="text-gray-400 text-lg md:text-xl leading-relaxed font-light mb-12">
          Since 1924, we have been the silent witness to the world's most significant moments. Our archives are a testament to a century of uncompromising standards and visionary design.
        </p>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-xs uppercase tracking-[0.4em] text-white border-b border-luxury-gold/50 pb-2 hover:text-luxury-gold hover:border-luxury-gold transition-all duration-500"
        >
          Discover Our Story
        </motion.button>
      </div>
    </section>
  );
}
