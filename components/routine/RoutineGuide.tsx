'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSkinBaseStore } from '@/lib/store';
import { Product } from '@/types';
import { buildRoutine } from '@/lib/products';
import { isBeginnerLocked, BEGINNER_ALLOWED_CATEGORIES } from '@/lib/experienceLevel';
import { BeginnerBanner, ActivesLockOverlay } from './BeginnerBanner';
import LevelUpModal from '../ui/LevelUpModal';

const categoryEmoji: Record<string, string> = {
  cleanser: '🧴',
  toner: '💧',
  serum: '✨',
  moisturizer: '🧊',
  sunscreen: '☀️',
  treatment: '💊',
  mask: '🎭',
  oil: '🫧',
  exfoliant: '🌀',
  eye_cream: '👁️',
};

const categoryDuration: Record<string, string> = {
  cleanser: '60 sec',
  toner: '15 sec',
  serum: '30 sec',
  moisturizer: '30 sec',
  sunscreen: '30 sec',
  treatment: '30 sec',
  mask: '10-15 min',
  oil: '30 sec',
  exfoliant: '60 sec',
  eye_cream: '15 sec',
};

function StepTimer({ seconds, onComplete }: { seconds: number; onComplete: () => void }) {
  const [remaining, setRemaining] = useState(seconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning || remaining <= 0) return;
    const timer = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning, remaining, onComplete]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const progress = ((seconds - remaining) / seconds) * 100;

  return (
    <div className="bg-amber-50 rounded-xl p-4 text-center">
      <p className="text-xs text-amber-600 font-medium mb-2 uppercase tracking-wider">Wait before next step</p>
      <div className="relative w-20 h-20 mx-auto mb-3">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="35" fill="none" stroke="#fef3c7" strokeWidth="6" />
          <circle
            cx="40" cy="40" r="35" fill="none" stroke="#f59e0b" strokeWidth="6"
            strokeDasharray={`${2 * Math.PI * 35}`}
            strokeDashoffset={`${2 * Math.PI * 35 * (1 - progress / 100)}`}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-amber-700">
            {mins}:{secs.toString().padStart(2, '0')}
          </span>
        </div>
      </div>
      {!isRunning ? (
        <button
          onClick={() => setIsRunning(true)}
          className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors"
        >
          {remaining === seconds ? 'Start Timer' : 'Resume'}
        </button>
      ) : (
        <button
          onClick={() => setIsRunning(false)}
          className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-200 transition-colors"
        >
          Pause
        </button>
      )}
    </div>
  );
}

function RoutineStepCard({
  product,
  stepNumber,
  isActive,
  isCompleted,
  onComplete,
  totalSteps,
}: {
  product: Product;
  stepNumber: number;
  isActive: boolean;
  isCompleted: boolean;
  onComplete: () => void;
  totalSteps: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [timerDone, setTimerDone] = useState(false);

  const handleTimerComplete = useCallback(() => {
    setTimerDone(true);
  }, []);

  // Collapsed non-active step
  if (!isActive && !isCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 0.5 }}
        className="bg-white/50 rounded-2xl p-4 border border-slate-100"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-sm">
            {stepNumber}
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-400 uppercase">{product.category}</p>
            <p className="font-medium text-slate-500 text-sm">{product.brand} {product.name}</p>
          </div>
          <span className="text-xl opacity-50">{categoryEmoji[product.category] || '✨'}</span>
        </div>
      </motion.div>
    );
  }

  // Completed step
  if (isCompleted) {
    return (
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-green-50 rounded-2xl p-4 border border-green-200"
      >
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold"
          >
            ✓
          </motion.div>
          <div className="flex-1">
            <p className="text-xs text-green-600 uppercase font-medium">{product.category}</p>
            <p className="font-medium text-green-800 text-sm">{product.brand} {product.name}</p>
          </div>
          <span className="text-xl">{categoryEmoji[product.category] || '✨'}</span>
        </div>
      </motion.div>
    );
  }

  // Active step
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
    style={{ border: '1px solid #E7DFD5' }}
    >
      {/* Step Header */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg" style={{ background: 'linear-gradient(135deg, #1B2B4B, #111C30)', boxShadow: '0 10px 25px rgba(27,43,75,0.25)' }}>
              {stepNumber}
            </div>
            <div>
              <p className="text-xs uppercase font-medium tracking-wider" style={{ color: '#1B2B4B' }}>
                Step {stepNumber} of {totalSteps}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-slate-400 capitalize">{product.category}</span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-400">{categoryDuration[product.category] || '30 sec'}</span>
              </div>
            </div>
          </div>
          <span className="text-3xl">{categoryEmoji[product.category] || '✨'}</span>
        </div>

        {/* Product Info */}
        <div className="rounded-xl p-4 mb-4" style={{ background: 'linear-gradient(135deg, #FBE9E4, #F5F0EA)' }}>
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#253860' }}>{product.brand}</p>
          <h3 className="text-lg font-bold text-slate-800">{product.name}</h3>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {product.key_actives.slice(0, 3).map((active) => (
              <span key={active} className="text-[11px] bg-white/70 text-slate-600 px-2 py-0.5 rounded-full">
                {active.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>

        {/* Expandable Tips */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between py-2 text-sm transition-colors"
          style={{ color: '#78716C' }}
        >
          <span className="font-medium">How to apply</span>
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            className="text-lg"
          >
            ↓
          </motion.span>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <p className="text-sm text-slate-600 leading-relaxed pb-3">
                {product.application_instructions}
              </p>
              <div className="bg-blue-50 rounded-xl p-3 mb-3">
                <h4 className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Why this step</h4>
                <p className="text-sm text-blue-700">{product.why_this_step}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timer (if product has wait time) */}
        {product.wait_time_seconds && showTimer && !timerDone && (
          <div className="mb-4">
            <StepTimer seconds={product.wait_time_seconds} onComplete={handleTimerComplete} />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-2">
          {product.wait_time_seconds && !showTimer && !timerDone && (
            <button
              onClick={() => setShowTimer(true)}
              className="flex-1 py-3 rounded-xl text-sm font-medium bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
            >
              Start Wait Timer
            </button>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={onComplete}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all"
            style={{ background: 'linear-gradient(135deg, #1B2B4B, #111C30)', boxShadow: '0 10px 25px rgba(27,43,75,0.25)' }}
          >
            {stepNumber === totalSteps ? 'Complete Routine!' : 'Done — Next Step'}
          </motion.button>
        </div>

        {/* Find Product Link */}
        <Link
          href={`/products?category=${product.category}`}
          className="block text-center text-xs mt-3 transition-colors"
          style={{ color: '#A8A29E' }}
        >
          What product should I use? →
        </Link>
      </div>
    </motion.div>
  );
}

function CompletionScreen({ onReset, streak }: { onReset: () => void; streak: number }) {
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    setDateStr(new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }));
    // Confetti effect
    if (typeof window !== 'undefined') {
      import('canvas-confetti').then((confetti) => {
        confetti.default({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#1B2B4B', '#253860', '#E8856A', '#E7DFD5'],
        });
      }).catch(() => {});
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="text-7xl mb-6"
      >
        🎉
      </motion.div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">All done!</h2>
      <p className="text-slate-500 mb-2">Great job taking care of your skin today</p>
      <p className="text-sm text-slate-400 mb-6">
        {dateStr ? `Logged for ${dateStr}` : 'Logged for today'}
      </p>

      {/* Streak update */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 max-w-sm mx-auto mb-6 border border-amber-100"
      >
        <div className="text-3xl mb-2">🔥</div>
        <p className="text-lg font-bold text-amber-700">
          {streak > 0 ? `${streak} day streak!` : 'Streak started!'}
        </p>
        <p className="text-sm text-amber-600 mt-1">
          {streak >= 7 ? 'You\'re on fire! Keep it up!' : 'Consistency is key to great skin'}
        </p>
      </motion.div>

      <div className="rounded-2xl p-5 max-w-sm mx-auto mb-8" style={{ background: 'linear-gradient(135deg, #FBE9E4, #F5F0EA)' }}>
        <p className="text-sm font-medium" style={{ color: '#1B2B4B' }}>Pro tip</p>
        <p className="text-slate-600 text-sm mt-1">
          Consistency is more important than perfection. Even a simple routine done daily beats a complex one done rarely.
        </p>
      </div>

      <div className="flex gap-3 justify-center">
        <Link href="/progress">
          <button className="px-6 py-3 text-white rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transition-all" style={{ background: 'linear-gradient(135deg, #1B2B4B, #111C30)', boxShadow: '0 10px 25px rgba(27,43,75,0.25)' }}>
            View Progress
          </button>
        </Link>
        <button
          onClick={onReset}
          className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
        >
          Back to Home
        </button>
      </div>
    </motion.div>
  );
}

export default function RoutineGuide() {
  const {
    quizResults,
    routineTimeOfDay,
    setTimeOfDay,
    currentRoutine,
    setRoutine,
    activeRoutineStep,
    isRoutineActive,
    startRoutine,
    completeStep,
    nextStep,
    resetRoutine,
    getStreak,
    getUniqueDaysLogged,
    checkAndUnlockActives,
    hasSeenLevelUp,
    dismissLevelUp,
  } = useSkinBaseStore();

  const [routineComplete, setRoutineComplete] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [mounted, setMounted] = useState(false);

  const daysLogged = getUniqueDaysLogged();
  const beginnerLocked = isBeginnerLocked(quizResults.experience, daysLogged);
  const streak = mounted ? getStreak() : 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Detect time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
      setTimeOfDay('am');
    } else if (hour >= 18 && hour < 24) {
      setTimeOfDay('pm');
    }
  }, [setTimeOfDay]);

  // Check for level-up on mount
  useEffect(() => {
    const justUnlocked = checkAndUnlockActives();
    if (justUnlocked || (!hasSeenLevelUp && daysLogged >= 14 && quizResults.experience === 'beginner')) {
      setShowLevelUp(true);
    }
  }, [daysLogged]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStart = () => {
    let routine = buildRoutine(
      quizResults.skinType || 'normal',
      quizResults.concerns,
      quizResults.budget || 'drugstore',
      quizResults.safetyTags,
      routineTimeOfDay
    );

    // Filter to beginner-only categories if locked
    if (beginnerLocked) {
      routine = routine.filter((p) => BEGINNER_ALLOWED_CATEGORIES.includes(p.category));
    }

    setRoutine(
      routine.map((product, i) => ({
        product,
        stepNumber: i + 1,
        isCompleted: false,
      }))
    );
    startRoutine();
    setRoutineComplete(false);
  };

  const handleStepComplete = (index: number) => {
    completeStep(index);
    if (index === currentRoutine.length - 1) {
      setRoutineComplete(true);
    } else {
      nextStep();
    }
  };

  // Calculate estimated time
  const estimatedTime = beginnerLocked ? '~3 minutes' : '~5 minutes';

  if (routineComplete) {
    return (
      <>
        <CompletionScreen
          onReset={() => { resetRoutine(); setRoutineComplete(false); }}
          streak={streak + 1}
        />
        <LevelUpModal isOpen={showLevelUp} onClose={() => { setShowLevelUp(false); dismissLevelUp(); }} />
      </>
    );
  }

  if (!isRoutineActive) {
    return (
      <div className="py-4">
        <BeginnerBanner />
        {beginnerLocked && (
          <div className="mb-6">
            <ActivesLockOverlay />
          </div>
        )}

        {/* Big Time Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex justify-center gap-3 mb-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setTimeOfDay('am')}
              className={`flex-1 max-w-[160px] py-4 px-6 rounded-2xl text-lg font-semibold transition-all ${
                routineTimeOfDay === 'am'
                  ? 'bg-gradient-to-br from-amber-400 to-orange-400 text-white shadow-lg shadow-amber-200'
                  : 'bg-white text-slate-500 border-2 border-slate-100'
              }`}
            >
              <span className="text-2xl block mb-1">☀️</span>
              Morning
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setTimeOfDay('pm')}
              className={`flex-1 max-w-[160px] py-4 px-6 rounded-2xl text-lg font-semibold transition-all ${
                routineTimeOfDay === 'pm'
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-200'
                  : 'bg-white text-slate-500 border-2 border-slate-100'
              }`}
            >
              <span className="text-2xl block mb-1">🌙</span>
              Evening
            </motion.button>
          </div>

          {/* Routine Preview */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm mb-6 text-left">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-700">Your {routineTimeOfDay === 'am' ? 'Morning' : 'Evening'} Routine</h3>
              <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-full">{estimatedTime}</span>
            </div>
            <div className="space-y-2">
              {(beginnerLocked ? ['cleanser', 'moisturizer', routineTimeOfDay === 'am' ? 'sunscreen' : 'treatment'] : ['cleanser', 'toner', 'serum', 'moisturizer', routineTimeOfDay === 'am' ? 'sunscreen' : 'treatment']).map((category, i) => (
                <div key={category} className="flex items-center gap-3 p-2">
                  <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-500 font-medium">
                    {i + 1}
                  </span>
                  <span className="text-lg">{categoryEmoji[category] || '✨'}</span>
                  <span className="text-sm text-slate-600 capitalize">{category.replace('_', ' ')}</span>
                  <span className="text-xs text-slate-400 ml-auto">{categoryDuration[category]}</span>
                </div>
              ))}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            className="w-full py-4 text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
            style={{ background: 'linear-gradient(135deg, #1B2B4B, #111C30)', boxShadow: '0 10px 25px rgba(27,43,75,0.25)' }}
          >
            Start Your Routine
          </motion.button>

          <p className="text-xs text-slate-400 mt-4 text-center">
            {beginnerLocked
              ? 'Starting with a simple 3-step routine'
              : `Personalized for your ${quizResults.skinType} skin`}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <LevelUpModal isOpen={showLevelUp} onClose={() => { setShowLevelUp(false); dismissLevelUp(); }} />

      {/* Progress Header */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 mb-4 sticky top-16 z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-600">
            {routineTimeOfDay === 'am' ? '☀️ Morning' : '🌙 Evening'} Routine
          </span>
          <span className="text-sm text-slate-400">
            {currentRoutine.filter((s) => s.isCompleted).length}/{currentRoutine.length} steps
          </span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(135deg, #1B2B4B, #111C30)' }}
            animate={{
              width: `${(currentRoutine.filter((s) => s.isCompleted).length / currentRoutine.length) * 100}%`,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Steps */}
      <AnimatePresence mode="wait">
        {currentRoutine.map((step, i) => (
          <RoutineStepCard
            key={step.product.id}
            product={step.product}
            stepNumber={i + 1}
            isActive={i === activeRoutineStep}
            isCompleted={step.isCompleted}
            onComplete={() => handleStepComplete(i)}
            totalSteps={currentRoutine.length}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
