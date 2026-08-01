import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-luxury-black border-t border-white/5 pt-32 pb-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        <Link to="/" className="block mb-12 mix-blend-difference">
          <Logo size="xl" animated={true} />
        </Link>
        
        <div className="w-full max-w-2xl mb-24">
          <h4 className="text-luxury-gold text-[10px] uppercase tracking-[0.8em] font-light mb-8">The Newsletter</h4>
          <form className="relative flex items-center">
            <input 
              type="email" 
              placeholder="YOUR EMAIL ADDRESS" 
              className="w-full bg-transparent border-b border-white/10 py-4 text-white text-[11px] uppercase tracking-[0.4em] focus:outline-none focus:border-luxury-gold transition-colors placeholder:text-white/20"
            />
            <button className="absolute right-0 text-white/40 hover:text-white transition-colors text-[10px] uppercase tracking-[0.4em]">
              Subscribe
            </button>
          </form>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-24 mb-24 w-full">
          <div className="space-y-6">
            <h4 className="text-luxury-gold text-[10px] uppercase tracking-[0.4em] font-light">Collections</h4>
            <ul className="space-y-4">
              {['Watches', 'Perfumes', 'Glasses', 'Clothing'].map((item) => (
                <li key={item}>
                  <Link to={`/shop?category=${item}`} className="text-white/40 hover:text-white transition-colors text-[11px] uppercase tracking-widest">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-luxury-gold text-[10px] uppercase tracking-[0.4em] font-light">Bespoke</h4>
            <ul className="space-y-4">
              {['Personalization', 'Exclusivity', 'Mastery', 'Archive'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/40 hover:text-white transition-colors text-[11px] uppercase tracking-widest">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-luxury-gold text-[10px] uppercase tracking-[0.4em] font-light">Legal</h4>
            <ul className="space-y-4">
              {['Privacy', 'Terms', 'Shipping', 'Returns'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/40 hover:text-white transition-colors text-[11px] uppercase tracking-widest">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-luxury-gold text-[10px] uppercase tracking-[0.4em] font-light">Social</h4>
            <ul className="space-y-4">
              {['Instagram', 'Twitter', 'LinkedIn', 'YouTube'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/40 hover:text-white transition-colors text-[11px] uppercase tracking-widest">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-12" />
        
        <div className="flex flex-col md:flex-row justify-between w-full items-center text-white/20 text-[10px] tracking-[0.4em] uppercase">
          <p>&copy; {new Date().getFullYear()} Aura Luxury. All rights reserved.</p>
          <p className="mt-4 md:mt-0">Geneva • Paris • London</p>
        </div>
      </div>
    </footer>
  );
}
