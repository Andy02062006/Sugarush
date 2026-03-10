import { MealLog } from '../../../lib/mocks';
import { MOCK_MEAL_LOGS as initialLogs } from '../../../lib/mocks';

// In-memory database to simulate a backend isolated within the food folder
// Note: This will reset whenever the Next.js server restarts
let mealLogsDB: MealLog[] = [...initialLogs];

export const db = {
  getLogs: () => mealLogsDB,
  
  addLog: (log: Omit<MealLog, 'id'>) => {
    const newLog: MealLog = {
      ...log,
      id: `ml_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    };
    mealLogsDB = [newLog, ...mealLogsDB];
    return newLog;
  },

  deleteLog: (id: string) => {
    const initialLength = mealLogsDB.length;
    mealLogsDB = mealLogsDB.filter(log => log.id !== id);
    return mealLogsDB.length < initialLength; // Returns true if a log was deleted
  }
};
