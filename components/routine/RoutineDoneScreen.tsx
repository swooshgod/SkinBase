'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PhotoPicker from '@/components/ui/PhotoPicker';
import { useSkinBaseStore } from '@/lib/store';
import { products as allProducts } from '@/lib/products';

const SKIN_TIPS: Record<string, string[]> = {
  oily: [
    'Don\'t skip moisturizer. Stripping oil signals your skin to produce even more.',
    'Niacinamide reduces sebum production. Give it 6 weeks to see real results.',
    'Wash your pillowcase twice a week — oil and bacteria build up fast.',
    'Blotting papers lift oil without disturbing your SPF. Keep them in your bag.',
  ],
  dry: [
    'Apply moisturizer to damp skin right after washing — it locks in the water.',
    'Avoid hot showers. They strip your skin\'s natural barrier. Go lukewarm.',
    'Facial oils as your last PM step seal everything in for deep overnight repair.',
    'Humectants draw moisture in. Occlusives seal it. You need both.',
  ],
  combination: [
    'You can use different products on different zones — gel on T-zone, cream on cheeks.',
    'Niacinamide balances oil without drying — perfect for combination skin.',
    'Layer thinnest to thickest consistency for maximum absorption.',
    'Exfoliate 1-2x a week to keep pores clear without irritating dry areas.',
  ],
  sensitive: [
    'Fragrance is the #1 cause of skin irritation. Look for fragrance-free formulas.',
    'Patch test new products on your inner arm for 48 hours before applying to face.',
    'Less is more. A 3-step routine done consistently beats a 10-step routine.',
    'Ceramides repair and strengthen your skin barrier — the root of most sensitivity.',
  ],
  normal: [
    'SPF is the most effective anti-aging product. Every single day.',
    'The same 3 products used daily outperform a complicated routine used occasionally.',
    'Vitamin C in the morning + retinol at night = the most powerful long-term combo.',
    'Give any new product 4 weeks before judging results. Skin cells turn over every 28 days.',
  ],
};

const UPGRADE_PRODUCTS: Record<string, { name: string; brand: string; reason: string; asin: string; gradient: string }[]> = {
  oily: [
    { name: 'Niacinamide 10% + Zinc 1%', brand: 'The Ordinary', reason: 'Controls oil & minimizes pores', asin: 'B06Y4C4D6C', gradient: 'linear-gradient(135deg, #E8F4FD, #C7E9F9)' },
    { name: 'BHA Liquid Exfoliant', brand: 'Paula\'s Choice', reason: 'Unclogs pores, reduces blackheads', asin: 'B00949CTQQ', gradient: 'linear-gradient(135deg, #F3F0FF, #E5DFFF)' },
  ],
  dry: [
    { name: 'Hyaluronic Acid 2% + B5', brand: 'The Ordinary', reason: 'Deep hydration, layers under anything', asin: 'B01MTNWPAM', gradient: 'linear-gradient(135deg, #FBE9E4, #F5C4B5)' },
    { name: 'Barrier Relief Overnight Mask', brand: 'First Aid Beauty', reason: 'Repairs moisture barrier while you sleep', asin: 'B00JFHWRGO', gradient: 'linear-gradient(135deg, #FFF0F5, #FFD6E7)' },
  ],
  combination: [
    { name: 'Niacinamide 10% + Zinc 1%', brand: 'The Ordinary', reason: 'Balances oil without drying dry zones', asin: 'B06Y4C4D6C', gradient: 'linear-gradient(135deg, #E8F4FD, #C7E9F9)' },
    { name: 'Hydro Boost Water Gel', brand: 'Neutrogena', reason: 'Lightweight hydration, won\'t clog pores', asin: 'B00NR1YQK4', gradient: 'linear-gradient(135deg, #FBE9E4, #F5C4B5)' },
  ],
  sensitive: [
    { name: 'Toleriane Double Repair', brand: 'La Roche-Posay', reason: 'Derm-tested barrier repair', asin: 'B074BXQVJR', gradient: 'linear-gradient(135deg, #FBE9E4, #F5C4B5)' },
    { name: 'UV Clear SPF 46', brand: 'EltaMD', reason: 'Fragrance-free mineral SPF', asin: 'B002MSN3QQ', gradient: 'linear-gradient(135deg, #FFF8E1, #FFF0C2)' },
  ],
  normal: [
    { name: 'Vitamin C Suspension 23%', brand: 'The Ordinary', reason: 'Brightens & boosts SPF effectiveness', asin: 'B01N9SPQHM', gradient: 'linear-gradient(135deg, #FFF8E1, #FFF0C2)' },
    { name: 'Retinol 0.2% in Squalane', brand: 'The Ordinary', reason: 'Start retinol here — low strength, real results', asin: 'B07K4CTTWS', gradient: 'linear-gradient(135deg, #F3F0FF, #E5DFFF)' },
  ],
};

const AFFILIATE_TAG = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || 'MY_ASSOCIATE_TAG';
const makeAffiliateLink = (asin: string) => `https://www.amazon.com/dp/${asin}?tag=${AFFILIATE_TAG}`;

interface Props { skinType: string; streak?: number; }

const STEP_LABELS: Record<string, string> = {
  cleanser: 'Cleanser',
  moisturizer: 'Moisturizer',
  sunscreen: 'SPF',
  serum: 'Serum',
  treatment: 'Treatment',
  toner: 'Toner',
  eye_cream: 'Eye Cream',
  exfoliant: 'Exfoliant',
  mask: 'Mask',
  oil: 'Face Oil',
  night_cream: 'Night Cream',
};

export default function RoutineDoneScreen({ skinType }: Props) {
  const tips = SKIN_TIPS[skinType] || SKIN_TIPS.normal;
  const products = UPGRADE_PRODUCTS[skinType] || UPGRADE_PRODUCTS.normal;
  const tip = tips[new Date().getDay() % tips.length];
  const { addProgressPhoto } = useSkinBaseStore();
  const [photoLogged, setPhotoLogged] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filterOptions = ['all', 'cleanser', 'serum', 'moisturizer', 'sunscreen', 'toner', 'treatment'];

  const searchResults = useMemo(() => {
    if (!searchQuery && activeFilter === 'all') return [];
    return allProducts
      .filter(p => {
        const matchesSkin = p.for_skin_types.includes(skinType as 'oily' | 'dry' | 'combo' | 'sensitive' | 'normal') || p.for_skin_types.includes('normal');
        const matchesSearch = !searchQuery || 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === 'all' || p.category === activeFilter;
        return matchesSkin && matchesSearch && matchesFilter;
      })
      .slice(0, 8);
  }, [searchQuery, activeFilter, skinType]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pb-6">

      {/* Tip of the day — the hero of this screen */}
      <div className="rounded-2xl p-5 mb-5" style={{ background: 'linear-gradient(135deg, #FFFBF2, #FBE9E4)' }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#1B2B4B' }}>Today&apos;s Tip</p>
        <p className="text-base font-semibold leading-relaxed" style={{ color: '#1C1917' }}>{tip}</p>
      </div>

      {/* Progress Photo Prompt */}
      {!photoLogged && (
        <div className="rounded-2xl p-4 text-center mb-5" style={{ background: '#F5F0EA', border: '1px solid #E7DFD5' }}>
          <p className="text-sm font-semibold mb-1" style={{ color: '#1C1917' }}>📸 Log a progress photo?</p>
          <p className="text-xs mb-3" style={{ color: '#A8A29E' }}>Track how your skin is changing over time</p>
          <div className="flex gap-2 justify-center">
            <PhotoPicker
              onPhoto={(dataUrl) => { addProgressPhoto(dataUrl); setPhotoLogged(true); }}
              facingMode="user"
            >
              <span className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
                style={{ background: 'linear-gradient(135deg, #1B2B4B, #111C30)', display: 'inline-block' }}>
                📷 Take Photo
              </span>
            </PhotoPicker>
            <button onClick={() => setPhotoLogged(true)}
              className="px-4 py-2 rounded-xl text-sm font-medium"
              style={{ background: '#FFFFFF', color: '#A8A29E', border: '1px solid #E7DFD5' }}>
              Skip
            </button>
          </div>
        </div>
      )}
      {photoLogged && (
        <p className="text-xs text-center mb-5" style={{ color: '#E8856A' }}>📸 Photo saved to your progress!</p>
      )}

      {/* Curated recs */}
      <div className="flex items-center justify-between mb-3 px-1">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#A8A29E' }}>Add to your routine</p>
        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: '#FBE9E4', color: '#1B2B4B' }}>
          For {skinType} skin
        </span>
      </div>
      <div className="flex flex-col gap-3 mb-5">
        {products.map((p) => (
          <a
            key={p.asin}
            href={makeAffiliateLink(p.asin)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-2xl p-4 no-underline"
            style={{ background: '#FFFFFF', border: '1px solid #E7DFD5', boxShadow: '0 2px 12px rgba(28,25,23,0.06)' }}
          >
            <div className="rounded-xl flex-shrink-0 overflow-hidden" style={{ width: 56, height: 56, background: p.gradient }}>
              <img
                src={`https://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=${p.asin}&Format=_SL300_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1`}
                alt={p.name}
                style={{ width: 56, height: 56, objectFit: 'contain' }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full"
                  style={{ background: '#F5F0EA', color: '#78716C' }}>
                  {STEP_LABELS[p.asin === 'B06Y4C4D6C' || p.asin === 'B01MTNWPAM' || p.asin === 'B01N9SPQHM' ? 'serum' : p.asin === 'B00949CTQQ' ? 'exfoliant' : p.asin === 'B002MSN3QQ' ? 'sunscreen' : p.asin === 'B07K4CTTWS' ? 'treatment' : p.asin === 'B00JFHWRGO' ? 'night_cream' : 'moisturizer'] || 'Skincare'}
                </span>
              </div>
              <p className="text-xs font-medium" style={{ color: '#78716C' }}>{p.brand}</p>
              <p className="text-sm font-bold leading-snug" style={{ color: '#1C1917' }}>{p.name}</p>
              <p className="text-xs mt-0.5" style={{ color: '#78716C' }}>{p.reason}</p>
            </div>
            <span style={{ color: '#1B2B4B', fontSize: 16, flexShrink: 0 }}>→</span>
          </a>
        ))}
      </div>

      {/* Search & Filter to explore more */}
      <div className="rounded-2xl p-4 mb-4" style={{ background: '#FFFFFF', border: '1px solid #E7DFD5' }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#A8A29E' }}>🔍 Explore More Products</p>
        {/* Search input */}
        <div className="relative mb-3">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#A8A29E' }}>🔍</span>
          <input
            type="text"
            placeholder="Search by name or brand..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: '#F5F0EA', border: '1px solid #E7DFD5', color: '#1C1917' }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: '#A8A29E' }}>✕</button>
          )}
        </div>
        {/* Filter pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {filterOptions.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="flex-shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold transition-all"
              style={{
                background: activeFilter === f ? '#1B2B4B' : '#F5F0EA',
                color: activeFilter === f ? '#FFFFFF' : '#78716C',
              }}
            >
              {f === 'all' ? 'All' : STEP_LABELS[f] || f}
            </button>
          ))}
        </div>

        {/* Results */}
        <AnimatePresence>
          {searchResults.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-3 flex flex-col gap-2">
              {searchResults.map(p => (
                <a
                  key={p.id}
                  href={p.amazonASIN ? makeAffiliateLink(p.amazonASIN) : (p.amazonAffiliateLink || '#')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl p-3 no-underline"
                  style={{ background: '#F5F0EA', border: '1px solid #E7DFD5' }}
                >
                  <div className="w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden" style={{ background: '#FFFFFF' }}>
                    {p.amazonImageUrl && <img src={p.amazonImageUrl} alt={p.name} style={{ width: 40, height: 40, objectFit: 'contain' }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full" style={{ background: '#FBE9E4', color: '#1B2B4B' }}>
                        {STEP_LABELS[p.category] || p.category}
                      </span>
                    </div>
                    <p className="text-xs font-semibold truncate" style={{ color: '#1C1917' }}>{p.name}</p>
                    <p className="text-[10px]" style={{ color: '#78716C' }}>{p.brand}</p>
                  </div>
                  <span style={{ color: '#E8856A', fontSize: 14, flexShrink: 0 }}>→</span>
                </a>
              ))}
            </motion.div>
          )}
          {(searchQuery || activeFilter !== 'all') && searchResults.length === 0 && (
            <p className="text-xs text-center mt-3" style={{ color: '#A8A29E' }}>No matching products found</p>
          )}
        </AnimatePresence>
      </div>

      <p className="text-[10px] text-center mt-2" style={{ color: '#A8A29E' }}>
        As an Amazon Associate, SkinBase earns from qualifying purchases.
      </p>
    </motion.div>
  );
}
