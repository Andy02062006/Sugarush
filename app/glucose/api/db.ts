import { GlucoseLog } from '../../../lib/mocks';
import { MOCK_LOGS as initialLogs } from '../../../lib/mocks';

// In-memory database to simulate a backend isolated within the glucose folder
// Note: This will reset whenever the Next.js server restarts
let glucoseLogsDB: GlucoseLog[] = [...initialLogs];

export const db = {
  getLogs: () => glucoseLogsDB,
  
  addLog: (log: Omit<GlucoseLog, 'id'>) => {
    const newLog: GlucoseLog = {
      ...log,
      id: `gl_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    };
    glucoseLogsDB = [newLog, ...glucoseLogsDB];
    return newLog;
  },

  deleteLog: (id: string) => {
    const initialLength = glucoseLogsDB.length;
    glucoseLogsDB = glucoseLogsDB.filter(log => log.id !== id);
    return glucoseLogsDB.length < initialLength; // Returns true if a log was deleted
  }
};
