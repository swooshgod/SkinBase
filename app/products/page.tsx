'use client';

import { useState, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useSkinBaseStore } from '@/lib/store';
import { products, searchProducts } from '@/lib/products';
import ProductCard from '@/components/products/ProductCard';
import dynamic from 'next/dynamic';
const BarcodeScanner = dynamic(() => import('@/components/products/BarcodeScanner'), { ssr: false });
import ProductDetailModal from '@/components/products/ProductDetailModal';
import { ProductCategory, Product, MyProduct } from '@/types';
import { getSafetyTags, SafetyTag, SAFETY_TAG_META } from '@/lib/safetyTags';

const categoryFilters: { value: ProductCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'cleanser', label: 'Cleansers' },
  { value: 'toner', label: 'Toners' },
  { value: 'serum', label: 'Serums' },
  { value: 'moisturizer', label: 'Moisturizers' },
  { value: 'sunscreen', label: 'Sunscreens' },
  { value: 'treatment', label: 'Treatments' },
  { value: 'exfoliant', label: 'Exfoliants' },
  { value: 'mask', label: 'Masks' },
  { value: 'oil', label: 'Oils' },
  { value: 'eye_cream', label: 'Eye Creams' },
];

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoadingState />}>
      <ProductsPageContent />
    </Suspense>
  );
}

function ProductsLoadingState() {
  return (
    <div className="min-h-screen pb-24 max-w-lg mx-auto px-4 pt-6">
      <div className="animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-48 mb-2"></div>
        <div className="h-4 bg-slate-100 rounded w-32 mb-6"></div>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-slate-100 rounded-2xl h-52"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') as ProductCategory | null;

  const { searchQuery, setSearchQuery, quizResults } = useSkinBaseStore();

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>(initialCategory || 'all');
  const [selectedSkinType, setSelectedSkinType] = useState<string>('all');
  const [selectedSafetyTag, setSelectedSafetyTag] = useState<SafetyTag | 'all'>('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedMyProduct, setSelectedMyProduct] = useState<MyProduct | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  // Get recommended products
  const recommendedProducts = useMemo(() => {
    if (!quizResults.completed) return [];
    return products
      .filter((p) => {
        const matchesSkinType = p.for_skin_types.includes(quizResults.skinType || 'normal');
        const matchesConcern = quizResults.concerns.some((c) => p.for_concerns.includes(c));
        return matchesSkinType && matchesConcern;
      })
      .slice(0, 6);
  }, [quizResults]);

  const filteredProducts = useMemo(() => {
    let result = searchQuery ? searchProducts(searchQuery) : [...products];

    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (selectedSkinType !== 'all') {
      result = result.filter((p) => p.for_skin_types.includes(selectedSkinType as never));
    }

    if (selectedSafetyTag !== 'all') {
      result = result.filter((p) => getSafetyTags(p).includes(selectedSafetyTag));
    }

    return result;
  }, [searchQuery, selectedCategory, selectedSkinType, selectedSafetyTag]);

  return (
    <div className="min-h-screen pb-24 max-w-lg mx-auto px-4 pt-6">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#1e293b' }}>Products</h1>
            <p className="text-sm" style={{ color: '#94a3b8' }}>Find your perfect routine</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowScanner(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-white rounded-xl text-sm font-medium"
              style={{ background: 'linear-gradient(135deg, #1B2B4B, #111C30)' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              Scan
            </button>
            <Link
              href="/products/add"
              className="flex items-center px-3 py-2 bg-white text-sm font-medium rounded-xl"
              style={{ color: '#64748b', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}
            >
              + Add
            </Link>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search products, brands..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 pl-10 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#253860]/30"
          style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}
        />
        <svg className="absolute left-3 top-3.5 w-4 h-4" style={{ color: '#94a3b8' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Category Pills - single scrollable row */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
        {categoryFilters.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all"
            style={{
              background: selectedCategory === cat.value ? '#1B2B4B' : 'white',
              color: selectedCategory === cat.value ? 'white' : '#78716C',
              boxShadow: selectedCategory === cat.value ? 'none' : '0 1px 8px rgba(0,0,0,0.06)',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Advanced filters toggle */}
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
          style={{
            background: (selectedSkinType !== 'all' || selectedSafetyTag !== 'all') ? '#FBE9E4' : '#F5F0EA',
            color: (selectedSkinType !== 'all' || selectedSafetyTag !== 'all') ? '#1B2B4B' : '#78716C',
          }}
        >
          🔽 Filters {(selectedSkinType !== 'all' || selectedSafetyTag !== 'all') ? '· Active' : ''}
        </button>
        {(selectedSkinType !== 'all' || selectedSafetyTag !== 'all') && (
          <button onClick={() => { setSelectedSkinType('all'); setSelectedSafetyTag('all'); }} className="text-xs text-slate-400 underline">
            Clear
          </button>
        )}
      </div>

      {showAdvancedFilters && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-3 space-y-3">
          {/* Skin type */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Skin Type</p>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {[
                { value: 'all', label: 'All' },
                { value: 'oily', label: '💧 Oily' },
                { value: 'dry', label: '🌵 Dry' },
                { value: 'combination', label: '☯️ Combo' },
                { value: 'sensitive', label: '🌸 Sensitive' },
                { value: 'normal', label: '✨ Normal' },
              ].map((st) => (
                <button key={st.value} onClick={() => setSelectedSkinType(st.value)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                  style={{ background: selectedSkinType === st.value ? '#1e293b' : 'white', color: selectedSkinType === st.value ? 'white' : '#64748b', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  {st.label}
                </button>
              ))}
            </div>
          </div>
          {/* Safety */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Safe For</p>
            <div className="flex flex-wrap gap-2 pb-1">
              {(['pregnancy-safe', 'fragrance-free', 'non-comedogenic', 'reef-safe', 'cruelty-free', 'vegan', 'dermatologist-tested', 'hypoallergenic', 'mineral SPF'] as const).map((tag) => {
                const meta = SAFETY_TAG_META[tag];
                const active = selectedSafetyTag === tag;
                return (
                  <button key={tag} onClick={() => setSelectedSafetyTag(active ? 'all' : tag)}
                    className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                    style={{ background: active ? meta.color : 'white', color: active ? meta.textColor : '#64748b', border: active ? `1.5px solid ${meta.textColor}` : '1.5px solid #e2e8f0' }}>
                    {meta.emoji} {meta.label}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Recommended Section */}
      {recommendedProducts.length > 0 && selectedCategory === 'all' && !searchQuery && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold" style={{ color: '#64748b' }}>Recommended for You</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {recommendedProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="flex-shrink-0 w-32 cursor-pointer"
                style={{ borderRadius: 16, overflow: 'hidden', background: 'white', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}
              >
                <div className="h-24 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FBE9E4, #F5F0EA)' }}>
                  <span className="text-3xl opacity-50">
                    {product.category === 'cleanser' ? '🧴' :
                     product.category === 'moisturizer' ? '🧊' :
                     product.category === 'sunscreen' ? '☀️' :
                     product.category === 'serum' ? '✨' : '💧'}
                  </span>
                </div>
                <div className="p-2">
                  <p className="text-[10px] font-semibold uppercase" style={{ color: '#1B2B4B' }}>{product.brand}</p>
                  <p className="text-xs font-medium line-clamp-2" style={{ color: '#1e293b' }}>{product.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product count */}
      {(selectedCategory !== 'all' || searchQuery) && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm" style={{ color: '#64748b' }}>
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </p>
          <button
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
            className="text-sm font-medium"
            style={{ color: '#1B2B4B' }}
          >
            Clear
          </button>
        </div>
      )}

      {/* Product Grid - 2 columns */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => setSelectedProduct(product)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🧴</div>
          <h3 className="text-lg font-semibold mb-1" style={{ color: '#1e293b' }}>No matches found</h3>
          <p className="text-sm mb-4" style={{ color: '#94a3b8' }}>Try removing a filter or broadening your search</p>
          <button
            onClick={() => { setSelectedSkinType('all'); setSelectedSafetyTag('all'); setSelectedCategory('all'); }}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #1B2B4B, #111C30)' }}
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Affiliate Disclosure */}
      <p className="text-[11px] text-center mt-8 pb-4" style={{ color: '#94a3b8' }}>
        As an Amazon Associate, SkinBase earns from qualifying purchases.
      </p>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end justify-center"
          onClick={() => setSelectedProduct(null)}
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-t-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5">
              {/* Handle bar */}
              <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4" />

              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#1B2B4B' }}>{selectedProduct.brand}</p>
                  <h2 className="text-xl font-bold" style={{ color: '#1e293b' }}>{selectedProduct.name}</h2>
                  <p className="text-sm capitalize" style={{ color: '#94a3b8' }}>{selectedProduct.category}</p>
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="p-2 rounded-lg"
                  style={{ background: '#f1f5f9' }}
                >
                  ✕
                </button>
              </div>

              {/* Benefits */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2" style={{ color: '#1e293b' }}>What it does</h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProduct.benefits.map((b) => (
                    <span key={b} className="text-sm px-3 py-1 rounded-full" style={{ background: '#dbeafe', color: '#1d4ed8' }}>
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price & Scores */}
              <div className="flex items-center gap-4 mb-4 pb-4" style={{ borderBottom: '1px solid #f1f5f9' }}>
                <span className="text-2xl font-bold" style={{ color: '#1e293b' }}>${selectedProduct.price_usd.toFixed(2)}</span>
                <span className="text-xs px-3 py-1 rounded-full font-medium" style={{
                  background: selectedProduct.price_tier === 'drugstore' ? '#dcfce7' : selectedProduct.price_tier === 'midrange' ? '#dbeafe' : '#ede9fe',
                  color: selectedProduct.price_tier === 'drugstore' ? '#15803d' : selectedProduct.price_tier === 'midrange' ? '#1d4ed8' : '#6d28d9'
                }}>
                  {selectedProduct.price_tier}
                </span>
              </div>

              {/* Key Actives */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2" style={{ color: '#1e293b' }}>Key Actives</h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProduct.key_actives.map((active) => (
                    <span key={active} className="text-sm px-3 py-1 rounded-full" style={{ background: '#FBE9E4', color: '#1B2B4B' }}>
                      {active.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>

              {/* How to Use */}
              <div className="rounded-xl p-4 mb-4" style={{ background: '#f8fafc' }}>
                <h3 className="text-sm font-semibold mb-1" style={{ color: '#1e293b' }}>How to Use</h3>
                <p className="text-sm" style={{ color: '#64748b' }}>{selectedProduct.application_instructions}</p>
              </div>

              {/* Amazon Button */}
              <a
                href={selectedProduct.amazonASIN
                  ? `https://www.amazon.com/dp/${selectedProduct.amazonASIN}?tag=${process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || 'MY_ASSOCIATE_TAG'}`
                  : `https://www.amazon.com/s?k=${encodeURIComponent(selectedProduct.brand + ' ' + selectedProduct.name)}&tag=${process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || 'MY_ASSOCIATE_TAG'}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-white"
                style={{ backgroundColor: '#FF9900' }}
              >
                View on Amazon ↗
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* My Product Modal */}
      <AnimatePresence>
        {selectedMyProduct && (
          <ProductDetailModal
            product={selectedMyProduct}
            onClose={() => setSelectedMyProduct(null)}
          />
        )}
      </AnimatePresence>

      {/* Barcode Scanner */}
      <AnimatePresence>
        {showScanner && (
          <BarcodeScanner onClose={() => setShowScanner(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
