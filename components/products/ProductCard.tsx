'use client';
import { useState } from 'react';
import { Product } from '@/types';
import { getSafetyTags, SAFETY_TAG_META } from '@/lib/safetyTags';

const CATEGORY_COLORS: Record<string, { bg: string; text: string; gradient: string }> = {
  cleanser:    { bg: '#E8F4FD', text: '#0369A1', gradient: 'linear-gradient(135deg, #E8F4FD, #C7E9F9)' },
  moisturizer: { bg: '#F0FAF0', text: '#1B2B4B', gradient: 'linear-gradient(135deg, #FBE9E4, #F5C4B5)' },
  serum:       { bg: '#FFF0F5', text: '#9D174D', gradient: 'linear-gradient(135deg, #FFF0F5, #FFD6E7)' },
  sunscreen:   { bg: '#FFF8E1', text: '#92400E', gradient: 'linear-gradient(135deg, #FFF8E1, #FFF0C2)' },
  toner:       { bg: '#FFF0E6', text: '#9A3412', gradient: 'linear-gradient(135deg, #FFF0E6, #FFD9BD)' },
  exfoliant:   { bg: '#FFF4E6', text: '#C2410C', gradient: 'linear-gradient(135deg, #FFF4E6, #FFEDD5)' },
  mask:        { bg: '#E6FAF8', text: '#0F766E', gradient: 'linear-gradient(135deg, #E6FAF8, #CCFBF1)' },
  eye_cream:   { bg: '#F5F0FF', text: '#7E22CE', gradient: 'linear-gradient(135deg, #F5F0FF, #E9D5FF)' },
  oil:         { bg: '#FFFBE6', text: '#92400E', gradient: 'linear-gradient(135deg, #FFFBE6, #FEF3C7)' },
  treatment:   { bg: '#F3F0FF', text: '#6D28D9', gradient: 'linear-gradient(135deg, #F3F0FF, #E5DFFF)' },
};

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const colors = CATEGORY_COLORS[product.category] || { bg: '#F5F0EA', text: '#78716C', gradient: 'linear-gradient(135deg, #F5F0EA, #EDE5D8)' };
  const imageUrl = product.amazonImageUrl && !imgError ? product.amazonImageUrl : null;
  const safetyTags = getSafetyTags(product);

  return (
    <div
      onClick={onClick}
      className="cursor-pointer active:scale-95 transition-transform duration-150"
      style={{ borderRadius: 16, overflow: 'hidden', background: '#FFFFFF', border: '1px solid #E7DFD5', boxShadow: '0 2px 12px rgba(28,25,23,0.06)' }}
    >
      {/* Image area */}
      <div className="relative" style={{ aspectRatio: '1', background: colors.gradient }}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-contain"
            style={{ padding: 12 }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-black text-6xl opacity-15" style={{ color: colors.text }}>
              {product.brand[0]}
            </span>
          </div>
        )}

        {/* Category pill */}
        <span
          className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider"
          style={{
            background: 'rgba(255,255,255,0.82)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            color: colors.text,
            padding: '2px 7px',
            borderRadius: 20,
          }}
        >
          {product.category.replace('_', ' ')}
        </span>
      </div>

      {/* Info */}
      <div style={{ padding: '10px 12px 12px' }}>
        <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#1B2B4B', marginBottom: 2 }}>
          {product.brand}
        </p>
        <p className="line-clamp-2 text-[13px] font-semibold" style={{ color: '#1C1917', lineHeight: 1.35 }}>
          {product.name}
        </p>
        <p className="text-[11px] mt-1.5" style={{ color: '#A8A29E' }}>
          ${product.price_usd.toFixed(2)} · {product.price_tier}
        </p>
        {/* Skin type tags */}
        {product.for_skin_types && product.for_skin_types.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {product.for_skin_types.map((type) => (
              <span key={type} style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', background: '#F5F0EA', color: '#78716C', borderRadius: 20, padding: '2px 6px' }}>
                {type}
              </span>
            ))}
          </div>
        )}
        {/* Safety / certification tags */}
        {safetyTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {safetyTags.slice(0, 3).map((tag) => {
              const meta = SAFETY_TAG_META[tag];
              return (
                <span key={tag} style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.03em', background: meta.color, color: meta.textColor, borderRadius: 20, padding: '2px 6px' }}>
                  {meta.emoji} {meta.label}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Export affiliate URL helper for use in modals
export function getProductAffiliateUrl(product: Product): string {
  const tag = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || 'MY_ASSOCIATE_TAG';
  return product.amazonASIN
    ? `https://www.amazon.com/dp/${product.amazonASIN}?tag=${tag}`
    : `https://www.amazon.com/s?k=${encodeURIComponent(product.brand + ' ' + product.name)}&tag=${tag}`;
}
