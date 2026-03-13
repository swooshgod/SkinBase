'use client';

import { motion } from 'framer-motion';
import { MyProduct } from '@/types';
import { useSkinBaseStore } from '@/lib/store';
import { getAffiliateUrl } from '@/lib/affiliateLinks';

interface ProductDetailModalProps {
  product: MyProduct;
  onClose: () => void;
}

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 80 ? 'bg-green-500' :
    score >= 60 ? 'bg-yellow-500' :
    score >= 40 ? 'bg-orange-500' :
    'bg-red-500';

  const textColor =
    score >= 80 ? 'text-green-600' :
    score >= 60 ? 'text-yellow-600' :
    score >= 40 ? 'text-orange-600' :
    'text-red-600';

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-slate-600">Ingredient Score</span>
        <span className={`text-xl font-bold ${textColor}`}>{score}/100</span>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-slate-400">Poor</span>
        <span className="text-[10px] text-slate-400">Fair</span>
        <span className="text-[10px] text-slate-400">Good</span>
        <span className="text-[10px] text-slate-400">Excellent</span>
      </div>
    </div>
  );
}

export default function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const { loadouts, addLoadout, updateLoadout } = useSkinBaseStore();

  const handleAddToLoadout = () => {
    if (loadouts.length === 0) {
      // Create a new loadout with this product
      addLoadout({
        id: crypto.randomUUID(),
        name: 'My Routine',
        timeOfDay: 'both',
        productIds: [product.id],
        createdAt: new Date().toISOString(),
      });
    } else {
      // Add to first loadout
      const first = loadouts[0];
      if (!first.productIds.includes(product.id)) {
        updateLoadout(first.id, {
          productIds: [...first.productIds, product.id],
        });
      }
    }
    onClose();
  };

  const ratingLabel = {
    excellent: 'Excellent',
    good: 'Good',
    fair: 'Fair',
    poor: 'Poor',
  };

  const ratingEmoji = {
    excellent: '🌟',
    good: '👍',
    fair: '⚠️',
    poor: '🚫',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 rounded-t-2xl p-5 flex justify-between items-start">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#1B2B4B' }}>{product.brand}</p>
            <h2 className="text-xl font-bold text-slate-800">{product.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full capitalize">
                {product.category}
              </span>
              <span className="text-xs text-slate-400">
                {product.source === 'scan' ? 'Scanned' : 'Manual'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Score */}
          <div className="bg-slate-50 rounded-xl p-4">
            <ScoreBar score={product.ingredientScore} />
            <div className="flex items-center gap-2 mt-2">
              <span className="text-lg">{ratingEmoji[product.ingredientRating]}</span>
              <span className="text-sm font-medium text-slate-600">
                {ratingLabel[product.ingredientRating]}
              </span>
            </div>
          </div>

          {/* Benefits / Good For */}
          {product.benefits.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Good For</h3>
              <div className="flex flex-wrap gap-1.5">
                {product.benefits.map((b, i) => (
                  <span key={i} className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Concerns / Avoid If */}
          {product.concerns.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Avoid If Sensitive</h3>
              <div className="flex flex-wrap gap-1.5">
                {product.concerns.map((c, i) => (
                  <span key={i} className="text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded-full">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Conflict Warnings */}
          {product.conflicts.length > 0 && (
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <h3 className="text-sm font-semibold text-amber-800 mb-2">Ingredient Conflicts</h3>
              {product.conflicts.map((c, i) => (
                <p key={i} className="text-sm text-amber-700 mb-1">{c}</p>
              ))}
            </div>
          )}

          {/* Ingredients */}
          {product.ingredients.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">
                Full Ingredients ({product.ingredients.length})
              </h3>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-500 leading-relaxed">
                  {product.ingredients.join(', ')}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleAddToLoadout}
              className="w-full py-3 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg, #1B2B4B, #111C30)' }}
            >
              Add to Loadout
            </button>

            {/* View on Amazon button */}
            <a
              href={getAffiliateUrl(`${product.brand} ${product.name}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-white"
              style={{ backgroundColor: '#FF9900' }}
            >
              <span>View on Amazon</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
