'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSkinBaseStore } from '@/lib/store';

const exploreCards = [
  {
    emoji: '🧴',
    title: 'Products',
    description: 'Browse 320+ curated products',
    href: '/products',
    gradient: 'linear-gradient(135deg, #FFF3D6, #F5E6C0)',
    accentColor: '#1B2B4B',
  },
  {
    emoji: '📚',
    title: 'Learn',
    description: 'Layering guides & ingredient science',
    href: '/learn',
    gradient: 'linear-gradient(135deg, #FBE9E4, #F5C4B5)',
    accentColor: '#1B2B4B',
  },
  {
    emoji: '✨',
    title: 'Transform',
    description: 'See your future skin (Pro)',
    href: '/transform',
    gradient: 'linear-gradient(135deg, #F5F0EA, #EDE5D8)',
    accentColor: '#E8856A',
    isPro: true,
  },
];

export default function ExplorePage() {
  const { isPro } = useSkinBaseStore();

  return (
    <div className="min-h-screen px-4 py-6 pb-24 max-w-lg mx-auto" style={{ background: '#FDFAF7' }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-5"
      >
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1C1917' }}>Explore</h1>
          <p className="text-sm" style={{ color: '#A8A29E' }}>Products, guides & more</p>
        </div>

        {/* Cards */}
        <div className="space-y-4">
          {exploreCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={card.href}>
                <div
                  className="rounded-2xl p-5 cursor-pointer transition-all hover:shadow-lg"
                  style={{ background: card.gradient }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(255,255,255,0.7)' }}
                    >
                      <span className="text-3xl">{card.emoji}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h2
                          className="text-lg font-bold"
                          style={{ color: card.accentColor }}
                        >
                          {card.title}
                        </h2>
                        {card.isPro && !isPro && (
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                            style={{
                              background: 'linear-gradient(135deg, #E8856A, #D4624A)',
                              color: 'white',
                            }}
                          >
                            Pro
                          </span>
                        )}
                      </div>
                      <p className="text-sm" style={{ color: '#78716C' }}>{card.description}</p>
                    </div>
                    <span style={{ color: '#A8A29E' }} className="text-lg">→</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-sm font-semibold mb-3" style={{ color: '#78716C' }}>More</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/products">
              <div
                className="rounded-xl p-4 transition-all"
                style={{ background: '#FFFFFF', border: '1px solid #E7DFD5' }}
              >
                <span className="text-2xl mb-2 block">🛍️</span>
                <p className="text-sm font-medium" style={{ color: '#1C1917' }}>My Products</p>
                <p className="text-xs" style={{ color: '#A8A29E' }}>Browse your saved picks</p>
              </div>
            </Link>
            <Link href="/pricing">
              <div
                className="rounded-xl p-4 transition-all"
                style={{ background: '#FFFFFF', border: '1px solid #E7DFD5' }}
              >
                <span className="text-2xl mb-2 block">💎</span>
                <p className="text-sm font-medium" style={{ color: '#1C1917' }}>Go Pro</p>
                <p className="text-xs" style={{ color: '#A8A29E' }}>Unlock all features</p>
              </div>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
