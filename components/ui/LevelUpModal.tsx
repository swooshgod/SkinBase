'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// canvas-confetti loaded dynamically to avoid SSR issues
let confetti: ((opts?: Record<string, unknown>) => void) | null = null;
if (typeof window !== 'undefined') {
  import('canvas-confetti').then((m) => { confetti = m.default; });
}
import { UNLOCKABLE_INGREDIENTS } from '@/lib/experienceLevel';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LevelUpModal({ isOpen, onClose }: LevelUpModalProps) {
  const [hasLaunched, setHasLaunched] = useState(false);

  useEffect(() => {
    if (isOpen && !hasLaunched) {
      setHasLaunched(true);
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti?.({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ['#1B2B4B', '#253860', '#E8856A', '#E7DFD5'],
        });
        confetti?.({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ['#1B2B4B', '#253860', '#E8856A', '#E7DFD5'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
    if (!isOpen) {
      setHasLaunched(false);
    }
  }, [isOpen, hasLaunched]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="text-7xl mb-4"
            >
              🎉
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-slate-800 mb-2"
            >
              Level Up!
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-slate-500 mb-6"
            >
              You unlocked <span className="font-semibold" style={{ color: '#1B2B4B' }}>actives</span>! 14 days of consistent logging — you&apos;re ready for the next level.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-2xl p-4 mb-6"
              style={{ background: 'linear-gradient(135deg, #FBE9E4, #F5F0EA)' }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#1B2B4B' }}>
                Now Available
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {UNLOCKABLE_INGREDIENTS.map((ingredient, i) => (
                  <motion.span
                    key={ingredient}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.05 }}
                    className="px-3 py-1 bg-white text-slate-700 rounded-full text-sm shadow-sm"
                    style={{ border: '1px solid #E7DFD5' }}
                  >
                    {ingredient}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="w-full py-3 text-white rounded-xl font-semibold shadow-lg"
              style={{ background: 'linear-gradient(135deg, #1B2B4B, #111C30)', boxShadow: '0 10px 25px rgba(27,43,75,0.25)' }}
            >
              Let&apos;s Go!
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
