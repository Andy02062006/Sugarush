import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, GlucoseLog, Badge, MealLog, MOCK_LOGS, MOCK_BADGES, MOCK_MEAL_LOGS, Reward, MOCK_REWARDS } from '../lib/mocks';

interface AppState {
  // USER slice
  profile: UserProfile | null;
  isLoggedIn: boolean;
  setUser: (user: UserProfile) => void;
  logout: () => void;
  
  // GLUCOSE slice
  currentReading: number;
  logs: GlucoseLog[];
  addLog: (log: Omit<GlucoseLog, 'id'>) => void;
  deleteLog: (id: string) => void;
  
  // GAMIFICATION slice
  xp: number;
  streak: number;
  badges: Badge[];
  redeemedRewards: string[]; // array of reward IDs
  addXP: (amount: number) => void;
  incrementStreak: () => void;
  unlockBadge: (badgeId: string) => void;
  redeemReward: (rewardId: string, cost: number) => void;

  // MEAL slice
  mealLogs: MealLog[];
  addMealLog: (log: Omit<MealLog, 'id'>) => void;
  deleteMealLog: (id: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // USER slice
      profile: null,
      isLoggedIn: false,
      setUser: (user) => set({ profile: user, isLoggedIn: true }),
      logout: () => set({ profile: null, isLoggedIn: false, logs: [], xp: 0, streak: 0 }),
      
      // GLUCOSE slice
      currentReading: MOCK_LOGS[0]?.value || 0,
      logs: MOCK_LOGS,
      addLog: (logData) => set((state) => {
        const newLog: GlucoseLog = {
          ...logData,
          id: Date.now().toString(),
        };
        return {
          logs: [newLog, ...state.logs],
          currentReading: newLog.value,
        };
      }),
      deleteLog: (id) => set((state) => ({
        logs: state.logs.filter(log => log.id !== id)
      })),
      
      // GAMIFICATION slice
      xp: 850,
      streak: 7,
      badges: MOCK_BADGES,
      redeemedRewards: [],
      addXP: (amount) => set((state) => ({ xp: state.xp + amount })),
      incrementStreak: () => set((state) => ({ streak: state.streak + 1 })),
      unlockBadge: (badgeId) => set((state) => {
        const updatedBadges = state.badges.map(b => 
          b.id === badgeId ? { ...b, unlockedAt: new Date().toISOString() } : b
        );
        return { badges: updatedBadges };
      }),
      redeemReward: (rewardId, cost) => set((state) => {
        if (state.xp >= cost && !state.redeemedRewards.includes(rewardId)) {
          return {
            xp: state.xp - cost,
            redeemedRewards: [...state.redeemedRewards, rewardId],
          };
        }
        return state;
      }),

      // MEAL slice
      mealLogs: MOCK_MEAL_LOGS,
      addMealLog: (logData) => set((state) => {
        const newLog: MealLog = {
          ...logData,
          id: `ml-${Date.now()}`,
        };
        return { mealLogs: [newLog, ...state.mealLogs] };
      }),
      deleteMealLog: (id) => set((state) => ({
        mealLogs: state.mealLogs.filter(m => m.id !== id),
      })),
    }),
    {
      name: 'sugarush-storage',
    }
  )
);
