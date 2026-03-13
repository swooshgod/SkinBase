'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'signin' | 'signup';
}

export default function AuthModal({ isOpen, onClose, defaultTab = 'signin' }: AuthModalProps) {
  const [tab, setTab] = useState<'signin' | 'signup'>(defaultTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setTab(defaultTab);
      setEmail('');
      setPassword('');
      setName('');
      setError('');
      setSuccess('');
      setLoading(false);
    }
  }, [isOpen, defaultTab]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      onClose();
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Auto sign in after signup
      const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
      if (signInErr) {
        setSuccess('Account created! Check your email to confirm, then sign in.');
        setLoading(false);
      } else {
        onClose();
      }
    }
  };

  const handleGoogle = async () => {
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` },
    });
    if (error) setError(error.message);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(27,43,75,0.55)',
              backdropFilter: 'blur(4px)',
              zIndex: 200,
            }}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 201,
              background: '#FFFFFF',
              borderRadius: '24px 24px 0 0',
              padding: '24px 24px calc(24px + env(safe-area-inset-bottom))',
              maxWidth: 480,
              margin: '0 auto',
            }}
          >
            {/* Handle */}
            <div style={{
              width: 40,
              height: 4,
              borderRadius: 2,
              background: '#E7DFD5',
              margin: '0 auto 20px',
            }} />

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1C1917', margin: 0 }}>
                {tab === 'signin' ? 'Welcome back ✨' : 'Start your journey ✨'}
              </h2>
              <p style={{ fontSize: 13, color: '#A8A29E', margin: '4px 0 0' }}>
                {tab === 'signin' ? 'Sign in to sync your routine' : 'Save your progress forever'}
              </p>
            </div>

            {/* Pill Tabs */}
            <div style={{
              display: 'flex',
              background: '#F5F0EA',
              borderRadius: 12,
              padding: 4,
              marginBottom: 20,
            }}>
              {(['signin', 'signup'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setError(''); setSuccess(''); }}
                  style={{
                    flex: 1,
                    padding: '8px 0',
                    borderRadius: 9,
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: 14,
                    transition: 'all 0.2s',
                    background: tab === t ? '#FFFFFF' : 'transparent',
                    color: tab === t ? '#1B2B4B' : '#A8A29E',
                    boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                  }}
                >
                  {t === 'signin' ? 'Sign In' : 'Create Account'}
                </button>
              ))}
            </div>

            {/* Google button */}
            <button
              onClick={handleGoogle}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                padding: '12px 0',
                border: '1.5px solid #E7DFD5',
                borderRadius: 14,
                background: '#FFFFFF',
                fontWeight: 600,
                fontSize: 14,
                color: '#1C1917',
                cursor: 'pointer',
                marginBottom: 16,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1, height: 1, background: '#E7DFD5' }} />
              <span style={{ fontSize: 12, color: '#A8A29E' }}>or</span>
              <div style={{ flex: 1, height: 1, background: '#E7DFD5' }} />
            </div>

            {/* Form */}
            <form onSubmit={tab === 'signin' ? handleSignIn : handleSignUp}>
              {tab === 'signup' && (
                <div style={{ marginBottom: 12 }}>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name (optional)"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 12,
                      border: '1.5px solid #E7DFD5',
                      fontSize: 15,
                      color: '#1C1917',
                      background: '#FDFAF7',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              )}
              <div style={{ marginBottom: 12 }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 12,
                    border: '1.5px solid #E7DFD5',
                    fontSize: 15,
                    color: '#1C1917',
                    background: '#FDFAF7',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  minLength={6}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 12,
                    border: '1.5px solid #E7DFD5',
                    fontSize: 15,
                    color: '#1C1917',
                    background: '#FDFAF7',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    fontSize: 13,
                    color: '#DC2626',
                    background: '#FEF2F2',
                    padding: '8px 12px',
                    borderRadius: 8,
                    marginBottom: 12,
                  }}
                >
                  {error}
                </motion.p>
              )}

              {success && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    fontSize: 13,
                    color: '#16A34A',
                    background: '#F0FDF4',
                    padding: '8px 12px',
                    borderRadius: 8,
                    marginBottom: 12,
                  }}
                >
                  {success}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px 0',
                  borderRadius: 14,
                  border: 'none',
                  background: 'linear-gradient(135deg, #1B2B4B, #111C30)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  boxShadow: '0 4px 16px rgba(27,43,75,0.3)',
                }}
              >
                {loading
                  ? (tab === 'signin' ? 'Signing in...' : 'Creating account...')
                  : (tab === 'signin' ? 'Sign In' : 'Create Account')
                }
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
