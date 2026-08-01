import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PaymentModal from '../components/PaymentModal';
import { formatCurrency } from '../lib/utils';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, isAuthenticated } = useStore();
  const navigate = useNavigate();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0; // Free shipping for luxury
  const total = subtotal + shipping;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-luxury-black min-h-screen pt-20 sm:pt-24">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 sm:py-12">
        <h1 className="font-serif text-3xl sm:text-4xl text-white mb-8 sm:mb-12">Shopping Bag</h1>

        {cart.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <p className="text-gray-400 mb-8">Your bag is currently empty.</p>
            <Link to="/shop" className="inline-block border border-white/30 px-8 py-3 text-white uppercase tracking-widest hover:bg-white hover:text-black transition-colors rounded-full text-xs sm:text-sm">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {cart.map((item) => (
                <motion.div 
                  layout
                  key={item.id} 
                  className="flex gap-4 sm:gap-6 border-b border-white/10 pb-6 sm:pb-8"
                >
                  <div className="w-20 h-28 sm:w-24 sm:h-32 bg-white/5 flex-shrink-0 rounded-lg overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover"  referrerPolicy="no-referrer" decoding="async" loading="lazy" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="font-serif text-base sm:text-xl text-white mb-1">{item.name}</h3>
                        <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-wider">{item.category}</p>
                      </div>
                      <p className="font-mono text-luxury-gold text-sm sm:text-base">{formatCurrency(item.price)}</p>
                    </div>

                    <div className="flex justify-between items-end mt-4 sm:mt-0">
                      <div className="flex items-center border border-white/20 rounded-full">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 sm:p-2 text-gray-400 hover:text-white"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-2 text-white font-mono text-xs sm:text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 sm:p-2 text-gray-400 hover:text-white"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-500 hover:text-red-400 transition-colors text-[10px] sm:text-xs uppercase tracking-wider flex items-center gap-1 p-1"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 p-8 sticky top-32">
                <h3 className="font-serif text-2xl text-white mb-8">Order Summary</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span className="text-white font-mono">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span className="text-white">Complimentary</span>
                  </div>
                </div>
                
                <div className="border-t border-white/10 pt-6 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">Total</span>
                    <span className="text-luxury-gold font-serif text-xl">{formatCurrency(total)}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setIsPaymentOpen(true)}
                  className="w-full bg-luxury-gold text-black py-4 uppercase tracking-widest text-sm font-bold hover:bg-white transition-colors flex items-center justify-center gap-2"
                >
                  Checkout <ArrowRight size={16} />
                </button>
                
                <p className="text-center text-gray-500 text-xs mt-4">
                  Secure Checkout • 30-Day Returns
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
      <PaymentModal 
        isOpen={isPaymentOpen} 
        onClose={() => setIsPaymentOpen(false)} 
        total={total} 
      />
    </div>
  );
}
