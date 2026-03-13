'use client';

import { motion } from 'framer-motion';

export interface SkinAnalysis {
  skinScore: number;
  skinTone: string;
  concerns: {
    name: string;
    severity: 'mild' | 'moderate' | 'visible';
    description: string;
  }[];
  strengths: string[];
  recommendations: {
    category: string;
    priority: 'high' | 'medium' | 'low';
    suggestion: string;
    targetConcern: string;
  }[];
  routineSuggestion: {
    morning: string[];
    evening: string[];
  };
}

interface SkinReportProps {
  analysis: SkinAnalysis;
  onRetake: () => void;
  onShopProducts: () => void;
  onSeeTransform: () => void;
}

const concernEmojis: Record<string, string> = {
  acne: '🔴',
  breakouts: '🔴',
  'dark spots': '🟤',
  hyperpigmentation: '🟤',
  redness: '🌸',
  oiliness: '💧',
  oily: '💧',
  dryness: '🏜️',
  dry: '🏜️',
  'fine lines': '〰️',
  wrinkles: '〰️',
  pores: '⭕',
  'large pores': '⭕',
  texture: '🫧',
  'uneven texture': '🫧',
  dullness: '😶',
  dull: '😶',
};

function getConcernEmoji(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, emoji] of Object.entries(concernEmojis)) {
    if (lower.includes(key)) return emoji;
  }
  return '🔍';
}

function getScoreColor(score: number) {
  if (score >= 8) return { ring: '#22c55e', bg: 'bg-green-50', text: 'text-green-700', label: 'Healthy' };
  if (score >= 6) return { ring: '#eab308', bg: 'bg-yellow-50', text: 'text-yellow-700', label: 'Good' };
  if (score >= 4) return { ring: '#f97316', bg: 'bg-orange-50', text: 'text-orange-700', label: 'Fair' };
  return { ring: '#ef4444', bg: 'bg-red-50', text: 'text-red-700', label: 'Needs Attention' };
}

function getSeverityStyle(severity: string) {
  switch (severity) {
    case 'mild': return 'bg-green-100 text-green-700';
    case 'moderate': return 'bg-yellow-100 text-yellow-700';
    case 'visible': return 'bg-red-100 text-red-700';
    default: return 'bg-slate-100 text-slate-700';
  }
}

function getPriorityStyle(priority: string) {
  switch (priority) {
    case 'high': return 'border-l-red-400';
    case 'medium': return 'border-l-yellow-400';
    case 'low': return 'border-l-green-400';
    default: return 'border-l-slate-400';
  }
}

function ScoreRing({ score }: { score: number }) {
  const { ring, label } = getScoreColor(score);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 10) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="8" />
          <motion.circle
            cx="60" cy="60" r={radius}
            fill="none"
            stroke={ring}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-4xl font-bold text-slate-800"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-xs text-slate-500">out of 10</span>
        </div>
      </div>
      <span className={`mt-2 text-sm font-semibold ${getScoreColor(score).text}`}>{label}</span>
    </div>
  );
}

export default function SkinReport({ analysis, onRetake, onShopProducts, onSeeTransform }: SkinReportProps) {
  const sortedRecs = [...analysis.recommendations].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return (order[a.priority] ?? 2) - (order[b.priority] ?? 2);
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Score + Skin Tone */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Your Skin Score</h2>
        <ScoreRing score={analysis.skinScore} />
        <div className="mt-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" style={{ background: '#FBE9E4', color: '#1B2B4B' }}>
            {analysis.skinTone}
          </span>
        </div>
      </div>

      {/* Strengths */}
      {analysis.strengths.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 mb-3">Strengths</h3>
          <div className="space-y-2">
            {analysis.strengths.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex items-start gap-2"
              >
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-sm text-slate-600">{s}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Concerns */}
      {analysis.concerns.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 mb-3">Concerns</h3>
          <div className="space-y-3">
            {analysis.concerns.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="p-3 bg-slate-50 rounded-xl"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{getConcernEmoji(c.name)}</span>
                  <span className="text-sm font-semibold text-slate-700">{c.name}</span>
                  <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${getSeverityStyle(c.severity)}`}>
                    {c.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-500 ml-8">{c.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {sortedRecs.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 mb-3">Recommendations</h3>
          <div className="space-y-3">
            {sortedRecs.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className={`p-3 bg-slate-50 rounded-xl border-l-4 ${getPriorityStyle(r.priority)}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-slate-700">{r.category}</span>
                  <span className="text-xs text-slate-400">for {r.targetConcern}</span>
                </div>
                <p className="text-xs text-slate-500">{r.suggestion}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Routine Suggestion */}
      {analysis.routineSuggestion && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 mb-3">Suggested Routine</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-amber-400">☀️</span>
                <span className="text-xs font-semibold text-slate-600">Morning</span>
              </div>
              <ol className="space-y-1.5">
                {analysis.routineSuggestion.morning.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-500">
                    <span className="font-bold mt-px" style={{ color: '#1B2B4B' }}>{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-indigo-400">🌙</span>
                <span className="text-xs font-semibold text-slate-600">Evening</span>
              </div>
              <ol className="space-y-1.5">
                {analysis.routineSuggestion.evening.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-500">
                    <span className="font-bold mt-px" style={{ color: '#1B2B4B' }}>{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onShopProducts}
          className="w-full py-3.5 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow"
          style={{ background: 'linear-gradient(135deg, #1B2B4B, #111C30)', boxShadow: '0 10px 25px rgba(27,43,75,0.25)' }}
        >
          Shop Recommended Products
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSeeTransform}
          className="w-full py-3 bg-slate-800 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2"
        >
          <span>See Your Future Skin</span>
          <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded">PRO</span>
        </motion.button>

        <button
          onClick={onRetake}
          className="w-full py-2.5 border border-slate-200 rounded-xl text-slate-600 font-medium text-sm hover:bg-slate-50 transition-colors"
        >
          Retake Photo
        </button>
      </div>
    </motion.div>
  );
}
