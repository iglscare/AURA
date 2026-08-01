import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, Lock, CheckCircle, Loader2 } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
}

export default function PaymentModal({ isOpen, onClose, total }: PaymentModalProps) {
  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');
  const { clearCart, cart, addOrder, user } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setStep('details');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    
    const newOrder = {
      id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      customerName: name || user?.name || 'Valued Guest',
      customerEmail: user?.email || 'guest@aura.com',
      items: [...cart],
      total: total,
      status: 'Processing' as const,
      date: new Date().toISOString().split('T')[0]
    };

    try {
      await addOrder(newOrder);
    } catch (err) {
      console.error('Order save error:', err);
    }

    setTimeout(() => {
      setStep('success');
      clearCart();
      setTimeout(() => {
        onClose();
        navigate('/profile');
      }, 2000);
    }, 1500);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    }
    return value;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-md max-h-[90vh] bg-luxury-charcoal border border-white/10 rounded-2xl shadow-2xl z-[70] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-white/10 bg-white/5 sticky top-0 bg-luxury-charcoal z-10">
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-luxury-gold" />
                <span className="text-white font-serif tracking-wide text-sm sm:text-base">Secure Checkout</span>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-8">
              {step === 'details' && (
                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                  <div className="text-center mb-6 sm:mb-8">
                    <p className="text-gray-400 text-xs uppercase tracking-widest mb-1 sm:mb-2">Total Amount</p>
                    <p className="text-3xl sm:text-4xl text-white font-serif">{formatCurrency(total)}</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Cardholder Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-luxury-gold transition-colors"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Card Number</label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-luxury-gold transition-colors pl-12"
                          placeholder="0000 0000 0000 0000"
                        />
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Expiry</label>
                        <input
                          type="text"
                          required
                          maxLength={5}
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-luxury-gold transition-colors"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">CVC</label>
                        <input
                          type="text"
                          required
                          maxLength={3}
                          value={cvc}
                          onChange={(e) => setCvc(e.target.value)}
                          className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-luxury-gold transition-colors"
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-luxury-gold text-black py-4 rounded-lg uppercase tracking-widest text-sm font-bold hover:bg-white transition-colors mt-8"
                  >
                    Pay {formatCurrency(total)}
                  </button>
                </form>
              )}

              {step === 'processing' && (
                <div className="py-12 text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block mb-6"
                  >
                    <Loader2 size={48} className="text-luxury-gold" />
                  </motion.div>
                  <h3 className="text-xl text-white font-serif mb-2">Processing Payment</h3>
                  <p className="text-gray-400 text-sm">Please do not close this window...</p>
                </div>
              )}

              {step === 'success' && (
                <div className="py-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-block mb-6 text-green-500"
                  >
                    <CheckCircle size={64} />
                  </motion.div>
                  <h3 className="text-2xl text-white font-serif mb-2">Payment Successful</h3>
                  <p className="text-gray-400 text-sm">Your order has been confirmed.</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
