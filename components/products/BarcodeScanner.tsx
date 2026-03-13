'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Html5Qrcode } from 'html5-qrcode';
import { scoreIngredients, IngredientScore } from '@/lib/ingredientScorer';
import { useSkinBaseStore } from '@/lib/store';
import { MyProduct, ProductCategory } from '@/types';

interface ScannedProduct {
  name: string;
  brand: string;
  ingredients: string[];
  barcode: string;
  category?: string;
}

interface BarcodeScannerProps {
  onClose: () => void;
}

export default function BarcodeScanner({ onClose }: BarcodeScannerProps) {
  const [scanning, setScanning] = useState(true);
  const [loading, setLoading] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<ScannedProduct | null>(null);
  const [ingredientScore, setIngredientScore] = useState<IngredientScore | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<string>('barcode-reader-' + Math.random().toString(36).slice(2));
  const { addMyProduct } = useSkinBaseStore();

  useEffect(() => {
    let mounted = true;

    const startScanner = async () => {
      try {
        const html5QrCode = new Html5Qrcode(containerRef.current);
        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 150 },
            aspectRatio: 1.0,
          },
          async (decodedText) => {
            if (!mounted) return;
            // Stop scanning on success
            await html5QrCode.stop();
            scannerRef.current = null;
            setScanning(false);
            handleBarcode(decodedText);
          },
          () => {
            // Scan failure — ignore, keep scanning
          }
        );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_e) {
        if (mounted) {
          setError('Could not access camera. Please allow camera permissions.');
          setScanning(false);
        }
      }
    };

    startScanner();

    return () => {
      mounted = false;
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, []);

  const handleBarcode = async (barcode: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `https://world.openbeautyfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json`
      );
      const data = await res.json();

      if (data.status === 1 && data.product) {
        const p = data.product;
        const ingredientsList: string[] = p.ingredients_text
          ? p.ingredients_text.split(',').map((i: string) => i.trim()).filter(Boolean)
          : [];

        const product: ScannedProduct = {
          name: p.product_name || 'Unknown Product',
          brand: p.brands || 'Unknown Brand',
          ingredients: ingredientsList,
          barcode,
          category: p.categories_tags?.[0]?.replace('en:', '') || undefined,
        };

        setScannedProduct(product);

        if (ingredientsList.length > 0) {
          const score = scoreIngredients(ingredientsList);
          setIngredientScore(score);
        }
      } else {
        setError('Product not in database — add it manually');
      }
    } catch {
      setError('Failed to look up product. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    if (!scannedProduct) return;

    const score = ingredientScore || scoreIngredients(scannedProduct.ingredients);

    const myProduct: MyProduct = {
      id: crypto.randomUUID(),
      name: scannedProduct.name,
      brand: scannedProduct.brand,
      category: (scannedProduct.category as ProductCategory) || 'treatment',
      price_usd: 0,
      ingredients: scannedProduct.ingredients,
      ingredientScore: score.score,
      ingredientRating: score.rating,
      concerns: score.concerns,
      benefits: score.benefits,
      conflicts: score.conflicts,
      barcode: scannedProduct.barcode,
      source: 'scan',
      createdAt: new Date().toISOString(),
    };

    addMyProduct(myProduct);
    onClose();
  };

  const scoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const ratingColor = (rating: string) => {
    if (rating === 'excellent') return 'text-green-600';
    if (rating === 'good') return 'text-yellow-600';
    if (rating === 'fair') return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4" style={{ background: 'linear-gradient(135deg, #1B2B4B, #111C30)' }}>
        <h2 className="text-white font-bold text-lg">Scan Product</h2>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white p-2 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Scanner Area */}
      {scanning && (
        <div className="flex-1 relative flex items-center justify-center bg-black">
          <div id={containerRef.current} className="w-full max-w-md" />

          {/* Scanning overlay */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-64 h-40 relative">
              {/* Animated corners */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#253860] rounded-tl-lg animate-pulse" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#253860] rounded-tr-lg animate-pulse" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#253860] rounded-bl-lg animate-pulse" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#253860] rounded-br-lg animate-pulse" />
              {/* Scanning line */}
              <motion.div
                className="absolute left-2 right-2 h-0.5"
                style={{ background: 'linear-gradient(to right, transparent, #253860, transparent)' }}
                animate={{ top: ['10%', '90%', '10%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </div>

          <div className="absolute bottom-8 left-0 right-0 text-center">
            <p className="text-white/70 text-sm">Point camera at product barcode</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex-1 flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <div className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: '#FBE9E4', borderTopColor: '#1B2B4B' }} />
            <p className="text-slate-600 font-medium">Looking up product...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && !scanning && (
        <div className="flex-1 flex items-center justify-center bg-slate-50 p-6">
          <div className="text-center max-w-sm">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Not Found</h3>
            <p className="text-sm text-slate-500 mb-6">{error}</p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-300 transition-colors"
              >
                Cancel
              </button>
              <a
                href="/products/add"
                className="flex-1 py-3 px-4 text-white rounded-xl font-medium text-center hover:opacity-90 transition-opacity"
                style={{ background: 'linear-gradient(135deg, #1B2B4B, #111C30)' }}
              >
                Add Manually
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Product Found */}
      {scannedProduct && !loading && (
        <div className="flex-1 overflow-y-auto bg-slate-50 p-4">
          <div className="max-w-md mx-auto space-y-4">
            {/* Product Info */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100">
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#1B2B4B' }}>{scannedProduct.brand}</p>
              <h3 className="text-xl font-bold text-slate-800 mt-1">{scannedProduct.name}</h3>
              <p className="text-xs text-slate-400 mt-1">Barcode: {scannedProduct.barcode}</p>
            </div>

            {/* Ingredient Score */}
            {ingredientScore && (
              <div className="bg-white rounded-2xl p-5 border border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-slate-700">Ingredient Score</h4>
                  <span className={`text-2xl font-bold ${ratingColor(ingredientScore.rating)}`}>
                    {ingredientScore.score}
                  </span>
                </div>
                {/* Score bar */}
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${ingredientScore.score}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full rounded-full ${scoreColor(ingredientScore.score)}`}
                  />
                </div>
                <p className={`text-sm font-medium capitalize ${ratingColor(ingredientScore.rating)}`}>
                  {ingredientScore.rating}
                </p>
              </div>
            )}

            {/* Benefits */}
            {ingredientScore && ingredientScore.benefits.length > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-slate-100">
                <h4 className="font-semibold text-slate-700 mb-2">Good For</h4>
                <div className="flex flex-wrap gap-1.5">
                  {ingredientScore.benefits.map((b, i) => (
                    <span key={i} className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Concerns */}
            {ingredientScore && ingredientScore.concerns.length > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-slate-100">
                <h4 className="font-semibold text-slate-700 mb-2">Avoid If Sensitive</h4>
                <div className="flex flex-wrap gap-1.5">
                  {ingredientScore.concerns.map((c, i) => (
                    <span key={i} className="text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded-full">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Conflicts */}
            {ingredientScore && ingredientScore.conflicts.length > 0 && (
              <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
                <h4 className="font-semibold text-amber-800 mb-2">Conflicts</h4>
                {ingredientScore.conflicts.map((c, i) => (
                  <p key={i} className="text-sm text-amber-700">{c}</p>
                ))}
              </div>
            )}

            {/* Ingredients List */}
            {scannedProduct.ingredients.length > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-slate-100">
                <h4 className="font-semibold text-slate-700 mb-2">
                  Ingredients ({scannedProduct.ingredients.length})
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {scannedProduct.ingredients.join(', ')}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2 pb-6">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className="flex-1 py-3 px-4 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
                style={{ background: 'linear-gradient(135deg, #1B2B4B, #111C30)' }}
              >
                Add to My Products
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
