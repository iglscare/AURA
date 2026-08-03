import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PRODUCTS } from '../data/products';
import { supabase } from '../lib/supabase';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'Watches' | 'Perfumes' | 'Glasses' | 'Clothing' | 'Accessories';
  image: string;
  description: string;
  specs: string[];
  inStock?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  addresses: string[];
  orders: any[];
}

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: 'Customer' | 'VIP' | 'Admin';
  status: 'Active' | 'Blacklisted';
  createdAt: string;
  notes?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
}

interface AppState {
  isAuthenticated: boolean;
  user: User | null;
  cart: CartItem[];
  wishlist: string[];
  lastAddedItem: Product | null;
  products: Product[];
  ordersList: Order[];
  usersList: ManagedUser[];
  deletedUserEmails: string[];
  isLoading: boolean;
  fetchProducts: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  login: (user: User) => void;
  logout: () => Promise<void>;
  addToCart: (product: Product) => void;
  setLastAddedItem: (item: Product | null) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  updateUser: (updates: Partial<User>) => void;
  addOrder: (order: Order) => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleStock: (productId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  addUser: (user: Omit<ManagedUser, 'id' | 'createdAt'>) => void;
  updateUserAdmin: (id: string, updates: Partial<ManagedUser>) => void;
  deleteUser: (id: string, email?: string) => void;
  toggleBlacklistUser: (id: string, userFallback?: Partial<ManagedUser>) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      cart: [],
      wishlist: [],
      lastAddedItem: null,
      products: PRODUCTS.map(p => ({ ...p, inStock: true })),
      ordersList: [],
      deletedUserEmails: [],
      usersList: [
        {
          id: 'usr_1',
          name: 'System Administrator',
          email: 'playzofficial216@gmail.com',
          role: 'Admin',
          status: 'Active',
          createdAt: '2026-01-01',
          notes: 'Root System Administrator'
        },
        {
          id: 'usr_2',
          name: 'Sophia Laurent',
          email: 'sophia.laurent@luxury.com',
          role: 'VIP',
          status: 'Active',
          createdAt: '2026-02-14',
          notes: 'High-value bespoke jewelry collector'
        },
        {
          id: 'usr_3',
          name: 'Alexander Wright',
          email: 'alexander@wright.co',
          role: 'Customer',
          status: 'Active',
          createdAt: '2026-03-20',
          notes: 'Prefers Swiss timepieces'
        }
      ],
      isLoading: false,

      fetchProducts: async () => {
        try {
          const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
          if (!error && data && data.length > 0) {
            const formattedProducts: Product[] = data.map((p: any) => ({
              id: p.id,
              name: p.name,
              price: Number(p.price),
              category: p.category,
              image: p.image,
              description: p.description || '',
              specs: Array.isArray(p.specs) ? p.specs : typeof p.specs === 'string' ? JSON.parse(p.specs) : [],
              inStock: p.in_stock ?? true
            }));
            set({ products: formattedProducts });
          }
        } catch (err) {
          console.error('Failed to fetch products from Supabase:', err);
        }
      },

      fetchOrders: async () => {
        try {
          const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
          if (!error && data) {
            const formattedOrders: Order[] = data.map((o: any) => ({
              id: o.id,
              customerName: o.customer_name,
              customerEmail: o.customer_email,
              items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items || [],
              total: Number(o.total),
              status: o.status as Order['status'],
              date: o.date
            }));
            set({ ordersList: formattedOrders });
          }
        } catch (err) {
          console.error('Failed to fetch orders from Supabase:', err);
        }
      },

      login: (user) => set({ isAuthenticated: true, user }),
      
      logout: async () => {
        try {
          await supabase.auth.signOut();
        } catch (e) {
          console.error('Logout error:', e);
        }
        set({ isAuthenticated: false, user: null, cart: [], wishlist: [] });
      },

      setLastAddedItem: (item) => set({ lastAddedItem: item }),
      
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      addOrder: async (order) => {
        set((state) => ({
          ordersList: [order, ...state.ordersList],
          user: state.user
            ? { ...state.user, orders: [order, ...(state.user.orders || [])] }
            : null,
        }));

        try {
          await supabase.from('orders').insert({
            id: order.id,
            customer_name: order.customerName,
            customer_email: order.customerEmail,
            items: order.items,
            total: order.total,
            status: order.status,
            date: order.date,
            user_id: get().user?.id && !get().user?.id.startsWith('admin_') && !get().user?.id.startsWith('u_') ? get().user?.id : null
          });
        } catch (err) {
          console.error('Error inserting order to Supabase:', err);
        }
      },

      addToCart: (product) =>
        set((state) => {
          if (product.inStock === false) return state; // Do not add out of stock products
          const existing = state.cart.find((item) => item.id === product.id);
          const newCart = existing
            ? state.cart.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
              )
            : [...state.cart, { ...product, quantity: 1 }];
          
          return { cart: newCart, lastAddedItem: product };
        }),

      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        })),

      clearCart: () => set({ cart: [] }),

      toggleWishlist: (productId) =>
        set((state) => {
          const inWishlist = state.wishlist.includes(productId);
          return {
            wishlist: inWishlist
              ? state.wishlist.filter((id) => id !== productId)
              : [...state.wishlist, productId],
          };
        }),

      addProduct: async (newProductData) => {
        const newId = 'p_' + Date.now();
        const newProduct: Product = {
          ...newProductData,
          id: newId,
          inStock: newProductData.inStock ?? true,
        };

        set((state) => ({ products: [newProduct, ...state.products] }));

        try {
          await supabase.from('products').insert({
            id: newProduct.id,
            name: newProduct.name,
            price: newProduct.price,
            category: newProduct.category,
            image: newProduct.image,
            description: newProduct.description,
            specs: newProduct.specs,
            in_stock: newProduct.inStock ?? true
          });
        } catch (err) {
          console.error('Failed to add product to Supabase:', err);
        }
      },

      updateProduct: async (id, updates) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }));

        const dbUpdates: Record<string, any> = { ...updates };
        if (updates.inStock !== undefined) {
          dbUpdates.in_stock = updates.inStock;
          delete dbUpdates.inStock;
        }

        try {
          await supabase.from('products').update(dbUpdates).eq('id', id);
        } catch (err) {
          console.error('Failed to update product in Supabase:', err);
        }
      },

      toggleStock: async (productId) => {
        const target = get().products.find((p) => p.id === productId);
        if (!target) return;
        const newInStock = !(target.inStock ?? true);

        set((state) => ({
          products: state.products.map((p) =>
            p.id === productId ? { ...p, inStock: newInStock } : p
          ),
        }));

        try {
          await supabase.from('products').update({ in_stock: newInStock }).eq('id', productId);
        } catch (err) {
          console.error('Failed to update stock status in Supabase:', err);
        }
      },

      deleteProduct: async (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));

        try {
          await supabase.from('products').delete().eq('id', id);
        } catch (err) {
          console.error('Failed to delete product from Supabase:', err);
        }
      },

      updateOrderStatus: async (orderId, status) => {
        set((state) => ({
          ordersList: state.ordersList.map((ord) =>
            ord.id === orderId ? { ...ord, status } : ord
          ),
        }));

        try {
          await supabase.from('orders').update({ status }).eq('id', orderId);
        } catch (err) {
          console.error('Failed to update order status in Supabase:', err);
        }
      },

      addUser: (userData) =>
        set((state) => {
          const newUser: ManagedUser = {
            ...userData,
            id: 'usr_' + Date.now(),
            createdAt: new Date().toISOString().split('T')[0]
          };
          return { usersList: [newUser, ...(state.usersList || [])] };
        }),

      updateUserAdmin: (id, updates) =>
        set((state) => {
          const exists = (state.usersList || []).some((u) => u.id === id);
          if (exists) {
            return {
              usersList: state.usersList.map((u) => (u.id === id ? { ...u, ...updates } : u)),
            };
          }
          if (updates.email) {
            const newUser: ManagedUser = {
              id: id || 'usr_' + Date.now(),
              name: updates.name || updates.email.split('@')[0],
              email: updates.email,
              role: updates.role || 'Customer',
              status: updates.status || 'Active',
              createdAt: new Date().toISOString().split('T')[0],
              notes: updates.notes || '',
            };
            return { usersList: [newUser, ...(state.usersList || [])] };
          }
          return state;
        }),

      deleteUser: (id, email) =>
        set((state) => ({
          usersList: (state.usersList || []).filter((u) => u.id !== id),
          deletedUserEmails: email
            ? [...(state.deletedUserEmails || []), email.toLowerCase()]
            : state.deletedUserEmails || [],
        })),

      toggleBlacklistUser: (id, userFallback) =>
        set((state) => {
          const exists = (state.usersList || []).some((u) => u.id === id);
          if (exists) {
            return {
              usersList: state.usersList.map((u) =>
                u.id === id
                  ? { ...u, status: u.status === 'Active' ? 'Blacklisted' : 'Active' }
                  : u
              ),
            };
          }
          if (userFallback && userFallback.email) {
            const newUser: ManagedUser = {
              id: id || 'usr_' + Date.now(),
              name: userFallback.name || userFallback.email.split('@')[0],
              email: userFallback.email,
              role: userFallback.role || 'Customer',
              status: 'Blacklisted',
              createdAt: new Date().toISOString().split('T')[0],
              notes: userFallback.notes || 'Blacklisted by Admin',
            };
            return { usersList: [newUser, ...(state.usersList || [])] };
          }
          return state;
        }),
    }),
    {
      name: 'aura-storage',
    }
  )
);

