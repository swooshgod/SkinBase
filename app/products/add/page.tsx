'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSkinBaseStore } from '@/lib/store';
import { scoreIngredients } from '@/lib/ingredientScorer';
import { ProductCategory, MyProduct } from '@/types';

const categories: { value: ProductCategory; label: string; icon: string }[] = [
  { value: 'cleanser', label: 'Cleanser', icon: '🧴' },
  { value: 'toner', label: 'Toner', icon: '💧' },
  { value: 'serum', label: 'Serum', icon: '✨' },
  { value: 'moisturizer', label: 'Moisturizer', icon: '🧊' },
  { value: 'sunscreen', label: 'Sunscreen', icon: '☀️' },
  { value: 'treatment', label: 'Treatment', icon: '💊' },
  { value: 'exfoliant', label: 'Exfoliant', icon: '🌀' },
  { value: 'mask', label: 'Mask', icon: '🎭' },
  { value: 'oil', label: 'Oil', icon: '🫧' },
  { value: 'eye_cream', label: 'Eye Cream', icon: '👁️' },
];

export default function AddProductPage() {
  const router = useRouter();
  const { addMyProduct } = useSkinBaseStore();

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState<ProductCategory>('serum');
  const [price, setPrice] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !brand.trim()) return;

    const ingredientsList = ingredients
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean);

    const score = scoreIngredients(ingredientsList);

    const product: MyProduct = {
      id: crypto.randomUUID(),
      name: name.trim(),
      brand: brand.trim(),
      category,
      price_usd: parseFloat(price) || 0,
      ingredients: ingredientsList,
      ingredientScore: score.score,
      ingredientRating: score.rating,
      concerns: score.concerns,
      benefits: score.benefits,
      conflicts: score.conflicts,
      source: 'manual',
      createdAt: new Date().toISOString(),
    };

    addMyProduct(product);
    setSubmitted(true);

    setTimeout(() => {
      router.push('/products');
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-slate-800">Product Added!</h2>
          <p className="text-sm text-slate-400 mt-1">Redirecting to products...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link href="/products" className="text-sm transition-colors" style={{ color: '#A8A29E' }}>
          ← Back to Products
        </Link>
        <h1 className="text-2xl font-bold text-slate-800 mt-2">Add Product</h1>
        <p className="text-sm text-slate-400">Manually add a product to your collection</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Product Name <span style={{ color: '#E8856A' }}>*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Hydrating Facial Cleanser"
            required
            className="w-full px-4 py-3 bg-white rounded-xl border text-sm focus:outline-none focus:ring-2 focus:border-transparent"
            style={{ borderColor: '#E7DFD5' }}
          />
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Brand <span style={{ color: '#E8856A' }}>*</span>
          </label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="e.g., CeraVe"
            required
            className="w-full px-4 py-3 bg-white rounded-xl border text-sm focus:outline-none focus:ring-2 focus:border-transparent"
            style={{ borderColor: '#E7DFD5' }}
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
          <div className="grid grid-cols-5 gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  category === cat.value
                    ? 'shadow-sm'
                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
                style={category === cat.value ? { background: '#FBE9E4', borderColor: '#253860', color: '#1B2B4B' } : {}}
              >
                <span className="text-lg">{cat.icon}</span>
                <span className="truncate w-full text-center text-[10px]">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Price (USD)</label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-slate-400 text-sm">$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-3 pl-8 bg-white rounded-xl border text-sm focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ borderColor: '#E7DFD5' }}
            />
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Ingredients
          </label>
          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="Paste ingredient list here, separated by commas (e.g., Water, Glycerin, Niacinamide, Hyaluronic Acid...)"
            rows={5}
            className="w-full px-4 py-3 bg-white rounded-xl border text-sm focus:outline-none focus:ring-2 focus:border-transparent resize-none"
            style={{ borderColor: '#E7DFD5' }}
          />
          <p className="text-xs text-slate-400 mt-1">
            Tip: Copy the ingredient list from the product packaging or website
          </p>
        </div>

        {/* Live Score Preview */}
        {ingredients.trim() && (() => {
          const list = ingredients.split(',').map(i => i.trim()).filter(Boolean);
          if (list.length === 0) return null;
          const score = scoreIngredients(list);
          const color =
            score.score >= 80 ? 'text-green-600 bg-green-50 border-green-100' :
            score.score >= 60 ? 'text-yellow-600 bg-yellow-50 border-yellow-100' :
            score.score >= 40 ? 'text-orange-600 bg-orange-50 border-orange-100' :
            'text-red-600 bg-red-50 border-red-100';
          const barColor =
            score.score >= 80 ? 'bg-green-500' :
            score.score >= 60 ? 'bg-yellow-500' :
            score.score >= 40 ? 'bg-orange-500' :
            'bg-red-500';

          return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl p-4 border ${color}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Score Preview</span>
                <span className="text-xl font-bold">{score.score}/100</span>
              </div>
              <div className="h-2 bg-white/60 rounded-full overflow-hidden mb-3">
                <div className={`h-full rounded-full ${barColor}`} style={{ width: `${score.score}%` }} />
              </div>
              {score.benefits.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs font-medium mb-1">Benefits found:</p>
                  <div className="flex flex-wrap gap-1">
                    {score.benefits.slice(0, 4).map((b, i) => (
                      <span key={i} className="text-[10px] bg-white/70 px-2 py-0.5 rounded-full">{b}</span>
                    ))}
                  </div>
                </div>
              )}
              {score.concerns.length > 0 && (
                <div>
                  <p className="text-xs font-medium mb-1">Concerns:</p>
                  <div className="flex flex-wrap gap-1">
                    {score.concerns.map((c, i) => (
                      <span key={i} className="text-[10px] bg-white/70 px-2 py-0.5 rounded-full">{c}</span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })()}

        {/* Submit */}
        <button
          type="submit"
          disabled={!name.trim() || !brand.trim()}
          className="w-full py-3.5 text-white rounded-xl font-medium text-base hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
          style={{ background: 'linear-gradient(135deg, #1B2B4B, #111C30)', boxShadow: '0 10px 25px rgba(27,43,75,0.25)' }}
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
