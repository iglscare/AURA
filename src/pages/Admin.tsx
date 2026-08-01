import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore, Product, Order, ManagedUser } from '../store/useStore';
import Navbar from '../components/Navbar';
import { formatCurrency } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  LogOut, 
  ShieldCheck, 
  DollarSign, 
  Upload,
  CheckCircle2, 
  XCircle,
  Eye,
  Truck, 
  X,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  UserCheck,
  UserPlus,
  UserX,
  ShieldAlert,
  Search,
  Crown,
  History,
  Clock,
  Loader2,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Activity
} from 'lucide-react';

interface CustomerDetail {
  name: string;
  email: string;
  ordersCount: number;
  totalSpend: number;
  orders: Order[];
}

const renderStatusBadge = (status: Order['status']) => {
  switch (status) {
    case 'Pending':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-amber-500/10 border border-amber-500/30 text-amber-300 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          Pending
        </span>
      );
    case 'Processing':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-blue-500/10 border border-blue-500/30 text-blue-300 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          Processing
        </span>
      );
    case 'Shipped':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-purple-500/10 border border-purple-500/30 text-purple-300 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
          Shipped
        </span>
      );
    case 'Delivered':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Delivered
        </span>
      );
    case 'Cancelled':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-red-500/10 border border-red-500/30 text-red-400 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
          Cancelled
        </span>
      );
  }
};

export default function Admin() {
  const navigate = useNavigate();
  const { 
    user, 
    login, 
    logout, 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    toggleStock,
    ordersList, 
    updateOrderStatus,
    usersList,
    addUser,
    updateUserAdmin,
    deleteUser,
    toggleBlacklistUser
  } = useStore();

  // Login form state if not logged in as Admin
  const [emailInput, setEmailInput] = useState('');
  const [passInput, setPassInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'customers'>('dashboard');
  
  // Order Filter Status
  const [orderFilter, setOrderFilter] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Customer / User Inspector Modal State
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetail | null>(null);

  // User Management State
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'All' | 'Customer' | 'VIP' | 'Admin'>('All');
  const [userStatusFilter, setUserStatusFilter] = useState<'All' | 'Active' | 'Blacklisted'>('All');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);

  // User Form State
  const [userNameInput, setUserNameInput] = useState('');
  const [userEmailInput, setUserEmailInput] = useState('');
  const [userRoleInput, setUserRoleInput] = useState<'Customer' | 'VIP' | 'Admin'>('Customer');
  const [userStatusInput, setUserStatusInput] = useState<'Active' | 'Blacklisted'>('Active');
  const [userNotesInput, setUserNotesInput] = useState('');

  // Product Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Product Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<Product['category']>('Watches');
  const [imageMode, setImageMode] = useState<'file' | 'url'>('file');
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [description, setDescription] = useState('');
  const [specsInput, setSpecsInput] = useState('');
  const [inStock, setInStock] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const openAddUserModal = () => {
    setEditingUser(null);
    setUserNameInput('');
    setUserEmailInput('');
    setUserRoleInput('Customer');
    setUserStatusInput('Active');
    setUserNotesInput('');
    setIsUserModalOpen(true);
  };

  const openEditUserModal = (u: ManagedUser) => {
    setEditingUser(u);
    setUserNameInput(u.name);
    setUserEmailInput(u.email);
    setUserRoleInput(u.role);
    setUserStatusInput(u.status);
    setUserNotesInput(u.notes || '');
    setIsUserModalOpen(true);
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userNameInput.trim() || !userEmailInput.trim()) return;

    if (editingUser) {
      updateUserAdmin(editingUser.id, {
        name: userNameInput.trim(),
        email: userEmailInput.trim(),
        role: userRoleInput,
        status: userStatusInput,
        notes: userNotesInput.trim()
      });
    } else {
      addUser({
        name: userNameInput.trim(),
        email: userEmailInput.trim(),
        role: userRoleInput,
        status: userStatusInput,
        notes: userNotesInput.trim()
      });
    }
    setIsUserModalOpen(false);
  };

  const deletedUserEmails = useStore((state) => state.deletedUserEmails || []);

  const handleInspectUserHistory = (usr: ManagedUser) => {
    const customerDetail = customersMap[usr.email.toLowerCase()] || {
      name: usr.name,
      email: usr.email,
      ordersCount: 0,
      totalSpend: 0,
      orders: []
    };
    setSelectedCustomer(customerDetail);
  };

  const handleDeleteUserClick = (id: string, email: string, name: string) => {
    if (window.confirm(`Are you sure you want to permanently delete user account "${name}" (${email})?`)) {
      deleteUser(id, email);
    }
  };

  const isAdminAuthenticated = user?.isAdmin || false;

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim().toLowerCase() === 'admin@gmail.com' && passInput === 'admin') {
      login({
        id: 'admin_1',
        name: 'System Administrator',
        email: 'admin@gmail.com',
        isAdmin: true,
        addresses: ['AURA Headquarters, Geneva'],
        orders: []
      });
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Use email: admin@gmail.com and password: admin');
    }
  };

  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Direct File Upload Handler to Supabase Storage Bucket
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    setIsUploadingImage(true);

    try {
      const fileExt = file.name.split('.').pop() || 'png';
      const fileName = `product_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `catalog/${fileName}`;

      const { error } = await supabase.storage
        .from('products')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      if (publicUrlData?.publicUrl) {
        setImage(publicUrlData.publicUrl);
        setImagePreview(publicUrlData.publicUrl);
      }
    } catch (err: any) {
      console.warn('Storage upload fallback to Data URL:', err);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImage(result);
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setPrice('');
    setCategory('Watches');
    setImageMode('file');
    setImage('https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=1000');
    setImagePreview('https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=1000');
    setDescription('');
    setSpecsInput('Swiss Movement, Sapphire Crystal');
    setInStock(true);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price.toString());
    setCategory(product.category);
    setImageMode('url');
    setImage(product.image);
    setImagePreview(product.image);
    setDescription(product.description);
    setSpecsInput(product.specs.join(', '));
    setInStock(product.inStock !== false);
    setIsModalOpen(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedPrice = parseFloat(price) || 0;
    const specsArray = specsInput.split(',').map(s => s.trim()).filter(Boolean);
    const finalImage = image || 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=1000';

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name,
        price: parsedPrice,
        category,
        image: finalImage,
        description,
        specs: specsArray,
        inStock
      });
    } else {
      addProduct({
        name,
        price: parsedPrice,
        category,
        image: finalImage,
        description,
        specs: specsArray,
        inStock
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this luxury item from the catalog?')) {
      deleteProduct(id);
    }
  };

  // Build customer analytics from ordersList
  const customersMap = ordersList.reduce((acc, ord) => {
    const email = ord.customerEmail || 'unknown@aura.com';
    if (!acc[email]) {
      acc[email] = {
        name: ord.customerName || 'Valued Member',
        email: email,
        ordersCount: 0,
        totalSpend: 0,
        orders: []
      };
    }
    acc[email].ordersCount += 1;
    acc[email].totalSpend += ord.status !== 'Cancelled' ? ord.total : 0;
    acc[email].orders.push(ord);
    return acc;
  }, {} as Record<string, CustomerDetail>);

  const customerList = Object.values(customersMap);

  // Combine usersList with customers from ordersList so ALL registered users appear in admin console
  const combinedUsersMap: Record<string, ManagedUser> = {};

  (usersList || []).forEach((u) => {
    combinedUsersMap[u.email.toLowerCase()] = u;
  });

  customerList.forEach((cust) => {
    const lowerEmail = cust.email.toLowerCase();
    if (!combinedUsersMap[lowerEmail] && !deletedUserEmails.includes(lowerEmail)) {
      combinedUsersMap[lowerEmail] = {
        id: `usr_${lowerEmail.replace(/[^a-z0-9]/g, '_')}`,
        name: cust.name || lowerEmail.split('@')[0],
        email: cust.email,
        role: lowerEmail === 'admin@gmail.com' ? 'Admin' : 'Customer',
        status: 'Active',
        createdAt: cust.orders[0]?.date || '2026-07-28',
        notes: `Registered Customer (${cust.ordersCount} order${cust.ordersCount > 1 ? 's' : ''})`
      };
    }
  });

  const allDisplayUsers = Object.values(combinedUsersMap).filter(
    (u) => !deletedUserEmails.includes(u.email.toLowerCase())
  );

  // Metrics
  const totalSales = ordersList.reduce((acc, ord) => acc + (ord.status !== 'Cancelled' ? ord.total : 0), 0);
  const pendingOrders = ordersList.filter(o => o.status === 'Pending').length;
  const filteredOrders = ordersList.filter(o => orderFilter === 'All' ? true : o.status === orderFilter);

  // If not authenticated as Admin, show Admin Login Screen
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden">
        {/* Background glow accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-luxury-gold/5 rounded-full blur-[140px] pointer-events-none" />
        <Navbar />

        <div className="flex-1 flex items-center justify-center px-6 py-28 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md luxury-glass-card p-8 md:p-12 rounded-3xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden backdrop-blur-2xl"
          >
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-luxury-gold/15 rounded-full blur-3xl pointer-events-none" />

            <div className="text-center mb-8">
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ repeat: Infinity, repeatType: 'reverse', duration: 2.5 }}
                className="w-16 h-16 bg-luxury-gold/10 border border-luxury-gold/40 rounded-2xl flex items-center justify-center mx-auto mb-4 text-luxury-gold shadow-[0_0_20px_rgba(212,175,55,0.2)]"
              >
                <ShieldCheck size={32} />
              </motion.div>
              <h2 className="font-serif text-3xl font-normal gold-gradient-text mb-2 tracking-tight">AURA Admin Portal</h2>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-[0.2em]">Restricted Executive Access</p>
            </div>

            {loginError && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs text-center flex items-center justify-center gap-2"
              >
                <AlertCircle size={14} />
                <span>{loginError}</span>
              </motion.div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-6">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-2 font-bold">Admin Email</label>
                <input 
                  type="email" 
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-all text-sm font-sans placeholder:text-gray-600"
                  placeholder="admin@gmail.com"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-2 font-bold">Password</label>
                <input 
                  type="password" 
                  value={passInput}
                  onChange={(e) => setPassInput(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-all text-sm font-sans placeholder:text-gray-600"
                  placeholder="admin"
                  required
                />
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gradient-to-r from-luxury-gold via-amber-400 to-luxury-gold text-black py-4 rounded-xl uppercase tracking-[0.2em] text-xs font-bold transition-all duration-300 shadow-[0_0_25px_rgba(212,175,55,0.3)] hover:brightness-110"
              >
                Access Control Console
              </motion.button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  setEmailInput('admin@gmail.com');
                  setPassInput('admin');
                }}
                className="w-full py-3 bg-luxury-gold/10 border border-luxury-gold/30 rounded-xl text-luxury-gold text-xs uppercase tracking-wider hover:bg-luxury-gold/20 transition-all text-center flex items-center justify-center gap-2 font-semibold"
              >
                <ShieldCheck size={14} /> Auto Fill Credentials (admin@gmail.com / admin)
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden">
      {/* Subtle ambient lighting glows */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-luxury-gold/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[160px] pointer-events-none" />

      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 md:px-12 py-28 relative z-10">
        
        {/* Admin Header / Executive Control Bar */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-white/10 mb-10"
        >
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/30 text-[10px] uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
                <ShieldCheck size={13} /> Administrator Console
              </span>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> System Operational
              </span>
              {pendingOrders > 0 && (
                <span className="bg-amber-500/15 text-amber-300 border border-amber-500/40 text-[10px] uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full font-bold animate-pulse">
                  {pendingOrders} Pending Request{pendingOrders > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight gold-gradient-text">Management Console</h1>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              to="/shop" 
              className="px-5 py-2.5 bg-white/5 border border-white/15 rounded-xl text-xs uppercase tracking-[0.18em] font-bold hover:bg-white/10 transition-all text-white flex items-center gap-2 backdrop-blur-md"
            >
              <Eye size={14} className="text-luxury-gold" />
              <span>Storefront</span>
            </Link>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="px-5 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs uppercase tracking-[0.18em] font-bold hover:bg-red-500/20 transition-all flex items-center gap-2 backdrop-blur-md"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </motion.div>

        {/* Executive KPI Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { 
              title: 'Total Revenue', 
              value: formatCurrency(totalSales), 
              change: '+18.4% live', 
              icon: DollarSign, 
              color: 'text-luxury-gold bg-luxury-gold/10 border-luxury-gold/30',
              accent: 'from-luxury-gold/20 via-transparent to-transparent'
            },
            { 
              title: 'Order Requests', 
              value: ordersList.length, 
              change: `${pendingOrders} Pending Action`, 
              icon: ShoppingBag, 
              color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
              accent: 'from-blue-500/20 via-transparent to-transparent'
            },
            { 
              title: 'Active Products', 
              value: products.length, 
              change: `${products.filter(p => p.inStock === false).length} Out of Stock`, 
              icon: Package, 
              color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
              accent: 'from-purple-500/20 via-transparent to-transparent'
            },
            { 
              title: 'Total Users', 
              value: allDisplayUsers.length, 
              change: `${allDisplayUsers.filter(u => u.status === 'Blacklisted').length} Blacklisted`, 
              icon: Users, 
              color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
              accent: 'from-amber-500/20 via-transparent to-transparent'
            },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="luxury-glass-card p-6 rounded-2xl border border-white/10 backdrop-blur-2xl transition-all duration-300 hover:border-luxury-gold/40 shadow-2xl relative overflow-hidden group"
              >
                {/* Glow accent */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${stat.accent} rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700`} />

                <div className="flex items-center justify-between mb-4 relative z-10">
                  <span className="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-bold">{stat.title}</span>
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${stat.color} shadow-md`}>
                    <Icon size={18} />
                  </div>
                </div>
                
                <p className="font-sans text-3xl md:text-4xl text-white font-bold tracking-tight font-tabular mb-2 relative z-10">{stat.value}</p>
                
                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium relative z-10">
                  <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold inline-block" />
                  <span>{stat.change}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tab Navigation Container */}
        <div className="mb-8">
          <div className="bg-black/60 border border-white/10 backdrop-blur-2xl p-2 rounded-2xl flex items-center gap-2 overflow-x-auto shadow-2xl no-scrollbar">
            {[
              { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
              { id: 'products', label: 'Products Catalog', count: products.length, icon: Package },
              { id: 'orders', label: 'Orders & Fulfillment', count: ordersList.length, badge: pendingOrders, icon: ShoppingBag },
              { id: 'customers', label: 'User Directory', count: allDisplayUsers.length, icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs uppercase tracking-[0.18em] transition-all duration-300 whitespace-nowrap ${
                    isActive 
                      ? 'bg-gradient-to-r from-luxury-gold via-amber-400 to-luxury-gold text-black font-bold shadow-[0_0_20px_rgba(212,175,55,0.25)] border border-luxury-gold-light/40' 
                      : 'bg-white/[0.03] text-gray-400 hover:text-white hover:bg-white/[0.08] border border-white/5 font-semibold'
                  }`}
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-tabular ${
                      isActive ? 'bg-black/20 text-black' : 'bg-white/10 text-gray-300'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-black text-luxury-gold' : 'bg-amber-500 text-black animate-pulse'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Container */}
        <AnimatePresence mode="wait">
          {/* Tab 1: Dashboard Overview */}
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="luxury-glass-card p-8 rounded-3xl border border-white/10 backdrop-blur-2xl shadow-2xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-white/10">
                  <div>
                    <h3 className="font-serif text-2xl text-white gold-gradient-text mb-1">Recent Activity</h3>
                    <p className="text-gray-400 text-xs uppercase tracking-[0.2em] font-semibold">Latest store order requests</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className="px-4 py-2 bg-luxury-gold/10 hover:bg-luxury-gold/20 border border-luxury-gold/30 text-luxury-gold text-xs uppercase tracking-[0.18em] font-bold rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <span>View All Orders</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-[11px] uppercase tracking-[0.2em] text-gray-400 border-b border-white/10 font-bold">
                      <tr>
                        <th className="pb-4">Order ID</th>
                        <th className="pb-4">Customer</th>
                        <th className="pb-4">Date</th>
                        <th className="pb-4">Amount</th>
                        <th className="pb-4">Delivery Status</th>
                        <th className="pb-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-gray-300 font-sans">
                      {ordersList.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className="hover:bg-white/[0.04] transition-all">
                          <td className="py-4 font-mono font-bold text-luxury-gold text-xs tracking-wider">{ord.id}</td>
                          <td className="py-4 font-semibold text-white">{ord.customerName}</td>
                          <td className="py-4 text-xs font-tabular text-gray-400">{ord.date}</td>
                          <td className="py-4 font-mono font-bold text-white font-tabular">{formatCurrency(ord.total)}</td>
                          <td className="py-4">
                            <select
                              value={ord.status}
                              onChange={(e) => updateOrderStatus(ord.id, e.target.value as Order['status'])}
                              className="bg-black/80 border border-white/20 hover:border-luxury-gold/50 text-xs font-semibold uppercase tracking-wider text-amber-200 rounded-xl px-3.5 py-1.5 focus:border-luxury-gold focus:outline-none transition-all cursor-pointer shadow-md"
                            >
                              <option value="Pending" className="bg-[#121214] text-amber-300">Pending</option>
                              <option value="Processing" className="bg-[#121214] text-blue-300">Processing</option>
                              <option value="Shipped" className="bg-[#121214] text-purple-300">Shipped</option>
                              <option value="Delivered" className="bg-[#121214] text-emerald-300">Delivered</option>
                              <option value="Cancelled" className="bg-[#121214] text-red-300">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-4 text-right">
                            <button
                              onClick={() => setSelectedOrder(ord)}
                              className="px-4 py-1.5 bg-white/5 border border-white/15 rounded-xl text-xs uppercase tracking-wider font-semibold text-white hover:bg-luxury-gold hover:text-black transition-all shadow-md"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>          )}

          {/* Tab 2: Products Catalog (Add, Edit, Remove, Out of Stock Toggle) */}
          {activeTab === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-serif text-3xl md:text-4xl text-white font-normal gold-gradient-text">Product Inventory</h3>
                  <p className="text-gray-400 text-xs uppercase tracking-[0.2em] font-semibold mt-1">Manage catalog items, pricing, and stock status</p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={openAddModal}
                  className="px-6 py-3.5 bg-gradient-to-r from-luxury-gold via-amber-400 to-luxury-gold text-black font-bold rounded-xl text-xs uppercase tracking-[0.18em] transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:brightness-110"
                >
                  <Plus size={16} /> Add New Product
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((prod) => (
                  <motion.div 
                    layout
                    key={prod.id} 
                    className="luxury-glass-card rounded-2xl overflow-hidden border border-white/10 hover:border-luxury-gold/40 transition-all p-5 flex flex-col justify-between group shadow-2xl backdrop-blur-2xl relative"
                  >
                    <div>
                      <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-black/40 relative group/img">
                        <img 
                          src={prod.image} 
                          alt={prod.name} 
                          className={`w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105 ${prod.inStock === false ? 'opacity-40 grayscale' : ''}`}
                          referrerPolicy="no-referrer"
                        />
                        
                        {/* Stock badge */}
                        <span className={`absolute top-3 left-3 backdrop-blur-md px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-[0.18em] border shadow-lg ${
                          prod.inStock !== false 
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                            : 'bg-red-500/80 text-white border-red-500'
                        }`}>
                          {prod.inStock !== false ? 'In Stock' : 'Out of Stock'}
                        </span>

                        <span className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-3.5 py-1 rounded-full text-luxury-gold font-mono text-xs font-bold border border-white/15 shadow-md font-tabular">
                          {formatCurrency(prod.price)}
                        </span>
                      </div>

                      <span className="text-luxury-gold text-[10px] uppercase tracking-[0.2em] font-bold block mb-1">
                        {prod.category}
                      </span>
                      <h4 className="font-serif text-xl font-normal text-white mb-2 tracking-wide">{prod.name}</h4>
                      <p className="text-gray-400 text-xs line-clamp-2 mb-4 font-sans leading-relaxed">{prod.description}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-white/10">
                      {/* Stock Toggle Button */}
                      <button
                        onClick={() => toggleStock(prod.id)}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs uppercase tracking-[0.15em] font-bold transition-all border flex items-center justify-center gap-1.5 ${
                          prod.inStock !== false 
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20' 
                            : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                        }`}
                      >
                        {prod.inStock !== false ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                        <span>{prod.inStock !== false ? 'Mark Out of Stock' : 'Mark In Stock'}</span>
                      </button>

                      <button
                        onClick={() => openEditModal(prod)}
                        className="py-2.5 px-4 bg-white/5 border border-white/15 rounded-xl text-xs uppercase tracking-[0.18em] font-bold text-white hover:bg-luxury-gold hover:text-black transition-all flex items-center justify-center gap-1.5"
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                      
                      <button
                        onClick={() => handleDelete(prod.id)}
                        className="py-2.5 px-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs hover:bg-red-500/20 transition-all flex items-center justify-center"
                        title="Delete product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Tab 3: Order Requests & Delivery Status Management */}
          {activeTab === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-serif text-3xl md:text-4xl text-white font-normal gold-gradient-text">Orders & Fulfillment</h3>
                  <p className="text-gray-400 text-xs uppercase tracking-[0.2em] font-semibold mt-1">Manage delivery progress and order inspections</p>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 no-scrollbar">
                  {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setOrderFilter(status)}
                      className={`px-4 py-2 rounded-xl text-xs uppercase tracking-[0.18em] font-bold transition-all whitespace-nowrap ${
                        orderFilter === status 
                          ? 'bg-gradient-to-r from-luxury-gold to-amber-400 text-black shadow-[0_0_15px_rgba(212,175,55,0.25)] font-bold' 
                          : 'bg-white/5 text-gray-400 hover:text-white border border-white/5 font-semibold'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                  <div className="p-12 text-center luxury-glass-card rounded-3xl border border-white/10 text-gray-400 text-xs uppercase tracking-widest font-semibold">
                    No orders found matching filter "{orderFilter}".
                  </div>
                ) : (
                  filteredOrders.map((ord) => (
                    <motion.div 
                      key={ord.id} 
                      layout
                      className="p-6 luxury-glass-card border border-white/10 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-luxury-gold/40 transition-all shadow-2xl backdrop-blur-2xl"
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono text-luxury-gold font-bold text-xs tracking-widest px-3 py-1 bg-luxury-gold/10 border border-luxury-gold/30 rounded-lg inline-block">{ord.id}</span>
                          <span className="font-mono text-xs text-gray-400 font-tabular">{ord.date}</span>
                        </div>
                        <p className="text-white font-semibold text-base mb-1 tracking-wide">{ord.customerName} <span className="font-mono text-xs text-gray-400 font-normal">({ord.customerEmail})</span></p>
                        <p className="text-gray-400 text-xs font-medium">
                          {ord.items.length} item{ord.items.length > 1 ? 's' : ''} • Total: <span className="text-luxury-gold font-mono font-bold font-tabular">{formatCurrency(ord.total)}</span>
                        </p>
                      </div>

                      {/* Action Controls & Direct Status Dropdown */}
                      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">Status:</span>
                          <select
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value as Order['status'])}
                            className="bg-black/80 border border-white/20 hover:border-luxury-gold/50 text-xs font-semibold uppercase tracking-wider text-amber-200 rounded-xl px-3.5 py-2 focus:border-luxury-gold focus:outline-none transition-all cursor-pointer shadow-md"
                          >
                            <option value="Pending" className="bg-[#121214] text-amber-300">Pending</option>
                            <option value="Processing" className="bg-[#121214] text-blue-300">Processing</option>
                            <option value="Shipped" className="bg-[#121214] text-purple-300">Shipped</option>
                            <option value="Delivered" className="bg-[#121214] text-emerald-300">Delivered</option>
                            <option value="Cancelled" className="bg-[#121214] text-red-300">Cancelled</option>
                          </select>
                        </div>

                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-xs uppercase tracking-[0.18em] font-bold text-white transition-all flex items-center gap-1.5 shadow-md"
                        >
                          <Eye size={14} /> Inspect Items
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* Tab 4: User & Customer Access Management */}
          {activeTab === 'customers' && (
            <motion.div
              key="customers"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Header with Title and Add User Button */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-serif text-3xl md:text-4xl text-white font-normal gold-gradient-text">User Directory</h3>
                  <p className="text-gray-400 text-xs uppercase tracking-[0.2em] font-semibold mt-1">
                    Role permissions, member activity, and access restrictions
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={openAddUserModal}
                  className="px-6 py-3.5 bg-gradient-to-r from-luxury-gold via-amber-400 to-luxury-gold text-black font-bold rounded-xl text-xs uppercase tracking-[0.18em] transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:brightness-110"
                >
                  <UserPlus size={16} /> Add New User
                </motion.button>
              </div>

              {/* Filters & Search Bar */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 luxury-glass-card p-4 rounded-2xl border border-white/10 backdrop-blur-2xl shadow-xl">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full bg-black/60 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-white text-xs font-sans focus:outline-none focus:border-luxury-gold transition-colors placeholder:text-gray-500"
                  />
                </div>

                {/* Role & Status Filter Options */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1 bg-black/50 p-1.5 rounded-xl border border-white/10">
                    <span className="text-[10px] text-gray-400 uppercase tracking-[0.2em] px-2 font-bold">Role:</span>
                    {(['All', 'Customer', 'VIP', 'Admin'] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setUserRoleFilter(r)}
                        className={`px-3 py-1 rounded-lg text-xs uppercase tracking-wider font-bold transition-all ${
                          userRoleFilter === r
                            ? 'bg-luxury-gold text-black shadow-md'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 bg-black/50 p-1.5 rounded-xl border border-white/10">
                    <span className="text-[10px] text-gray-400 uppercase tracking-[0.2em] px-2 font-bold">Status:</span>
                    {(['All', 'Active', 'Blacklisted'] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setUserStatusFilter(s)}
                        className={`px-3 py-1 rounded-lg text-xs uppercase tracking-wider font-bold transition-all ${
                          userStatusFilter === s
                            ? 'bg-luxury-gold text-black shadow-md'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Users Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(allDisplayUsers || [])
                  .filter((u) => {
                    const matchesSearch =
                      u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                      u.email.toLowerCase().includes(userSearchQuery.toLowerCase());
                    const matchesRole = userRoleFilter === 'All' || u.role === userRoleFilter;
                    const matchesStatus = userStatusFilter === 'All' || u.status === userStatusFilter;
                    return matchesSearch && matchesRole && matchesStatus;
                  })
                  .map((usr) => {
                    const customerStats = customersMap[usr.email.toLowerCase()];
                    const totalSpend = customerStats ? customerStats.totalSpend : 0;
                    const ordersCount = customerStats ? customerStats.ordersCount : 0;

                    return (
                      <motion.div
                        key={usr.id}
                        layout
                        className={`p-6 rounded-2xl border backdrop-blur-2xl transition-all flex flex-col justify-between shadow-2xl ${
                          usr.status === 'Blacklisted'
                            ? 'bg-red-950/20 border-red-500/30 hover:border-red-500/60'
                            : 'luxury-glass-card border-white/10 hover:border-luxury-gold/40'
                        }`}
                      >
                        <div>
                          {/* User Header */}
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border ${
                                usr.role === 'Admin' ? 'bg-luxury-gold/20 text-luxury-gold border-luxury-gold/40' :
                                usr.role === 'VIP' ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' :
                                'bg-blue-500/20 text-blue-300 border-blue-500/40'
                              }`}>
                                {usr.name[0] || 'U'}
                              </div>
                              <div>
                                <h4 className="font-serif text-xl font-normal text-white tracking-wide flex items-center gap-1.5">
                                  <span>{usr.name}</span>
                                  {usr.role === 'VIP' && <Crown size={15} className="text-amber-400" />}
                                </h4>
                                <p className="text-gray-400 text-xs font-mono tracking-tight">{usr.email}</p>
                              </div>
                            </div>
                          </div>

                          {/* Role & Status Badges */}
                          <div className="flex items-center gap-2 mb-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-[0.2em] border ${
                              usr.role === 'Admin' ? 'bg-luxury-gold text-black border-luxury-gold shadow-sm' :
                              usr.role === 'VIP' ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' :
                              'bg-white/10 text-gray-300 border-white/15'
                            }`}>
                              {usr.role}
                            </span>

                            <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-[0.2em] border flex items-center gap-1.5 ${
                              usr.status === 'Blacklisted'
                                ? 'bg-red-500/20 text-red-400 border-red-500/40'
                                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                            }`}>
                              {usr.status === 'Blacklisted' ? <ShieldAlert size={12} /> : <CheckCircle2 size={12} />}
                              <span>{usr.status}</span>
                            </span>
                          </div>

                          {/* Customer Stats & Notes */}
                          <div className="space-y-2 mb-4 text-xs text-gray-300 bg-black/50 p-3.5 rounded-xl border border-white/5 font-sans">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400 font-medium">Total Orders:</span>
                              <span className="font-bold text-white text-sm font-tabular">{ordersCount}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400 font-medium">Total Spend:</span>
                              <span className="font-mono text-luxury-gold font-bold text-sm font-tabular">{formatCurrency(totalSpend)}</span>
                            </div>
                            {usr.notes && (
                              <div className="pt-2 border-t border-white/5 text-[11px] text-gray-400 italic">
                                "{usr.notes}"
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/10">
                          {/* Blacklist / Unblock Toggle Button */}
                          <button
                            onClick={() => toggleBlacklistUser(usr.id, usr)}
                            className={`flex-1 py-2.5 px-3 rounded-xl text-xs uppercase tracking-[0.18em] font-bold transition-all border flex items-center justify-center gap-1.5 ${
                              usr.status === 'Active'
                                ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
                                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                            }`}
                          >
                            {usr.status === 'Active' ? (
                              <>
                                <UserX size={14} />
                                <span>Blacklist</span>
                              </>
                            ) : (
                              <>
                                <UserCheck size={14} />
                                <span>Unblock</span>
                              </>
                            )}
                          </button>

                          {/* Inspect History Button */}
                          <button
                            onClick={() => handleInspectUserHistory(usr)}
                            className="py-2.5 px-3 bg-luxury-gold/10 border border-luxury-gold/30 rounded-xl text-xs uppercase tracking-[0.18em] font-bold text-luxury-gold hover:bg-luxury-gold hover:text-black transition-all flex items-center justify-center gap-1.5"
                            title="View User Order History & Activity"
                          >
                            <Eye size={14} />
                            <span>History</span>
                          </button>

                          {/* Edit User Button */}
                          <button
                            onClick={() => openEditUserModal(usr)}
                            className="py-2.5 px-4 bg-white/5 border border-white/15 rounded-xl text-xs uppercase tracking-[0.18em] font-bold text-white hover:bg-luxury-gold hover:text-black transition-all flex items-center gap-1.5"
                          >
                            <Edit3 size={14} /> Edit
                          </button>

                          {/* Delete User Button */}
                          <button
                            onClick={() => handleDeleteUserClick(usr.id, usr.email, usr.name)}
                            className="py-2.5 px-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs hover:bg-red-500/20 transition-all flex items-center justify-center"
                            title="Delete User"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* User Add / Edit Modal */}
      <AnimatePresence>
        {isUserModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-lg luxury-glass-card border border-white/15 p-8 md:p-10 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.9)] relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <h3 className="font-serif text-3xl font-normal gold-gradient-text mb-6">
                {editingUser ? 'Edit User Account' : 'Add New User Account'}
              </h3>

              <form onSubmit={handleUserSubmit} className="space-y-5 font-sans">
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-2 font-bold">Full Name</label>
                  <input
                    type="text"
                    value={userNameInput}
                    onChange={(e) => setUserNameInput(e.target.value)}
                    required
                    className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/50 text-sm placeholder:text-gray-600 transition-all"
                    placeholder="e.g. Eleanor Vance"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-2 font-bold">Email Address</label>
                  <input
                    type="email"
                    value={userEmailInput}
                    onChange={(e) => setUserEmailInput(e.target.value)}
                    required
                    className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/50 text-sm placeholder:text-gray-600 transition-all"
                    placeholder="eleanor@example.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-2 font-bold">Account Role</label>
                    <select
                      value={userRoleInput}
                      onChange={(e) => setUserRoleInput(e.target.value as any)}
                      className="w-full bg-[#121214] border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-luxury-gold text-sm cursor-pointer"
                    >
                      <option value="Customer">Customer</option>
                      <option value="VIP">VIP Member</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-2 font-bold">Access Status</label>
                    <select
                      value={userStatusInput}
                      onChange={(e) => setUserStatusInput(e.target.value as any)}
                      className="w-full bg-[#121214] border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-luxury-gold text-sm cursor-pointer"
                    >
                      <option value="Active">Active</option>
                      <option value="Blacklisted">Blacklisted</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-2 font-bold">Admin Notes / Blacklist Reason</label>
                  <textarea
                    value={userNotesInput}
                    onChange={(e) => setUserNotesInput(e.target.value)}
                    rows={3}
                    className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/50 text-sm placeholder:text-gray-600 transition-all"
                    placeholder="Enter any administrative notes or reason for blacklisting..."
                  />
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsUserModalOpen(false)}
                    className="flex-1 py-3.5 bg-white/5 border border-white/15 rounded-xl text-xs uppercase tracking-[0.18em] hover:bg-white/10 text-white font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 bg-gradient-to-r from-luxury-gold via-amber-400 to-luxury-gold text-black font-bold rounded-xl text-xs uppercase tracking-[0.18em] hover:brightness-110 transition-all shadow-[0_0_20px_rgba(212,175,55,0.25)]"
                  >
                    {editingUser ? 'Save User Changes' : 'Create User'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Product Add / Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-xl luxury-glass-card border border-white/15 p-8 md:p-10 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.9)] relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <h3 className="font-serif text-3xl font-normal gold-gradient-text mb-6">
                {editingProduct ? 'Edit Luxury Item' : 'Add New Luxury Item'}
              </h3>

              <form onSubmit={handleProductSubmit} className="space-y-5 font-sans">
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-2 font-bold">Item Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/50 text-sm placeholder:text-gray-600 transition-all"
                    placeholder="e.g. Royal Chronograph Platinum"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-2 font-bold">Price (₹)</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/50 text-sm font-tabular placeholder:text-gray-600 transition-all"
                      placeholder="150000"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-2 font-bold">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full bg-[#121214] border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-luxury-gold text-sm cursor-pointer"
                    >
                      <option value="Watches">Watches</option>
                      <option value="Perfumes">Perfumes</option>
                      <option value="Glasses">Glasses</option>
                      <option value="Clothing">Clothing</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>
                </div>

                {/* Stock Availability Toggle Switch */}
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-white font-bold block">Stock Status</span>
                    <span className="text-gray-400 text-xs">{inStock ? 'Item is available for customer purchase' : 'Item is marked Out of Stock'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setInStock(!inStock)}
                    className={`px-4 py-2 rounded-xl text-xs uppercase font-bold tracking-wider transition-all shadow-md ${
                      inStock ? 'bg-emerald-500 text-black shadow-emerald-500/20' : 'bg-red-500 text-white shadow-red-500/20'
                    }`}
                  >
                    {inStock ? 'In Stock' : 'Out of Stock'}
                  </button>
                </div>

                {/* Image Upload/URL Modes */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-[11px] uppercase tracking-[0.2em] text-gray-400 font-bold">Product Image</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setImageMode('file')}
                        className={`text-[10px] uppercase tracking-wider px-3 py-1 rounded-full font-bold transition-all ${
                          imageMode === 'file' ? 'bg-luxury-gold text-black' : 'bg-white/10 text-gray-400'
                        }`}
                      >
                        Upload File
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageMode('url')}
                        className={`text-[10px] uppercase tracking-wider px-3 py-1 rounded-full font-bold transition-all ${
                          imageMode === 'url' ? 'bg-luxury-gold text-black' : 'bg-white/10 text-gray-400'
                        }`}
                      >
                        Image URL
                      </button>
                    </div>
                  </div>

                  {imageMode === 'file' ? (
                    <div className="space-y-3">
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        disabled={isUploadingImage}
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-8 border-2 border-dashed border-white/20 hover:border-luxury-gold rounded-2xl flex flex-col items-center justify-center gap-2 bg-black/40 hover:bg-black/60 transition-all text-gray-300 disabled:opacity-50"
                      >
                        {isUploadingImage ? (
                          <>
                            <Loader2 size={24} className="text-luxury-gold animate-spin" />
                            <span className="text-xs uppercase tracking-wider font-semibold text-luxury-gold">Uploading to Supabase Storage...</span>
                          </>
                        ) : (
                          <>
                            <Upload size={24} className="text-luxury-gold" />
                            <span className="text-xs uppercase tracking-wider font-semibold">Click to upload file to Supabase Bucket</span>
                            <span className="text-[10px] text-gray-500">Stored directly in your cloud bucket</span>
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => {
                        setImage(e.target.value);
                        setImagePreview(e.target.value);
                      }}
                      required
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/50 text-sm transition-all"
                    />
                  )}

                  {imagePreview && (
                    <div className="mt-3 relative aspect-[16/9] rounded-xl overflow-hidden border border-luxury-gold/40 shadow-lg">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-2 font-bold">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    required
                    className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/50 text-sm placeholder:text-gray-600 transition-all"
                    placeholder="Handcrafted luxury description..."
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-2 font-bold">Specifications (comma separated)</label>
                  <input
                    type="text"
                    value={specsInput}
                    onChange={(e) => setSpecsInput(e.target.value)}
                    className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/50 text-sm placeholder:text-gray-600 transition-all"
                    placeholder="Swiss Movement, Sapphire Crystal, 100m Water Resistance"
                  />
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3.5 bg-white/5 border border-white/15 rounded-xl text-xs uppercase tracking-[0.18em] font-bold hover:bg-white/10 text-white transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 bg-gradient-to-r from-luxury-gold via-amber-400 to-luxury-gold text-black font-bold rounded-xl text-xs uppercase tracking-[0.18em] hover:brightness-110 transition-all shadow-[0_0_20px_rgba(212,175,55,0.25)]"
                  >
                    {editingProduct ? 'Save Changes' : 'Create Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Customer / User History Inspector Modal */}
      <AnimatePresence>
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              className="w-full max-w-3xl luxury-glass-card border border-white/15 p-8 md:p-10 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.9)] relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedCustomer(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              {/* User Identity Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-luxury-gold/20 border border-luxury-gold/40 text-luxury-gold rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg shadow-luxury-gold/10">
                  {selectedCustomer.name[0] || 'U'}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] text-luxury-gold uppercase tracking-[0.2em] font-bold">User Activity Log</span>
                  </div>
                  <h3 className="font-serif text-3xl font-normal gold-gradient-text tracking-wide">{selectedCustomer.name}</h3>
                  <p className="text-gray-400 text-xs font-mono">{selectedCustomer.email}</p>
                </div>
              </div>

              {/* KPI Summary Cards */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-black/50 rounded-2xl mb-6 text-xs border border-white/10 font-sans">
                <div>
                  <span className="text-gray-400 block mb-1 uppercase tracking-wider font-bold text-[10px]">Total Orders:</span>
                  <span className="text-white font-bold text-lg font-tabular">{selectedCustomer.ordersCount}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-1 uppercase tracking-wider font-bold text-[10px]">Total Spend:</span>
                  <span className="text-luxury-gold font-mono font-bold text-lg font-tabular">{formatCurrency(selectedCustomer.totalSpend)}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-1 uppercase tracking-wider font-bold text-[10px]">Avg Order Value:</span>
                  <span className="text-white font-mono font-bold text-lg font-tabular">
                    {formatCurrency(selectedCustomer.ordersCount > 0 ? selectedCustomer.totalSpend / selectedCustomer.ordersCount : 0)}
                  </span>
                </div>
              </div>

              {/* Order History Timeline */}
              <div className="mb-6 font-sans">
                <h4 className="text-xs uppercase tracking-[0.2em] text-gray-400 font-bold mb-4 flex items-center gap-2">
                  <History size={14} className="text-luxury-gold" />
                  <span>Order & Purchase History ({selectedCustomer.orders.length})</span>
                </h4>

                {selectedCustomer.orders.length === 0 ? (
                  <div className="p-8 text-center bg-black/50 rounded-2xl border border-white/10 space-y-3">
                    <Clock size={32} className="mx-auto text-gray-500" />
                    <p className="text-gray-300 text-sm font-semibold">No order history recorded for this user yet.</p>
                    <p className="text-gray-500 text-xs max-w-sm mx-auto">
                      When this user places an order on AURA, their item details, status updates, and transaction amounts will appear here automatically.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-72 overflow-y-auto pr-2 no-scrollbar">
                    {selectedCustomer.orders.map((ord) => (
                      <div key={ord.id} className="p-5 bg-black/60 rounded-2xl border border-white/10 space-y-3">
                        <div className="flex flex-wrap justify-between items-center gap-2 border-b border-white/10 pb-3">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-luxury-gold font-bold text-xs tracking-widest px-3 py-1 bg-luxury-gold/10 border border-luxury-gold/30 rounded-lg">{ord.id}</span>
                            <span className="text-xs font-mono text-gray-400 font-tabular">{ord.date}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <select
                              value={ord.status}
                              onChange={(e) => {
                                const newStatus = e.target.value as Order['status'];
                                updateOrderStatus(ord.id, newStatus);
                                setSelectedCustomer({
                                  ...selectedCustomer,
                                  orders: selectedCustomer.orders.map(o => o.id === ord.id ? { ...o, status: newStatus } : o)
                                });
                              }}
                              className="bg-black border border-white/20 text-xs font-semibold uppercase tracking-wider text-luxury-gold rounded-xl px-3 py-1.5 focus:border-luxury-gold focus:outline-none cursor-pointer"
                            >
                              <option value="Pending" className="bg-[#121214] text-amber-300">Pending</option>
                              <option value="Processing" className="bg-[#121214] text-blue-300">Processing</option>
                              <option value="Shipped" className="bg-[#121214] text-purple-300">Shipped</option>
                              <option value="Delivered" className="bg-[#121214] text-emerald-300">Delivered</option>
                              <option value="Cancelled" className="bg-[#121214] text-red-300">Cancelled</option>
                            </select>
                            <span className="font-mono text-white text-sm font-bold font-tabular">{formatCurrency(ord.total)}</span>
                          </div>
                        </div>

                        {/* Items in Order */}
                        <div className="space-y-2">
                          {ord.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs text-gray-300 bg-white/5 p-2.5 rounded-xl">
                              <div className="flex items-center gap-3">
                                <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-black/40" />
                                <div>
                                  <p className="text-white font-semibold">{item.name}</p>
                                  <span className="text-[10px] text-gray-400">{item.category} • Qty: {item.quantity}</span>
                                </div>
                              </div>
                              <span className="font-mono text-luxury-gold font-bold font-tabular">{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-white/10 text-right">
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="px-6 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs uppercase tracking-[0.18em] font-bold text-white transition-all shadow-md"
                >
                  Close History
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Order Details Inspection Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              className="w-full max-w-2xl luxury-glass-card border border-white/15 p-8 md:p-10 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.9)] relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-6 font-sans">
                <span className="font-mono text-2xl font-bold text-luxury-gold tracking-wider">{selectedOrder.id}</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as Order['status'];
                    updateOrderStatus(selectedOrder.id, newStatus);
                    setSelectedOrder({ ...selectedOrder, status: newStatus });
                  }}
                  className="bg-black border border-white/20 text-xs uppercase tracking-wider text-amber-200 rounded-xl px-3 py-1.5 focus:border-luxury-gold focus:outline-none font-bold cursor-pointer"
                >
                  <option value="Pending" className="bg-[#121214] text-amber-300">Pending</option>
                  <option value="Processing" className="bg-[#121214] text-blue-300">Processing</option>
                  <option value="Shipped" className="bg-[#121214] text-purple-300">Shipped</option>
                  <option value="Delivered" className="bg-[#121214] text-emerald-300">Delivered</option>
                  <option value="Cancelled" className="bg-[#121214] text-red-300">Cancelled</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-black/50 rounded-2xl mb-6 text-xs border border-white/10 font-sans">
                <div>
                  <span className="text-gray-400 block mb-1 font-bold uppercase text-[10px]">Customer Name:</span>
                  <span className="text-white font-semibold text-sm">{selectedOrder.customerName}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-1 font-bold uppercase text-[10px]">Contact Email:</span>
                  <span className="text-white font-mono text-xs">{selectedOrder.customerEmail}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-1 font-bold uppercase text-[10px]">Order Date:</span>
                  <span className="text-white font-tabular font-medium">{selectedOrder.date}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-1 font-bold uppercase text-[10px]">Total Amount:</span>
                  <span className="text-luxury-gold font-mono font-bold text-sm font-tabular">{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>

              <h4 className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-4 font-sans">Ordered Items</h4>
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2 font-sans no-scrollbar">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 bg-black/60 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold">{item.name}</p>
                        <p className="text-gray-400 text-xs">{item.category} • Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-mono text-luxury-gold text-sm font-bold font-tabular">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end font-sans">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-6 py-2.5 bg-white/10 rounded-xl text-xs uppercase tracking-[0.18em] font-bold hover:bg-white/20 text-white transition-all shadow-md"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
