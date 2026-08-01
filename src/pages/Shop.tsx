import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link, useSearchParams } from 'react-router-dom';
import { formatCurrency } from '../lib/utils';

export default function Shop() {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter || 'All');
  const { products, isAuthenticated } = useStore();

  const categories = ['All', 'Watches', 'Perfumes', 'Glasses', 'Clothing', 'Accessories'];

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center px-6">
        <Navbar />
        <div className="text-center max-w-md">
          <h2 className="font-serif text-3xl text-white mb-4">Members Only Access</h2>
          <p className="text-gray-400 mb-8">Please sign in to view our exclusive collection and access the full shopping experience.</p>
          <Link to="/login" className="inline-block bg-luxury-gold text-black px-8 py-3 rounded-full font-medium uppercase tracking-wider hover:bg-white transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-luxury-black min-h-screen pt-20 sm:pt-24">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 sm:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 sm:mb-16 gap-4">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white">The Collection</h1>
          
          <div className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm uppercase tracking-wider transition-all whitespace-nowrap ${
                  selectedCategory === cat 
                    ? 'bg-luxury-gold text-black font-medium' 
                    : 'border border-white/20 text-white hover:border-luxury-gold'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 gap-y-8 sm:gap-y-16">
          {filteredProducts.map((product) => {
            const isOutOfStock = product.inStock === false;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="group"
              >
                <Link to={`/product/${product.id}`}>
                  <div className="relative aspect-[4/5] overflow-hidden bg-white/5 mb-3 sm:mb-6 rounded-xl sm:rounded-2xl border border-white/10">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${isOutOfStock ? 'opacity-40 grayscale' : ''}`}
                      referrerPolicy="no-referrer" 
                      decoding="async" 
                      loading="lazy" 
                    />
                    
                    {isOutOfStock && (
                      <div className="absolute top-3 left-3 bg-red-500/80 text-white font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-md z-10 shadow-lg">
                        Out of Stock
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6 opacity-0 sm:opacity-100 sm:translate-y-full group-hover:translate-y-0 transition-all duration-500 hidden sm:block">
                      <button className="w-full bg-white text-black py-2 sm:py-3 uppercase tracking-widest text-[10px] sm:text-xs font-bold hover:bg-luxury-gold transition-colors rounded-lg">
                        View Details
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-center px-1">
                    <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-wider mb-1">{product.category}</p>
                    <h3 className="font-serif text-base sm:text-xl text-white mb-1 group-hover:text-luxury-gold transition-colors line-clamp-1">{product.name}</h3>
                    <span className="font-mono text-xs sm:text-base text-luxury-gold">{formatCurrency(product.price)}</span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
