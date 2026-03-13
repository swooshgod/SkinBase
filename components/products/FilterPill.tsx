'use client';

import { motion } from 'framer-motion';

interface FilterPillProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon?: string;
}

export default function FilterPill({ label, isActive, onClick, icon }: FilterPillProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
        isActive
          ? 'text-white shadow-md'
          : 'bg-white text-slate-600 border border-slate-200'
      }`}
      style={isActive ? { background: '#1B2B4B', boxShadow: '0 10px 25px rgba(27,43,75,0.25)' } : {}}
    >
      {icon && <span className="text-sm">{icon}</span>}
      {label}
    </motion.button>
  );
}
