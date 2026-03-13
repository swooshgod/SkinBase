export type SkinType = 'oily' | 'dry' | 'combo' | 'sensitive' | 'normal';

export type Concern =
  | 'acne' | 'aging' | 'hyperpigmentation' | 'redness'
  | 'texture' | 'dark_spots' | 'fine_lines' | 'pores'
  | 'dullness' | 'dehydration';

export type SafetyTag =
  | 'pregnancy_safe' | 'breastfeeding_safe' | 'fungal_safe'
  | 'fragrance_free' | 'vegan' | 'cruelty_free'
  | 'clean_beauty' | 'reef_safe';

export type ConditionTag =
  | 'acne_prone' | 'rosacea' | 'eczema' | 'psoriasis' | 'sensitive';

export type LifeStageTag =
  | 'pregnancy_safe' | 'breastfeeding_safe' | 'menopause' | 'teen';

export type FilterTag = SafetyTag | ConditionTag | LifeStageTag |
  'anti_aging' | 'brightening' | 'hydration' | 'oil_control' | 'pore_minimizing' | 'dark_spots' | 'redness';

export type Budget = 'drugstore' | 'midrange' | 'luxury';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export type ProductCategory =
  | 'cleanser' | 'toner' | 'serum' | 'moisturizer'
  | 'sunscreen' | 'treatment' | 'mask' | 'oil' | 'exfoliant' | 'eye_cream';

export type TimeOfDay = 'am' | 'pm';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  image_url: string;
  price_tier: Budget;
  price_usd: number;
  benefits: string[];
  targets: string[];
  pregnancy_safe: boolean;
  fungal_safe: boolean;
  fragrance_free: boolean;
  vegan: boolean;
  cruelty_free: boolean;
  ingredient_score: number;
  efficacy_score: number;
  key_actives: string[];
  avoid_with: string[];
  routine_step: number; // order in routine
  time_of_day: TimeOfDay | 'both';
  application_instructions: string;
  why_this_step: string;
  wait_time_seconds?: number;
  for_skin_types: SkinType[];
  for_concerns: Concern[];
  tags: FilterTag[];
  // Amazon integration
  amazonASIN?: string;
  amazonImageUrl?: string;
  amazonAffiliateLink?: string;
}

export interface QuizResults {
  skinType: SkinType | null;
  concerns: Concern[];
  safetyTags: FilterTag[];
  budget: Budget | null;
  experience: ExperienceLevel | null;
  completed: boolean;
}

export interface RoutineStep {
  product: Product;
  stepNumber: number;
  isCompleted: boolean;
}

export interface Loadout {
  id: string;
  name: string;
  timeOfDay: TimeOfDay | 'both';
  productIds: string[];
  createdAt: string;
}

export interface ProgressLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  loadoutId?: string;
  loadoutName?: string;
  timeOfDay: TimeOfDay;
  createdAt: string;
}

export interface MyProduct {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price_usd: number;
  ingredients: string[];
  ingredientScore: number;
  ingredientRating: 'excellent' | 'good' | 'fair' | 'poor';
  concerns: string[];
  benefits: string[];
  conflicts: string[];
  barcode?: string;
  source: 'scan' | 'manual';
  createdAt: string;
}

// New: DayLog for AM/PM tracking
export interface DayLog {
  date: string; // YYYY-MM-DD
  amDone: boolean;
  amTime?: string;
  pmDone: boolean;
  pmTime?: string;
}

// Routine slot for display
export interface RoutineSlot {
  slotType: string;
  category: ProductCategory;
  emoji: string;
  product: Product | null;
  isLocked: boolean;
  unlocksAtLevel: number;
}
