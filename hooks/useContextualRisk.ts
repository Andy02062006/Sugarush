"use client";

import { useState, useEffect } from 'react';
import { useStore } from '../store';
import { calculatePreemptiveRisk, EnvironmentalData, RiskNudge } from '../lib/riskEngine';

/**
 * A hook that monitors the user's environment and their recent activity
 * to surface preemptive health nudges.
 */
export function useContextualRisk() {
  const { mealLogs } = useStore();
  const [nudge, setNudge] = useState<RiskNudge | null>(null);
  
  // Simulated contextual sensors. 
  // In a real app this would call out to WeatherKit, HealthKit, or device sensors.
  const [env, setEnv] = useState<EnvironmentalData>({
    temperature: 34,    // High heat simulated (Celsius)
    humidity: 75,       // High humidity simulated (%)
    isSedentary: true,  // Simulated tracking (e.g. no steps in 2 hours)
  });

  useEffect(() => {
    // Find the most recent meal regardless of date
    let lastMealTimestamp: string | null = null;
    
    if (mealLogs.length > 0) {
      // Sort to ensure we get the absolute latest
      const sorted = [...mealLogs].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      lastMealTimestamp = sorted[0].timestamp;
    }

    // Evaluate Risk 
    const calculatedNudge = calculatePreemptiveRisk(lastMealTimestamp, env);
    setNudge(calculatedNudge);

  }, [mealLogs, env]); // Re-run if they log a meal or environmental factors change

  // Exposed for demo purposes to forcefully toggle environmental factors
  const toggleEnvironmentSimulation = () => {
    setEnv(prev => {
      // Toggle between a "High Risk" environment and a "Safe" environment
      if (prev.temperature > 30) {
         return { temperature: 22, humidity: 40, isSedentary: false };
      } else {
         return { temperature: 34, humidity: 75, isSedentary: true };
      }
    });
  };

  return { nudge, env, toggleEnvironmentSimulation };
}
