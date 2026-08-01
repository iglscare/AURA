import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function AestheticsSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

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

  return (
    <section className="py-16 md:py-32 bg-luxury-black text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <h2 className="font-serif text-4xl sm:text-5xl md:text-7xl leading-tight mb-6 sm:mb-8 relative">
              The <span className="inline-block w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-white/30 mb-1 sm:mb-2 ml-2 align-middle" /> <br />
              <span className="italic font-light text-white/80">Aesthetics</span> <br />
              of Luxury
            </h2>
            
            <p className="text-gray-400 text-base md:text-lg font-light leading-relaxed mb-8 sm:mb-10 max-w-md mx-auto lg:mx-0">
              Every piece in our collection is selected not just for its function, but for its form. We believe that true luxury lies in the details—the weight of a watch, the scent of a perfume, the drape of a coat.
            </p>

            <Link 
              to="/journal" 
              className="inline-flex items-center gap-2 text-xs sm:text-sm uppercase tracking-widest border-b border-white/30 pb-1 hover:text-luxury-gold hover:border-luxury-gold transition-colors group"
            >
              Read the Journal
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Image Collage */}
          <div className="relative h-[380px] sm:h-[500px] md:h-[600px] w-full">
            {/* Image 1: Video Background */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute top-0 left-0 w-3/5 h-4/5 z-10"
            >
              <div className="w-full h-full rounded-2xl overflow-hidden relative">
                <video 
                  ref={videoRef}
                  loop 
                  muted 
                  playsInline
                  preload="none"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                >
                  <source src="https://cdn.pixabay.com/video/2023/10/20/185834-876606346_large.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/20" />
              </div>
            </motion.div>

            {/* Image 2: Clothes Rack */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute bottom-0 right-0 w-3/5 h-4/5 z-0"
            >
              <div className="w-full h-full rounded-2xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1000" 
                  alt="Fashion Collection" 
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                 referrerPolicy="no-referrer" decoding="async" />
                <div className="absolute inset-0 bg-black/20" />
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
