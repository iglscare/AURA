import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react';
import Logo from './Logo';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const { cart, isAuthenticated, user } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setIsScrolled(currentScrollY > 50);
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Shop', path: '/shop' },
    { name: 'Collections', path: '/shop?category=All' },
    { name: 'Bespoke', path: '/' },
    { name: 'About', path: '/' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4 md:px-12',
          isScrolled ? 'bg-luxury-black/80 backdrop-blur-md border-b border-white/5 py-3' : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between relative">
          {/* Logo */}
          <Link to="/" className="relative z-50 mix-blend-difference">
            <Logo size="md" animated={true} />
          </Link>

          {/* Desktop Nav */}
          <div className={`hidden md:flex items-center space-x-8 transition-opacity duration-300 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-sm uppercase tracking-widest text-white/80 hover:text-luxury-gold transition-colors duration-300 relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-luxury-gold transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Search Bar Overlay */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: '100%' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex items-center justify-center z-40 bg-luxury-black/90 md:bg-transparent h-full md:h-auto px-4 md:px-0"
              >
                <form onSubmit={handleSearchSubmit} className="w-full max-w-xl relative flex items-center">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for luxury..."
                    className="w-full bg-transparent border-b border-white/30 py-2 text-white text-lg focus:outline-none focus:border-luxury-gold placeholder:text-white/30 font-serif"
                  />
                  <button 
                    type="button" 
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute right-0 text-white/50 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Icons */}
          <div className="hidden md:flex items-center space-x-6 z-50">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-white/80 hover:text-luxury-gold transition-colors"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>
            
            {user?.isAdmin && (
              <Link to="/admin" className="text-xs uppercase tracking-wider bg-luxury-gold/20 text-luxury-gold border border-luxury-gold/40 px-3 py-1 rounded-full font-bold hover:bg-luxury-gold hover:text-black transition-colors">
                Admin
              </Link>
            )}

            {isAuthenticated ? (
               <Link to="/profile" className="text-white/80 hover:text-luxury-gold transition-colors">
                 <User size={20} strokeWidth={1.5} />
               </Link>
            ) : (
               <Link to="/login" className="text-white/80 hover:text-luxury-gold transition-colors">
                 <span className="text-xs uppercase tracking-wider border border-white/20 px-3 py-1 rounded-full hover:border-luxury-gold transition-colors">Sign In</span>
               </Link>
            )}

            <Link to="/cart" className="text-white/80 hover:text-luxury-gold transition-colors relative">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-luxury-gold text-luxury-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Quick Action & Menu Toggle */}
          <div className="flex items-center space-x-4 md:hidden z-50">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-white/80 hover:text-luxury-gold transition-colors p-1"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>
            
            <Link to="/cart" className="text-white/80 hover:text-luxury-gold transition-colors relative p-1">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-luxury-gold text-luxury-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cart.length}
                </span>
              )}
            </Link>

            <button
              className="text-white p-1 ml-1"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-luxury-black z-40 flex flex-col items-center justify-center px-6 py-16 overflow-y-auto space-y-6"
          >
            {/* Mobile Search */}
            <form onSubmit={(e) => { handleSearchSubmit(e); setIsMobileMenuOpen(false); }} className="w-full max-w-xs mb-4 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full bg-transparent border-b border-white/30 py-2 text-white text-base focus:outline-none focus:border-luxury-gold placeholder:text-white/30 text-center font-serif"
              />
              <button type="submit" className="absolute right-0 top-2 text-white/50">
                <Search size={18} />
              </button>
            </form>

            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-serif text-2xl sm:text-3xl text-white hover:text-luxury-gold transition-colors tracking-wide"
              >
                {link.name}
              </Link>
            ))}

            {user?.isAdmin && (
              <Link 
                to="/admin" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xs uppercase tracking-wider bg-luxury-gold/20 text-luxury-gold border border-luxury-gold/40 px-4 py-2 rounded-full font-bold hover:bg-luxury-gold hover:text-black transition-colors my-2"
              >
                Admin Control Center
              </Link>
            )}

            <div className="flex space-x-8 pt-4">
              <Link to={isAuthenticated ? "/profile" : "/login"} onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-luxury-gold transition-colors">
                <User size={24} />
              </Link>
              <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-luxury-gold transition-colors relative">
                <ShoppingBag size={24} />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-luxury-gold text-luxury-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {cart.length}
                  </span>
                )}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
