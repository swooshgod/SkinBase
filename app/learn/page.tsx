'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSkinBaseStore } from '@/lib/store';
import {
  getEffectiveLevelInfo,
  getDaysUntilNextLevel,
  getProgressToNextLevel,
  LEVELS,
} from '@/lib/experienceLevel';

const TIPS = [
  { text: 'Always apply SPF as the last step of your morning routine — even on cloudy days.', icon: '☀️' },
  { text: 'Wait 1-2 minutes between serum and moisturizer for better absorption.', icon: '⏱️' },
  { text: 'Introduce only one new active at a time. Wait 2 weeks before adding another.', icon: '🧪' },
  { text: 'Pat, don\'t rub! Patting products in helps them absorb without tugging skin.', icon: '👋' },
  { text: 'Your neck and chest need skincare too — extend your routine below the jawline.', icon: '✨' },
  { text: 'Drinking water helps, but a good moisturizer does more for skin hydration.', icon: '💧' },
];

export default function LearnPage() {
  const { getUniqueDaysLogged, quizResults } = useSkinBaseStore();
  const [tipIndex, setTipIndex] = useState(0);

  const daysLogged = getUniqueDaysLogged();
  const currentLevel = getEffectiveLevelInfo(daysLogged, quizResults.experience);
  const daysUntilNext = getDaysUntilNextLevel(daysLogged);
  const progress = getProgressToNextLevel(daysLogged);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen px-4 py-8 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        {/* Header */}
        <div>
          <Link href="/" className="text-sm transition-colors" style={{ color: '#A8A29E' }}>
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-slate-800 mt-2">
            Learn & <span style={{ color: '#1B2B4B' }}>Level Up</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">Education, guides, and your progress</p>
        </div>

        {/* Your Level */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl p-5"
          style={{ background: 'linear-gradient(135deg, #FBE9E4, #F5F0EA)', border: '1px solid #E7DFD5' }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#1B2B4B' }}>
              Your Level
            </h2>
            <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: currentLevel.bgColor, color: currentLevel.color }}>
              {currentLevel.label}
            </span>
          </div>

          <p className="text-sm text-slate-600 mb-4">{currentLevel.description}</p>

          {/* Level Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{daysLogged} days logged</span>
              {daysUntilNext !== null ? (
                <span>{daysUntilNext} days until next level</span>
              ) : (
                <span>Max level reached!</span>
              )}
            </div>
            <div className="h-3 bg-white rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(135deg, #1B2B4B, #111C30)' }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>

            {/* Level markers */}
            <div className="flex justify-between text-[10px] text-slate-400">
              {LEVELS.map((l) => (
                <span
                  key={l.level}
                  className={daysLogged >= l.minDays ? 'font-semibold' : ''}
                  style={daysLogged >= l.minDays ? { color: '#1B2B4B' } : {}}
                >
                  {l.label}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/learn/layering">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -2 }}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer h-full"
            >
              <div className="text-3xl mb-3">📋</div>
              <h3 className="font-semibold text-slate-800">Layering Guide</h3>
              <p className="text-xs text-slate-400 mt-1">
                AM & PM application order with wait times
              </p>
            </motion.div>
          </Link>
          <Link href="/learn/ingredients">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -2 }}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer h-full"
            >
              <div className="text-3xl mb-3">🧬</div>
              <h3 className="font-semibold text-slate-800">Ingredient Cards</h3>
              <p className="text-xs text-slate-400 mt-1">
                Learn what each active does & how to use it
              </p>
            </motion.div>
          </Link>
        </div>

        {/* Tips Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm"
        >
          <h2 className="text-sm font-semibold text-slate-600 mb-3">Skincare Tips</h2>
          <div className="relative overflow-hidden min-h-[60px]">
            <motion.div
              key={tipIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-start gap-3"
            >
              <span className="text-2xl flex-shrink-0">{TIPS[tipIndex].icon}</span>
              <p className="text-sm text-slate-600 leading-relaxed">{TIPS[tipIndex].text}</p>
            </motion.div>
          </div>
          {/* Dots */}
          <div className="flex justify-center gap-1.5 mt-3">
            {TIPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setTipIndex(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === tipIndex ? 'w-4' : 'bg-slate-200'
                }`}
                style={i === tipIndex ? { background: '#1B2B4B' } : {}}
              />
            ))}
          </div>
        </motion.div>


      </motion.div>
    </div>
  );
}
