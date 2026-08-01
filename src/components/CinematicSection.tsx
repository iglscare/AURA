import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CinematicSectionProps {
  children: React.ReactNode;
  backgroundImage?: string;
  backgroundVideo?: string;
  title?: string;
  subtitle?: string;
  pin?: boolean;
}

export default function CinematicSection({ 
  children, 
  backgroundImage, 
  backgroundVideo,
  title, 
  subtitle,
  pin = false 
}: CinematicSectionProps) {
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
      if (pin) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=100%',
          pin: true,
          scrub: true,
        });
      }

      if (contentRef.current) {
        gsap.fromTo(contentRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            }
          }
        );
      }
    });

    return () => ctx.revert();
  }, [pin]);

  return (
    <section ref={sectionRef} className="relative min-h-screen w-full overflow-hidden flex items-center justify-center py-20">
      {backgroundVideo ? (
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <video 
            ref={videoRef}
            loop 
            muted 
            playsInline
            autoPlay
            className="w-full h-full object-cover opacity-60"
          >
            <source src={backgroundVideo} type="video/mp4" />
          </video>
        </div>
      ) : backgroundImage && (
        <div ref={bgRef} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <img src={backgroundImage} 
            alt="" 
            loading="lazy"
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer" decoding="async" />
        </div>
      )}
      
      <div ref={contentRef} className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 py-12">
        {(title || subtitle) && (
          <div className="mb-16 flex flex-col items-center md:items-start text-center md:text-left">
            {subtitle && (
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="text-luxury-gold text-xs md:text-sm uppercase tracking-[0.8em] mb-6 block font-light"
              >
                {subtitle}
              </motion.span>
            )}
            {title && (
              <h2 className="text-5xl md:text-7xl lg:text-8xl text-white font-serif leading-[0.95] tracking-tight">
                {title.split(' ').map((word, i) => (
                  <span key={i} className={i % 2 === 1 ? 'italic font-light text-white/60' : ''}>
                    {word}{' '}
                  </span>
                ))}
              </h2>
            )}
            <div className="h-[1px] w-32 bg-luxury-gold/30 mt-8" />
          </div>
        )}
        <div className="relative">
          {children}
        </div>
      </div>
    </section>
  );
}
