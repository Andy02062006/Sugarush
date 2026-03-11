import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, GlucoseLog, Badge, MealLog, MOCK_LOGS, MOCK_BADGES, MOCK_MEAL_LOGS, Reward, MOCK_REWARDS } from '../lib/mocks';

interface AppState {
  // USER slice
  profile: UserProfile | null;
  isLoggedIn: boolean;
  setUser: (user: UserProfile) => void;
  logout: () => void;
  fetchUserData: () => Promise<void>;
  
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
      
      fetchUserData: async () => {
        try {
          const [gRes, mRes, rRes, uRes] = await Promise.all([
            fetch('/api/glucose'),
            fetch('/api/meals'),
            fetch('/api/rewards'),
            fetch('/api/user')
          ]);

          if (gRes.ok) {
            const logs = await gRes.json();
            set({ logs, currentReading: logs[0]?.value || 0 });
          }
          if (mRes.ok) {
            const mealLogs = await mRes.json();
            set({ mealLogs });
          }
          if (rRes.ok) {
            const rewards = await rRes.json();
            set({ redeemedRewards: rewards.map((r: any) => r.rewardId) });
          }
          if (uRes.ok) {
            const user = await uRes.json();
            
            // Forcefully overwrite any stale mock data in `profile` with real DB entries
            set({
              profile: {
                name: user.name,
                diabetesType: user.profile?.diabetesType || 'Type 2',
                age: user.profile?.age || 35,
                targetRangeMin: user.profile?.targetRangeMin || 70,
                targetRangeMax: user.profile?.targetRangeMax || 140,
              },
              xp: user.profile?.xp || 0,
              streak: user.profile?.streak || 0,
              isLoggedIn: true
            });
          }
        } catch (error) {
          console.error('Failed to fetch user data', error);
        }
      },

      // GLUCOSE slice
      currentReading: MOCK_LOGS[0]?.value || 0,
      logs: MOCK_LOGS,
      addLog: async (logData) => {
        const tempId = `temp-${Date.now()}`;
        const newLog: GlucoseLog = { ...logData, id: tempId, timestamp: new Date().toISOString() };
        
        // Optimistic update
        set((state) => ({
          logs: [newLog, ...state.logs],
          currentReading: newLog.value,
        }));

        try {
          const res = await fetch('/api/glucose', {
            method: 'POST',
            body: JSON.stringify(newLog) // Send stringified JSON
          });
          if (res.ok) {
            const savedLog = await res.json();
            set((state) => ({
              logs: state.logs.map(l => l.id === tempId ? savedLog : l),
              xp: state.xp + 10 // Mock matching what the API does
            }));
          }
        } catch (e) {
          console.error(e);
        }
      },
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
      redeemReward: async (rewardId, cost) => {
        set((state) => {
          if (state.xp >= cost && !state.redeemedRewards.includes(rewardId)) {
            return {
              xp: state.xp - cost,
              redeemedRewards: [...state.redeemedRewards, rewardId],
            };
          }
          return state;
        });

        try {
          await fetch('/api/rewards', {
            method: 'POST',
            body: JSON.stringify({ rewardId, cost })
          });
        } catch (e) {
          console.error(e);
        }
      },

      // MEAL slice
      mealLogs: MOCK_MEAL_LOGS,
      addMealLog: async (logData) => {
        const tempId = `ml-temp-${Date.now()}`;
        const newLog: MealLog = { ...logData, id: tempId, timestamp: new Date().toISOString() };
        
        // Optimistic update
        set((state) => ({ mealLogs: [newLog, ...state.mealLogs] }));

        try {
          const res = await fetch('/api/meals', {
            method: 'POST',
            body: JSON.stringify(newLog)
          });
          if (res.ok) {
            const savedLog = await res.json();
            set(state => ({
              mealLogs: state.mealLogs.map(m => m.id === tempId ? savedLog : m)
            }));
          }
        } catch(e) { console.error(e); }
      },
      deleteMealLog: (id) => set((state) => ({
        mealLogs: state.mealLogs.filter(m => m.id !== id),
      })),
    }),
    {
      name: 'sugarush-storage',
    }
  )
);
