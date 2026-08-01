import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { formatCurrency } from '../lib/utils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore, Product } from '../store/useStore';

gsap.registerPlugin(ScrollTrigger);

function ProductCard({ product }: { product: Product; key?: string }) {
  const [hasError, setHasError] = React.useState(false);

  if (hasError) return null;

  return (
    <div className="w-[260px] sm:w-[340px] md:w-[420px] flex-shrink-0 group perspective-1000 select-none">
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-[4/5] overflow-hidden bg-white/5 transition-all duration-700 shadow-2xl group-hover:shadow-luxury-gold/20 border border-white/10 group-hover:border-luxury-gold/40 rounded-3xl">
          <img 
            src={product.image} 
            alt={product.name} 
            onError={() => setHasError(true)}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            referrerPolicy="no-referrer" 
            decoding="async" 
            loading="lazy" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
          
          {/* Top Right Price Tag */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
            <span className="font-mono text-luxury-gold bg-black/70 backdrop-blur-xl px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/10 text-xs md:text-sm shadow-xl">
              {formatCurrency(product.price)}
            </span>
          </div>

          {/* Bottom Card Info */}
          <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 z-20">
            <h3 className="font-serif text-xl sm:text-2xl md:text-3xl text-white mb-1 group-hover:text-luxury-gold transition-colors duration-500 drop-shadow-2xl">
              {product.name}
            </h3>
            <p className="text-luxury-gold/70 text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] font-light">
              {product.category}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function FeaturedProducts() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const storeProducts = useStore((state) => state.products);

  const products = storeProducts.length > 0 ? storeProducts.slice(0, 12) : PRODUCTS.slice(0, 12);

  useEffect(() => {
    if (!sectionRef.current || !scrollTrackRef.current) return;

    const ctx = gsap.context(() => {
      const scrollTrack = scrollTrackRef.current!;
      const totalWidth = scrollTrack.scrollWidth;
      const viewWidth = window.innerWidth;
      const amountToScroll = totalWidth - viewWidth + 80;

      gsap.to(scrollTrack, {
        x: -amountToScroll,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${amountToScroll}`,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen bg-luxury-black text-white overflow-hidden flex flex-col justify-center py-12 sm:py-16">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full mb-8 sm:mb-12 flex flex-col md:flex-row justify-between items-start md:items-end">
        <div>
          <span className="text-luxury-gold text-xs uppercase tracking-[0.3em] sm:tracking-[0.5em] block mb-2 sm:mb-4 font-light">
            Exquisite Selection
          </span>
          <h2 className="font-serif text-3xl sm:text-6xl lg:text-7xl leading-tight">
            Curated Masterpieces
          </h2>
        </div>

        <div className="flex items-center gap-4 sm:gap-8 mt-4 md:mt-0">
          <span className="text-white/40 text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] font-light">
            Swipe or scroll ({products.length} Items)
          </span>
          <Link 
            to="/shop" 
            className="text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] border-b border-white/20 pb-1.5 hover:text-luxury-gold hover:border-luxury-gold transition-all duration-500 font-light"
          >
            Explore All
          </Link>
        </div>
      </div>

      {/* Horizontal Track */}
      <div className="w-full overflow-hidden">
        <div 
          ref={scrollTrackRef} 
          className="flex gap-6 sm:gap-8 md:gap-12 px-6 md:px-12 w-max items-center"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}

          {/* End Callout Card */}
          <div className="w-[260px] sm:w-[340px] md:w-[420px] aspect-[4/5] flex-shrink-0 rounded-3xl border border-white/10 bg-white/5 flex flex-col items-center justify-center p-6 sm:p-8 text-center backdrop-blur-md">
            <span className="text-luxury-gold text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] mb-4 font-light">
              Full Collection
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-white mb-6">
              Discover All Masterpieces
            </h3>
            <Link 
              to="/shop" 
              className="px-6 sm:px-8 py-3.5 sm:py-4 bg-luxury-gold text-black text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] rounded-full font-medium hover:bg-white transition-all duration-500 shadow-xl"
            >
              View Entire Catalog
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
