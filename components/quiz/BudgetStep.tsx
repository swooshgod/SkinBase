'use client';

import { motion } from 'framer-motion';
import { Budget } from '@/types';
import { useSkinBaseStore } from '@/lib/store';

const budgets: { budget: Budget; label: string; icon: string; desc: string; examples: string }[] = [
  {
    budget: 'drugstore',
    label: 'Drugstore',
    icon: '💰',
    desc: 'Effective skincare doesn\'t have to break the bank',
    examples: 'CeraVe, The Ordinary, Neutrogena, La Roche-Posay',
  },
  {
    budget: 'midrange',
    label: 'Mid-Range',
    icon: '💎',
    desc: 'A balance of quality ingredients and value',
    examples: 'Paula\'s Choice, Cosrx, Drunk Elephant, Tatcha',
  },
  {
    budget: 'luxury',
    label: 'Luxury',
    icon: '👑',
    desc: 'Premium formulations and elegant experiences',
    examples: 'SK-II, La Mer, Dr. Barbara Sturm, Augustinus Bader',
  },
];

export default function BudgetStep() {
  const { quizResults, setBudget } = useSkinBaseStore();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800">What&apos;s your budget?</h2>
        <p className="text-slate-500 mt-2">We&apos;ll recommend products in your price range</p>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {budgets.map(({ budget, label, icon, desc, examples }, i) => (
          <motion.button
            key={budget}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setBudget(budget)}
            className={`p-5 rounded-2xl text-left transition-all ${
              quizResults.budget === budget
                ? 'ring-2 shadow-md'
                : 'bg-white shadow-sm hover:shadow-md border border-slate-100'
            }`}
            style={quizResults.budget === budget ? { background: '#FBE9E4', boxShadow: '0 0 0 2px #1B2B4B' } : {}}
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl">{icon}</span>
              <div>
                <h3 className="font-semibold text-slate-800 text-lg">{label}</h3>
                <p className="text-sm text-slate-500 mt-0.5">{desc}</p>
                <p className="text-xs text-slate-400 mt-2 italic">{examples}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
