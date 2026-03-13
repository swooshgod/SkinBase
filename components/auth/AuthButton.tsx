'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/hooks/useAuth';
import { useSkinBaseStore } from '@/lib/store';
import AuthModal from './AuthModal';
import PhotoPicker from '@/components/ui/PhotoPicker';

export default function AuthButton() {
  const { user, loading, signOut } = useAuth();
  const { isPro, avatarDataUrl, setAvatarPhoto } = useSkinBaseStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (loading) {
    return <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#F5F0EA' }} />;
  }

  if (!user) {
    return (
      <>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setModalOpen(true)}
          style={{
            padding: '6px 16px',
            borderRadius: 10,
            border: 'none',
            background: 'linear-gradient(135deg, #1B2B4B, #111C30)',
            color: '#FFFFFF',
            fontWeight: 600,
            fontSize: 13,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(27,43,75,0.25)',
          }}
        >
          Sign In
        </motion.button>
        <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    );
  }

  const userInitial = (user.email?.[0] || user.user_metadata?.name?.[0] || '?').toUpperCase();

  return (
    <div style={{ position: 'relative' }}>
      <PhotoPicker onPhoto={setAvatarPhoto} facingMode="user">
        <div
          onClick={(e) => { e.stopPropagation(); setDropdownOpen(!dropdownOpen); }}
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            overflow: 'hidden',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: avatarDataUrl ? 'transparent' : 'linear-gradient(135deg, #1B2B4B, #111C30)',
            position: 'relative',
          }}
        >
          {avatarDataUrl
            ? <img src={avatarDataUrl} alt="Avatar" style={{ width: 32, height: 32, objectFit: 'cover' }} />
            : <span style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 700 }}>{userInitial}</span>
          }
          {isPro && (
            <span style={{
              position: 'absolute',
              bottom: -1,
              right: -1,
              background: '#E8856A',
              borderRadius: 4,
              fontSize: 7,
              fontWeight: 800,
              color: '#fff',
              padding: '1px 3px',
              lineHeight: 1.2,
            }}>
              PRO
            </span>
          )}
        </div>
      </PhotoPicker>

      {/* Dropdown */}
      <AnimatePresence>
        {dropdownOpen && (
          <>
            <div
              style={{ position: 'fixed', inset: 0, zIndex: 100 }}
              onClick={() => setDropdownOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                background: '#FFFFFF',
                borderRadius: 12,
                boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                border: '1px solid #E7DFD5',
                minWidth: 160,
                zIndex: 101,
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '10px 14px', borderBottom: '1px solid #F5F0EA' }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#1C1917', margin: 0 }}>
                  {user.user_metadata?.name || user.email?.split('@')[0]}
                </p>
                <p style={{ fontSize: 11, color: '#A8A29E', margin: '2px 0 0' }}>{user.email}</p>
                {isPro && (
                  <span style={{
                    display: 'inline-block',
                    marginTop: 4,
                    background: 'linear-gradient(135deg, #E8856A, #D4624A)',
                    color: '#fff',
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 20,
                  }}>
                    PRO Member
                  </span>
                )}
              </div>
              {!isPro && (
                <a
                  href="/pricing"
                  onClick={() => setDropdownOpen(false)}
                  style={{
                    display: 'block',
                    padding: '10px 14px',
                    fontSize: 13,
                    color: '#E8856A',
                    fontWeight: 600,
                    textDecoration: 'none',
                    borderBottom: '1px solid #F5F0EA',
                  }}
                >
                  ✨ Upgrade to Pro
                </a>
              )}
              <button
                onClick={() => { signOut(); setDropdownOpen(false); }}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '10px 14px',
                  textAlign: 'left',
                  fontSize: 13,
                  color: '#78716C',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                Sign out
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
