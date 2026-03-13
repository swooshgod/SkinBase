'use client';

import { Suspense, useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSkinBaseStore } from '@/lib/store';
import { products as allProducts } from '@/lib/products';
import { Product } from '@/types';
import { AM_SLOTS, PM_SLOTS, SlotConfig } from '@/components/routine/RoutineSlots';
import { getStepType, getStepInstruction } from '@/lib/stepInstructions';

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

const verbColors: Record<string, string> = {
  cleanser: '#FBE9E4',
  moisturizer: '#F5C4B5',
  sunscreen: '#FFF0C2',
  serum: '#FFD6E7',
  treatment: '#E5DFFF',
  toner: '#FFD9BD',
  mask: '#CCFBF1',
  oil: '#FEF3C7',
  exfoliant: '#FFEDD5',
  eye_cream: '#E9D5FF',
  default: '#F5F0EA',
};


const milestoneMessages: Record<number, { emoji: string; title: string; subtitle: string }> = {
  7: { emoji: '🌿', title: 'One week strong!', subtitle: 'You\'re building a real habit.' },
  14: { emoji: '✨', title: 'Two weeks!', subtitle: 'Your skin is already adjusting.' },
  30: { emoji: '🏆', title: 'One month!', subtitle: 'You\'re a skincare pro now.' },
  60: { emoji: '💎', title: 'Two months!', subtitle: 'Incredible dedication.' },
};

function ActiveRoutineContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const timeOfDay = (searchParams.get('time') as 'am' | 'pm') || 'am';
  const isFirstTime = searchParams.get('first') === 'true';

  const { quizResults, amSlots, pmSlots, getLevel, logRoutine, calculateStreak, getDaysLoggedTotal } = useSkinBaseStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);
  const [timerStarted, setTimerStarted] = useState(false);
  const [showPhotoPrompt, setShowPhotoPrompt] = useState(false);
  const [showIntro, setShowIntro] = useState(isFirstTime);

  const daysLogged = getDaysLoggedTotal();
  const level = getLevel();
  const sessionSeed = useMemo(() => Math.floor(Math.random() * 1000), []);

  // Build the routine steps based on unlocked slots and products
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

        // If no custom product, get recommended
        if (!product) {
          const filtered = allProducts.filter((p) => {
            if (p.category !== slot.category) return false;
            const matchesSkinType = p.for_skin_types.includes(quizResults.skinType || 'normal');
            return matchesSkinType;
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

  // Reset timer state on step change
  useEffect(() => {
    setTimer(null);
    setTimerStarted(false);
  }, [currentStep]);

  // Count down only when started
  useEffect(() => {
    if (timerStarted && timer !== null && timer > 0) {
      const interval = setInterval(() => {
        setTimer((t) => (t !== null && t > 0 ? t - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timerStarted, timer]);

  const handleStartTimer = () => {
    setTimer(currentInstruction.timerSeconds ?? 30);
    setTimerStarted(true);
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      setTimer(null);
    } else {
      // Log the routine
      logRoutine(timeOfDay);

      // Check if it's day 14 for photo prompt
      if (daysLogged === 13) {
        setShowPhotoPrompt(true);
      } else {
        setCompleted(true);
      }
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const handlePhotoComplete = () => {
    setShowPhotoPrompt(false);
    setCompleted(true);
  };

  const streak = calculateStreak();
  const newDayCount = daysLogged + 1;
  const milestone = milestoneMessages[newDayCount];

  // First-time intro screen (after quiz)
  if (showIntro) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{ background: 'linear-gradient(160deg, #FFFBF2, #FBE9E4)' }}
      >
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-sm">
          <div className="text-5xl mb-4">🌟</div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#1C1917' }}>Your routine is ready</h1>
          <p className="mb-6 text-sm leading-relaxed" style={{ color: '#78716C' }}>
            We built your personalized morning routine based on your skin type.
            Each step takes about 1–2 minutes. You can always swap products later.
          </p>
          <div className="rounded-2xl p-4 mb-6 text-left space-y-3" style={{ background: '#FFFFFF' }}>
            {routineSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #1B2B4B, #111C30)', flexShrink: 0 }}
                >
                  {i + 1}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#A8A29E' }}>{step.slot.slotType}</p>
                  <p className="text-sm font-semibold" style={{ color: '#1C1917' }}>{step.product.name}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowIntro(false)}
            className="w-full py-4 text-white rounded-2xl font-bold text-base"
            style={{ background: 'linear-gradient(135deg, #1B2B4B, #111C30)', boxShadow: '0 4px 20px rgba(27,43,75,0.4)' }}
          >
            Let&apos;s Start →
          </button>
        </motion.div>
      </div>
    );
  }

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

  // Photo prompt screen (Day 14)
  if (showPhotoPrompt) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{ background: 'linear-gradient(135deg, #FFFBF2, #FBE9E4)' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm"
        >
          <div className="text-6xl mb-6">📸</div>
          <h1 className="text-2xl font-bold mb-3" style={{ color: '#1C1917' }}>
            2 weeks of consistency!
          </h1>
          <p className="mb-8" style={{ color: '#78716C' }}>
            Take a progress photo to track your results. You&apos;ll be able to compare over time.
          </p>
          <button
            onClick={() => {
              // In a real app, this would open the camera
              handlePhotoComplete();
            }}
            className="w-full py-4 text-white rounded-2xl font-semibold text-lg shadow-xl mb-4"
            style={{ background: 'linear-gradient(135deg, #1B2B4B, #111C30)', boxShadow: '0 8px 24px rgba(27,43,75,0.25)' }}
          >
            Take Progress Photo
          </button>
          <button
            onClick={handlePhotoComplete}
            className="text-sm"
            style={{ color: '#A8A29E' }}
          >
            Skip for now
          </button>
        </motion.div>
      </div>
    );
  }

  // Completion screen
  if (completed) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{ background: 'linear-gradient(135deg, #FBE9E4, #F5C4B5)' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center shadow-xl"
            style={{ background: 'linear-gradient(135deg, #E8856A, #D4624A)', boxShadow: '0 8px 24px rgba(201,169,110,0.3)' }}
          >
            <span className="text-4xl text-white">✓</span>
          </motion.div>

          <h1 className="text-2xl font-bold mb-2" style={{ color: '#1C1917' }}>
            {timeOfDay === 'am' ? 'Morning' : 'Evening'} routine complete!
          </h1>

          {milestone && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl p-4 mb-4"
              style={{ background: 'linear-gradient(135deg, #1B2B4B, #111C30)' }}
            >
              <p className="text-3xl mb-2">{milestone.emoji}</p>
              <p className="text-lg font-bold text-white">{milestone.title}</p>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{milestone.subtitle}</p>
            </motion.div>
          )}

          {streak > 0 && !milestone && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{ background: '#F0E6CC', color: '#92400E' }}
            >
              <span>🔥</span>
              <span>{streak} day streak — keep it up!</span>
            </motion.div>
          )}

          <p className="mb-8" style={{ color: '#78716C' }}>
            {timeOfDay === 'am'
              ? 'See you tonight for your PM routine'
              : 'Great job! Rest well and see you tomorrow morning'}
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

  // Active step screen
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FDFAF7' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => router.back()}
          className="text-sm"
          style={{ color: '#A8A29E' }}
        >
          ← Exit
        </button>
        <span className="text-sm font-medium" style={{ color: '#78716C' }}>
          Step {currentStep + 1} of {totalSteps}
        </span>
        <div className="w-12" />
      </div>

      {/* Progress bar */}
      <div className="px-4 mb-3">
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#E7DFD5' }}>
          <motion.div
            className="h-full"
            style={{ background: 'linear-gradient(90deg, #1B2B4B, #111C30)' }}
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-sm"
          >
            {/* Product row — image left, info right */}
            <div className="flex items-center gap-4 mb-4 p-3 rounded-2xl" style={{ background: '#F5F0EA' }}>
              {/* Product image or gradient fallback */}
              <div
                className="rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden"
                style={{
                  width: 80,
                  height: 80,
                  background: categoryGradients[currentStepData.product.category],
                }}
              >
                {currentStepData.product.amazonImageUrl ? (
                  <img
                    src={currentStepData.product.amazonImageUrl}
                    alt={currentStepData.product.name}
                    style={{ width: 80, height: 80, objectFit: 'contain' }}
                  />
                ) : (
                  <span className="text-4xl">{currentStepData.slot.emoji}</span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                {currentStep === 0 && (
                  <p className="text-xs font-semibold mb-0.5" style={{ color: '#1B2B4B' }}>
                    Start with your {currentStepData.slot.slotType} 👇
                  </p>
                )}
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#A8A29E' }}>{currentStepData.product.brand}</p>
                <h2
                  className="text-base font-bold leading-tight mt-0.5"
                  style={{ color: '#1C1917', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                >
                  {currentStepData.product.name}
                </h2>
              </div>
            </div>

            {/* Instructions */}
            <div className="rounded-2xl p-4 mb-4" style={{ background: '#F5F0EA' }}>
              <p className="text-sm leading-relaxed" style={{ color: '#78716C' }}>
                {currentInstruction.instruction}
              </p>
            </div>

            {/* Pro Tip */}
            {currentInstruction.tip && (
              <div className="rounded-2xl p-3 mb-4" style={{ background: '#FBE9E4', border: '1px solid #F5C4B5' }}>
                <p className="text-xs font-bold mb-1" style={{ color: '#E8856A', letterSpacing: '0.05em' }}>💡 PRO TIP</p>
                <p className="text-xs leading-relaxed" style={{ color: '#1C1917', lineHeight: 1.5 }}>{currentInstruction.tip}</p>
              </div>
            )}

            {/* Timer for cleanser */}
            {currentStepData.slot.category === 'cleanser' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl p-3 mb-4 text-center"
                style={{ background: timerStarted ? '#FBE9E4' : '#F5F0EA' }}
              >
                {!timerStarted ? (
                  <button
                    onClick={handleStartTimer}
                    className="w-full py-3 rounded-xl font-semibold text-white text-sm"
                    style={{ background: 'linear-gradient(135deg, #1B2B4B, #111C30)' }}
                  >
                    ▶ Start {currentInstruction.timerLabel ?? 'Timer'} ({currentInstruction.timerSeconds ?? 30}s)
                  </button>
                ) : timer !== null && timer > 0 ? (
                  <>
                    <p className="text-sm font-medium mb-1" style={{ color: '#1B2B4B' }}>{currentInstruction.timerLabel ?? 'Timer'}</p>
                    <p className="text-4xl font-bold" style={{ color: '#1B2B4B' }}>{timer}s</p>
                  </>
                ) : (
                  <p className="text-sm font-semibold" style={{ color: '#1B2B4B' }}>✓ Done massaging — rinse now!</p>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Big action verb — fills the space, reinforces the step */}
      <div className="flex-1 flex items-center justify-center">
        <p
          className="font-black uppercase tracking-widest select-none"
          style={{
            fontSize: 52,
            color: verbColors[currentStepData.product.category] || verbColors.default,
            letterSpacing: '0.15em',
          }}
        >
          {({
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
          } as Record<string, string>)[currentStepData.product.category] || 'APPLY'}
        </p>
      </div>

      {/* Bottom actions */}
      <div className="p-6 pb-10">
        <button
          onClick={handleNext}
          className="w-full py-4 text-white rounded-2xl font-semibold text-lg shadow-xl mb-3"
          style={{ background: 'linear-gradient(135deg, #1B2B4B, #111C30)', boxShadow: '0 8px 24px rgba(27,43,75,0.25)' }}
        >
          {currentStep < totalSteps - 1 ? 'Done — Next Step' : 'Complete Routine ✓'}
        </button>
        <button
          onClick={handleSkip}
          className="w-full text-sm py-2"
          style={{ color: '#A8A29E' }}
        >
          Skip this step
        </button>
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
