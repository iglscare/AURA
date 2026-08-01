import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';

export default function SartorialVisionsSection() {
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          
          {/* Column 1: Left Image */}
          <div className="flex flex-col justify-start pt-0 md:pt-20">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="aspect-[4/5] w-full overflow-hidden rounded-sm"
            >
              <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800" 
                alt="Jewelry Details" 
                loading="lazy"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
               referrerPolicy="no-referrer" decoding="async" />
            </motion.div>
          </div>

          {/* Column 2: Text & Bottom Image */}
          <div className="flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8 md:mb-16 text-center md:text-left"
            >
              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-tight mb-4 sm:mb-6">
                Sartorial <br />
                <span className="italic font-light text-luxury-gold">Visions</span>
              </h2>
              <p className="text-gray-400 font-light leading-relaxed text-sm sm:text-base">
                A visual journey through our latest collections, where every frame captures the essence of modern luxury.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="aspect-square w-full overflow-hidden rounded-sm mt-auto relative"
            >
              <video 
                ref={videoRef}
                loop 
                muted 
                playsInline
                preload="none"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              >
                <source src="https://cdn.pixabay.com/video/2021/04/12/70874-537443193_large.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-black/20" />
            </motion.div>
          </div>

          {/* Column 3: Right Tall Image */}
          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="aspect-[3/5] w-full overflow-hidden rounded-sm"
            >
              <img src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800" 
                alt="Fine Living" 
                loading="lazy"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
               referrerPolicy="no-referrer" decoding="async" />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
