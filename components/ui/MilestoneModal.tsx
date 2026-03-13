'use client';
import { motion, AnimatePresence } from 'framer-motion';

const MILESTONES: Record<number, { emoji: string; title: string; message: string }> = {
  7: { emoji: '🌱', title: 'One Week Strong!', message: "Your skin is just starting to adjust to your routine. Keep going — the real changes show at Day 30." },
  14: { emoji: '🌿', title: 'Two Weeks!', message: "Your skin cells are turning over for the first time in your routine. You're building a real habit." },
  30: { emoji: '🌳', title: '30-Day Milestone!', message: "One full skin cycle complete. You've earned your first progress photo comparison." },
  60: { emoji: '✨', title: '60 Days — Glowing!', message: "Collagen production improvements are starting. This is when most people start seeing real results." },
  90: { emoji: '🏆', title: '90 Days — Routine Master!', message: "You've built one of the most impactful health habits possible. Your skin is thanking you." },
};

interface Props {
  streak: number;
  onClose: () => void;
}

export default function MilestoneModal({ streak, onClose }: Props) {
  const milestone = MILESTONES[streak];
  if (!milestone) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.5)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-lg rounded-3xl p-6 text-center"
          style={{ background: '#FFFFFF' }}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: 2 }}
            className="text-6xl mb-4"
          >
            {milestone.emoji}
          </motion.div>
          <h2 className="text-2xl font-black mb-2" style={{ color: '#1C1917' }}>{milestone.title}</h2>
          <p className="text-sm mb-4" style={{ color: '#78716C' }}>{milestone.message}</p>
          <div className="rounded-2xl p-4 mb-4" style={{ background: '#FBE9E4' }}>
            <p className="text-sm font-semibold mb-1" style={{ color: '#1B2B4B' }}>
              🔓 Unlock AI Skin Analysis
            </p>
            <p className="text-xs mb-3" style={{ color: '#78716C' }}>
              See what&apos;s actually changing in your skin with monthly AI reports.
            </p>
            <a href="/pricing" 
              className="block py-2 rounded-xl text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #1B2B4B, #111C30)' }}>
              See Pro Features →
            </a>
          </div>
          <button onClick={onClose} className="text-sm" style={{ color: '#A8A29E' }}>
            Keep going 🔥
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
