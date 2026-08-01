import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'motion/react';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 492;

export default function BespokeExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameObjRef = useRef({ frame: 0 });
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const text3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Preload frame images
    const images: HTMLImageElement[] = [];
    let loaded = 0;

    const renderFrame = (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = imagesRef.current[index];
      if (!img || !img.complete) return;

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const imgWidth = img.naturalWidth || img.width;
      const imgHeight = img.naturalHeight || img.height;

      if (!imgWidth || !imgHeight) return;

      const ratio = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
      const newWidth = imgWidth * ratio;
      const newHeight = imgHeight * ratio;
      const x = (canvasWidth - newWidth) / 2;
      const y = (canvasHeight - newHeight) / 2;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, x, y, newWidth, newHeight);
    };

    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth * (window.devicePixelRatio || 1);
      canvas.height = window.innerHeight * (window.devicePixelRatio || 1);
      renderFrame(Math.round(frameObjRef.current.frame));
    };

    window.addEventListener('resize', handleResize);

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(4, '0');
      img.src = `/scroll-animation/frame_${frameNum}.png`;

      img.onload = () => {
        loaded++;
        if (loaded === 1) {
          handleResize();
          renderFrame(0);
          setIsReady(true);
        }
        if (loaded % 20 === 0 || loaded === TOTAL_FRAMES) {
          setLoadedCount(loaded);
        }
      };

      images.push(img);
    }
    imagesRef.current = images;

    // 2. GSAP ScrollTrigger timeline
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=450%',
          pin: true,
          scrub: 0.5,
          onUpdate: (self) => {
            const frameIndex = Math.min(
              TOTAL_FRAMES - 1,
              Math.max(0, Math.floor(frameObjRef.current.frame))
            );
            renderFrame(frameIndex);
          },
        },
      });

      // Frame animation sequence
      timeline.to(frameObjRef.current, {
        frame: TOTAL_FRAMES - 1,
        ease: 'none',
        duration: 10,
      }, 0);

      // Text Phase 1 (0 -> 2.5s)
      timeline.fromTo(text1Ref.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
        0.2
      );
      timeline.to(text1Ref.current,
        { opacity: 0, y: -50, duration: 1, ease: 'power2.in' },
        2.5
      );

      // Text Phase 2 (3.5s -> 6.5s)
      timeline.fromTo(text2Ref.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
        3.5
      );
      timeline.to(text2Ref.current,
        { opacity: 0, y: -50, duration: 1, ease: 'power2.in' },
        6.5
      );

      // Text Phase 3 (7.5s -> 10s)
      timeline.fromTo(text3Ref.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.5, ease: 'power2.out' },
        7.5
      );
    }, containerRef);

    return () => {
      ctx.revert();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-luxury-black">
      {/* Scroll Animation Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-90 pointer-events-none"
      />

      {/* Ambient Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-luxury-black/70 z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#000_100%)] opacity-60 z-10 pointer-events-none" />

      {/* Progress / Preloader indicator if still initial loading */}
      {!isReady && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-luxury-black">
          <div className="w-12 h-12 border-2 border-luxury-gold/30 border-t-luxury-gold rounded-full animate-spin mb-4" />
          <p className="text-luxury-gold text-xs uppercase tracking-[0.4em] font-light">
            Loading Experience ({Math.round((loadedCount / TOTAL_FRAMES) * 100)}%)
          </p>
        </div>
      )}

      {/* Content Container */}
      <div className="relative z-20 h-full w-full flex items-center justify-center px-4 sm:px-6">
        
        {/* Phase 1 Text */}
        <div ref={text1Ref} className="absolute text-center max-w-3xl opacity-0 pointer-events-none px-2">
          <span className="text-luxury-gold text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.8em] mb-4 sm:mb-6 block font-light">
            Bespoke Craftsmanship
          </span>
          <h2 className="font-serif text-3xl sm:text-6xl md:text-8xl text-white mb-4 sm:mb-8 leading-tight tracking-tight">
            Beyond <br />
            <span className="italic font-extralight text-white/40">Imagination</span>
          </h2>
          <p className="text-gray-300 text-sm sm:text-lg md:text-xl max-w-xl mx-auto leading-relaxed font-light">
            Every detail is a dialogue between your vision and our mastery. We don't just create products; we craft legacies.
          </p>
        </div>

        {/* Phase 2 Text */}
        <div ref={text2Ref} className="absolute text-center max-w-3xl opacity-0 pointer-events-none px-2">
          <span className="text-luxury-gold text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.8em] mb-4 sm:mb-6 block font-light">
            Engineered Perfection
          </span>
          <h2 className="font-serif text-3xl sm:text-6xl md:text-8xl text-white mb-4 sm:mb-8 leading-tight tracking-tight">
            Micro-Precision <br />
            <span className="italic font-extralight text-white/40 font-serif">Unveiled</span>
          </h2>
          <p className="text-gray-300 text-sm sm:text-lg md:text-xl max-w-xl mx-auto leading-relaxed font-light">
            Witness every movement disassembled into pure harmony—where timeless aesthetics meet uncompromised accuracy.
          </p>
        </div>

        {/* Phase 3 Text & CTA */}
        <div ref={text3Ref} className="absolute text-center max-w-3xl opacity-0 px-2">
          <span className="text-luxury-gold text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.8em] mb-4 sm:mb-6 block font-light">
            The Ultimate Expression
          </span>
          <h2 className="font-serif text-3xl sm:text-6xl md:text-8xl text-white mb-4 sm:mb-8 leading-tight tracking-tight">
            Own the <br />
            <span className="italic font-extralight text-white/40">Masterpiece</span>
          </h2>
          <p className="text-gray-300 text-sm sm:text-lg md:text-xl max-w-xl mx-auto leading-relaxed font-light mb-6 sm:mb-12">
            Tailored specifically for those who command distinction.
          </p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 sm:px-12 py-3.5 sm:py-5 border border-luxury-gold/50 bg-luxury-black/60 backdrop-blur-md rounded-full text-white text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.4em] hover:bg-luxury-gold hover:text-black transition-all duration-500 shadow-2xl"
          >
            Start Your Journey
          </motion.button>
        </div>
      </div>

      {/* Decorative Side Text */}
      <div className="absolute left-12 bottom-12 z-20 hidden xl:block pointer-events-none">
        <p className="text-[10px] uppercase tracking-[0.5em] text-white/30 rotate-[-90deg] origin-left">
          PERSONALIZATION • EXCLUSIVITY • MASTERY
        </p>
      </div>

      {/* Scroll indicator prompt */}
      <div className="absolute right-12 bottom-12 z-20 hidden md:flex flex-col items-center gap-3 pointer-events-none">
        <span className="text-[9px] uppercase tracking-[0.4em] text-white/30 rotate-90 origin-right translate-x-4 mb-8">
          Scroll
        </span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-luxury-gold/50 to-transparent" />
      </div>
    </section>
  );
}
