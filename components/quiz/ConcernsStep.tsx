'use client';

import { motion } from 'framer-motion';
import { Concern } from '@/types';
import { useSkinBaseStore } from '@/lib/store';

const concerns: { concern: Concern; label: string; icon: string }[] = [
  { concern: 'acne', label: 'Acne & Breakouts', icon: '🔴' },
  { concern: 'aging', label: 'Anti-Aging', icon: '⏳' },
  { concern: 'hyperpigmentation', label: 'Hyperpigmentation', icon: '🎨' },
  { concern: 'redness', label: 'Redness', icon: '🌹' },
  { concern: 'texture', label: 'Uneven Texture', icon: '🪨' },
  { concern: 'dark_spots', label: 'Dark Spots', icon: '⚫' },
  { concern: 'fine_lines', label: 'Fine Lines', icon: '〰️' },
  { concern: 'pores', label: 'Large Pores', icon: '🔍' },
  { concern: 'dullness', label: 'Dullness', icon: '😶' },
  { concern: 'dehydration', label: 'Dehydration', icon: '🥤' },
];

export default function ConcernsStep() {
  const { quizResults, toggleConcern } = useSkinBaseStore();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800">What are your skin concerns?</h2>
        <p className="text-slate-500 mt-2">Select all that apply</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {concerns.map(({ concern, label, icon }, i) => {
          const isSelected = quizResults.concerns.includes(concern);
          return (
            <motion.button
              key={concern}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleConcern(concern)}
              className={`p-3 rounded-xl text-center transition-all ${
                isSelected
                  ? 'shadow-md'
                  : 'bg-white shadow-sm hover:shadow-md border border-slate-100'
              }`}
              style={isSelected ? { background: '#FBE9E4', boxShadow: '0 0 0 2px #1B2B4B' } : {}}
            >
              <span className="text-xl">{icon}</span>
              <p className="text-sm font-medium text-slate-700 mt-1">{label}</p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
