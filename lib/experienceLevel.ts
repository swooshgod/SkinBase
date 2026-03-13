import { ExperienceLevel, ProductCategory } from '@/types';

export const BEGINNER_UNLOCK_DAYS = 14;

export const BEGINNER_ALLOWED_CATEGORIES: ProductCategory[] = [
  'cleanser',
  'moisturizer',
  'sunscreen',
];

export const ACTIVE_CATEGORIES: ProductCategory[] = [
  'serum',
  'treatment',
  'exfoliant',
  'mask',
  'oil',
  'toner',
  'eye_cream',
];

export const UNLOCKABLE_INGREDIENTS = [
  'Retinol',
  'Vitamin C',
  'Niacinamide',
  'AHA (Glycolic Acid)',
  'BHA (Salicylic Acid)',
  'Hyaluronic Acid',
  'Peptides',
];

export interface LevelInfo {
  level: ExperienceLevel;
  label: string;
  description: string;
  minDays: number;
  color: string;
  bgColor: string;
}

export const LEVELS: LevelInfo[] = [
  {
    level: 'beginner',
    label: 'Beginner',
    description: 'Building the basics — cleanse, moisturize, protect',
    minDays: 0,
    color: '#1B2B4B',
    bgColor: '#F5F0EA',
  },
  {
    level: 'intermediate',
    label: 'Intermediate',
    description: 'Exploring serums, actives, and layering',
    minDays: 14,
    color: '#1B2B4B',
    bgColor: '#FBE9E4',
  },
  {
    level: 'advanced',
    label: 'Advanced',
    description: 'Full routine mastery with targeted treatments',
    minDays: 42,
    color: '#E8856A',
    bgColor: '#FBE9E4',
  },
];

export function getLevelForDays(daysLogged: number): LevelInfo {
  if (daysLogged >= 42) return LEVELS[2];
  if (daysLogged >= 14) return LEVELS[1];
  return LEVELS[0];
}

export function getDaysUntilNextLevel(daysLogged: number): number | null {
  if (daysLogged >= 42) return null; // max level
  if (daysLogged >= 14) return 42 - daysLogged;
  return 14 - daysLogged;
}

export function getProgressToNextLevel(daysLogged: number): number {
  if (daysLogged >= 42) return 100;
  if (daysLogged >= 14) return ((daysLogged - 14) / (42 - 14)) * 100;
  return (daysLogged / 14) * 100;
}

export function isBeginnerLocked(
  experience: ExperienceLevel | null,
  daysLogged: number
): boolean {
  return experience === 'beginner' && daysLogged < BEGINNER_UNLOCK_DAYS;
}

export function isCategoryLocked(
  category: ProductCategory,
  experience: ExperienceLevel | null,
  daysLogged: number
): boolean {
  if (!isBeginnerLocked(experience, daysLogged)) return false;
  return !BEGINNER_ALLOWED_CATEGORIES.includes(category);
}

/**
 * Get the effective level info — the higher of progress level and quiz experience
 */
export function getEffectiveLevelInfo(daysLogged: number, experience: string | null): LevelInfo {
  const progressLevel = getLevelForDays(daysLogged);
  if (experience === 'advanced' && progressLevel.level !== 'advanced') {
    return LEVELS[2]; // advanced
  }
  if (experience === 'intermediate' && progressLevel.level === 'beginner') {
    return LEVELS[1]; // intermediate
  }
  return progressLevel;
}
