import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ReactLenis, { useLenis } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CustomCursor from './components/CustomCursor';
import LoadingScreen from './components/LoadingScreen';
import ScrollToTopButton from './components/ScrollToTopButton';
import WatermarkLogo from './components/WatermarkLogo';
import { useStore } from './store/useStore';
import { supabase } from './lib/supabase';

// Lazy-loaded page components for optimal bundle splitting
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Login = lazy(() => import('./pages/Login'));
const Cart = lazy(() => import('./pages/Cart'));
const Profile = lazy(() => import('./pages/Profile'));
const Admin = lazy(() => import('./pages/Admin'));

gsap.registerPlugin(ScrollTrigger);

function GsapLenisSync() {
  const lenis = useLenis(ScrollTrigger.update);
  useEffect(() => {
    const update = (time: number) => {
      lenis?.raf(time * 1000);
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(update);
    };
  }, [lenis]);
  return null;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  const lenis = useLenis();
  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, lenis]);
  return null;
}

export default function App() {
  const fetchProducts = useStore((state) => state.fetchProducts);
  const fetchOrders = useStore((state) => state.fetchOrders);
  const login = useStore((state) => state.login);

  useEffect(() => {
    fetchProducts();
    fetchOrders();

    // Check initial auth session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        login({
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Valued Member',
          email: session.user.email || '',
          isAdmin: ['playzofficial216@gmail.com', 'playzofficial2106@gmail.com', 'admin@gmail.com'].includes((session.user.email || '').toLowerCase()) || session.user.user_metadata?.is_admin === true,
          addresses: [],
          orders: []
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        login({
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Valued Member',
          email: session.user.email || '',
          isAdmin: ['playzofficial216@gmail.com', 'playzofficial2106@gmail.com', 'admin@gmail.com'].includes((session.user.email || '').toLowerCase()) || session.user.user_metadata?.is_admin === true,
          addresses: [],
          orders: []
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProducts, fetchOrders, login]);

  return (
    <ReactLenis root autoRaf={false} options={{ 
      lerp: 0.08, 
      duration: 1.2, 
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false,
    }}>
      <GsapLenisSync />
      <Router>
        <LoadingScreen />
        <CustomCursor />
        <ScrollToTopButton />
        <WatermarkLogo />
        <ScrollToTop />
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Suspense>
      </Router>
    </ReactLenis>
  );
}

