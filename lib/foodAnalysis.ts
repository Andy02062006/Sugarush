/**
 * foodAnalysis.ts
 * Pattern-matching analysis engine for correlating food intake with glucose spikes.
 * Pure TypeScript — no network calls, no external API. Works entirely from user history.
 */

import { MealLog, FoodItem } from './mocks';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FoodContribution {
  foodName: string;
  percentage: number;
  estimatedRise: number; // mg/dL attributed to this food
}

export interface FoodRiskData {
  foodName: string;
  totalAppearances: number;
  spikeAppearances: number;
  spikeRate: number;         // 0–1
  averageGlucoseRise: number; // mg/dL average rise when this food was eaten
  maxGlucoseRise: number;
  riskLevel: 'high' | 'medium' | 'low' | 'safe';
}

export interface FoodWarning {
  foodName: string;
  message: string;
  severity: 'danger' | 'warning';
  spikeRate: number;
  avgRise: number;
}

export interface DashboardInsights {
  spikeOffenders: FoodRiskData[];   // foods with spikeRate > 0.6
  safeFoods: FoodRiskData[];         // foods with spikeRate < 0.2 and appeared >1x
  avgRisePerFood: { foodName: string; avgRise: number }[];
  totalMealsAnalyzed: number;
  totalSpikeMeals: number;
  overallSpikeRate: number;
}

// ─── Core Helpers ─────────────────────────────────────────────────────────────

const SPIKE_THRESHOLD = 30; // mg/dL rise = spike

/**
 * Detects whether a spike occurred in a meal entry.
 */
export function detectSpike(before: number, after: number, threshold = SPIKE_THRESHOLD): boolean {
  return (after - before) >= threshold;
}

/**
 * Normalizes a food name for consistent key lookups (lowercase, trim).
 */
function normalizeFood(name: string): string {
  return name.trim().toLowerCase();
}

// ─── Core Analysis ────────────────────────────────────────────────────────────

/**
 * Distributes the total glucose rise across the food items in a meal,
 * weighted by estimated carbohydrate content. Falls back to equal weighting
 * if carb data is unavailable.
 */
export function attributeFoodContributions(meal: MealLog): FoodContribution[] {
  const spikeAmount = meal.spikeAmount ?? 0;
  if (spikeAmount <= 0 || meal.foods.length === 0) {
    // No spike — return equal 0-contribution for display purposes
    return meal.foods.map(f => ({ foodName: f.name, percentage: 0, estimatedRise: 0 }));
  }

  const foods = meal.foods;
  const totalCarbs = foods.reduce((sum, f) => sum + (f.estimatedCarbs ?? 0), 0);

  let contributions: FoodContribution[];

  if (totalCarbs > 0) {
    // Carb-weighted distribution
    contributions = foods.map(f => {
      const carbs = f.estimatedCarbs ?? 0;
      const pct = totalCarbs > 0 ? (carbs / totalCarbs) : (1 / foods.length);
      return {
        foodName: f.name,
        percentage: Math.round(pct * 100),
        estimatedRise: Math.round(pct * spikeAmount),
      };
    });
  } else {
    // Equal distribution fallback
    const equalPct = Math.round(100 / foods.length);
    contributions = foods.map(f => ({
      foodName: f.name,
      percentage: equalPct,
      estimatedRise: Math.round(spikeAmount / foods.length),
    }));
  }

  // Normalize percentages to exactly 100%
  const total = contributions.reduce((s, c) => s + c.percentage, 0);
  if (total !== 100 && contributions.length > 0) {
    contributions[0].percentage += (100 - total);
  }

  return contributions.sort((a, b) => b.percentage - a.percentage);
}

/**
 * Builds a risk profile map for every unique food across all historical meals.
 * Aggregates spike rate, average/max glucose rise, and classifies risk level.
 */
export function buildFoodRiskProfile(mealLogs: MealLog[]): Map<string, FoodRiskData> {
  // First pass: collect raw data per food
  const raw = new Map<string, { appearances: number; spikeCount: number; rises: number[] }>();

  for (const meal of mealLogs) {
    const rise = meal.spikeAmount ?? (
      meal.glucoseAfterMeal && meal.glucoseBeforeMeal
        ? meal.glucoseAfterMeal - meal.glucoseBeforeMeal
        : 0
    );
    const spiked = meal.spikeDetected ?? (rise >= SPIKE_THRESHOLD);

    for (const food of meal.foods) {
      const key = normalizeFood(food.name);
      const existing = raw.get(key) ?? { appearances: 0, spikeCount: 0, rises: [] };
      existing.appearances += 1;
      if (spiked) existing.spikeCount += 1;
      existing.rises.push(rise);
      raw.set(key, existing);
    }
  }

  // Second pass: compute derived stats and build the profile map
  const profile = new Map<string, FoodRiskData>();

  for (const [key, data] of raw.entries()) {
    // Find a display name (first appearance in logs)
    let displayName = key;
    outer: for (const meal of mealLogs) {
      for (const food of meal.foods) {
        if (normalizeFood(food.name) === key) {
          displayName = food.name; // preserve original casing
          break outer;
        }
      }
    }

    const spikeRate = data.appearances > 0 ? data.spikeCount / data.appearances : 0;
    const avgRise = data.rises.length > 0
      ? Math.round(data.rises.reduce((s, r) => s + r, 0) / data.rises.length)
      : 0;
    const maxRise = data.rises.length > 0 ? Math.max(...data.rises) : 0;

    let riskLevel: FoodRiskData['riskLevel'];
    if (spikeRate >= 0.7) riskLevel = 'high';
    else if (spikeRate >= 0.4) riskLevel = 'medium';
    else if (spikeRate >= 0.15) riskLevel = 'low';
    else riskLevel = 'safe';

    profile.set(key, {
      foodName: displayName,
      totalAppearances: data.appearances,
      spikeAppearances: data.spikeCount,
      spikeRate: Math.round(spikeRate * 100) / 100,
      averageGlucoseRise: avgRise,
      maxGlucoseRise: maxRise,
      riskLevel,
    });
  }

  return profile;
}

/**
 * Given a list of food names the user is about to log, returns any warnings
 * based on their historical risk profile.
 */
export function getWarningsForFoods(
  foodNames: string[],
  riskProfile: Map<string, FoodRiskData>
): FoodWarning[] {
  const warnings: FoodWarning[] = [];

  for (const name of foodNames) {
    const key = normalizeFood(name);
    const risk = riskProfile.get(key);
    if (!risk) continue;

    if (risk.riskLevel === 'high') {
      warnings.push({
        foodName: risk.foodName,
        message: `${risk.foodName} caused a blood sugar spike in ${Math.round(risk.spikeRate * 100)}% of meals it appeared in. Consider a smaller portion or skip it.`,
        severity: 'danger',
        spikeRate: risk.spikeRate,
        avgRise: risk.averageGlucoseRise,
      });
    } else if (risk.riskLevel === 'medium') {
      warnings.push({
        foodName: risk.foodName,
        message: `${risk.foodName} has caused spikes before. Watch your portion size today.`,
        severity: 'warning',
        spikeRate: risk.spikeRate,
        avgRise: risk.averageGlucoseRise,
      });
    }
  }

  return warnings;
}

/**
 * Derives the full insights dashboard dataset from the risk profile.
 */
export function getDashboardInsights(
  riskProfile: Map<string, FoodRiskData>,
  mealLogs: MealLog[]
): DashboardInsights {
  const allFoods = Array.from(riskProfile.values());

  const spikeOffenders = allFoods
    .filter(f => f.spikeRate >= 0.5 && f.totalAppearances >= 1)
    .sort((a, b) => b.spikeRate - a.spikeRate)
    .slice(0, 8);

  const safeFoods = allFoods
    .filter(f => f.spikeRate < 0.2)
    .sort((a, b) => a.averageGlucoseRise - b.averageGlucoseRise)
    .slice(0, 8);

  const avgRisePerFood = allFoods
    .filter(f => f.totalAppearances >= 1)
    .map(f => ({ foodName: f.foodName, avgRise: f.averageGlucoseRise }))
    .sort((a, b) => b.avgRise - a.avgRise)
    .slice(0, 10);

  const totalSpikeMeals = mealLogs.filter(m => m.spikeDetected).length;

  return {
    spikeOffenders,
    safeFoods,
    avgRisePerFood,
    totalMealsAnalyzed: mealLogs.length,
    totalSpikeMeals,
    overallSpikeRate: mealLogs.length > 0
      ? Math.round((totalSpikeMeals / mealLogs.length) * 100)
      : 0,
  };
}
