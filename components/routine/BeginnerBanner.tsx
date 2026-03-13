'use client';

import { motion } from 'framer-motion';
import { useSkinBaseStore } from '@/lib/store';
import { isBeginnerLocked, BEGINNER_UNLOCK_DAYS } from '@/lib/experienceLevel';

export function BeginnerBanner() {
  const { quizResults, getUniqueDaysLogged } = useSkinBaseStore();
  const daysLogged = getUniqueDaysLogged();

  if (!isBeginnerLocked(quizResults.experience, daysLogged)) return null;

  const remaining = BEGINNER_UNLOCK_DAYS - daysLogged;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100 mb-4"
    >
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0">🌱</span>
        <div>
          <p className="text-sm font-semibold text-emerald-700">Stick to the basics for now</p>
          <p className="text-xs text-emerald-600 mt-0.5">
            You&apos;re in beginner mode — focus on cleanse, moisturize, and SPF.
            {remaining > 0 && (
              <> Log {remaining} more day{remaining !== 1 ? 's' : ''} to unlock actives!</>
            )}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function ActivesLockOverlay() {
  const { quizResults, getUniqueDaysLogged } = useSkinBaseStore();
  const daysLogged = getUniqueDaysLogged();

  if (!isBeginnerLocked(quizResults.experience, daysLogged)) return null;

  const remaining = BEGINNER_UNLOCK_DAYS - daysLogged;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-slate-50/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 text-center"
    >
      <div className="text-3xl mb-2">🔒</div>
      <p className="text-sm font-semibold text-slate-700">Unlock after {remaining} more days of logging</p>
      <p className="text-xs text-slate-500 mt-1">
        Build the habit first — actives and serums will be available soon
      </p>
      <div className="mt-3 h-2 bg-slate-200 rounded-full overflow-hidden max-w-[200px] mx-auto">
        <div
          className="h-full rounded-full transition-all"
          style={{ background: 'linear-gradient(135deg, #1B2B4B, #111C30)', width: `${(daysLogged / BEGINNER_UNLOCK_DAYS) * 100}%` }}
        />
      </div>
    </motion.div>
  );
}

export function PatchTestBanner({ productName }: { productName: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-yellow-50 rounded-xl p-3 border border-yellow-100 mb-3"
    >
      <div className="flex items-start gap-2">
        <span className="text-lg flex-shrink-0">⚠️</span>
        <div>
          <p className="text-xs font-semibold text-yellow-700">New product? Do a patch test first!</p>
          <p className="text-[11px] text-yellow-600 mt-0.5">
            Apply a small amount of {productName} to your inner arm and wait 24h before using on your face.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
