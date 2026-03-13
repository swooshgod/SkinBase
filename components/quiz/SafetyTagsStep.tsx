'use client';

import { motion } from 'framer-motion';
import { FilterTag } from '@/types';
import { useSkinBaseStore } from '@/lib/store';

const safetyOptions: { tag: FilterTag; label: string; icon: string; desc: string }[] = [
  { tag: 'pregnancy_safe', label: 'Pregnancy Safe', icon: '🤰', desc: 'No retinoids, salicylic acid, or other restricted ingredients' },
  { tag: 'fragrance_free', label: 'Fragrance Free', icon: '🚫', desc: 'No added fragrances or perfumes' },
  { tag: 'fungal_safe', label: 'Fungal Acne Safe', icon: '🍄', desc: 'No fatty acids or esters that feed malassezia' },
  { tag: 'vegan', label: 'Vegan', icon: '🌱', desc: 'No animal-derived ingredients' },
  { tag: 'cruelty_free', label: 'Cruelty Free', icon: '🐰', desc: 'Not tested on animals' },
  { tag: 'clean_beauty', label: 'Clean Beauty', icon: '🧼', desc: 'No parabens, sulfates, or phthalates' },
];

export default function SafetyTagsStep() {
  const { quizResults, toggleSafetyTag } = useSkinBaseStore();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800">Any safety preferences?</h2>
        <p className="text-slate-500 mt-2">Select all that matter to you (optional)</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {safetyOptions.map(({ tag, label, icon, desc }, i) => {
          const isSelected = quizResults.safetyTags.includes(tag);
          return (
            <motion.button
              key={tag}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleSafetyTag(tag)}
              className={`p-4 rounded-2xl text-left transition-all ${
                isSelected
                  ? 'ring-2 ring-green-500 bg-green-50 shadow-md'
                  : 'bg-white shadow-sm hover:shadow-md border border-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{icon}</span>
                <div>
                  <h3 className="font-semibold text-slate-800">{label}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
