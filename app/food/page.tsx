"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Utensils, Plus, X, AlertTriangle, CheckCircle, TrendingUp, History,
  BarChart2, Trash2, ChevronDown, ChevronUp, Flame, Leaf, ShieldCheck, Info,
} from 'lucide-react';
import { useStore } from '../../store';
import { Card } from '../../components/ui/Card';
import { FoodItem, MealLog } from '../../lib/mocks';
import {
  attributeFoodContributions,
  buildFoodRiskProfile,
  getWarningsForFoods,
  getDashboardInsights,
  FoodWarning,
} from '../../lib/foodAnalysis';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRelativeTime(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const h = Math.floor(diff / (1000 * 60 * 60));
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ago`;
  if (h > 0) return `${h}h ago`;
  return 'Just now';
}

function RiskBadge({ level }: { level: 'high' | 'medium' | 'low' | 'safe' }) {
  const config: Record<string, { label: string; className: string }> = {
    high: { label: '⚡ High Risk', className: 'bg-red-50 text-red-600 border-red-100' },
    medium: { label: '⚠ Moderate', className: 'bg-orange-50 text-orange-600 border-orange-100' },
    low: { label: '↗ Low', className: 'bg-yellow-50 text-yellow-700 border-yellow-100' },
    safe: { label: '✓ Safe', className: 'bg-green-50 text-green-600 border-green-100' },
  };
  const c = config[level];
  return (
    <span className={`inline-flex items-center text-[11px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border ${c.className}`}>
      {c.label}
    </span>
  );
}

// ─── Meal Card (History Tab) ──────────────────────────────────────────────────

function MealCard({ meal, onDelete }: { meal: MealLog; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const contributions = useMemo(() => attributeFoodContributions(meal), [meal]);

  return (
    <Card className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              {new Date(meal.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
              {' · '}
              {new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {meal.spikeDetected ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                <Flame size={10} className="fill-current" /> Spike +{meal.spikeAmount} mg/dL
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                <Leaf size={10} /> Safe
              </span>
            )}
          </div>

          <p className="text-[14px] font-semibold text-slate-800 leading-snug">
            {meal.foods.map(f => f.name).join(', ')}
          </p>

          {meal.notes && (
            <p className="text-[13px] text-slate-400 font-medium mt-1">{meal.notes}</p>
          )}

          {meal.glucoseBeforeMeal && meal.glucoseAfterMeal && (
            <div className="flex items-center gap-3 mt-3">
              <span className="text-[13px] font-bold text-slate-500">
                {meal.glucoseBeforeMeal} <span className="text-slate-300">→</span> {meal.glucoseAfterMeal} mg/dL
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 ml-3 shrink-0">
          <button
            onClick={() => setExpanded(e => !e)}
            aria-label="Toggle contribution breakdown"
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <button
            onClick={() => onDelete(meal.id)}
            aria-label="Delete meal"
            className="p-2 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Contribution Breakdown */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <BarChart2 size={11} /> Glucose Contribution Estimate
              </p>
              {meal.spikeDetected ? (
                contributions.map((c) => (
                  <div key={c.foodName}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[13px] font-semibold text-slate-700">{c.foodName}</span>
                      <span className="text-[13px] font-bold text-slate-900">{c.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${c.percentage}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className={`h-2 rounded-full ${
                          c.percentage > 40 ? 'bg-red-500' :
                          c.percentage > 20 ? 'bg-orange-400' : 'bg-green-500'
                        }`}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                      ~+{c.estimatedRise} mg/dL attributed
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-[13px] text-green-600 font-medium flex items-center gap-2">
                  <CheckCircle size={14} /> No significant spike — all foods behaved well!
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ─── Warning Banner ───────────────────────────────────────────────────────────

function WarningBanner({ warnings }: { warnings: FoodWarning[] }) {
  if (warnings.length === 0) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className="space-y-2"
      >
        {warnings.map((w) => (
          <div
            key={w.foodName}
            className={`flex items-start gap-3 p-4 rounded-2xl border ${
              w.severity === 'danger'
                ? 'bg-red-50 border-red-200'
                : 'bg-orange-50 border-orange-200'
            }`}
          >
            <AlertTriangle
              size={16}
              className={`shrink-0 mt-0.5 ${w.severity === 'danger' ? 'text-red-500' : 'text-orange-500'}`}
            />
            <div>
              <p className={`text-[13px] font-bold ${w.severity === 'danger' ? 'text-red-700' : 'text-orange-700'}`}>
                {w.message}
              </p>
              <p className={`text-[11px] font-bold mt-0.5 uppercase tracking-wider ${w.severity === 'danger' ? 'text-red-400' : 'text-orange-400'}`}>
                Avg rise: +{w.avgRise} mg/dL · Spike rate: {Math.round(w.spikeRate * 100)}%
              </p>
            </div>
          </div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type Tab = 'log' | 'history' | 'insights';

export default function FoodScreen() {
  const { mealLogs, addMealLog, deleteMealLog, addXP, incrementStreak } = useStore();

  // Build the risk profile from all historical data
  const riskProfile = useMemo(() => buildFoodRiskProfile(mealLogs), [mealLogs]);
  const insights = useMemo(() => getDashboardInsights(riskProfile, mealLogs), [riskProfile, mealLogs]);

  const [activeTab, setActiveTab] = useState<Tab>('log');

  // ── Log Meal Form State ──
  const [foodInput, setFoodInput] = useState('');
  const [portionInput, setPortionInput] = useState('');
  const [foodList, setFoodList] = useState<FoodItem[]>([]);
  const [mealNotes, setMealNotes] = useState('');
  const [glucoseBefore, setGlucoseBefore] = useState('');
  const [glucoseAfter, setGlucoseAfter] = useState('');
  const [saved, setSaved] = useState(false);

  // Compute real-time warnings as food items are added
  const warnings = useMemo(
    () => getWarningsForFoods(foodList.map(f => f.name), riskProfile),
    [foodList, riskProfile]
  );

  const handleAddFood = () => {
    const name = foodInput.trim();
    if (!name) return;
    setFoodList(prev => [...prev, { name, portionSize: portionInput.trim() || undefined }]);
    setFoodInput('');
    setPortionInput('');
  };

  const handleRemoveFood = (idx: number) => {
    setFoodList(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSaveMeal = () => {
    if (foodList.length === 0) return;
    
    const isFirstLogToday = mealLogs.filter(l => new Date(l.timestamp).toDateString() === new Date().toDateString()).length === 0;
    if (isFirstLogToday) incrementStreak();

    const before = parseInt(glucoseBefore) || undefined;
    const after = parseInt(glucoseAfter) || undefined;
    const spikeAmt = before && after ? Math.max(0, after - before) : undefined;
    addMealLog({
      timestamp: new Date().toISOString(),
      foods: foodList,
      notes: mealNotes || undefined,
      glucoseBeforeMeal: before,
      glucoseAfterMeal: after,
      spikeDetected: spikeAmt !== undefined ? spikeAmt >= 30 : undefined,
      spikeAmount: spikeAmt,
    });
    addXP(75);
    // Reset
    setFoodList([]);
    setMealNotes('');
    setGlucoseBefore('');
    setGlucoseAfter('');
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'log', label: 'Log Meal', icon: <Plus size={14} /> },
    { id: 'history', label: 'History', icon: <History size={14} /> },
    { id: 'insights', label: 'Insights', icon: <TrendingUp size={14} /> },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <header className="mb-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-500 rounded-md text-[11px] font-bold uppercase tracking-widest mb-4">
          <Utensils size={12} /> Food Intelligence
        </div>
        <h1 className="text-4xl md:text-5xl font-heading font-black text-slate-900 tracking-tight leading-none">
          Food <span className="text-slate-400">IQ</span>
        </h1>
        <p className="text-[14px] text-slate-500 font-medium mt-2">
          Track meals, detect spikes, and get personalised warnings based on your history.
        </p>
      </header>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-sm transition-shadow">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">Meals Logged</p>
          <p className="text-2xl font-heading font-black text-slate-900">{insights.totalMealsAnalyzed}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-sm transition-shadow">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">Spike Rate</p>
          <p className="text-2xl font-heading font-black text-slate-900">{insights.overallSpikeRate}%</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-sm transition-shadow">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">Flagged Foods</p>
          <p className="text-2xl font-heading font-black text-slate-900">{insights.spikeOffenders.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-50/50 p-1 rounded-[14px] border border-slate-200">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[13px] font-bold rounded-[10px] transition-all focus-ring ${
              activeTab === tab.id
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
            }`}
          >
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >

          {/* ── LOG MEAL TAB ── */}
          {activeTab === 'log' && (
            <div className="space-y-4">
              {/* Success Banner */}
              <AnimatePresence>
                {saved && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl p-4"
                  >
                    <CheckCircle size={16} className="text-green-600 shrink-0" />
                    <p className="text-[13px] font-bold text-green-700">Meal logged! +75 XP earned 🎉</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Warning Banner (real-time) */}
              <WarningBanner warnings={warnings} />

              {/* Food Input */}
              <Card className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Add Food Items</h3>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={foodInput}
                    onChange={e => setFoodInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddFood()}
                    placeholder="e.g. White Rice, Soda..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-[12px] py-3 px-4 text-[14px] font-medium placeholder:text-slate-400 focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none transition-all"
                    id="food-name-input"
                  />
                  <input
                    type="text"
                    value={portionInput}
                    onChange={e => setPortionInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddFood()}
                    placeholder="Portion"
                    className="w-28 bg-slate-50 border border-slate-200 rounded-[12px] py-3 px-4 text-[14px] font-medium placeholder:text-slate-400 focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none transition-all"
                    id="food-portion-input"
                  />
                  <button
                    onClick={handleAddFood}
                    aria-label="Add food item"
                    className="w-11 h-11 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-slate-800 transition-colors shrink-0"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                {/* Added items list */}
                {foodList.length > 0 && (
                  <div className="space-y-2">
                    {foodList.map((food, idx) => {
                      const key = food.name.trim().toLowerCase();
                      const risk = riskProfile.get(key);
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-[14px] font-semibold text-slate-800">{food.name}</span>
                            {food.portionSize && (
                              <span className="text-[11px] text-slate-400 font-medium">{food.portionSize}</span>
                            )}
                            {risk && <RiskBadge level={risk.riskLevel} />}
                          </div>
                          <button
                            onClick={() => handleRemoveFood(idx)}
                            aria-label={`Remove ${food.name}`}
                            className="text-slate-400 hover:text-red-500 transition-colors p-1"
                          >
                            <X size={14} />
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {foodList.length === 0 && (
                  <p className="text-[13px] text-slate-400 font-medium text-center py-4">
                    Add the foods you ate above ↑
                  </p>
                )}
              </Card>

              {/* Glucose readings */}
              <Card className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Glucose Readings (Optional)</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Before Meal</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={glucoseBefore}
                        onChange={e => setGlucoseBefore(e.target.value)}
                        placeholder="0"
                        id="glucose-before-input"
                        className="w-full bg-slate-50 border border-slate-200 rounded-[12px] py-3 px-4 pr-16 text-[14px] font-bold placeholder:text-slate-400 focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none transition-all"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-bold text-slate-400">mg/dL</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">After Meal</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={glucoseAfter}
                        onChange={e => setGlucoseAfter(e.target.value)}
                        placeholder="0"
                        id="glucose-after-input"
                        className="w-full bg-slate-50 border border-slate-200 rounded-[12px] py-3 px-4 pr-16 text-[14px] font-bold placeholder:text-slate-400 focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none transition-all"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-bold text-slate-400">mg/dL</span>
                    </div>
                  </div>
                </div>
                {glucoseBefore && glucoseAfter && parseInt(glucoseAfter) - parseInt(glucoseBefore) >= 30 && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
                    <AlertTriangle size={14} className="text-red-500 shrink-0" />
                    <p className="text-[13px] font-bold text-red-600">
                      Spike detected: +{parseInt(glucoseAfter) - parseInt(glucoseBefore)} mg/dL
                    </p>
                  </div>
                )}
              </Card>

              {/* Notes */}
              <Card className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Notes (Optional)</h3>
                <textarea
                  value={mealNotes}
                  onChange={e => setMealNotes(e.target.value)}
                  placeholder="E.g., Ate out, felt sluggish after..."
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-[12px] py-3 px-4 text-[14px] font-medium placeholder:text-slate-400 focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none transition-all resize-none"
                />
              </Card>

              {/* Save */}
              <button
                onClick={handleSaveMeal}
                disabled={foodList.length === 0}
                id="save-meal-btn"
                className="w-full bg-slate-900 text-white font-bold text-[15px] py-4 rounded-[12px] hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShieldCheck size={18} /> Save Meal Log
              </button>
            </div>
          )}

          {/* ── HISTORY TAB ── */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  {mealLogs.length} meals logged
                </span>
              </div>
              {mealLogs.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <Utensils size={32} className="mx-auto mb-3 opacity-40" />
                  <p className="font-medium">No meals logged yet. Start from the Log tab!</p>
                </div>
              ) : (
                mealLogs.map(meal => (
                  <MealCard key={meal.id} meal={meal} onDelete={deleteMealLog} />
                ))
              )}
            </div>
          )}

          {/* ── INSIGHTS TAB ── */}
          {activeTab === 'insights' && (
            <div className="space-y-6">

              {/* Spike Offenders */}
              <Card className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Flame size={16} className="text-red-500" />
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Spike Offenders</h3>
                </div>
                {insights.spikeOffenders.length === 0 ? (
                  <p className="text-[13px] text-slate-400 font-medium">Not enough data yet. Log more meals!</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {insights.spikeOffenders.map(f => (
                      <div
                        key={f.foodName}
                        className="flex flex-col bg-red-50 border border-red-100 rounded-xl px-3 py-2"
                      >
                        <span className="text-[13px] font-bold text-red-700">{f.foodName}</span>
                        <span className="text-[11px] text-red-400 font-medium">
                          {Math.round(f.spikeRate * 100)}% spike rate · avg +{f.averageGlucoseRise} mg/dL
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Safe Foods */}
              <Card className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Leaf size={16} className="text-green-500" />
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Safe Foods</h3>
                </div>
                {insights.safeFoods.length === 0 ? (
                  <p className="text-[13px] text-slate-400 font-medium">No confirmed safe foods yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {insights.safeFoods.map(f => (
                      <div
                        key={f.foodName}
                        className="flex flex-col bg-green-50 border border-green-100 rounded-xl px-3 py-2"
                      >
                        <span className="text-[13px] font-bold text-green-700">{f.foodName}</span>
                        <span className="text-[11px] text-green-400 font-medium">
                          avg +{f.averageGlucoseRise} mg/dL
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Avg Glucose Rise Per Food - Chart */}
              <Card className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-5">
                  <BarChart2 size={16} className="text-slate-400" />
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Avg Glucose Rise Per Food</h3>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={insights.avgRisePerFood.slice(0, 8)}
                      layout="vertical"
                      margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                      <XAxis
                        type="number"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }}
                        tickFormatter={(v) => `+${v}`}
                      />
                      <YAxis
                        type="category"
                        dataKey="foodName"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }}
                        width={100}
                      />
                      <Tooltip
                        cursor={{ fill: '#F1F5F9' }}
                        formatter={(v) => [`+${Number(v ?? 0)} mg/dL`, 'Avg Rise']}
                        contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '13px', fontWeight: 'bold' }}
                      />
                      <Bar dataKey="avgRise" radius={[0, 4, 4, 0]} maxBarSize={20}>
                        {insights.avgRisePerFood.slice(0, 8).map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.avgRise >= 60 ? '#EF4444' : entry.avgRise >= 35 ? '#F59E0B' : '#10B981'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Per-food detailed list */}
              <Card className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Info size={16} className="text-slate-400" />
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-500">All Food Risk Profiles</h3>
                </div>
                <div className="space-y-3">
                  {Array.from(riskProfile.values())
                    .sort((a, b) => b.spikeRate - a.spikeRate)
                    .map(f => (
                      <div key={f.foodName} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                        <div>
                          <p className="text-[14px] font-semibold text-slate-800">{f.foodName}</p>
                          <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                            {f.totalAppearances} meal{f.totalAppearances > 1 ? 's' : ''} · avg +{f.averageGlucoseRise} mg/dL
                          </p>
                        </div>
                        <RiskBadge level={f.riskLevel} />
                      </div>
                    ))}
                </div>
              </Card>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
