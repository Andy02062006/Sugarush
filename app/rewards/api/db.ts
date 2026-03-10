// In-memory database to simulate a gamification backend isolated within the rewards folder
// Note: This will reset whenever the Next.js server restarts

export interface GamificationState {
  xp: number;
  streak: number;
  redeemedRewards: string[]; // Array of Reward IDs
}

let dbState: GamificationState = {
  xp: 1500, // Starting seed capital
  streak: 12,
  redeemedRewards: []
};

export const db = {
  getState: () => ({ ...dbState }),

  // Securely deduct XP and record redeemed item
  redeemReward: (rewardId: string, cost: number) => {
    if (dbState.xp >= cost && !dbState.redeemedRewards.includes(rewardId)) {
      dbState = {
        ...dbState,
        xp: dbState.xp - cost,
        redeemedRewards: [...dbState.redeemedRewards, rewardId]
      };
      return { success: true, newState: { ...dbState } };
    }
    return { success: false, error: 'Insufficient XP or already redeemed' };
  }
};
