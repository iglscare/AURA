import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import CircularCategorySelector from '../components/CircularCategorySelector';
import FeaturedProducts from '../components/FeaturedProducts';
import AestheticsSection from '../components/AestheticsSection';
import SartorialVisionsSection from '../components/SartorialVisionsSection';
import CinematicProductSection from '../components/CinematicProductSection';
import DominoTrailSection from '../components/DominoTrailSection';
import BespokeExperience from '../components/BespokeExperience';
import HeritageSection from '../components/HeritageSection';
import BrandFilm from '../components/BrandFilm';
import ThreeScene from '../components/ThreeScene';
import CinematicSection from '../components/CinematicSection';
import SplitSection from '../components/SplitSection';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function ParallaxCraftCards() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const card1Ref = React.useRef<HTMLDivElement>(null);
  const card2Ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Parallax card 1: moves upward during scroll
      gsap.to(card1Ref.current, {
        y: -70,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      // Parallax card 2: moves downward during scroll
      gsap.to(card2Ref.current, {
        y: 80,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="col-span-1 md:col-span-2 grid grid-cols-2 gap-12 items-center">
      {/* Card 1 */}
      <div 
        ref={card1Ref} 
        className="aspect-[3/4] overflow-hidden rounded-3xl shadow-2xl transform rotate-[-3deg] border border-white/10 group relative transition-all duration-700 hover:border-luxury-gold/60 hover:shadow-[0_20px_50px_rgba(212,175,55,0.25)] hover:scale-[1.03] cursor-pointer"
      >
        <img 
          src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1974&auto=format&fit=crop" 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
          alt="Detail 1"  
          referrerPolicy="no-referrer" 
          decoding="async" 
          loading="lazy" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-50 group-hover:opacity-90 transition-opacity duration-500 flex flex-col justify-end p-8">
          <span className="text-luxury-gold text-[10px] uppercase tracking-[0.4em] font-light transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            Precision Cut
          </span>
          <h4 className="font-serif text-2xl text-white font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
            Atelier Weaving
          </h4>
        </div>
      </div>

      {/* Card 2 */}
      <div 
        ref={card2Ref} 
        className="aspect-[3/4] overflow-hidden rounded-3xl shadow-2xl transform translate-y-12 rotate-[3deg] border border-white/10 group relative transition-all duration-700 hover:border-luxury-gold/60 hover:shadow-[0_20px_50px_rgba(212,175,55,0.25)] hover:scale-[1.03] cursor-pointer"
      >
        <img 
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop" 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
          alt="Detail 2"  
          referrerPolicy="no-referrer" 
          decoding="async" 
          loading="lazy" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-50 group-hover:opacity-90 transition-opacity duration-500 flex flex-col justify-end p-8">
          <span className="text-luxury-gold text-[10px] uppercase tracking-[0.4em] font-light transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            Handcrafted Detail
          </span>
          <h4 className="font-serif text-2xl text-white font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
            Master Assembly
          </h4>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  useEffect(() => {
    ScrollTrigger.refresh();
  }, []);

  return (
    <div className="bg-luxury-black min-h-screen">
      <ThreeScene />
      <Navbar />
      
      <main className="relative z-10">
        <Hero />
        
        <SplitSection 
          subtitle="The Vision"
          title="A New Paradigm of Elegance"
          description="In the heart of Geneva, we began a journey to redefine what it means to live luxuriously. Not through excess, but through the perfect harmony of form and function."
          image="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
        />

        <DominoTrailSection />

        <CinematicSection 
          subtitle="The Craft"
          title="Mastery in Every Detail"
          backgroundVideo="https://cdn.pixabay.com/video/2021/04/12/70874-537443193_large.mp4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-24 items-center">
            <div className="space-y-12">
              <p className="text-2xl text-white/70 leading-relaxed font-serif italic">
                "Craftsmanship is the language of the soul, spoken through the hands of masters."
              </p>
              <div className="h-[1px] w-32 bg-luxury-gold/50" />
            </div>
            <ParallaxCraftCards />
          </div>
        </CinematicSection>

        <CircularCategorySelector />

        <SplitSection 
          subtitle="Bespoke"
          title="Tailored to Your Identity"
          description="Our master tailors work with you to create pieces that are as unique as your own signature. Every stitch is a conversation between tradition and modernity."
          image="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=2080&auto=format&fit=crop"
          reversed={true}
          link="/bespoke"
          linkText="Begin Your Journey"
        />

        <BespokeExperience />



        <AestheticsSection />
        <SartorialVisionsSection />
        
        <CinematicProductSection />

        <FeaturedProducts />

        <HeritageSection />
      </main>

      <Footer />
    </div>
  );
}
