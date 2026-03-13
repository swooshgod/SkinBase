'use client';

import { motion } from 'framer-motion';
import { SkinType } from '@/types';
import { useSkinBaseStore } from '@/lib/store';

const skinTypes: { type: SkinType; label: string; icon: string; desc: string }[] = [
  { type: 'oily', label: 'Oily', icon: '💧', desc: 'Shiny T-zone, enlarged pores, prone to breakouts' },
  { type: 'dry', label: 'Dry', icon: '🏜️', desc: 'Tight feeling, flaky patches, fine lines visible' },
  { type: 'combo', label: 'Combination', icon: '⚖️', desc: 'Oily T-zone but dry cheeks, mixed texture' },
  { type: 'sensitive', label: 'Sensitive', icon: '🌸', desc: 'Reacts easily, redness, stinging with products' },
  { type: 'normal', label: 'Normal', icon: '✨', desc: 'Balanced, few concerns, rarely irritated' },
];

export default function SkinTypeStep() {
  const { quizResults, setSkinType } = useSkinBaseStore();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800">What&apos;s your skin type?</h2>
        <p className="text-slate-500 mt-2">This helps us recommend the right products</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {skinTypes.map(({ type, label, icon, desc }, i) => (
          <motion.button
            key={type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSkinType(type)}
            className={`p-4 rounded-2xl text-left transition-all ${
              quizResults.skinType === type
                ? 'ring-2 shadow-md'
                : 'bg-white shadow-sm hover:shadow-md border border-slate-100'
            }`}
            style={quizResults.skinType === type ? { background: '#FBE9E4', boxShadow: '0 0 0 2px #1B2B4B' } : {}}
          >
            <span className="text-2xl">{icon}</span>
            <h3 className="font-semibold text-slate-800 mt-2">{label}</h3>
            <p className="text-sm text-slate-500 mt-1">{desc}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
