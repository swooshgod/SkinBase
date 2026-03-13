export interface IngredientScore {
  score: number;
  concerns: string[];
  benefits: string[];
  rating: 'excellent' | 'good' | 'fair' | 'poor';
  conflicts: string[];
}

const CONCERNING_INGREDIENTS: Record<string, string> = {
  methylparaben: 'Paraben (preservative, potential endocrine disruptor)',
  propylparaben: 'Paraben (preservative, potential endocrine disruptor)',
  butylparaben: 'Paraben (preservative, potential endocrine disruptor)',
  ethylparaben: 'Paraben (preservative, potential endocrine disruptor)',
  'sodium lauryl sulfate': 'Sulfate (harsh surfactant, can strip skin)',
  'sodium laureth sulfate': 'Sulfate (surfactant, can be irritating)',
  'dmdm hydantoin': 'Formaldehyde releaser (preservative, potential irritant)',
  'quaternium-15': 'Formaldehyde releaser (preservative, potential irritant)',
  'imidazolidinyl urea': 'Formaldehyde releaser (preservative)',
  'diazolidinyl urea': 'Formaldehyde releaser (preservative)',
  fragrance: 'Synthetic fragrance (potential allergen/irritant)',
  parfum: 'Synthetic fragrance (potential allergen/irritant)',
};

const BENEFICIAL_INGREDIENTS: Record<string, string> = {
  'hyaluronic acid': 'Powerful humectant for deep hydration',
  niacinamide: 'Brightening, pore-minimizing, barrier support',
  retinol: 'Gold standard anti-aging active',
  'ascorbic acid': 'Vitamin C — antioxidant, brightening',
  'vitamin c': 'Antioxidant, brightening, collagen support',
  peptides: 'Anti-aging, stimulates collagen production',
  ceramides: 'Barrier repair, moisture retention',
  ceramide: 'Barrier repair, moisture retention',
  glycerin: 'Humectant, draws moisture to skin',
  squalane: 'Lightweight moisturizer, mimics natural sebum',
  squalene: 'Natural moisturizing lipid',
  'glycolic acid': 'AHA — exfoliant, brightening, texture improvement',
  'salicylic acid': 'BHA — unclogs pores, fights acne',
  'lactic acid': 'Gentle AHA — exfoliant, hydrating',
  'mandelic acid': 'Gentle AHA — good for sensitive skin',
  'azelaic acid': 'Brightening, anti-inflammatory, anti-acne',
  'tranexamic acid': 'Targets hyperpigmentation and dark spots',
  'centella asiatica': 'Soothing, barrier repair, anti-inflammatory',
  'green tea': 'Antioxidant, anti-inflammatory',
  'tea tree': 'Antibacterial, anti-acne',
  'zinc oxide': 'SPF active — mineral sunscreen',
  'titanium dioxide': 'SPF active — mineral sunscreen',
  avobenzone: 'SPF active — chemical sunscreen',
  'panthenol': 'Vitamin B5 — soothing, hydrating',
  allantoin: 'Soothing, skin-conditioning',
  'alpha arbutin': 'Brightening, targets dark spots',
  bakuchiol: 'Plant-based retinol alternative',
};

function normalizeIngredient(ingredient: string): string {
  return ingredient.trim().toLowerCase().replace(/\s+/g, ' ');
}

function findMatch(normalized: string, dictionary: Record<string, string>): string | null {
  for (const key of Object.keys(dictionary)) {
    if (normalized.includes(key)) {
      return key;
    }
  }
  return null;
}

export function scoreIngredients(ingredients: string[]): IngredientScore {
  const concerns: string[] = [];
  const benefits: string[] = [];
  const conflicts: string[] = [];
  const foundConcernKeys = new Set<string>();
  const foundBenefitKeys = new Set<string>();

  for (const raw of ingredients) {
    const normalized = normalizeIngredient(raw);

    const concernKey = findMatch(normalized, CONCERNING_INGREDIENTS);
    if (concernKey && !foundConcernKeys.has(concernKey)) {
      foundConcernKeys.add(concernKey);
      concerns.push(CONCERNING_INGREDIENTS[concernKey]);
    }

    const benefitKey = findMatch(normalized, BENEFICIAL_INGREDIENTS);
    if (benefitKey && !foundBenefitKeys.has(benefitKey)) {
      foundBenefitKeys.add(benefitKey);
      benefits.push(BENEFICIAL_INGREDIENTS[benefitKey]);
    }
  }

  // Conflict detection
  const hasRetinol = foundBenefitKeys.has('retinol') || foundBenefitKeys.has('bakuchiol');
  const hasVitaminC = foundBenefitKeys.has('ascorbic acid') || foundBenefitKeys.has('vitamin c');
  const hasAHA = foundBenefitKeys.has('glycolic acid') || foundBenefitKeys.has('lactic acid') || foundBenefitKeys.has('mandelic acid');
  const hasBHA = foundBenefitKeys.has('salicylic acid');

  if (hasRetinol && hasVitaminC) {
    conflicts.push('Contains both Retinol + Vitamin C — use separately (Vitamin C in AM, Retinol in PM)');
  }
  if ((hasAHA || hasBHA) && hasRetinol) {
    conflicts.push('Contains AHA/BHA + Retinol — alternate nights to avoid irritation');
  }

  // Score calculation
  // Start at 70 (neutral), add for benefits, subtract for concerns
  let score = 70;
  score += benefits.length * 5;   // Up to +15-20 for good actives
  score -= concerns.length * 10;  // -10 per concerning ingredient
  score += conflicts.length > 0 ? -5 : 0; // Small penalty for conflicts (not inherently bad, just needs care)

  // Clamp to 0-100
  score = Math.max(0, Math.min(100, score));

  let rating: IngredientScore['rating'];
  if (score >= 80) rating = 'excellent';
  else if (score >= 60) rating = 'good';
  else if (score >= 40) rating = 'fair';
  else rating = 'poor';

  return { score, concerns, benefits, rating, conflicts };
}
