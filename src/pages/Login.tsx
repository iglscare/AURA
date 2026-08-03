import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import Navbar from '../components/Navbar';
import { motion } from 'motion/react';
import { Loader2, MailCheck, ArrowLeft, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState('');
  const [showResendOption, setShowResendOption] = useState(false);

  const navigate = useNavigate();
  const { login } = useStore();
  const usersList = useStore((state) => state.usersList);

  useEffect(() => {
    // Check if coming back from email verification redirect
    const hash = window.location.hash;
    const searchParams = new URLSearchParams(window.location.search);
    if (hash.includes('access_token') || hash.includes('type=signup') || searchParams.has('code')) {
      setInfoMsg('Email verified successfully! You can now sign in to your account.');
    }
  }, []);

  const handleResendVerification = async (targetEmail?: string) => {
    const emailToUse = targetEmail || email || pendingVerificationEmail;
    if (!emailToUse) {
      setErrorMsg('Please enter your email address to resend verification.');
      return;
    }
    setResendLoading(true);
    setErrorMsg('');
    setInfoMsg('');
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: emailToUse,
        options: {
          emailRedirectTo: `${window.location.origin}/login`
        }
      });
      if (error) throw error;
      setInfoMsg(`Verification email successfully sent to ${emailToUse}. Please check your inbox.`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to resend verification email.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');
    setShowResendOption(false);
    setLoading(true);

    // Check if user is blacklisted by Admin
    const isBlacklisted = (usersList || []).some(
      (u) => u.email.trim().toLowerCase() === email.trim().toLowerCase() && u.status === 'Blacklisted'
    );

    if (isBlacklisted) {
      setErrorMsg('Your account has been blacklisted/suspended by an administrator. Please contact support.');
      setLoading(false);
      return;
    }

    const validAdminEmails = ['playzofficial216@gmail.com', 'playzofficial2106@gmail.com', 'admin@gmail.com'];
    const validAdminPasswords = ['210645', 'playz@2106', 'admin'];

    const cleanEmail = email.trim().toLowerCase();
    if (validAdminEmails.includes(cleanEmail) && validAdminPasswords.includes(password)) {
      login({
        id: 'admin_1',
        name: 'System Administrator',
        email: cleanEmail,
        isAdmin: true,
        addresses: ['AURA Headquarters, Geneva'],
        orders: []
      });
      setLoading(false);
      navigate('/admin');
      return;
    }

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) {
          if (error.message.toLowerCase().includes('email not confirmed')) {
            setShowResendOption(true);
            throw new Error('Your email address has not been verified yet. Please check your inbox for the verification link.');
          }
          throw error;
        }

        if (data.user) {
          login({
            id: data.user.id,
            name: data.user.user_metadata?.full_name || email.split('@')[0] || 'Valued Member',
            email: data.user.email || email,
            isAdmin: validAdminEmails.includes((data.user.email || email).toLowerCase()),
            addresses: [],
            orders: []
          });
          navigate(validAdminEmails.includes((data.user.email || email).toLowerCase()) ? '/admin' : '/shop');
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/login`,
            data: {
              full_name: email.split('@')[0] || 'Valued Member'
            }
          }
        });
        if (error) throw error;

        // Check if email verification is required (session is null or unconfirmed email)
        if (data.user && (!data.session || !data.user.email_confirmed_at)) {
          setVerificationSent(true);
          setPendingVerificationEmail(email);
          setInfoMsg(`A verification link has been sent to ${email}. Please verify your email before signing in.`);
        } else if (data.session && data.user) {
          // If auto-confirm is enabled in Supabase project settings
          login({
            id: data.user.id,
            name: email.split('@')[0] || 'Valued Member',
            email: data.user.email || email,
            isAdmin: false,
            addresses: [],
            orders: []
          });
          navigate('/shop');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-black flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white/5 p-8 md:p-12 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl"
        >
          {verificationSent ? (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-luxury-gold/10 border border-luxury-gold/30 rounded-2xl flex items-center justify-center mx-auto text-luxury-gold">
                <MailCheck size={32} />
              </div>

              <div>
                <h2 className="font-serif text-3xl text-white mb-2">Verify Your Email</h2>
                <p className="text-gray-300 text-sm leading-relaxed">
                  We have sent a verification link to <span className="text-luxury-gold font-medium">{pendingVerificationEmail}</span>.
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  Please click the link in your email to activate your account and complete your sign up.
                </p>
              </div>

              {infoMsg && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs text-center">
                  {infoMsg}
                </div>
              )}

              {errorMsg && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs text-center">
                  {errorMsg}
                </div>
              )}

              <div className="pt-4 space-y-3">
                <button
                  type="button"
                  onClick={() => handleResendVerification(pendingVerificationEmail)}
                  disabled={resendLoading}
                  className="w-full bg-luxury-gold/10 border border-luxury-gold/40 text-luxury-gold py-3.5 rounded-xl uppercase tracking-widest text-xs font-semibold hover:bg-luxury-gold hover:text-black transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {resendLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Sending Email...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw size={14} />
                      <span>Resend Verification Email</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setVerificationSent(false);
                    setIsLogin(true);
                    setErrorMsg('');
                    setInfoMsg('');
                  }}
                  className="w-full text-gray-400 py-2.5 text-xs uppercase tracking-widest hover:text-white transition-colors flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Sign In</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="font-serif text-4xl text-white mb-2">{isLogin ? 'Welcome Back' : 'Join Aura'}</h2>
                <p className="text-gray-400 text-xs uppercase tracking-widest">Enter the world of luxury</p>
              </div>

              {infoMsg && (
                <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs text-center">
                  {infoMsg}
                </div>
              )}

              {errorMsg && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs text-center space-y-3">
                  <p>{errorMsg}</p>
                  {showResendOption && (
                    <button
                      type="button"
                      onClick={() => handleResendVerification(email)}
                      disabled={resendLoading}
                      className="inline-flex items-center gap-1.5 text-luxury-gold underline hover:text-white transition-colors text-xs font-semibold"
                    >
                      {resendLoading ? (
                        <>
                          <Loader2 size={12} className="animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <span>Resend verification email now</span>
                      )}
                    </button>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">Email Address</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-luxury-gold transition-colors text-sm"
                    placeholder="name@example.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">Password</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-luxury-gold transition-colors text-sm"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-luxury-gold text-black py-4 rounded-xl uppercase tracking-widest text-xs font-bold hover:bg-white transition-all duration-300 shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    isLogin ? 'Sign In' : 'Create Account'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button 
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setErrorMsg('');
                    setInfoMsg('');
                    setShowResendOption(false);
                  }}
                  className="text-gray-500 text-xs uppercase tracking-widest hover:text-white transition-colors"
                >
                  {isLogin ? "Don't have an account? Sign Up" : "Already a member? Sign In"}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

