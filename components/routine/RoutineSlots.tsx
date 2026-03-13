'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSkinBaseStore } from '@/lib/store';
import { products as allProducts } from '@/lib/products';
import { Product, ProductCategory } from '@/types';

interface SlotConfig {
  slotType: string;
  category: ProductCategory;
  emoji: string;
  lockedUntilLevel: number;
}

const AM_SLOTS: SlotConfig[] = [
  { slotType: 'Cleanser', category: 'cleanser', emoji: '🧴', lockedUntilLevel: 1 },
  { slotType: 'Moisturizer', category: 'moisturizer', emoji: '💧', lockedUntilLevel: 1 },
  { slotType: 'SPF', category: 'sunscreen', emoji: '☀️', lockedUntilLevel: 1 },
  { slotType: 'Serum', category: 'serum', emoji: '✨', lockedUntilLevel: 2 },
];

const PM_SLOTS: SlotConfig[] = [
  { slotType: 'Cleanser', category: 'cleanser', emoji: '🧴', lockedUntilLevel: 1 },
  { slotType: 'Night Cream', category: 'moisturizer', emoji: '🌙', lockedUntilLevel: 1 },
  { slotType: 'Serum', category: 'serum', emoji: '✨', lockedUntilLevel: 2 },
  { slotType: 'Retinol', category: 'treatment', emoji: '💊', lockedUntilLevel: 2 },
];

const categoryGradients: Record<string, string> = {
  cleanser: 'linear-gradient(135deg, #E8F4FD, #C7E9F9)',
  moisturizer: 'linear-gradient(135deg, #FBE9E4, #F5C4B5)',
  sunscreen: 'linear-gradient(135deg, #FFF8E1, #FFF0C2)',
  serum: 'linear-gradient(135deg, #FFF0F5, #FFD6E7)',
  treatment: 'linear-gradient(135deg, #F3F0FF, #E5DFFF)',
  toner: 'linear-gradient(135deg, #FFF0E6, #FFD9BD)',
  mask: 'linear-gradient(135deg, #E6FAF8, #CCFBF1)',
  oil: 'linear-gradient(135deg, #FFFBE6, #FEF3C7)',
  exfoliant: 'linear-gradient(135deg, #FFF4E6, #FFEDD5)',
  eye_cream: 'linear-gradient(135deg, #F5F0FF, #E9D5FF)',
};

interface RoutineSlotsProps {
  timeOfDay: 'am' | 'pm';
  onSlotClick?: (slot: SlotConfig, product: Product | null) => void;
}

export default function RoutineSlots({ timeOfDay, onSlotClick }: RoutineSlotsProps) {
  const { quizResults, amSlots, pmSlots, setSlotProduct, getLevel, getDaysLoggedTotal } = useSkinBaseStore();
  const [swapSheet, setSwapSheet] = useState<{ open: boolean; slot: SlotConfig | null }>({ open: false, slot: null });
  const [searchQuery, setSearchQuery] = useState('');

  const slots = timeOfDay === 'am' ? AM_SLOTS : PM_SLOTS;
  const currentSlots = timeOfDay === 'am' ? amSlots : pmSlots;
  const level = getLevel();
  const daysLogged = getDaysLoggedTotal();

  // Get recommended product for a slot
  const getRecommendedProduct = (category: ProductCategory): Product | null => {
    const filtered = allProducts.filter((p) => {
      if (p.category !== category) return false;
      const matchesSkinType = p.for_skin_types.includes(quizResults.skinType || 'normal');
      const matchesBudget = !quizResults.budget || p.price_tier === quizResults.budget;
      const matchesSafety = quizResults.safetyTags.every((tag) => {
        if (tag === 'pregnancy_safe') return p.pregnancy_safe;
        if (tag === 'fragrance_free') return p.fragrance_free;
        if (tag === 'fungal_safe') return p.fungal_safe;
        if (tag === 'vegan') return p.vegan;
        if (tag === 'cruelty_free') return p.cruelty_free;
        return true;
      });
      return matchesSkinType && matchesBudget && matchesSafety;
    });

    // Score by efficacy and concern matching
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

  // Get product for a slot (user selected or recommended)
  const getSlotProduct = (slot: SlotConfig): Product | null => {
    const productId = currentSlots[slot.slotType];
    if (productId) {
      return allProducts.find((p) => p.id === productId) || null;
    }
    return getRecommendedProduct(slot.category);
  };

  // Filter products for swap sheet
  const filteredProducts = useMemo(() => {
    if (!swapSheet.slot) return [];
    return allProducts.filter((p) => {
      if (p.category !== swapSheet.slot!.category) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query)
        );
      }
      return true;
    }).slice(0, 20);
  }, [swapSheet.slot, searchQuery]);

  const handleSwap = (slot: SlotConfig) => {
    setSwapSheet({ open: true, slot });
    setSearchQuery('');
  };

  const handleSelectProduct = (product: Product) => {
    if (swapSheet.slot) {
      setSlotProduct(timeOfDay, swapSheet.slot.slotType, product.id);
    }
    setSwapSheet({ open: false, slot: null });
  };

  const handleUseRecommendation = () => {
    if (swapSheet.slot) {
      // Clear the custom selection to use recommendation
      setSlotProduct(timeOfDay, swapSheet.slot.slotType, '');
    }
    setSwapSheet({ open: false, slot: null });
  };

  // Only show the first locked slot (don't overwhelm beginners with multiple locks)
  let shownLockedSlot = false;

  return (
    <>
      <div className="space-y-2">
        {slots.map((slot) => {
          const isLocked = level < slot.lockedUntilLevel;
          const product = isLocked ? null : getSlotProduct(slot);

          // Skip additional locked slots — show only the first one
          if (isLocked) {
            if (shownLockedSlot) return null;
            shownLockedSlot = true;
          }

          if (isLocked) {
            // Locked slot
            return (
              <div
                key={slot.slotType}
                style={{
                  background: '#F5F0EA',
                  borderRadius: 12,
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  opacity: 0.7,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: '#E7DFD5',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: 18, color: '#E8856A' }}>🔒</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontSize: 11,
                      color: '#A8A29E',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      margin: 0,
                    }}
                  >
                    {slot.slotType}
                  </p>
                  <p style={{ fontSize: 13, color: '#A8A29E', margin: '2px 0 0' }}>
                    Unlocks at Level 2
                  </p>
                  <div
                    style={{
                      height: 4,
                      background: '#E7DFD5',
                      borderRadius: 4,
                      marginTop: 6,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.min((daysLogged / 14) * 100, 100)}%`,
                        background: 'linear-gradient(90deg, #E8856A, #F5A98A)',
                        borderRadius: 4,
                      }}
                    />
                  </div>
                  <p style={{ fontSize: 10, color: '#A8A29E', margin: '3px 0 0' }}>
                    {daysLogged}/14 days
                  </p>
                </div>
              </div>
            );
          }

          // Unlocked slot
          return (
            <motion.div
              key={slot.slotType}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E7DFD5',
                borderRadius: 12,
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
              onClick={() => onSlotClick?.(slot, product)}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: categoryGradients[slot.category] || categoryGradients.serum,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: 20 }}>{slot.emoji}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: 11,
                    color: '#A8A29E',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    margin: 0,
                  }}
                >
                  {slot.slotType}
                </p>
                {product ? (
                  <>
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#1C1917',
                        margin: '2px 0 0',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {product.name}
                    </p>
                    <p style={{ fontSize: 12, color: '#78716C', margin: 0 }}>{product.brand}</p>
                  </>
                ) : (
                  <p style={{ fontSize: 13, color: '#A8A29E', margin: '2px 0 0' }}>
                    Tap to select
                  </p>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSwap(slot);
                }}
                style={{
                  fontSize: 12,
                  color: '#1B2B4B',
                  background: '#FBE9E4',
                  border: 'none',
                  borderRadius: 8,
                  padding: '4px 10px',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                Swap
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Swap Bottom Sheet */}
      <AnimatePresence>
        {swapSheet.open && swapSheet.slot && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSwapSheet({ open: false, slot: null })}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(28,25,23,0.4)',
                zIndex: 100,
              }}
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                background: '#FFFFFF',
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                maxHeight: '80vh',
                zIndex: 101,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Handle */}
              <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 8px' }}>
                <div
                  style={{
                    width: 40,
                    height: 4,
                    background: '#E7DFD5',
                    borderRadius: 2,
                  }}
                />
              </div>

              {/* Header */}
              <div style={{ padding: '0 20px 12px' }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1C1917', margin: 0 }}>
                  Choose {swapSheet.slot.slotType}
                </h3>
              </div>

              {/* Search */}
              <div style={{ padding: '0 20px 12px' }}>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #E7DFD5',
                    borderRadius: 12,
                    fontSize: 14,
                    outline: 'none',
                    background: '#FFFFFF',
                  }}
                />
              </div>

              {/* Use Recommendation */}
              <button
                onClick={handleUseRecommendation}
                style={{
                  margin: '0 20px 12px',
                  padding: '12px 16px',
                  background: 'linear-gradient(135deg, #FBE9E4, #F5C4B5)',
                  border: 'none',
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#1B2B4B',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                ✨ Use our recommendation
              </button>

              {/* Product list */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }}>
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleSelectProduct(product)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px',
                      background: '#F5F0EA',
                      border: 'none',
                      borderRadius: 12,
                      marginBottom: 8,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 10,
                        background: categoryGradients[product.category] || categoryGradients.serum,
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{swapSheet.slot?.emoji}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: 12,
                          color: '#78716C',
                          margin: 0,
                          textTransform: 'uppercase',
                        }}
                      >
                        {product.brand}
                      </p>
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: '#1C1917',
                          margin: '2px 0 0',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {product.name}
                      </p>
                    </div>
                    <span style={{ fontSize: 12, color: '#78716C' }}>
                      ${product.price_usd}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Export slot configs for use in other components
export { AM_SLOTS, PM_SLOTS };
export type { SlotConfig };
