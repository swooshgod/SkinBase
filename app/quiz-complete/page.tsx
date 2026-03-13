'use client';

import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSkinBaseStore } from '@/lib/store';
import { products } from '@/lib/products';
import { Product, ProductCategory } from '@/types';

const categoryEmoji: Record<string, string> = {
  cleanser: '🧴',
  moisturizer: '💧',
  sunscreen: '☀️',
  serum: '✨',
};

const categoryGradients: Record<string, string> = {
  cleanser: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
  moisturizer: 'linear-gradient(135deg, #e0f2fe, #bae6fd)',
  sunscreen: 'linear-gradient(135deg, #fef3c7, #fde68a)',
  serum: 'linear-gradient(135deg, #FBE9E4, #F5F0EA)',
};

interface SlotDisplay {
  slotType: string;
  category: ProductCategory;
  product: Product | null;
  isLocked: boolean;
}

export default function QuizCompletePage() {
  const router = useRouter();
  const { quizResults } = useSkinBaseStore();

  // Redirect if quiz not completed
  useEffect(() => {
    if (!quizResults.completed) {
      router.push('/quiz');
    }
  }, [quizResults.completed, router]);

  // Get recommended products for beginner AM routine
  const routineSlots = useMemo<SlotDisplay[]>(() => {
    if (!quizResults.completed) return [];

    const getProduct = (category: ProductCategory): Product | null => {
      const filtered = products.filter((p) => {
        if (p.category !== category) return false;
        const matchesSkinType = p.for_skin_types.includes(quizResults.skinType || 'normal');
        const matchesBudget = !quizResults.budget || p.price_tier === quizResults.budget;
        const matchesSafety = quizResults.safetyTags.every((tag) => {
          if (tag === 'pregnancy_safe') return p.pregnancy_safe;
          if (tag === 'fragrance_free') return p.fragrance_free;
          if (tag === 'fungal_safe') return p.fungal_safe;
          return true;
        });
        return matchesSkinType && matchesBudget && matchesSafety;
      });

      const scored = filtered.map((p) => {
        let score = p.efficacy_score;
        quizResults.concerns.forEach((c) => {
          if (p.for_concerns.includes(c)) score += 15;
        });
        return { product: p, score };
      });

      scored.sort((a, b) => b.score - a.score);
      return scored[0]?.product || null;
    };

    return [
      { slotType: 'Cleanser', category: 'cleanser', product: getProduct('cleanser'), isLocked: false },
      { slotType: 'Moisturizer', category: 'moisturizer', product: getProduct('moisturizer'), isLocked: false },
      { slotType: 'SPF', category: 'sunscreen', product: getProduct('sunscreen'), isLocked: false },
      { slotType: 'Serum', category: 'serum', product: null, isLocked: true },
    ];
  }, [quizResults]);

  // Confetti effect
  useEffect(() => {
    if (typeof window !== 'undefined' && quizResults.completed) {
      import('canvas-confetti').then((confetti) => {
        confetti.default({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#1B2B4B', '#253860', '#E8856A', '#E7DFD5', '#78716C'],
        });
      }).catch(() => {});
    }
  }, [quizResults.completed]);

  if (!quizResults.completed) {
    return null;
  }

  return (
    <div className="min-h-screen px-4 py-8 pb-24 max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        {/* Hero */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-6xl mb-4"
        >
          ✨
        </motion.div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Your routine is ready!
        </h1>
        <p className="text-slate-500 mb-8">
          Personalized for your{' '}
          <span className="font-medium capitalize" style={{ color: '#1B2B4B' }}>{quizResults.skinType}</span> skin
        </p>

        {/* Routine Slots */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-5 border border-slate-100 shadow-lg mb-6 text-left"
        >
          <h2 className="text-sm font-semibold text-slate-600 mb-4 text-center">
            Your Morning Routine
          </h2>

          <div className="space-y-2">
            {routineSlots.map((slot, i) => (
              <motion.div
                key={slot.slotType}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                {slot.isLocked ? (
                  // Locked slot
                  <div
                    style={{
                      background: '#f8fafc',
                      borderRadius: 12,
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      opacity: 0.6,
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 10,
                        background: '#e2e8f0',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span style={{ fontSize: 18 }}>🔒</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontSize: 11,
                          color: '#94a3b8',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          margin: 0,
                        }}
                      >
                        {slot.slotType}
                      </p>
                      <p style={{ fontSize: 13, color: '#94a3b8', margin: '2px 0 0' }}>
                        Unlocks at Level 2
                      </p>
                    </div>
                  </div>
                ) : (
                  // Unlocked slot with product
                  <div
                    style={{
                      background: 'white',
                      borderRadius: 12,
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      border: '1px solid #f1f5f9',
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 10,
                        background: categoryGradients[slot.category],
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span style={{ fontSize: 20 }}>{categoryEmoji[slot.category]}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: 11,
                          color: '#94a3b8',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          margin: 0,
                        }}
                      >
                        {slot.slotType}
                      </p>
                      {slot.product ? (
                        <>
                          <p
                            style={{
                              fontSize: 14,
                              fontWeight: 600,
                              color: '#1e293b',
                              margin: '2px 0 0',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {slot.product.name}
                          </p>
                          <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
                            {slot.product.brand}
                          </p>
                        </>
                      ) : (
                        <p style={{ fontSize: 13, color: '#94a3b8', margin: '2px 0 0' }}>
                          Recommended for you
                        </p>
                      )}
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        color: '#10b981',
                        background: '#d1fae5',
                        padding: '4px 8px',
                        borderRadius: 6,
                        fontWeight: 600,
                      }}
                    >
                      Match
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Why simple */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-blue-50 rounded-2xl p-4 mb-8 text-left"
        >
          <h3 className="text-sm font-semibold text-blue-700 mb-1">Why start simple?</h3>
          <p className="text-sm text-blue-600">
            A 3-step routine is the foundation of great skin. Master these basics for 14 days
            to unlock serums, retinol, and advanced actives.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
              style={{ background: 'linear-gradient(135deg, #1B2B4B, #111C30)', boxShadow: '0 10px 25px rgba(27,43,75,0.25)' }}
            >
              Start My First Routine →
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
