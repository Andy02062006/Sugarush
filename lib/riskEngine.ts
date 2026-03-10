export interface EnvironmentalData {
  temperature: number; // Celsius
  humidity: number; // Percentage
  isSedentary: boolean; // Has the user been sitting without movement for > 2 hours?
}

export interface RiskNudge {
  score: number; // 0 - 100 
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  actionText?: string;
  actionUrl?: string; // Route link
}

/**
 * Computes an environmental and contextual risk score based on the current weather, 
 * physical movement, and time passed since the last meal.
 */
export function calculatePreemptiveRisk(
  lastMealTimestamp: string | null,
  env: EnvironmentalData
): RiskNudge | null {
  
  let score = 0;
  let hasHighHumidity = env.humidity > 70;
  let hasHighHeat = env.temperature > 32;

  // 1. Evaluate Meal Timing (Hypoglycemia Risk)
  let hoursSinceLastMeal = 0;
  if (lastMealTimestamp) {
    const diffMs = Date.now() - new Date(lastMealTimestamp).getTime();
    hoursSinceLastMeal = diffMs / (1000 * 60 * 60);
  } else {
    // If they have never logged a meal, assume a baseline risk to encourage logging
    hoursSinceLastMeal = 6; 
  }

  // Base risk increases substantially after 4 hours of no food
  if (hoursSinceLastMeal > 4) {
    score += 40;
  } else if (hoursSinceLastMeal > 3) {
    score += 20;
  }

  // 2. Evaluate Environmental Stress
  // High heat & humidity increases peripheral vasodilation which can alter insulin absorption rates
  if (hasHighHeat && hasHighHumidity) {
    score += 30;
  } else if (hasHighHumidity || hasHighHeat) {
    score += 15;
  }

  // 3. Evaluate Sedentary Behavior
  // Lack of movement decreases insulin sensitivity
  if (env.isSedentary) {
    score += 20;
  } else {
    // Light activity protects against spikes/drops
    score -= 10;
  }

  // Clamp score
  score = Math.max(0, Math.min(100, score));

  // Determine Nudge output
  if (score >= 70) {
    // Primary User Requirement Match
    if (hoursSinceLastMeal > 4 && hasHighHumidity) {
      return {
        score,
        severity: 'critical',
        title: 'Hypo Risk Alert ⚠️',
        message: `High humidity + no meal in ${Math.floor(hoursSinceLastMeal)}hrs = hypo risk. Try your Pantry's mango oat snack now.`,
        actionText: 'Open Pantry',
        actionUrl: '/food'
      };
    }
    
    return {
      score,
      severity: 'high',
      title: 'Action Required ⚠️',
      message: 'Combo of high heat, sedentary time, and missed meals is stressing your glucose stability.',
      actionText: 'Log a Meal',
      actionUrl: '/food'
    };
  } else if (score >= 40) {
    if (env.isSedentary) {
      return {
        score,
        severity: 'medium',
        title: 'Time to Move 🚶',
        message: 'You\'ve been sedentary. A 10 minute walk will dramatically improve your insulin sensitivity right now.',
      };
    }
    return {
      score,
      severity: 'medium',
      title: 'Check Your Sugar 🩸',
      message: 'It\'s been a while since you ate in this warm weather. You might want to check your levels.',
      actionText: 'Log Glucose',
      actionUrl: '/glucose'
    };
  }

  // If score is low, we don't necessarily want to spam nudges, maybe return null
  // unless we want to reinforce good behavior. 
  return null; 
}
