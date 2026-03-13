'use client';

import { motion } from 'framer-motion';
import { ExperienceLevel } from '@/types';
import { useSkinBaseStore } from '@/lib/store';

const levels: { level: ExperienceLevel; label: string; icon: string; desc: string; unlocks: string }[] = [
  {
    level: 'beginner',
    label: 'Beginner',
    icon: '🌱',
    desc: 'New to skincare or just getting started with a routine',
    unlocks: 'We\'ll start you with a simple 3-step routine and build up gradually',
  },
  {
    level: 'intermediate',
    label: 'Intermediate',
    icon: '🌿',
    desc: 'You have a basic routine and want to level it up',
    unlocks: 'We\'ll introduce serums, treatments, and help you layer properly',
  },
  {
    level: 'advanced',
    label: 'Advanced',
    icon: '🌳',
    desc: 'You know your actives and want to optimize your routine',
    unlocks: 'Full access to all products, advanced actives, and custom routines',
  },
];

export default function ExperienceStep() {
  const { quizResults, setExperience } = useSkinBaseStore();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800">What&apos;s your experience level?</h2>
        <p className="text-slate-500 mt-2">This helps us pace your routine safely</p>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {levels.map(({ level, label, icon, desc, unlocks }, i) => (
          <motion.button
            key={level}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setExperience(level)}
            className={`p-5 rounded-2xl text-left transition-all ${
              quizResults.experience === level
                ? 'ring-2 ring-violet-500 bg-violet-50 shadow-md'
                : 'bg-white shadow-sm hover:shadow-md border border-slate-100'
            }`}
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl">{icon}</span>
              <div>
                <h3 className="font-semibold text-slate-800 text-lg">{label}</h3>
                <p className="text-sm text-slate-500 mt-0.5">{desc}</p>
                <div className={`mt-2 text-xs px-3 py-1.5 rounded-lg inline-block ${
                  quizResults.experience === level
                    ? 'bg-violet-100 text-violet-700'
                    : 'bg-slate-50 text-slate-400'
                }`}>
                  {unlocks}
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
