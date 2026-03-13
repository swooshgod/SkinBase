'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSkinBaseStore } from '@/lib/store';
import { getGreeting, formatDateFull, getSuggestedRoutineType } from '@/lib/streak';
import RoutineSlots, { AM_SLOTS, PM_SLOTS } from '@/components/routine/RoutineSlots';
import RoutineDoneScreen from '@/components/routine/RoutineDoneScreen';
import IngredientChecker from '@/components/routine/IngredientChecker';
import MilestoneModal from '@/components/ui/MilestoneModal';
import AuthModal from '@/components/auth/AuthModal';
import { products as allProducts } from '@/lib/products';

const AFFILIATE_TAG = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || 'MY_ASSOCIATE_TAG';
const MILESTONE_DAYS = [7, 14, 30, 60, 90];

export default function Home() {
  const {
    quizResults,
    userName,
    calculateStreak,
    getTodayStatus,
    amSlots,
    pmSlots,
    addShownMilestone,
    isAuthenticated,
  } = useSkinBaseStore();

  const [mounted, setMounted] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState<'am' | 'pm'>('am');
  const [activeMilestone, setActiveMilestone] = useState<number | null>(null);
  const [authNudgeOpen, setAuthNudgeOpen] = useState(false);

  // Recs state
  const [routineRecs, setRoutineRecs] = useState<{
    name: string;
    brand: string;
    step: string;
    reason: string;
    searchQuery: string;
    keyIngredient: string;
  }[]>([]);
  const [recsLoading, setRecsLoading] = useState(false);
  const [recsOpen, setRecsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const suggested = getSuggestedRoutineType();
    const status = useSkinBaseStore.getState().getTodayStatus();
    if (status.amDone && !status.pmDone) {
      setSelectedRoutine('pm');
    } else if (suggested === 'pm') {
      setSelectedRoutine('pm');
    }

    // Check milestone
    const streak = useSkinBaseStore.getState().calculateStreak();
    const shown = useSkinBaseStore.getState().shownMilestones;
    if (MILESTONE_DAYS.includes(streak) && !shown.includes(streak)) {
      setActiveMilestone(streak);
    }

    // If user just completed quiz and is logged in, sync to Supabase
    const storeState = useSkinBaseStore.getState();
    if (storeState.quizResults.completed && storeState.isAuthenticated) {
      storeState.syncWithSupabase().catch(() => {/* non-critical */});
    }
  }, []);

  const greeting = getGreeting();
  const dateStr = formatDateFull();
  const suggestedRoutine = mounted ? getSuggestedRoutineType() : 'am';
  const streak = mounted ? calculateStreak() : 0;
  const todayStatus = mounted ? getTodayStatus() : { amDone: false, pmDone: false };

  const amGradient = 'linear-gradient(135deg, #FFFBF2, #FFF3D6)';
  const pmGradient = 'linear-gradient(135deg, #0D1520, #111C30)';
  const currentGradient = selectedRoutine === 'am' ? amGradient : pmGradient;

  const getRoutineRecs = async () => {
    setRecsLoading(true);
    setRecsOpen(true);
    try {
      const slots = selectedRoutine === 'am' ? amSlots : pmSlots;
      const slotProductIds = Object.values(slots).filter(Boolean) as string[];
      const slotProducts = slotProductIds
        .map(id => allProducts.find(p => p.id === id)?.name)
        .filter(Boolean) as string[];

      const res = await fetch('/api/routine-recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skinType: quizResults.skinType || 'normal',
          concerns: quizResults.concerns || [],
          experience: quizResults.experience,
          currentProducts: slotProducts,
          level: mounted ? useSkinBaseStore.getState().getLevel() : 1,
        }),
      });
      const data = await res.json();
      setRoutineRecs(data.recommendations || []);
    } catch {
      setRoutineRecs([]);
    } finally {
      setRecsLoading(false);
    }
  };

  const handleCloseMilestone = () => {
    if (activeMilestone !== null) {
      addShownMilestone(activeMilestone);
      setActiveMilestone(null);
    }
  };

  if (!quizResults.completed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5 pb-20" style={{ background: '#FDFAF7' }}>
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-6">✨</div>
          <h1 className="text-3xl font-bold mb-3" style={{ color: '#1C1917' }}>
            Your skin deserves a routine
          </h1>
          <p className="text-base mb-8" style={{ color: '#78716C' }}>
            Answer a few questions. Get a personalized routine built for you.
          </p>
          <Link href="/quiz">
            <button
              className="w-full py-4 text-white rounded-2xl font-semibold text-lg"
              style={{ background: 'linear-gradient(135deg, #1B2B4B, #111C30)', boxShadow: '0 8px 24px rgba(27,43,75,0.3)' }}
            >
              Take the Skin Quiz
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const allDone = todayStatus.amDone && todayStatus.pmDone;
  const level = mounted ? useSkinBaseStore.getState().getLevel() : 1;
  const activeSlots = (selectedRoutine === 'am' ? AM_SLOTS : PM_SLOTS).filter(s => s.lockedUntilLevel <= level);
  const stepCount = activeSlots.length;
  const estMinutes = stepCount * 1.5;
  const isSelectedDone = selectedRoutine === 'am' ? todayStatus.amDone : todayStatus.pmDone;

  // Check if user has at least 2 products in current routine slots
  const currentSlots = selectedRoutine === 'am' ? amSlots : pmSlots;
  const currentSlotCount = Object.values(currentSlots).filter(Boolean).length;

  return (
    <div className="min-h-screen max-w-lg mx-auto px-4 pt-4 pb-24" style={{ background: '#FDFAF7' }}>
      {/* Milestone Modal */}
      {activeMilestone !== null && (
        <MilestoneModal streak={activeMilestone} onClose={handleCloseMilestone} />
      )}

      {/* Greeting + date */}
      <div className="mb-4">
        <h1 className="text-xl font-bold" style={{ color: '#1C1917' }}>
          {greeting.text}{userName ? `, ${userName}` : ''} {greeting.emoji}
        </h1>
        <p className="text-sm" style={{ color: '#A8A29E' }}>
          {dateStr}
        </p>
      </div>

      {/* Streak Hero Card */}
      <div
        style={{
          background: streak > 0 ? 'linear-gradient(135deg, #1B2B4B, #111C30)' : '#F5F0EA',
          borderRadius: 20,
          padding: '20px 24px',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: streak > 0 ? 'rgba(255,255,255,0.7)' : '#A8A29E',
              margin: 0,
            }}
          >
            Current Streak
          </p>
          <p
            style={{
              fontSize: 48,
              fontWeight: 900,
              color: streak > 0 ? '#FFFFFF' : '#1C1917',
              margin: '4px 0 0',
              lineHeight: 1,
            }}
          >
            {streak}
          </p>
          <p
            style={{
              fontSize: 13,
              color: streak > 0 ? 'rgba(255,255,255,0.7)' : '#A8A29E',
              margin: '2px 0 0',
            }}
          >
            {streak === 1 ? 'day' : 'days'} {streak > 0 ? '🔥' : '— start today'}
          </p>
        </div>
        {/* AM/PM rings */}
        <div style={{ display: 'flex', gap: 12 }}>
          {[
            { label: 'AM', done: todayStatus.amDone, emoji: '☀️' },
            { label: 'PM', done: todayStatus.pmDone, emoji: '🌙' },
          ].map(({ label, done, emoji }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  border: `3px solid ${done ? '#E8856A' : streak > 0 ? 'rgba(255,255,255,0.3)' : '#E7DFD5'}`,
                  background: done ? '#E8856A' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  color: done ? '#FFFFFF' : 'inherit',
                }}
              >
                {done ? '✓' : emoji}
              </div>
              <p
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  margin: '4px 0 0',
                  color: streak > 0 ? 'rgba(255,255,255,0.6)' : '#A8A29E',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Sign-in nudge: show when streak > 3 and not authenticated */}
      {mounted && streak > 3 && !isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'linear-gradient(135deg, #FBE9E4, #FFF3F0)',
            borderRadius: 16,
            padding: '14px 16px',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid rgba(232,133,106,0.3)',
          }}
        >
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#1B2B4B', margin: 0 }}>
              🔒 Save your {streak}-day streak!
            </p>
            <p style={{ fontSize: 12, color: '#78716C', margin: '2px 0 0' }}>
              Sign in to back up your progress
            </p>
          </div>
          <button
            onClick={() => setAuthNudgeOpen(true)}
            style={{
              padding: '7px 14px',
              borderRadius: 10,
              border: 'none',
              background: '#E8856A',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: 12,
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            Sign In
          </button>
        </motion.div>
      )}
      <AuthModal
        isOpen={authNudgeOpen}
        onClose={() => setAuthNudgeOpen(false)}
        defaultTab="signup"
      />

      {/* All done state */}
      {allDone ? (
        <RoutineDoneScreen skinType={quizResults.skinType || 'normal'} streak={streak} />
      ) : (
        <>
          {/* Time of day toggle */}
          {suggestedRoutine === 'both' && !(todayStatus.amDone && todayStatus.pmDone) && (
            <div className="flex gap-2 mb-4">
              {!todayStatus.amDone && (
                <button
                  onClick={() => setSelectedRoutine('am')}
                  className="flex-1 py-2 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: selectedRoutine === 'am' ? '#FFF3D6' : '#F5F0EA',
                    color: selectedRoutine === 'am' ? '#92400E' : '#A8A29E',
                  }}
                >
                  ☀️ Morning
                </button>
              )}
              {!todayStatus.pmDone && (
                <button
                  onClick={() => setSelectedRoutine('pm')}
                  className="flex-1 py-2 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: selectedRoutine === 'pm' ? 'rgba(232,133,106,0.15)' : '#F5F0EA',
                    color: selectedRoutine === 'pm' ? '#E8856A' : '#A8A29E',
                  }}
                >
                  🌙 Evening
                </button>
              )}
            </div>
          )}

          {/* Hero routine card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-5 mb-5"
            style={{
              background: currentGradient,
              border: selectedRoutine === 'am' ? '1px solid #F5A98A' : 'none',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2
                  className="text-lg font-bold"
                  style={{ color: selectedRoutine === 'am' ? '#1C1917' : '#FFFFFF' }}
                >
                  {selectedRoutine === 'am' ? 'Morning Routine' : 'Evening Routine'}
                </h2>
                <p
                  className="text-sm"
                  style={{ color: selectedRoutine === 'am' ? '#78716C' : 'rgba(255,255,255,0.7)' }}
                >
                  {stepCount} steps · ~{Math.round(estMinutes)} min
                </p>
              </div>
              {selectedRoutine === 'am' ? (
                <span className="text-3xl">☀️</span>
              ) : (
                <span className="text-3xl">🌙</span>
              )}
            </div>

            {/* Product slots */}
            <RoutineSlots timeOfDay={selectedRoutine} />
          </motion.div>

          {/* Ingredient Checker — show when user has 2+ products */}
          {currentSlotCount >= 2 && (
            <div className="mb-3">
              <IngredientChecker timeOfDay={selectedRoutine} />
            </div>
          )}

          {/* What to Add Next button */}
          {currentSlotCount >= 2 && (
            <div className="mb-4 space-y-3">
              <button
                onClick={getRoutineRecs}
                className="w-full py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2"
                style={{ background: '#F5F0EA', color: '#1B2B4B', border: '1px solid #E7DFD5' }}
              >
                {recsLoading ? '✨ Analyzing your routine...' : '✨ What should I add next?'}
              </button>

              {recsOpen && routineRecs.length > 0 && (
                <div className="rounded-2xl p-4" style={{ background: '#FFFFFF', border: '1px solid #E7DFD5' }}>
                  <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#A8A29E' }}>
                    AI Recommendations for You
                  </p>
                  {routineRecs.map((rec, i) => (
                    <a
                      key={i}
                      href={`https://www.amazon.com/s?k=${encodeURIComponent(rec.searchQuery)}&tag=${AFFILIATE_TAG}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex gap-3 mb-3 no-underline"
                    >
                      <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-lg"
                        style={{ background: '#FBE9E4' }}>
                        ✨
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full"
                          style={{ background: '#F5F0EA', color: '#78716C' }}>{rec.step}</span>
                        <p className="text-sm font-bold mt-0.5" style={{ color: '#1C1917' }}>{rec.name}</p>
                        <p className="text-xs" style={{ color: '#78716C' }}>{rec.brand} · {rec.keyIngredient}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#A8A29E' }}>{rec.reason}</p>
                      </div>
                      <span style={{ color: '#E8856A', flexShrink: 0 }}>→</span>
                    </a>
                  ))}
                </div>
              )}

              {recsOpen && !recsLoading && routineRecs.length === 0 && (
                <div className="rounded-2xl p-4 text-center" style={{ background: '#F5F0EA' }}>
                  <p className="text-sm" style={{ color: '#78716C' }}>Could not load recommendations right now. Try again!</p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Sticky Start Routine button */}
      {quizResults.completed && !allDone && !isSelectedDone && (
        <div style={{ position: 'fixed', bottom: 80, left: 0, right: 0, padding: '0 20px', zIndex: 40, pointerEvents: 'none' }}>
          <div style={{ maxWidth: 430, margin: '0 auto', pointerEvents: 'all' }}>
            <Link href={`/routine/active?time=${selectedRoutine}`}>
              <button
                className="w-full py-4 text-white rounded-2xl font-bold text-base"
                style={{
                  background: selectedRoutine === 'am'
                    ? 'linear-gradient(135deg, #1B2B4B, #111C30)'
                    : 'linear-gradient(135deg, #E8856A, #D4624A)',
                  boxShadow: selectedRoutine === 'am'
                    ? '0 4px 20px rgba(27,43,75,0.4)'
                    : '0 4px 20px rgba(201,169,110,0.4)',
                }}
              >
                Start {selectedRoutine === 'am' ? 'Morning ☀️' : 'Evening 🌙'} Routine →
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
