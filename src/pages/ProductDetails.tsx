import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { formatCurrency } from '../lib/utils';
import { ArrowLeft, Heart } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, toggleWishlist, wishlist, isAuthenticated } = useStore();
  const product = products.find(p => p.id === id);
  const [isAdding, setIsAdding] = useState(false);

  if (!product) {
    return (
      <div className="bg-luxury-black min-h-screen text-white flex flex-col items-center justify-center">
        <Navbar />
        <h2 className="font-serif text-3xl mb-4">Product Not Found</h2>
        <button onClick={() => navigate('/shop')} className="px-6 py-2.5 bg-luxury-gold text-black rounded-full font-bold text-xs uppercase tracking-wider">
          Return to Shop
        </button>
      </div>
    );
  }

  const isOutOfStock = product.inStock === false;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (isOutOfStock) return;
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 1000);
  };

  const isWishlisted = wishlist.includes(product.id);

  return (
    <div className="bg-luxury-black min-h-screen">
      <Navbar />
      
      <div className="pt-24 sm:pt-32 pb-16 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white flex items-center gap-2 mb-8 sm:mb-12 uppercase text-xs tracking-widest">
          <ArrowLeft size={16} /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Image Section */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative aspect-[4/5] bg-white/5 overflow-hidden rounded-xl sm:rounded-2xl border border-white/10"
          >
            <img 
              src={product.image} 
              alt={product.name} 
              className={`w-full h-full object-cover ${isOutOfStock ? 'opacity-40 grayscale' : ''}`}
              referrerPolicy="no-referrer" decoding="async" loading="lazy" 
            />
            {isOutOfStock && (
              <div className="absolute top-4 left-4 bg-red-500/90 text-white font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full backdrop-blur-md shadow-xl">
                Out of Stock
              </div>
            )}
          </motion.div>

          {/* Details Section */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-luxury-gold text-xs sm:text-sm uppercase tracking-widest block mb-2 sm:mb-4">{product.category}</span>
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white mb-4 sm:mb-6">{product.name}</h1>
            <p className="font-mono text-xl sm:text-2xl text-white/80 mb-6 sm:mb-8">{formatCurrency(product.price)}</p>
            
            <p className="text-gray-400 leading-relaxed mb-8 sm:mb-10 font-light text-base sm:text-lg">
              {product.description}
            </p>

            <div className="mb-8 sm:mb-12">
              <h3 className="text-white text-xs sm:text-sm uppercase tracking-widest mb-3 sm:mb-4 border-b border-white/10 pb-2">Specifications</h3>
              <ul className="space-y-2">
                {product.specs.map((spec, i) => (
                  <li key={i} className="text-gray-400 text-xs sm:text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-luxury-gold rounded-full" />
                    {spec}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleAddToCart}
                disabled={isAdding || isOutOfStock}
                className={`flex-1 py-3.5 sm:py-4 uppercase tracking-widest text-xs sm:text-sm font-bold transition-colors rounded-lg sm:rounded-none ${
                  isOutOfStock 
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-black hover:bg-luxury-gold disabled:bg-luxury-gold/50'
                }`}
              >
                {isOutOfStock ? 'Currently Out of Stock' : isAdding ? 'Added to Cart' : 'Add to Cart'}
              </button>
              
              <button 
                onClick={() => toggleWishlist(product.id)}
                className={`p-3.5 sm:p-4 border border-white/20 transition-colors rounded-lg sm:rounded-none ${isWishlisted ? 'text-red-500 border-red-500' : 'text-white hover:border-white'}`}
              >
                <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
