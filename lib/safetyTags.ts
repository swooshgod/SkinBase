import { Product } from '@/types';

export type SafetyTag =
  | 'pregnancy-safe'
  | 'fragrance-free'
  | 'non-comedogenic'
  | 'reef-safe'
  | 'cruelty-free'
  | 'vegan'
  | 'dermatologist-tested'
  | 'hypoallergenic'
  | 'alcohol-free'
  | 'mineral SPF';

export const SAFETY_TAG_META: Record<SafetyTag, { label: string; emoji: string; color: string; textColor: string }> = {
  'pregnancy-safe':        { label: 'Pregnancy Safe',        emoji: '🤰', color: '#fdf4ff', textColor: '#a21caf' },
  'fragrance-free':        { label: 'Fragrance Free',        emoji: '🚫', color: '#f0fdf4', textColor: '#15803d' },
  'non-comedogenic':       { label: 'Non-Comedogenic',       emoji: '🧴', color: '#eff6ff', textColor: '#1d4ed8' },
  'reef-safe':             { label: 'Reef Safe',             emoji: '🌊', color: '#ecfeff', textColor: '#0e7490' },
  'cruelty-free':          { label: 'Cruelty Free',          emoji: '🐰', color: '#fff7ed', textColor: '#c2410c' },
  'vegan':                 { label: 'Vegan',                 emoji: '🌱', color: '#f0fdf4', textColor: '#166534' },
  'dermatologist-tested':  { label: 'Derm Tested',           emoji: '👩‍⚕️', color: '#f0f9ff', textColor: '#0369a1' },
  'hypoallergenic':        { label: 'Hypoallergenic',        emoji: '🌸', color: '#fff1f2', textColor: '#be123c' },
  'alcohol-free':          { label: 'Alcohol Free',          emoji: '✓',  color: '#f8fafc', textColor: '#475569' },
  'mineral SPF':           { label: 'Mineral SPF',           emoji: '⛏️', color: '#fef9c3', textColor: '#854d0e' },
};

// Brands known for specific certifications
const FRAGRANCE_FREE_BRANDS = ['cerave', 'la roche-posay', 'eltamd', 'vanicream', 'first aid beauty', 'aveeno', 'cetaphil'];
const DERM_TESTED_BRANDS    = ['cerave', 'la roche-posay', 'eltamd', 'neutrogena', 'cetaphil', 'avene', 'eucerin'];
const CRUELTY_FREE_BRANDS   = ['the ordinary', "paula's choice", 'biossance', 'some by mi', 'tatcha', 'drunk elephant', 'inkey list', 'farmacy'];
const VEGAN_BRANDS          = ['the ordinary', 'biossance', 'drunk elephant', 'farmacy', 'youth to the people'];
const MINERAL_SPF_BRANDS    = ['eltamd', 'blue lizard', 'badger', 'coola'];
const NON_COMEDOGENIC_BRANDS = ['cerave', 'la roche-posay', 'neutrogena', 'eltamd', 'first aid beauty'];

// Ingredients / keywords that disqualify pregnancy-safe
const PREGNANCY_UNSAFE_KEYWORDS = [
  'retinol', 'retinoid', 'retinoic', 'tretinoin', 'salicylic', 'bha',
  'hydroquinone', 'benzoyl peroxide', 'formaldehyde', 'chemical spf',
  'oxybenzone', 'avobenzone',
];

export function getSafetyTags(product: Product): SafetyTag[] {
  const brand = product.brand.toLowerCase();
  const name  = product.name.toLowerCase();
  const combined = `${brand} ${name}`;
  const tags: SafetyTag[] = [];

  // Fragrance-free
  if (
    FRAGRANCE_FREE_BRANDS.some((b) => brand.includes(b)) ||
    combined.includes('fragrance-free') ||
    combined.includes('unscented')
  ) {
    tags.push('fragrance-free');
  }

  // Dermatologist-tested
  if (DERM_TESTED_BRANDS.some((b) => brand.includes(b))) {
    tags.push('dermatologist-tested');
  }

  // Cruelty-free
  if (CRUELTY_FREE_BRANDS.some((b) => brand.includes(b))) {
    tags.push('cruelty-free');
  }

  // Vegan
  if (VEGAN_BRANDS.some((b) => brand.includes(b))) {
    tags.push('vegan');
  }

  // Non-comedogenic
  if (
    NON_COMEDOGENIC_BRANDS.some((b) => brand.includes(b)) ||
    combined.includes('non-comedogenic') ||
    combined.includes('noncomedogenic')
  ) {
    tags.push('non-comedogenic');
  }

  // Mineral SPF / Reef-safe (sunscreens only)
  if (product.category === 'sunscreen') {
    const isMineralBrand = MINERAL_SPF_BRANDS.some((b) => brand.includes(b));
    const isMineralName  = combined.includes('mineral') || combined.includes('zinc') || combined.includes('tint');
    if (isMineralBrand || isMineralName) {
      tags.push('mineral SPF');
      tags.push('reef-safe');
    }
  }

  // Pregnancy-safe — no unsafe keywords in name, not a retinol/treatment product
  const isPregnancySafe = !PREGNANCY_UNSAFE_KEYWORDS.some((kw) => combined.includes(kw));
  if (
    isPregnancySafe &&
    (product.category === 'cleanser' ||
     product.category === 'moisturizer' ||
     product.category === 'sunscreen' ||
     product.category === 'toner' ||
     product.category === 'eye_cream' ||
     product.category === 'mask')
  ) {
    tags.push('pregnancy-safe');
  }

  // Hypoallergenic — La Roche-Posay Toleriane line, Vanicream, EltaMD
  if (
    combined.includes('toleriane') ||
    combined.includes('vanicream') ||
    combined.includes('eltamd') ||
    combined.includes('hypoallergenic')
  ) {
    tags.push('hypoallergenic');
  }

  // Alcohol-free — known alcohol-free lines
  if (
    combined.includes('alcohol-free') ||
    FRAGRANCE_FREE_BRANDS.some((b) => brand.includes(b)) // most gentle brands are also alcohol-free
  ) {
    tags.push('alcohol-free');
  }

  return tags.filter((tag, i, arr) => arr.indexOf(tag) === i); // deduplicate
}
