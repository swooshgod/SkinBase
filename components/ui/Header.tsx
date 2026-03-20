'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import AuthButton from '@/components/auth/AuthButton';

// Custom SVG icons — premium, on-brand
const TodayIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#1B2B4B' : '#A8A29E'} strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
    {/* Sun / morning circle with rays */}
    <circle cx="12" cy="12" r="4" fill={active ? '#1B2B4B' : 'none'} stroke={active ? '#1B2B4B' : '#A8A29E'} />
    <line x1="12" y1="2" x2="12" y2="5" />
    <line x1="12" y1="19" x2="12" y2="22" />
    <line x1="2" y1="12" x2="5" y2="12" />
    <line x1="19" y1="12" x2="22" y2="12" />
    <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
    <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
    <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
    <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
  </svg>
);

const ProgressIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#1B2B4B' : '#A8A29E'} strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
    {/* Leaf / growth */}
    <path d="M12 22V12" />
    <path d="M12 12C12 12 7 10 5 5c5 0 7 3 7 7z" fill={active ? '#1B2B4B' : 'none'} />
    <path d="M12 12c0 0 5-2 7-7-5 0-7 3-7 7z" fill={active ? '#E8856A' : 'none'} stroke={active ? '#E8856A' : '#A8A29E'} />
  </svg>
);

const ExploreIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#1B2B4B' : '#A8A29E'} strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
    {/* Droplet / serum bottle */}
    <path d="M12 2L8 10a5 5 0 1 0 8 0L12 2z" fill={active ? '#1B2B4B' : 'none'} />
  </svg>
);

// 3 tabs only for bottom nav
const bottomNavLinks = [
  { href: '/', label: 'Today' },
  { href: '/progress', label: 'Progress' },
  { href: '/explore', label: 'Explore' },
];

// Desktop nav links (same 3)
const desktopNavLinks = [
  { href: '/', label: 'Today' },
  { href: '/progress', label: 'Progress' },
  { href: '/explore', label: 'Explore' },
];

export default function Header() {
  const pathname = usePathname();

  // Hide header on auth pages
  if (pathname?.startsWith('/auth')) return null;
  if (pathname?.startsWith('/routine/active')) return null;

  return (
    <>
      {/* Top Header */}
      <header
        className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-md"
        style={{
          background: 'rgba(253,250,247,0.92)',
          borderBottom: '1px solid #E7DFD5',
          paddingTop: 'env(safe-area-inset-top)',
        }}
      >
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5">
            <span style={{
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: '-0.04em',
              color: '#1C1917',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              {/* Official logo */}
              <img src="/logo.png" alt="SkinBase" style={{ width: 48, height: 48, objectFit: 'contain' }} />
              <span>skin<span style={{ color: '#1B2B4B' }}>base</span></span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden sm:flex items-center gap-1">
            {desktopNavLinks.map((link) => {
              const isActive = pathname === link.href ||
                (link.href !== '/' && pathname?.startsWith(link.href));
              return (
                <Link key={link.href} href={link.href}>
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      background: isActive ? '#FBE9E4' : 'transparent',
                      color: isActive ? '#1B2B4B' : '#78716C',
                    }}
                  >
                    {link.label}
                  </motion.span>
                </Link>
              );
            })}
          </nav>

          {/* Auth area */}
          <div className="flex items-center gap-2">
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation - 3 tabs only */}
      <nav
        className="sm:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{
          background: '#FFFFFF',
          borderTop: '1px solid #E7DFD5',
          paddingBottom: 'env(safe-area-inset-bottom)',
          boxShadow: '0 -1px 8px rgba(28,25,23,0.04)',
        }}
      >
        <div className="flex items-center justify-around h-16">
          {bottomNavLinks.map((link) => {
            const isActive = pathname === link.href ||
              (link.href !== '/' && pathname?.startsWith(link.href));
            const Icon = link.href === '/' ? TodayIcon : link.href === '/progress' ? ProgressIcon : ExploreIcon;
            return (
              <Link key={link.href} href={link.href} className="flex-1">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center gap-1 py-2"
                >
                  <Icon active={isActive} />
                  <span
                    className="text-[10px] font-semibold tracking-wide transition-colors duration-200"
                    style={{ color: isActive ? '#1B2B4B' : '#A8A29E', letterSpacing: '0.04em' }}
                  >
                    {link.label.toUpperCase()}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
