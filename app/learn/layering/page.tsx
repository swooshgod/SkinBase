'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface LayeringStep {
  name: string;
  icon: string;
  waitTime: string | null;
  tip: string;
  why: string;
}

const AM_STEPS: LayeringStep[] = [
  {
    name: 'Cleanser',
    icon: '🧴',
    waitTime: null,
    tip: 'Use a gentle, hydrating cleanser in the morning — no need to strip your skin.',
    why: 'Removes overnight oils and dead skin cells so products absorb better.',
  },
  {
    name: 'Toner',
    icon: '💧',
    waitTime: 'Wait 30 seconds',
    tip: 'Pat onto damp skin with your hands — skip cotton pads to avoid waste.',
    why: 'Balances pH after cleansing and preps skin to absorb serums more effectively.',
  },
  {
    name: 'Serum',
    icon: '✨',
    waitTime: 'Wait 60 seconds',
    tip: 'Use 3-4 drops. Vitamin C serums work great in AM for antioxidant protection.',
    why: 'Concentrated actives penetrate deeply. Thinnest consistency goes first.',
  },
  {
    name: 'Eye Cream',
    icon: '👁️',
    waitTime: 'Wait 30 seconds',
    tip: 'Use your ring finger — it applies the lightest pressure on delicate skin.',
    why: 'The eye area is thinner and more delicate, needing targeted hydration.',
  },
  {
    name: 'Moisturizer',
    icon: '🧊',
    waitTime: 'Wait 60 seconds',
    tip: 'Even oily skin needs moisturizer — look for gel or water-based formulas.',
    why: 'Seals in all previous layers and strengthens your moisture barrier.',
  },
  {
    name: 'SPF',
    icon: '☀️',
    waitTime: 'Wait 2-3 minutes before makeup',
    tip: 'Use two finger-lengths of SPF. Reapply every 2 hours if outdoors.',
    why: 'UV protection is the #1 anti-aging and skin cancer prevention step. Non-negotiable.',
  },
];

const PM_STEPS: LayeringStep[] = [
  {
    name: 'Cleanser',
    icon: '🧴',
    waitTime: null,
    tip: 'Double cleanse if you wore sunscreen or makeup — oil cleanser first, then water-based.',
    why: 'Removes the full day of SPF, makeup, pollution, and excess oil.',
  },
  {
    name: 'Toner',
    icon: '💧',
    waitTime: 'Wait 30 seconds',
    tip: 'Hydrating toners with hyaluronic acid are great for PM prep.',
    why: 'Rebalances skin pH and delivers a first layer of hydration.',
  },
  {
    name: 'Treatment / Actives',
    icon: '💊',
    waitTime: 'Wait 1-2 minutes',
    tip: 'This is where retinol, AHAs, or BHAs go. Start slow — 2-3 nights a week.',
    why: 'Active ingredients work best at night when skin repairs itself. Apply before serums for max penetration.',
  },
  {
    name: 'Serum',
    icon: '✨',
    waitTime: 'Wait 60 seconds',
    tip: 'Hydrating serums (hyaluronic acid, niacinamide) layer well after treatments.',
    why: 'Delivers targeted hydration and repair ingredients deeper into the skin.',
  },
  {
    name: 'Eye Cream',
    icon: '👁️',
    waitTime: 'Wait 30 seconds',
    tip: 'PM eye creams can be richer — look for peptides or retinol eye formulas.',
    why: 'Nighttime is when the delicate eye area benefits most from repair ingredients.',
  },
  {
    name: 'Moisturizer',
    icon: '🧊',
    waitTime: 'Wait 60 seconds',
    tip: 'PM moisturizers can be thicker and richer than AM ones — your skin is repairing overnight.',
    why: 'Locks in all actives and serums, preventing transepidermal water loss while you sleep.',
  },
  {
    name: 'Face Oil',
    icon: '🫧',
    waitTime: null,
    tip: 'Oils go LAST — they create an occlusive barrier. Skip if your moisturizer is rich enough.',
    why: 'Oil molecules are too large to penetrate — they seal everything underneath in.',
  },
];

function StepCard({
  step,
  index,
  isHighlighted,
  onToggleWhy,
  showWhy,
}: {
  step: LayeringStep;
  index: number;
  isHighlighted: boolean;
  onToggleWhy: () => void;
  showWhy: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className={`rounded-2xl p-4 border transition-all duration-300 ${
        isHighlighted
          ? 'shadow-lg'
          : 'bg-white border-slate-100 shadow-sm'
      }`}
      style={isHighlighted ? { background: '#FBE9E4', borderColor: '#E7DFD5', boxShadow: '0 10px 25px rgba(27,43,75,0.15)' } : {}}
    >
      <div className="flex items-start gap-3">
        {/* Step number + icon */}
        <div className="flex flex-col items-center gap-1">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
              isHighlighted
                ? 'text-white shadow-md'
                : 'bg-slate-100 text-slate-600'
            }`}
            style={isHighlighted ? { background: '#1B2B4B' } : {}}
          >
            {step.icon}
          </div>
          <span className="text-[10px] font-bold text-slate-400">{index + 1}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold" style={{ color: isHighlighted ? '#1B2B4B' : '#1C1917' }}>
              {step.name}
            </h3>
            {step.waitTime && (
              <span className="text-[11px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-medium">
                {step.waitTime}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">{step.tip}</p>

          <button
            onClick={onToggleWhy}
            className="text-xs mt-2 font-medium"
            style={{ color: '#1B2B4B' }}
          >
            {showWhy ? 'Hide explanation ▲' : 'Why this order? ▼'}
          </button>

          <AnimatePresence>
            {showWhy && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-blue-50 rounded-xl p-3 mt-2">
                  <p className="text-xs text-blue-700">{step.why}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Connector line */}
      {step.waitTime && (
        <div className="ml-5 mt-2 flex items-center gap-2">
          <div className="w-px h-4 bg-slate-200" />
          <span className="text-[10px] text-amber-500 font-medium">⏱ {step.waitTime}</span>
        </div>
      )}
    </motion.div>
  );
}

export default function LayeringGuidePage() {
  const [activeTab, setActiveTab] = useState<'am' | 'pm'>('am');
  const [highlightedStep, setHighlightedStep] = useState<number | null>(null);
  const [expandedWhy, setExpandedWhy] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const steps = activeTab === 'am' ? AM_STEPS : PM_STEPS;

  const handleAnimate = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    let i = 0;
    const interval = setInterval(() => {
      setHighlightedStep(i);
      i++;
      if (i >= steps.length) {
        clearInterval(interval);
        setTimeout(() => {
          setHighlightedStep(null);
          setIsAnimating(false);
        }, 1500);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen px-4 py-8 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
        {/* Header */}
        <div>
          <Link href="/learn" className="text-sm transition-colors" style={{ color: '#A8A29E' }}>
            ← Back to Learn
          </Link>
          <h1 className="text-2xl font-bold text-slate-800 mt-2">
            Layering <span style={{ color: '#1B2B4B' }}>Guide</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            The correct order to apply your products
          </p>
        </div>

        {/* Time Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => { setActiveTab('am'); setHighlightedStep(null); setExpandedWhy(null); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'am'
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-200'
                : 'bg-white text-slate-500 border border-slate-200'
            }`}
          >
            ☀️ AM Routine
          </button>
          <button
            onClick={() => { setActiveTab('pm'); setHighlightedStep(null); setExpandedWhy(null); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'pm'
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-200'
                : 'bg-white text-slate-500 border border-slate-200'
            }`}
          >
            🌙 PM Routine
          </button>
        </div>

        {/* Animate button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAnimate}
          disabled={isAnimating}
          className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all ${
            isAnimating
              ? 'bg-slate-100 text-slate-400'
              : 'text-white shadow-md'
          }`}
          style={!isAnimating ? { background: 'linear-gradient(135deg, #1B2B4B, #111C30)', boxShadow: '0 10px 25px rgba(27,43,75,0.25)' } : {}}
        >
          {isAnimating ? 'Playing sequence...' : '▶ Play Step-by-Step'}
        </motion.button>

        {/* Steps */}
        <div className="space-y-3">
          {steps.map((step, i) => (
            <StepCard
              key={`${activeTab}-${i}`}
              step={step}
              index={i}
              isHighlighted={highlightedStep === i}
              showWhy={expandedWhy === i}
              onToggleWhy={() => setExpandedWhy(expandedWhy === i ? null : i)}
            />
          ))}
        </div>

        {/* General rule */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
          <h3 className="text-sm font-semibold text-blue-700 mb-2">The Golden Rule</h3>
          <p className="text-sm text-blue-600">
            Apply products from <strong>thinnest to thickest</strong> consistency. Water-based before oil-based. Actives before moisturizers. SPF always last (AM only).
          </p>
        </div>
      </motion.div>
    </div>
  );
}
