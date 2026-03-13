'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  SkinType,
  Concern,
  FilterTag,
  Budget,
  ExperienceLevel,
  QuizResults,
  RoutineStep,
  Loadout,
  ProgressLogEntry,
  MyProduct,
  DayLog,
} from '@/types';
import { getEffectiveLevel } from '@/lib/streak';
import type { User } from '@supabase/supabase-js';

interface SkinBaseStore {
  // Quiz State
  currentStep: number;
  quizResults: QuizResults;
  setCurrentStep: (step: number) => void;
  setSkinType: (type: SkinType) => void;
  toggleConcern: (concern: Concern) => void;
  toggleSafetyTag: (tag: FilterTag) => void;
  setBudget: (budget: Budget) => void;
  setExperience: (level: ExperienceLevel) => void;
  completeQuiz: () => void;
  resetQuiz: () => void;

  // Product Filters
  activeFilters: FilterTag[];
  searchQuery: string;
  selectedBudget: Budget | null;
  toggleFilter: (filter: FilterTag) => void;
  clearFilters: () => void;
  setSearchQuery: (query: string) => void;
  setSelectedBudget: (budget: Budget | null) => void;

  // Routine State
  currentRoutine: RoutineStep[];
  activeRoutineStep: number;
  routineTimeOfDay: 'am' | 'pm';
  isRoutineActive: boolean;
  setRoutine: (steps: RoutineStep[]) => void;
  startRoutine: () => void;
  completeStep: (stepIndex: number) => void;
  nextStep: () => void;
  resetRoutine: () => void;
  setTimeOfDay: (time: 'am' | 'pm') => void;

  // Loadouts
  loadouts: Loadout[];
  addLoadout: (loadout: Loadout) => void;
  removeLoadout: (id: string) => void;
  updateLoadout: (id: string, updates: Partial<Loadout>) => void;

  // Progress Log
  progressLog: ProgressLogEntry[];
  logEntry: (entry: ProgressLogEntry) => void;
  removeLogEntry: (id: string) => void;
  getStreak: () => number;
  getTodayLogs: () => ProgressLogEntry[];
  getLast7Days: () => { date: string; active: boolean }[];

  // My Products (scanned/manual)
  myProducts: MyProduct[];
  addMyProduct: (product: MyProduct) => void;
  removeMyProduct: (id: string) => void;

  // UI State
  showQuiz: boolean;
  setShowQuiz: (show: boolean) => void;

  // Auth state
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  syncWithSupabase: () => Promise<void>;

  // Premium
  isPro: boolean;
  setIsPro: (pro: boolean) => void;

  // Education / Experience Level
  firstLogDate: string | null; // YYYY-MM-DD
  levelUpDate: string | null; // date when user hit 14 days
  unlockedActives: string[];
  hasSeenLevelUp: boolean;
  getDaysLogged: () => number;
  getUniqueDaysLogged: () => number;
  checkAndUnlockActives: () => boolean; // returns true if just unlocked
  dismissLevelUp: () => void;

  // New: DayLog-based routine tracking
  routineLogs: DayLog[];
  logRoutine: (type: 'am' | 'pm', date?: string) => void;
  getDayLog: (date: string) => DayLog | undefined;
  getTodayStatus: () => { amDone: boolean; pmDone: boolean };
  calculateStreak: () => number;
  getLevel: () => 1 | 2 | 3 | 4;
  getDaysLoggedTotal: () => number;

  // User name for greeting
  userName: string | null;
  setUserName: (name: string) => void;

  // Routine product slots (user selections)
  amSlots: Record<string, string>; // slotType -> productId
  pmSlots: Record<string, string>;
  setSlotProduct: (timeOfDay: 'am' | 'pm', slotType: string, productId: string) => void;

  // Progress Photos
  progressPhotos: { id: string; date: string; dataUrl: string; note?: string }[];
  avatarDataUrl: string | null;
  addProgressPhoto: (dataUrl: string, note?: string) => void;
  removeProgressPhoto: (id: string) => void;
  setAvatarPhoto: (dataUrl: string | null) => void;

  // Streak Milestones
  shownMilestones: number[];
  addShownMilestone: (n: number) => void;
}

function getDateStr(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

export const useSkinBaseStore = create<SkinBaseStore>()(
  persist(
    (set, get) => ({
      // Quiz State
      currentStep: 0,
      quizResults: {
        skinType: null,
        concerns: [],
        safetyTags: [],
        budget: null,
        experience: null,
        completed: false,
      },
      setCurrentStep: (step) => set({ currentStep: step }),
      setSkinType: (type) =>
        set((state) => ({
          quizResults: { ...state.quizResults, skinType: type },
        })),
      toggleConcern: (concern) =>
        set((state) => {
          const concerns = state.quizResults.concerns.includes(concern)
            ? state.quizResults.concerns.filter((c) => c !== concern)
            : [...state.quizResults.concerns, concern];
          return { quizResults: { ...state.quizResults, concerns } };
        }),
      toggleSafetyTag: (tag) =>
        set((state) => {
          const safetyTags = state.quizResults.safetyTags.includes(tag)
            ? state.quizResults.safetyTags.filter((t) => t !== tag)
            : [...state.quizResults.safetyTags, tag];
          return { quizResults: { ...state.quizResults, safetyTags } };
        }),
      setBudget: (budget) =>
        set((state) => ({
          quizResults: { ...state.quizResults, budget },
        })),
      setExperience: (level) =>
        set((state) => ({
          quizResults: { ...state.quizResults, experience: level },
        })),
      completeQuiz: () =>
        set((state) => ({
          quizResults: { ...state.quizResults, completed: true },
        })),
      resetQuiz: () =>
        set({
          currentStep: 0,
          quizResults: {
            skinType: null,
            concerns: [],
            safetyTags: [],
            budget: null,
            experience: null,
            completed: false,
          },
        }),

      // Product Filters
      activeFilters: [],
      searchQuery: '',
      selectedBudget: null,
      toggleFilter: (filter) =>
        set((state) => ({
          activeFilters: state.activeFilters.includes(filter)
            ? state.activeFilters.filter((f) => f !== filter)
            : [...state.activeFilters, filter],
        })),
      clearFilters: () => set({ activeFilters: [], searchQuery: '', selectedBudget: null }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedBudget: (budget) => set({ selectedBudget: budget }),

      // Routine State
      currentRoutine: [],
      activeRoutineStep: 0,
      routineTimeOfDay: 'am',
      isRoutineActive: false,
      setRoutine: (steps) => set({ currentRoutine: steps }),
      startRoutine: () => set({ isRoutineActive: true, activeRoutineStep: 0 }),
      completeStep: (stepIndex) =>
        set((state) => ({
          currentRoutine: state.currentRoutine.map((step, i) =>
            i === stepIndex ? { ...step, isCompleted: true } : step
          ),
        })),
      nextStep: () =>
        set((state) => ({
          activeRoutineStep: Math.min(
            state.activeRoutineStep + 1,
            state.currentRoutine.length - 1
          ),
        })),
      resetRoutine: () =>
        set({
          isRoutineActive: false,
          activeRoutineStep: 0,
          currentRoutine: [],
        }),
      setTimeOfDay: (time) => set({ routineTimeOfDay: time }),

      // Loadouts
      loadouts: [],
      addLoadout: (loadout) =>
        set((state) => ({ loadouts: [...state.loadouts, loadout] })),
      removeLoadout: (id) =>
        set((state) => ({
          loadouts: state.loadouts.filter((l) => l.id !== id),
        })),
      updateLoadout: (id, updates) =>
        set((state) => ({
          loadouts: state.loadouts.map((l) =>
            l.id === id ? { ...l, ...updates } : l
          ),
        })),

      // Progress Log
      progressLog: [],
      logEntry: (entry) =>
        set((state) => ({
          progressLog: [...state.progressLog, entry],
          firstLogDate: state.firstLogDate || entry.date,
        })),
      removeLogEntry: (id) =>
        set((state) => ({
          progressLog: state.progressLog.filter((e) => e.id !== id),
        })),
      getStreak: () => {
        const { progressLog } = get();
        const uniqueDates = Array.from(new Set(progressLog.map((e) => e.date))).sort().reverse();
        if (uniqueDates.length === 0) return 0;

        let streak = 0;
        const today = new Date();
        const checkDate = new Date(today);

        // If no log today, start checking from yesterday
        if (!uniqueDates.includes(getDateStr(today))) {
          checkDate.setDate(checkDate.getDate() - 1);
          if (!uniqueDates.includes(getDateStr(checkDate))) return 0;
        }

        while (uniqueDates.includes(getDateStr(checkDate))) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        }
        return streak;
      },
      getTodayLogs: () => {
        const { progressLog } = get();
        const today = getDateStr();
        return progressLog.filter((e) => e.date === today);
      },
      getLast7Days: () => {
        const { progressLog } = get();
        const logDates = new Set(progressLog.map((e) => e.date));
        const days: { date: string; active: boolean }[] = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateStr = getDateStr(d);
          days.push({ date: dateStr, active: logDates.has(dateStr) });
        }
        return days;
      },

      // My Products
      myProducts: [],
      addMyProduct: (product) =>
        set((state) => ({ myProducts: [...state.myProducts, product] })),
      removeMyProduct: (id) =>
        set((state) => ({
          myProducts: state.myProducts.filter((p) => p.id !== id),
        })),

      // UI State
      showQuiz: false,
      setShowQuiz: (show) => set({ showQuiz: show }),

      // Auth state
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      syncWithSupabase: async () => {
        const state = get();
        if (!state.user) return;
        // Lazy import to avoid SSR issues
        const { supabase: sb } = await import('@/lib/supabase');
        if (!sb) return;
        const userId = state.user.id;
        // Upsert profile with quiz results
        await sb.from('profiles').upsert({
          id: userId,
          email: state.user.email,
          name: state.userName || null,
          skin_type: state.quizResults.skinType || null,
          concerns: state.quizResults.concerns,
          experience: state.quizResults.experience || null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });
        // Upsert routines (one row per user; use user_id as de-dupe key)
        const { data: existingRoutine } = await sb
          .from('routines')
          .select('id')
          .eq('user_id', userId)
          .maybeSingle();
        if (existingRoutine) {
          await sb.from('routines').update({
            am_slots: state.amSlots,
            pm_slots: state.pmSlots,
            updated_at: new Date().toISOString(),
          }).eq('id', existingRoutine.id);
        } else {
          await sb.from('routines').insert({
            user_id: userId,
            am_slots: state.amSlots,
            pm_slots: state.pmSlots,
          });
        }
        // Upsert checkins for recent routine logs
        const recentLogs = state.routineLogs.slice(-30);
        for (const log of recentLogs) {
          await sb.from('checkins').upsert({
            user_id: userId,
            date: log.date,
            am_done: log.amDone,
            pm_done: log.pmDone,
          }, { onConflict: 'user_id,date' });
        }
      },

      // Premium
      isPro: false,
      setIsPro: (pro) => set({ isPro: pro }),

      // Education / Experience Level
      firstLogDate: null,
      levelUpDate: null,
      unlockedActives: [],
      hasSeenLevelUp: false,
      getDaysLogged: () => {
        const { firstLogDate } = get();
        if (!firstLogDate) return 0;
        const first = new Date(firstLogDate);
        const now = new Date();
        const diff = Math.floor((now.getTime() - first.getTime()) / (1000 * 60 * 60 * 24));
        return Math.max(0, diff);
      },
      getUniqueDaysLogged: () => {
        const { progressLog } = get();
        return new Set(progressLog.map((e) => e.date)).size;
      },
      checkAndUnlockActives: () => {
        const { getUniqueDaysLogged, levelUpDate } = get();
        const uniqueDays = getUniqueDaysLogged();
        if (uniqueDays >= 14 && !levelUpDate) {
          const actives = [
            'Retinol', 'Vitamin C', 'Niacinamide',
            'AHA (Glycolic Acid)', 'BHA (Salicylic Acid)',
            'Hyaluronic Acid', 'Peptides',
          ];
          set({
            levelUpDate: getDateStr(),
            unlockedActives: actives,
            hasSeenLevelUp: false,
          });
          return true;
        }
        return false;
      },
      dismissLevelUp: () => set({ hasSeenLevelUp: true }),

      // New: DayLog-based routine tracking
      routineLogs: [],
      logRoutine: (type, date) => {
        const targetDate = date || getDateStr();
        set((state) => {
          const existingLog = state.routineLogs.find((l) => l.date === targetDate);
          const now = new Date().toISOString();

          if (existingLog) {
            return {
              routineLogs: state.routineLogs.map((l) =>
                l.date === targetDate
                  ? type === 'am'
                    ? { ...l, amDone: true, amTime: now }
                    : { ...l, pmDone: true, pmTime: now }
                  : l
              ),
              firstLogDate: state.firstLogDate || targetDate,
            };
          } else {
            const newLog: DayLog = {
              date: targetDate,
              amDone: type === 'am',
              amTime: type === 'am' ? now : undefined,
              pmDone: type === 'pm',
              pmTime: type === 'pm' ? now : undefined,
            };
            return {
              routineLogs: [...state.routineLogs, newLog],
              firstLogDate: state.firstLogDate || targetDate,
            };
          }
        });
      },
      getDayLog: (date) => {
        const { routineLogs } = get();
        return routineLogs.find((l) => l.date === date);
      },
      getTodayStatus: () => {
        const { routineLogs } = get();
        const today = getDateStr();
        const todayLog = routineLogs.find((l) => l.date === today);
        return {
          amDone: todayLog?.amDone ?? false,
          pmDone: todayLog?.pmDone ?? false,
        };
      },
      calculateStreak: () => {
        const { routineLogs } = get();
        if (routineLogs.length === 0) return 0;

        const today = getDateStr();
        let streak = 0;
        let checkDate = today;

        while (true) {
          const log = routineLogs.find((l) => l.date === checkDate);
          if (log && log.amDone && log.pmDone) {
            streak++;
            const d = new Date(checkDate);
            d.setDate(d.getDate() - 1);
            checkDate = getDateStr(d);
          } else {
            break;
          }
        }
        return streak;
      },
      getDaysLoggedTotal: () => {
        const { routineLogs } = get();
        // Count days with at least one routine done
        return routineLogs.filter((l) => l.amDone || l.pmDone).length;
      },
      getLevel: () => {
        const state = get();
        const days = state.getDaysLoggedTotal();
        return getEffectiveLevel(days, state.quizResults.experience);
      },

      // User name
      userName: null,
      setUserName: (name) => set({ userName: name }),

      // Routine product slots
      amSlots: {},
      pmSlots: {},
      setSlotProduct: (timeOfDay, slotType, productId) =>
        set((state) => ({
          [timeOfDay === 'am' ? 'amSlots' : 'pmSlots']: {
            ...(timeOfDay === 'am' ? state.amSlots : state.pmSlots),
            [slotType]: productId,
          },
        })),

      // Progress Photos
      progressPhotos: [],
      avatarDataUrl: null,
      addProgressPhoto: (dataUrl, note) => {
        const id = Date.now().toString();
        const date = new Date().toISOString().split('T')[0];
        set((state) => ({ progressPhotos: [...(state.progressPhotos || []), { id, date, dataUrl, note }] }));
      },
      removeProgressPhoto: (id) => {
        set((state) => ({ progressPhotos: (state.progressPhotos || []).filter((p) => p.id !== id) }));
      },
      setAvatarPhoto: (dataUrl) => set({ avatarDataUrl: dataUrl }),

      // Streak Milestones
      shownMilestones: [],
      addShownMilestone: (n) =>
        set((state) => ({ shownMilestones: [...state.shownMilestones, n] })),
    }),
    {
      name: 'skinbase-store',
      skipHydration: true,
    }
  )
);