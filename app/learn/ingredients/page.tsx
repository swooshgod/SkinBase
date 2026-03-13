'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

type ConcernFilter = 'all' | 'acne' | 'aging' | 'hydration' | 'brightening';

interface IngredientCard {
  name: string;
  icon: string;
  whatItDoes: string;
  whoItsFor: string;
  howToUse: string;
  doNotCombine: string[];
  beginnerFriendly: boolean;
  concerns: ConcernFilter[];
}

const INGREDIENTS: IngredientCard[] = [
  {
    name: 'Retinol',
    icon: '🔬',
    whatItDoes: 'Speeds up cell turnover, boosts collagen production, reduces fine lines, fades dark spots, and clears acne. The gold standard of anti-aging.',
    whoItsFor: 'Anyone concerned with aging, acne, texture, or dark spots. Not for sensitive skin without slow introduction.',
    howToUse: 'PM only. Start 1-2x/week, build to nightly. Use pea-sized amount after cleansing. Always pair with SPF the next day.',
    doNotCombine: ['Vitamin C (same routine)', 'AHA/BHA (same night)', 'Benzoyl Peroxide'],
    beginnerFriendly: false,
    concerns: ['aging', 'acne'],
  },
  {
    name: 'Vitamin C',
    icon: '🍊',
    whatItDoes: 'Powerful antioxidant that brightens skin, fades dark spots, protects against UV damage, and boosts collagen. Gives a natural glow.',
    whoItsFor: 'Anyone wanting brighter, more even skin. Great for dullness, dark spots, and sun damage prevention.',
    howToUse: 'AM routine after cleansing, before moisturizer. Use a serum with 10-20% L-ascorbic acid. Store in a cool, dark place.',
    doNotCombine: ['Retinol (same routine)', 'Niacinamide (older advice — actually fine together)', 'AHA/BHA (same routine)'],
    beginnerFriendly: false,
    concerns: ['brightening', 'aging'],
  },
  {
    name: 'Niacinamide',
    icon: '💎',
    whatItDoes: 'Strengthens skin barrier, reduces pore appearance, controls oil, fades redness and dark spots. The multi-tasker.',
    whoItsFor: 'Almost everyone — especially oily, acne-prone, or sensitive skin. Very well-tolerated.',
    howToUse: 'AM or PM. Apply serum (2-5%) after toner. Can be mixed into moisturizer. Pairs well with most actives.',
    doNotCombine: ['Pure Vitamin C at high concentrations (may reduce efficacy)'],
    beginnerFriendly: true,
    concerns: ['acne', 'brightening', 'hydration'],
  },
  {
    name: 'AHA (Glycolic Acid)',
    icon: '🧪',
    whatItDoes: 'Chemical exfoliant that dissolves dead skin cells on the surface. Improves texture, brightness, and fades dark spots.',
    whoItsFor: 'Normal to dry skin wanting smoother texture and brighter tone. Good for sun damage and aging.',
    howToUse: 'PM only, 2-3x/week. Start with lower concentration (5-8%). Apply after cleansing on dry skin. Always use SPF next day.',
    doNotCombine: ['Retinol (same night)', 'BHA (same routine)', 'Vitamin C (same routine)'],
    beginnerFriendly: false,
    concerns: ['aging', 'brightening'],
  },
  {
    name: 'BHA (Salicylic Acid)',
    icon: '🫧',
    whatItDoes: 'Oil-soluble chemical exfoliant that penetrates pores. Dissolves excess oil and dead skin inside pores. The acne fighter.',
    whoItsFor: 'Oily and acne-prone skin. Great for blackheads, whiteheads, and clogged pores.',
    howToUse: 'PM, 2-3x/week. Use 0.5-2% concentration. Apply after cleansing. Can use as a spot treatment.',
    doNotCombine: ['AHA (same routine)', 'Retinol (same night)', 'Benzoyl Peroxide (same routine)'],
    beginnerFriendly: false,
    concerns: ['acne'],
  },
  {
    name: 'Hyaluronic Acid',
    icon: '💧',
    whatItDoes: 'Humectant that holds 1000x its weight in water. Plumps skin, reduces fine lines, and provides deep hydration without heaviness.',
    whoItsFor: 'Everyone! All skin types benefit. Especially great for dehydrated, dry, or aging skin.',
    howToUse: 'AM and PM. Apply to damp skin — it needs water to work. Layer under moisturizer. Avoid using alone in very dry climates.',
    doNotCombine: [],
    beginnerFriendly: true,
    concerns: ['hydration', 'aging'],
  },
  {
    name: 'Peptides',
    icon: '🧬',
    whatItDoes: 'Signal skin to produce more collagen and elastin. Firms skin, reduces fine lines, and supports skin repair.',
    whoItsFor: 'Anyone concerned with aging, firmness, or skin repair. Gentle enough for sensitive skin.',
    howToUse: 'AM or PM. Apply serum after cleansing/toning. Layer under moisturizer. Consistent use over weeks shows results.',
    doNotCombine: ['AHA/BHA (may degrade peptides)', 'Copper Peptides + Vitamin C'],
    beginnerFriendly: true,
    concerns: ['aging'],
  },
  {
    name: 'Ceramides',
    icon: '🛡️',
    whatItDoes: 'Lipids that form your skin\'s natural barrier. Prevent moisture loss, protect against irritants, and support skin repair.',
    whoItsFor: 'Dry, sensitive, eczema-prone skin. Also great after using harsh actives that may compromise the barrier.',
    howToUse: 'AM and PM. Found in moisturizers and serums. Layer as your moisturizer step. Pairs with everything.',
    doNotCombine: [],
    beginnerFriendly: true,
    concerns: ['hydration'],
  },
  {
    name: 'SPF',
    icon: '☀️',
    whatItDoes: 'Blocks UV radiation that causes sunburn, premature aging, dark spots, and skin cancer. The single most important skincare product.',
    whoItsFor: 'Everyone. No exceptions. Even dark skin tones need SPF. Even indoors near windows.',
    howToUse: 'Every morning, last step of skincare. Use 2 finger-lengths. Reapply every 2 hours if outdoors. SPF 30 minimum.',
    doNotCombine: [],
    beginnerFriendly: true,
    concerns: ['aging', 'brightening', 'acne', 'hydration'],
  },
  {
    name: 'Benzoyl Peroxide',
    icon: '🎯',
    whatItDoes: 'Kills acne-causing bacteria on contact. Reduces inflammation and clears breakouts. Works differently from BHA.',
    whoItsFor: 'Acne-prone skin with active breakouts, especially inflammatory (red, painful) acne.',
    howToUse: 'PM, as spot treatment or short-contact (apply, wait 5-10 min, rinse). Start with 2.5%. Can bleach fabrics!',
    doNotCombine: ['Retinol', 'Vitamin C', 'AHA/BHA (same routine)'],
    beginnerFriendly: false,
    concerns: ['acne'],
  },
];

const CONCERN_OPTIONS: { value: ConcernFilter; label: string; icon: string }[] = [
  { value: 'all', label: 'All', icon: '🌟' },
  { value: 'acne', label: 'Acne', icon: '🎯' },
  { value: 'aging', label: 'Aging', icon: '⏳' },
  { value: 'hydration', label: 'Hydration', icon: '💧' },
  { value: 'brightening', label: 'Brightening', icon: '✨' },
];

export default function IngredientsPage() {
  const [search, setSearch] = useState('');
  const [concernFilter, setConcernFilter] = useState<ConcernFilter>('all');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const filtered = INGREDIENTS.filter((ing) => {
    const matchesSearch =
      search === '' ||
      ing.name.toLowerCase().includes(search.toLowerCase()) ||
      ing.whatItDoes.toLowerCase().includes(search.toLowerCase());
    const matchesConcern =
      concernFilter === 'all' || ing.concerns.includes(concernFilter);
    return matchesSearch && matchesConcern;
  });

  return (
    <div className="min-h-screen px-4 py-8 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
        {/* Header */}
        <div>
          <Link href="/learn" className="text-sm transition-colors" style={{ color: '#A8A29E' }}>
            ← Back to Learn
          </Link>
          <h1 className="text-2xl font-bold text-slate-800 mt-2">
            Ingredient <span style={{ color: '#1B2B4B' }}>Cards</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Learn what each ingredient does and how to use it safely
          </p>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search ingredients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 transition-all"
          style={{ borderColor: '#E7DFD5' }}
        />

        {/* Concern filters */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CONCERN_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setConcernFilter(opt.value)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                concernFilter === opt.value
                  ? 'text-white shadow-md'
                  : 'bg-white text-slate-500 border border-slate-200'
              }`}
              style={concernFilter === opt.value ? { background: '#1B2B4B' } : {}}
            >
              {opt.icon} {opt.label}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((ing, i) => {
              const isExpanded = expandedCard === ing.name;
              return (
                <motion.div
                  key={ing.name}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setExpandedCard(isExpanded ? null : ing.name)}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{ing.icon}</span>
                        <div>
                          <h3 className="font-semibold text-slate-800">{ing.name}</h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            {ing.beginnerFriendly ? (
                              <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-medium">
                                Beginner-friendly
                              </span>
                            ) : (
                              <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-medium">
                                Intermediate+
                              </span>
                            )}
                            {ing.concerns.filter((c) => c !== 'all').map((c) => (
                              <span key={c} className="text-[10px] text-slate-400 capitalize">
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <motion.span
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        className="text-slate-400 text-sm"
                      >
                        ▼
                      </motion.span>
                    </div>

                    {!isExpanded && (
                      <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                        {ing.whatItDoes}
                      </p>
                    )}
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 space-y-3">
                          <div>
                            <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                              What it does
                            </h4>
                            <p className="text-sm text-slate-600">{ing.whatItDoes}</p>
                          </div>

                          <div>
                            <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                              Who it&apos;s for
                            </h4>
                            <p className="text-sm text-slate-600">{ing.whoItsFor}</p>
                          </div>

                          <div>
                            <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                              How to use
                            </h4>
                            <p className="text-sm text-slate-600">{ing.howToUse}</p>
                          </div>

                          {ing.doNotCombine.length > 0 && (
                            <div className="bg-red-50 rounded-xl p-3">
                              <h4 className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-1.5">
                                Do NOT combine with
                              </h4>
                              <div className="flex flex-wrap gap-1.5">
                                {ing.doNotCombine.map((item) => (
                                  <span
                                    key={item}
                                    className="text-xs bg-white text-red-600 px-2 py-0.5 rounded-full border border-red-100"
                                  >
                                    {item}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {ing.doNotCombine.length === 0 && (
                            <div className="bg-green-50 rounded-xl p-3">
                              <p className="text-xs text-green-600 font-medium">
                                Pairs well with everything — no known conflicts
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-slate-500 text-sm">No ingredients match your search</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
