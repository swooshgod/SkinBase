'use client';

import { Suspense, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSkinBaseStore } from '@/lib/store';
import { products as allProducts } from '@/lib/products';
import { Product } from '@/types';
import { AM_SLOTS, PM_SLOTS, SlotConfig } from '@/components/routine/RoutineSlots';
import { getStepType, getStepInstruction } from '@/lib/stepInstructions';
import confetti from 'canvas-confetti';

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

const categoryVerbs: Record<string, string> = {
  cleanser: 'CLEANSE',
  moisturizer: 'MOISTURIZE',
  sunscreen: 'PROTECT',
  serum: 'TREAT',
  treatment: 'TREAT',
  toner: 'TONE',
  mask: 'MASK',
  oil: 'NOURISH',
  exfoliant: 'EXFOLIATE',
  eye_cream: 'REVIVE',
};

const milestoneMessages: Record<number, { emoji: string; title: string; subtitle: string }> = {
  7: { emoji: '🌿', title: 'One week strong!', subtitle: 'You\'re building a real habit.' },
  14: { emoji: '✨', title: 'Two weeks!', subtitle: 'Your skin is already adjusting.' },
  30: { emoji: '🏆', title: 'One month!', subtitle: 'You\'re a skincare pro now.' },
  60: { emoji: '💎', title: 'Two months!', subtitle: 'Incredible dedication.' },
};

const SHAKE_THRESHOLD = 15; // m/s² — deliberate shake only
const SHAKE_COOLDOWN = 800; // ms between accepted shakes

// Slide animation variants
const slideVariants = {
  enter: { x: '100%', opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: '-100%', opacity: 0 },
};

function ActiveRoutineContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const timeOfDay = (searchParams.get('time') as 'am' | 'pm') || 'am';
  const isFirstTime = searchParams.get('first') === 'true';

  const { quizResults, amSlots, pmSlots, getLevel, logRoutine, calculateStreak, getDaysLoggedTotal } = useSkinBaseStore();

  const [phase, setPhase] = useState<'start' | 'active' | 'photo' | 'done'>(isFirstTime ? 'start' : 'start');
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward slide
  const [shakeSupported, setShakeSupported] = useState(false);
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);

  const lastShakeTime = useRef(0);
  const advanceRef = useRef<() => void>(() => {});

  const daysLogged = getDaysLoggedTotal();
  const level = getLevel();
  const sessionSeed = useMemo(() => Math.floor(Math.random() * 1000), []);

  // Build routine steps
  const routineSteps = useMemo(() => {
    const slots = timeOfDay === 'am' ? AM_SLOTS : PM_SLOTS;
    const currentSlots = timeOfDay === 'am' ? amSlots : pmSlots;

    return slots
      .filter((slot) => level >= slot.lockedUntilLevel)
      .map((slot) => {
        const productId = currentSlots[slot.slotType];
        let product: Product | null = null;
        if (productId) {
          product = allProducts.find((p) => p.id === productId) || null;
        }
        if (!product) {
          const filtered = allProducts.filter((p) => {
            if (p.category !== slot.category) return false;
            return p.for_skin_types.includes(quizResults.skinType || 'normal');
          });
          product = filtered[0] || null;
        }
        return { slot, product };
      })
      .filter((step) => step.product !== null) as { slot: SlotConfig; product: Product }[];
  }, [timeOfDay, amSlots, pmSlots, level, quizResults]);

  const totalSteps = routineSteps.length;
  const currentStepData = routineSteps[currentStep];
  const stepType = getStepType(currentStepData?.product?.category ?? '', currentStepData?.product?.name ?? '');
  const currentInstruction = getStepInstruction(stepType, level, sessionSeed);
  const streak = calculateStreak();
  const newDayCount = daysLogged + 1;
  const milestone = milestoneMessages[newDayCount];

  // Advance to next step (or complete)
  const handleAdvance = useCallback(() => {
    if (phase !== 'active') return;

    if (currentStep < totalSteps - 1) {
      setDirection(1);
      setCurrentStep((s) => s + 1);
    } else {
      // Complete routine
      logRoutine(timeOfDay);
      if (daysLogged === 13) {
        setPhase('photo');
      } else {
        setPhase('done');
      }
    }
  }, [phase, currentStep, totalSteps, logRoutine, timeOfDay, daysLogged]);

  // Keep advanceRef current for shake handler
  useEffect(() => {
    advanceRef.current = handleAdvance;
  }, [handleAdvance]);

  // Wake Lock — keep screen on during active routine
  useEffect(() => {
    if (phase !== 'active') return;

    let lock: WakeLockSentinel | null = null;

    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          lock = await navigator.wakeLock.request('screen');
          setWakeLock(lock);
        }
      } catch {
        // Wake lock not supported or denied — that's OK
      }
    };

    requestWakeLock();

    // Re-acquire on visibility change (browser releases it when tab is hidden)
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      if (lock) lock.release().catch(() => {});
      setWakeLock(null);
    };
  }, [phase]);

  // Shake detection via DeviceMotionEvent
  useEffect(() => {
    if (phase !== 'active') return;

    const handleMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc || acc.x == null || acc.y == null || acc.z == null) return;

      const magnitude = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);
      // Subtract gravity (~9.8) — a shake spike above threshold means deliberate shake
      const net = Math.abs(magnitude - 9.8);

      if (net > SHAKE_THRESHOLD) {
        const now = Date.now();
        if (now - lastShakeTime.current > SHAKE_COOLDOWN) {
          lastShakeTime.current = now;
          advanceRef.current();
        }
      }
    };

    // Request permission on iOS 13+
    const setup = async () => {
      try {
        const DME = window.DeviceMotionEvent as typeof DeviceMotionEvent & {
          requestPermission?: () => Promise<string>;
        };
        if (typeof DME.requestPermission === 'function') {
          const permission = await DME.requestPermission();
          if (permission === 'granted') {
            setShakeSupported(true);
            window.addEventListener('devicemotion', handleMotion);
          }
        } else {
          // Android or desktop — just add listener, check if events fire
          setShakeSupported(true);
          window.addEventListener('devicemotion', handleMotion);
        }
      } catch {
        setShakeSupported(false);
      }
    };

    setup();
    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [phase]);

  // Fire confetti on completion
  useEffect(() => {
    if (phase !== 'done') return;
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#E8856A', '#1B2B4B', '#F5C4B5', '#FFF0C2'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#E8856A', '#1B2B4B', '#F5C4B5', '#FFF0C2'],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, [phase]);

  // Redirect if quiz not completed
  if (!quizResults.completed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5" style={{ background: '#FDFAF7' }}>
        <div className="text-center">
          <p style={{ color: '#78716C' }}>Please complete the quiz first</p>
        </div>
      </div>
    );
  }

  // ─── START SCREEN ─────────────────────────────────────────
  if (phase === 'start') {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{ background: 'linear-gradient(160deg, #FFFBF2, #FBE9E4)' }}
      >
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-sm w-full">
          <div className="text-5xl mb-4">{timeOfDay === 'am' ? '☀️' : '🌙'}</div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#1C1917' }}>
            {isFirstTime ? 'Your routine is ready' : `${timeOfDay === 'am' ? 'Morning' : 'Evening'} Routine`}
          </h1>
          <p className="mb-6 text-sm leading-relaxed" style={{ color: '#78716C' }}>
            {isFirstTime
              ? 'We built your personalized routine. Each step takes 1–2 minutes.'
              : `${totalSteps} steps — shake your phone to go hands-free.`}
          </p>

          {/* Step preview */}
          <div className="rounded-2xl p-4 mb-6 text-left space-y-3" style={{ background: '#FFFFFF' }}>
            {routineSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #1B2B4B, #111C30)' }}
                >
                  {i + 1}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#A8A29E' }}>{step.slot.slotType}</p>
                  <p className="text-sm font-semibold truncate" style={{ color: '#1C1917' }}>{step.product.name}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setPhase('active')}
            className="w-full py-5 text-white rounded-2xl font-bold text-lg"
            style={{ background: 'linear-gradient(135deg, #1B2B4B, #111C30)', boxShadow: '0 4px 20px rgba(27,43,75,0.4)' }}
          >
            Start Routine
          </button>
        </motion.div>
      </div>
    );
  }

  // ─── PHOTO PROMPT (Day 14) ────────────────────────────────
  if (phase === 'photo') {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{ background: 'linear-gradient(135deg, #FFFBF2, #FBE9E4)' }}
      >
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-sm">
          <div className="text-6xl mb-6">📸</div>
          <h1 className="text-2xl font-bold mb-3" style={{ color: '#1C1917' }}>2 weeks of consistency!</h1>
          <p className="mb-8" style={{ color: '#78716C' }}>
            Take a progress photo to track your results. You&apos;ll be able to compare over time.
          </p>
          <button
            onClick={() => setPhase('done')}
            className="w-full py-4 text-white rounded-2xl font-semibold text-lg shadow-xl mb-4"
            style={{ background: 'linear-gradient(135deg, #1B2B4B, #111C30)', boxShadow: '0 8px 24px rgba(27,43,75,0.25)' }}
          >
            Take Progress Photo
          </button>
          <button onClick={() => setPhase('done')} className="text-sm" style={{ color: '#A8A29E' }}>
            Skip for now
          </button>
        </motion.div>
      </div>
    );
  }

  // ─── COMPLETION SCREEN ────────────────────────────────────
  if (phase === 'done') {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #FBE9E4, #F5C4B5)' }}
      >
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-sm z-10">
          {/* Big checkmark */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-28 h-28 mx-auto mb-6 rounded-full flex items-center justify-center shadow-xl"
            style={{ background: 'linear-gradient(135deg, #E8856A, #D4624A)', boxShadow: '0 8px 24px rgba(201,169,110,0.3)' }}
          >
            <span className="text-5xl text-white">✓</span>
          </motion.div>

          <h1 className="text-3xl font-bold mb-2" style={{ color: '#1C1917' }}>
            {timeOfDay === 'am' ? 'Morning' : 'Evening'} routine done!
          </h1>

          {/* Streak badge */}
          {streak > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-base font-bold mb-4"
              style={{ background: '#F0E6CC', color: '#92400E' }}
            >
              <span className="text-xl">🔥</span>
              <span>{streak} day streak</span>
            </motion.div>
          )}

          {/* Milestone */}
          {milestone && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-2xl p-5 mb-4"
              style={{ background: 'linear-gradient(135deg, #1B2B4B, #111C30)' }}
            >
              <p className="text-4xl mb-2">{milestone.emoji}</p>
              <p className="text-xl font-bold text-white">{milestone.title}</p>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{milestone.subtitle}</p>
            </motion.div>
          )}

          <p className="mb-8 text-base" style={{ color: '#78716C' }}>
            {timeOfDay === 'am' ? 'See you tonight for your PM routine' : 'Rest well — see you tomorrow morning'}
          </p>

          <button
            onClick={() => router.push('/')}
            className="w-full py-4 text-white rounded-2xl font-semibold text-lg shadow-xl"
            style={{ background: 'linear-gradient(135deg, #1B2B4B, #111C30)', boxShadow: '0 8px 24px rgba(27,43,75,0.25)' }}
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  // ─── ACTIVE STEP — FULL SCREEN HANDS-FREE ─────────────────
  const verb = categoryVerbs[currentStepData.product.category] || 'APPLY';
  const gradient = categoryGradients[currentStepData.product.category] || categoryGradients.cleanser;

  return (
    <div
      className="fixed inset-0 flex flex-col select-none"
      style={{ background: '#FDFAF7', touchAction: 'manipulation' }}
      onClick={handleAdvance}
    >
      {/* Progress bar — thin at the very top */}
      <div className="w-full px-4 pt-3 pb-1">
        <div className="h-1 rounded-full overflow-hidden" style={{ background: '#E7DFD5' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #E8856A, #D4624A)' }}
            animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Main step content — fills screen */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="flex-1 flex flex-col px-6 pt-4 pb-2"
          >
            {/* Action verb — large and bold at top */}
            <motion.p
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              className="font-black uppercase tracking-widest text-center mb-4"
              style={{ fontSize: 44, color: '#1B2B4B', letterSpacing: '0.12em' }}
            >
              {verb}
            </motion.p>

            {/* Product image — large, centered */}
            <div className="flex justify-center mb-4">
              <div
                className="rounded-3xl flex items-center justify-center overflow-hidden"
                style={{ width: 160, height: 160, background: gradient }}
              >
                {currentStepData.product.amazonImageUrl ? (
                  <img
                    src={currentStepData.product.amazonImageUrl}
                    alt={currentStepData.product.name}
                    style={{ width: 150, height: 150, objectFit: 'contain' }}
                    draggable={false}
                  />
                ) : (
                  <span style={{ fontSize: 72 }}>{currentStepData.slot.emoji}</span>
                )}
              </div>
            </div>

            {/* Product name — big, readable */}
            <div className="text-center mb-3">
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#A8A29E' }}>
                {currentStepData.product.brand}
              </p>
              <h1
                className="text-2xl font-bold leading-tight px-2"
                style={{ color: '#1C1917' }}
              >
                {currentStepData.product.name}
              </h1>
            </div>

            {/* How-to instruction — clear and readable */}
            <div className="rounded-2xl p-5 mb-3" style={{ background: '#F5F0EA' }}>
              <p className="text-base leading-relaxed text-center" style={{ color: '#44403C' }}>
                {currentInstruction.instruction}
              </p>
            </div>

            {/* Pro tip */}
            {currentInstruction.tip && (
              <div className="rounded-2xl p-4" style={{ background: '#FBE9E4', border: '1px solid #F5C4B5' }}>
                <p className="text-xs font-bold mb-1 text-center" style={{ color: '#E8856A', letterSpacing: '0.05em' }}>💡 PRO TIP</p>
                <p className="text-sm leading-relaxed text-center" style={{ color: '#1C1917' }}>{currentInstruction.tip}</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom bar — step progress + shake hint */}
      <div className="px-6 pb-8 pt-3" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Release wake lock before leaving
              if (wakeLock) wakeLock.release().catch(() => {});
              router.back();
            }}
            className="text-sm font-medium px-3 py-1.5 rounded-full"
            style={{ color: '#A8A29E', background: 'rgba(0,0,0,0.04)' }}
          >
            ✕ Exit
          </button>
          <span className="text-sm font-bold" style={{ color: '#1B2B4B' }}>
            Step {currentStep + 1} of {totalSteps}
          </span>
          <div className="w-14" />
        </div>

        {/* Shake hint or tap hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-center text-xs"
          style={{ color: '#A8A29E' }}
        >
          {shakeSupported ? '📳 Shake phone to advance' : 'Tap anywhere to advance'}
          {currentStep === totalSteps - 1 && ' → Complete'}
        </motion.p>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#FDFAF7' }}>
      <div className="text-center">
        <div
          className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4"
          style={{ borderColor: '#1B2B4B', borderTopColor: 'transparent' }}
        />
        <p className="text-sm" style={{ color: '#78716C' }}>Loading routine...</p>
      </div>
    </div>
  );
}

export default function ActiveRoutinePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ActiveRoutineContent />
    </Suspense>
  );
}
