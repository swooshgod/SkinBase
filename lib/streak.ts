import { DayLog } from '@/types';

function getDateStr(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

/**
 * Calculate streak: consecutive days where BOTH AM and PM are done
 * Starting from today going backwards
 */
export function calculateStreak(logs: DayLog[]): number {
  if (logs.length === 0) return 0;

  const today = getDateStr();
  let streak = 0;
  let checkDate = today;

  while (true) {
    const log = logs.find((l) => l.date === checkDate);
    if (log && log.amDone && log.pmDone) {
      streak++;
      // Go back one day
      const d = new Date(checkDate);
      d.setDate(d.getDate() - 1);
      checkDate = getDateStr(d);
    } else {
      break;
    }
  }
  return streak;
}

/**
 * Check if retroactive logging is allowed (within 24 hours)
 */
export function canRetroLog(routineType: 'am' | 'pm', date: string): boolean {
  // Build the expected time for that routine
  // AM routine would be expected around 8 AM
  // PM routine would be expected around 9 PM
  const logTime = new Date(date);
  if (routineType === 'am') {
    logTime.setHours(8, 0, 0, 0);
  } else {
    logTime.setHours(21, 0, 0, 0);
  }

  const now = new Date();
  const hoursDiff = (now.getTime() - logTime.getTime()) / (1000 * 60 * 60);
  return hoursDiff <= 24 && hoursDiff >= 0;
}

/**
 * Get yesterday's date string
 */
export function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return getDateStr(d);
}

/**
 * Get today's date string
 */
export function getToday(): string {
  return getDateStr();
}

/**
 * Check if it's morning (before noon)
 */
export function isMorning(): boolean {
  return new Date().getHours() < 12;
}

/**
 * Check if it's afternoon (noon to 6pm)
 */
export function isAfternoon(): boolean {
  const hour = new Date().getHours();
  return hour >= 12 && hour < 18;
}

/**
 * Check if it's evening (after 6pm)
 */
export function isEvening(): boolean {
  return new Date().getHours() >= 18;
}

/**
 * Get the suggested routine type based on time of day
 */
export function getSuggestedRoutineType(): 'am' | 'pm' | 'both' {
  if (isMorning()) return 'am';
  if (isEvening()) return 'pm';
  return 'both'; // afternoon - show toggle
}

/**
 * Get greeting based on time of day
 */
export function getGreeting(): { text: string; emoji: string } {
  const hour = new Date().getHours();
  if (hour < 12) return { text: 'Good morning', emoji: '☀️' };
  if (hour < 18) return { text: 'Good afternoon', emoji: '🌤️' };
  return { text: 'Good evening', emoji: '🌙' };
}

/**
 * Get level based on total days logged
 */
export function getLevel(daysLogged: number): 1 | 2 | 3 | 4 {
  if (daysLogged >= 60) return 4;
  if (daysLogged >= 30) return 3;
  if (daysLogged >= 14) return 2;
  return 1;
}

/**
 * Get days remaining until next level
 */
export function getDaysToNextLevel(daysLogged: number): number {
  if (daysLogged >= 60) return 0;
  if (daysLogged >= 30) return 60 - daysLogged;
  if (daysLogged >= 14) return 30 - daysLogged;
  return 14 - daysLogged;
}

/**
 * Format day of week
 */
export function getDayOfWeek(date: Date = new Date()): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}

/**
 * Format date like "Thursday, March 12"
 */
export function formatDateFull(date: Date = new Date()): string {
  const dayOfWeek = getDayOfWeek(date);
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  const day = date.getDate();
  return `${dayOfWeek}, ${month} ${day}`;
}

/**
 * Convert quiz experience string to numeric level
 */
export function quizExperienceToLevel(experience: string | null): 1 | 2 | 3 | 4 {
  if (experience === 'advanced') return 3;
  if (experience === 'intermediate') return 2;
  return 1;
}

/**
 * Get effective level — the higher of progress level and quiz experience level
 */
export function getEffectiveLevel(daysLogged: number, experience: string | null): 1 | 2 | 3 | 4 {
  const progressLevel = getLevel(daysLogged);
  const quizLevel = quizExperienceToLevel(experience);
  return Math.max(progressLevel, quizLevel) as 1 | 2 | 3 | 4;
}
