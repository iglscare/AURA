import React, { useEffect, useState } from 'react';
import { useStore, Order } from '../store/useStore';
import Navbar from '../components/Navbar';
import { useNavigate, Link } from 'react-router-dom';
import { formatCurrency } from '../lib/utils';
import { Package, Heart, User, MapPin, Settings, LogOut, Edit2, Save, X, Plus, Clock, Truck, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Profile() {
  const { user, logout, isAuthenticated, wishlist, updateUser, ordersList, products } = useStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditEmail(user.email);
    }
  }, [user]);

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveProfile = () => {
    updateUser({ name: editName, email: editEmail });
    setIsEditing(false);
  };

  const wishlistItems = products.filter(p => wishlist.includes(p.id));

  // Get customer's orders from the store / Supabase order list
  const userEmailLower = user?.email?.toLowerCase().trim() || '';
  const myOrders = ordersList.filter(o => 
    o.customerEmail?.toLowerCase().trim() === userEmailLower || 
    (user?.name && o.customerName?.toLowerCase().trim() === user.name.toLowerCase().trim())
  );

  const tabs = [
    { name: 'Overview', icon: User },
    { name: 'Orders', icon: Package, count: myOrders.length },
    { name: 'Wishlist', icon: Heart, count: wishlistItems.length },
    { name: 'Addresses', icon: MapPin },
    { name: 'Settings', icon: Settings },
  ];

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Pending':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40"><Clock size={13} /> Order Placed</span>;
      case 'Processing':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40"><Package size={13} /> In Processing</span>;
      case 'Shipped':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/40"><Truck size={13} /> Out for Delivery</span>;
      case 'Delivered':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"><CheckCircle size={13} /> Delivered</span>;
      case 'Cancelled':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/40"><AlertCircle size={13} /> Cancelled</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-500/20 text-gray-300 border border-gray-500/40">{status}</span>;
    }
  };

  const statusSteps: Order['status'][] = ['Pending', 'Processing', 'Shipped', 'Delivered'];

  const getStepIndex = (status: Order['status']) => {
    if (status === 'Cancelled') return -1;
    return statusSteps.indexOf(status);
  };

  return (
    <div className="bg-luxury-black min-h-screen pt-24">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
             <h1 className="font-serif text-4xl text-white mb-2">My Account</h1>
             <p className="text-gray-400 text-sm">Manage your personal information and live orders.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-400 hover:text-red-400 text-sm uppercase tracking-widest border border-white/20 px-6 py-2 rounded-full hover:border-red-400 transition-colors"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Sidebar / Tabs */}
          <div className="flex overflow-x-auto no-scrollbar lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 pb-2 lg:pb-0">
            {tabs.map((tab) => (
              <button 
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center justify-between py-2.5 px-4 rounded-lg transition-all duration-300 whitespace-nowrap text-xs sm:text-sm ${activeTab === tab.name ? 'bg-luxury-gold text-black font-medium' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <tab.icon size={16} />
                  <span>{tab.name}</span>
                </div>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeTab === tab.name ? 'bg-black text-luxury-gold' : 'bg-white/10 text-white'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="lg:col-span-3 bg-white/5 p-4 sm:p-8 rounded-2xl border border-white/5 min-h-[450px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'Overview' && (
                  <div className="space-y-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left w-full sm:w-auto">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-luxury-gold to-yellow-600 rounded-full flex items-center justify-center text-3xl sm:text-4xl font-serif text-black shadow-lg flex-shrink-0">
                          {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          {isEditing ? (
                            <div className="space-y-3">
                              <input 
                                type="text" 
                                value={editName} 
                                onChange={(e) => setEditName(e.target.value)}
                                className="bg-black/30 border border-white/20 rounded px-3 py-2 text-white focus:border-luxury-gold outline-none block w-full"
                              />
                              <input 
                                type="email" 
                                value={editEmail} 
                                onChange={(e) => setEditEmail(e.target.value)}
                                className="bg-black/30 border border-white/20 rounded px-3 py-2 text-white focus:border-luxury-gold outline-none block w-full"
                              />
                              <div className="flex gap-2">
                                <button onClick={handleSaveProfile} className="text-xs bg-luxury-gold text-black px-3 py-1 rounded flex items-center gap-1 hover:bg-white transition-colors"><Save size={12} /> Save</button>
                                <button onClick={() => setIsEditing(false)} className="text-xs bg-white/10 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-white/20 transition-colors"><X size={12} /> Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <h2 className="text-3xl text-white font-serif mb-1">{user?.name}</h2>
                              <p className="text-gray-400 mb-2">{user?.email}</p>
                              <div className="flex gap-3">
                                <span className="inline-block text-xs bg-luxury-gold/20 text-luxury-gold px-3 py-1 rounded-full uppercase tracking-wider border border-luxury-gold/20">Platinum VIP Member</span>
                                <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-white transition-colors"><Edit2 size={16} /></button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-black/20 p-6 rounded-xl border border-white/5">
                        <h3 className="text-gray-400 text-xs uppercase tracking-widest mb-2">Total Orders</h3>
                        <p className="text-3xl text-white font-serif">{myOrders.length}</p>
                      </div>
                      <div className="bg-black/20 p-6 rounded-xl border border-white/5">
                        <h3 className="text-gray-400 text-xs uppercase tracking-widest mb-2">Wishlist Items</h3>
                        <p className="text-3xl text-white font-serif">{wishlistItems.length}</p>
                      </div>
                      <div className="bg-black/20 p-6 rounded-xl border border-white/5">
                        <h3 className="text-gray-400 text-xs uppercase tracking-widest mb-2">Saved Addresses</h3>
                        <p className="text-3xl text-white font-serif">{user?.addresses?.length || 0}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'Orders' && (
                  <div>
                    <h3 className="text-2xl text-white font-serif mb-6">Order History & Delivery Tracker</h3>
                    {myOrders.length > 0 ? (
                      <div className="space-y-6">
                        {myOrders.map((order: Order) => {
                          const currentStep = getStepIndex(order.status);

                          return (
                            <div key={order.id} className="bg-black/40 p-6 rounded-2xl border border-white/10 space-y-6 hover:border-luxury-gold/30 transition-all">
                              {/* Order Header */}
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
                                <div>
                                  <div className="flex items-center gap-3 mb-1">
                                    <span className="font-mono text-luxury-gold text-lg font-bold">{order.id}</span>
                                    <span className="text-xs text-gray-400 font-light">({order.date})</span>
                                  </div>
                                  <p className="text-gray-400 text-xs">Customer: <span className="text-white">{order.customerName}</span></p>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="text-right">
                                    <span className="text-gray-400 text-[10px] uppercase block">Total Amount</span>
                                    <span className="text-luxury-gold font-mono text-base font-bold">{formatCurrency(order.total)}</span>
                                  </div>
                                  {getStatusBadge(order.status)}
                                </div>
                              </div>

                              {/* Order Items List */}
                              <div className="space-y-3">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-black/40 flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                      </div>
                                      <div>
                                        <h4 className="text-white text-sm font-medium">{item.name}</h4>
                                        <p className="text-gray-400 text-xs">{item.category} • Qty: {item.quantity}</p>
                                      </div>
                                    </div>
                                    <span className="font-mono text-luxury-gold text-sm">
                                      {formatCurrency(item.price * item.quantity)}
                                    </span>
                                  </div>
                                ))}
                              </div>

                              {/* Delivery Progress Bar */}
                              {order.status !== 'Cancelled' && (
                                <div className="pt-4 border-t border-white/5">
                                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-4 font-medium">Delivery Progress</p>
                                  <div className="grid grid-cols-4 gap-2 text-center relative">
                                    {statusSteps.map((step, idx) => {
                                      const isCompleted = currentStep >= idx;
                                      const isCurrent = currentStep === idx;

                                      return (
                                        <div key={step} className="flex flex-col items-center gap-2">
                                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all border ${
                                            isCurrent 
                                              ? 'bg-luxury-gold text-black border-luxury-gold shadow-lg shadow-luxury-gold/30 ring-2 ring-luxury-gold/50' 
                                              : isCompleted 
                                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                                                : 'bg-white/5 text-gray-500 border-white/10'
                                          }`}>
                                            {isCompleted ? '✓' : idx + 1}
                                          </div>
                                          <span className={`text-[10px] uppercase tracking-wider ${
                                            isCurrent ? 'text-luxury-gold font-bold' : isCompleted ? 'text-white font-medium' : 'text-gray-500'
                                          }`}>
                                            {step}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500 bg-black/20 rounded-2xl border border-white/5">
                        <Package size={48} className="mx-auto mb-4 opacity-50 text-luxury-gold" />
                        <p className="text-white text-lg font-serif mb-1">No Orders Found</p>
                        <p className="text-xs text-gray-400 mb-6">Explore our catalog and place your first luxury order.</p>
                        <Link to="/shop" className="px-6 py-2.5 bg-luxury-gold text-black rounded-full font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors">Start Shopping</Link>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'Wishlist' && (
                  <div>
                    <h3 className="text-2xl text-white font-serif mb-6">My Wishlist</h3>
                    {wishlistItems.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {wishlistItems.map((product) => (
                          <div key={product.id} className="bg-black/20 p-4 rounded-xl border border-white/5 flex gap-4 items-center">
                            <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-lg" referrerPolicy="no-referrer" decoding="async" loading="lazy" />
                            <div className="flex-1">
                              <h4 className="text-white font-serif mb-1">{product.name}</h4>
                              <p className="text-luxury-gold font-mono text-sm mb-2">{formatCurrency(product.price)}</p>
                              <Link to={`/product/${product.id}`} className="text-xs text-gray-400 hover:text-white uppercase tracking-wider border-b border-gray-600 hover:border-white pb-0.5 transition-colors">View Details</Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500 bg-black/20 rounded-2xl border border-white/5">
                        <Heart size={48} className="mx-auto mb-4 opacity-50 text-luxury-gold" />
                        <p className="text-white text-lg font-serif mb-1">Your Wishlist is Empty</p>
                        <p className="text-xs text-gray-400 mb-6">Save your favorite luxury pieces for later.</p>
                        <Link to="/shop" className="px-6 py-2.5 bg-luxury-gold text-black rounded-full font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors">Browse Collections</Link>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'Addresses' && (
                  <div>
                    <h3 className="text-2xl text-white font-serif mb-6">Saved Addresses</h3>
                    <div className="bg-black/20 p-6 rounded-xl border border-white/5 border-dashed flex flex-col items-center justify-center text-center py-12 cursor-pointer hover:bg-black/30 transition-colors group">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-luxury-gold group-hover:text-black transition-colors">
                        <Plus size={24} />
                      </div>
                      <p className="text-gray-400 text-sm">Add New Delivery Address</p>
                    </div>
                  </div>
                )}

                {activeTab === 'Settings' && (
                  <div>
                    <h3 className="text-2xl text-white font-serif mb-6">Account Settings</h3>
                    <div className="space-y-6 max-w-md">
                      <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                        <div>
                           <p className="text-white">Email Notifications</p>
                           <p className="text-xs text-gray-500">Receive real-time order delivery updates</p>
                        </div>
                        <div className="w-10 h-5 bg-luxury-gold rounded-full relative cursor-pointer">
                          <div className="absolute right-1 top-1 w-3 h-3 bg-black rounded-full" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                        <div>
                           <p className="text-white">Two-Factor Auth</p>
                           <p className="text-xs text-gray-500">Enhanced account security</p>
                        </div>
                        <div className="w-10 h-5 bg-white/20 rounded-full relative cursor-pointer">
                          <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full" />
                        </div>
                      </div>
                      <button className="text-red-400 text-sm hover:underline">Delete Account</button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
