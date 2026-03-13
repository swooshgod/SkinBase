'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSkinBaseStore } from '@/lib/store';
import { products as allProducts } from '@/lib/products';

interface ConflictItem {
  severity: 'high' | 'medium' | 'low';
  products: string[];
  issue: string;
  fix: string;
}

interface AnalysisResult {
  status: 'compatible' | 'conflicts' | 'warnings' | 'unavailable' | 'error';
  headline?: string;
  summary?: string;
  conflicts?: ConflictItem[];
  positives?: string[];
  applicationOrder?: string[];
  message?: string;
}

interface Props {
  timeOfDay: 'am' | 'pm';
}

export default function IngredientChecker({ timeOfDay }: Props) {
  const { amSlots, pmSlots } = useSkinBaseStore();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const slots = timeOfDay === 'am' ? amSlots : pmSlots;
  const productIds = Object.values(slots).filter(Boolean) as string[];
  const currentProducts = productIds
    .map(id => allProducts.find(p => p.id === id))
    .filter(Boolean);

  if (currentProducts.length < 2) return null;

  const runCheck = async () => {
    setLoading(true);
    setIsOpen(true);
    try {
      const res = await fetch('/api/ingredient-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products: currentProducts.map(p => ({
            name: p!.name,
            brand: p!.brand,
            keyIngredients: p!.key_actives,
          })),
          timeOfDay,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ status: 'error', message: 'Could not analyze right now.' });
    } finally {
      setLoading(false);
    }
  };

  const severityColor = (s: string) => {
    if (s === 'high') return '#E53E3E';
    if (s === 'medium') return '#D97706';
    return '#78716C';
  };

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #E7DFD5', background: '#FFFFFF' }}>
      {/* Header — always visible */}
      <button
        onClick={isOpen ? () => setIsOpen(false) : runCheck}
        className="w-full flex items-center justify-between px-4 py-3"
        style={{ background: '#FFFFFF' }}
      >
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 16 }}>🧪</span>
          <span className="text-sm font-semibold" style={{ color: '#1C1917' }}>
            Ingredient Compatibility Check
          </span>
        </div>
        {result && !loading && (
          <span style={{ fontSize: 18 }}>
            {result.status === 'compatible' ? '✅' : result.status === 'conflicts' ? '⚠️' : '→'}
          </span>
        )}
        {!result && !loading && (
          <span className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{ background: '#FBE9E4', color: '#1B2B4B' }}>
            Check
          </span>
        )}
        {loading && (
          <div className="w-5 h-5 rounded-full border-2 animate-spin"
            style={{ borderColor: '#E8856A', borderTopColor: 'transparent' }} />
        )}
      </button>

      {/* Results */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              {loading && (
                <div className="text-center py-4">
                  <p className="text-sm" style={{ color: '#A8A29E' }}>Analyzing your routine...</p>
                </div>
              )}

              {result && !loading && (
                <>
                  {/* Status banner */}
                  {result.status === 'compatible' && (
                    <motion.div
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      className="rounded-xl p-4 flex items-start gap-3"
                      style={{ background: '#EBF2E4', border: '1px solid #C6E0AB' }}
                    >
                      <span style={{ fontSize: 24, flexShrink: 0 }}>✅</span>
                      <div>
                        <p className="font-bold text-sm" style={{ color: '#2D5016' }}>{result.headline || 'All good!'}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#3A6B1C' }}>{result.summary}</p>
                      </div>
                    </motion.div>
                  )}

                  {(result.status === 'conflicts' || result.status === 'warnings') && (
                    <motion.div
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      className="rounded-xl p-4 flex items-start gap-3"
                      style={{ 
                        background: result.status === 'conflicts' ? '#FEF2F2' : '#FFFBEB',
                        border: `1px solid ${result.status === 'conflicts' ? '#FECACA' : '#FDE68A'}`
                      }}
                    >
                      <span style={{ fontSize: 24, flexShrink: 0 }}>{result.status === 'conflicts' ? '⚠️' : '💛'}</span>
                      <div>
                        <p className="font-bold text-sm" style={{ color: result.status === 'conflicts' ? '#991B1B' : '#92400E' }}>
                          {result.headline}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: result.status === 'conflicts' ? '#7F1D1D' : '#78350F' }}>
                          {result.summary}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {result.status === 'unavailable' && (
                    <div className="rounded-xl p-4 text-center" style={{ background: '#F5F0EA' }}>
                      <p className="text-sm" style={{ color: '#78716C' }}>
                        🔒 AI analysis is a Pro feature. Get personalized conflict detection for your routine.
                      </p>
                    </div>
                  )}

                  {result.status === 'error' && (
                    <div className="rounded-xl p-4 text-center" style={{ background: '#FEF2F2' }}>
                      <p className="text-sm" style={{ color: '#991B1B' }}>
                        {result.message || 'Could not analyze right now.'}
                      </p>
                    </div>
                  )}

                  {/* Conflict details */}
                  {result.conflicts && result.conflicts.length > 0 && (
                    <div className="space-y-2">
                      {result.conflicts.map((c, i) => (
                        <div key={i} className="rounded-xl p-3" style={{ background: '#FFF7ED', border: '1px solid #FED7AA' }}>
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{ background: severityColor(c.severity) }} />
                            <p className="text-xs font-bold" style={{ color: severityColor(c.severity) }}>
                              {c.products.join(' + ')}
                            </p>
                          </div>
                          <p className="text-xs mb-1" style={{ color: '#1C1917' }}>{c.issue}</p>
                          <p className="text-xs font-medium" style={{ color: '#1B2B4B' }}>
                            ✦ Fix: {c.fix}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Positives */}
                  {result.positives && result.positives.length > 0 && (
                    <div className="space-y-1">
                      {result.positives.map((pos, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-xs" style={{ color: '#2D5016' }}>✓</span>
                          <p className="text-xs" style={{ color: '#78716C' }}>{pos}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Application order */}
                  {result.applicationOrder && result.applicationOrder.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#A8A29E' }}>
                        Recommended Application Order
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {result.applicationOrder.map((p, i) => (
                          <span key={i} className="flex items-center gap-1">
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{ background: '#FBE9E4', color: '#1B2B4B' }}>
                              {i + 1}. {p}
                            </span>
                            {i < result.applicationOrder!.length - 1 && (
                              <span style={{ color: '#E7DFD5', fontSize: 12 }}>→</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Re-check button */}
                  <button
                    onClick={runCheck}
                    className="text-xs underline"
                    style={{ color: '#A8A29E' }}
                  >
                    Re-analyze
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
