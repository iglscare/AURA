import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'Watches', image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=800' },
  { name: 'Perfumes', image: 'https://images.unsplash.com/photo-1592914610354-fd354ea45e48?auto=format&fit=crop&q=80&w=800' },
  { name: 'Glasses', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800' },
  { name: 'Clothing', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800' },
];

export default function CategorySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section ref={containerRef} className="py-32 px-6 md:px-12 bg-luxury-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-luxury-gold text-xs uppercase tracking-[0.3em] block mb-4">Curated For You</span>
          <h2 className="font-serif text-4xl md:text-6xl text-white">The Collections</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, index) => (
            <Link to={`/shop?category=${cat.name}`} key={cat.name} className="group relative block aspect-[3/4] overflow-hidden rounded-sm">
              <motion.div
                style={{ y: index % 2 === 0 ? y : 0 }}
                className="w-full h-full"
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500 z-10" />
                <img src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                 referrerPolicy="no-referrer" decoding="async" loading="lazy" />
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center mb-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <span className="text-white text-xl font-light">+</span>
                  </div>
                  <h3 className="font-serif text-2xl text-white tracking-widest uppercase border-b border-transparent group-hover:border-luxury-gold pb-2 transition-all duration-500">
                    {cat.name}
                  </h3>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
