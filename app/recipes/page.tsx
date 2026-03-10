"use client";

import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Search, Flame, Clock, Droplet, ChefHat, Volume2, Languages, X, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_RECIPES, Recipe } from '../../lib/mocks';
import Image from 'next/image';

export default function RecipesScreen() {
  const [lang, setLang] = useState<'en' | 'ta'>('en');
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [pantryOpen, setPantryOpen] = useState(false);
  const [pantryItems, setPantryItems] = useState('');

  // Filtering Logic
  const filteredRecipes = MOCK_RECIPES.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.nameTamil.toLowerCase().includes(search.toLowerCase());

    let matchesFilter = true;
    if (activeFilter === 'Low Carb') matchesFilter = r.carbs < 20;
    if (activeFilter === 'High Protein') matchesFilter = r.protein > 20;
    if (activeFilter === 'Quick') matchesFilter = r.prepTime.includes('mins') && parseInt(r.prepTime) <= 20;

    let matchesPantry = true;
    if (pantryItems.trim()) {
      const items = pantryItems.toLowerCase().split(',').map(i => i.trim());
      // Recipe matches if it contains ALL of the comma-separated ingredients
      matchesPantry = items.every(item => r.ingredients.some(ing => ing.toLowerCase().includes(item)));
    }

    return matchesSearch && matchesFilter && matchesPantry;
  });

  const handleReadAloud = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    // Rough language detection/setting for demo
    utterance.lang = lang === 'ta' ? 'ta-IN' : 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const getRecipeName = (r: Recipe) => lang === 'en' ? r.name : r.nameTamil;

  return (
    <div className="p-4 md:p-8 space-y-6 pb-24 md:pb-8">

      {/* Distinct Extended Header */}
      <header className="relative bg-white border border-slate-200 rounded-3xl p-6 md:p-8 mb-8 overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 opacity-[0.03] transform translate-x-4 -translate-y-4">
          <ChefHat size={160} />
        </div>

        <div className="relative z-10 flex justify-between items-start">
          <div className="max-w-[70%]">
            <h1 className="text-3xl md:text-4xl font-heading font-black text-slate-900 mb-2 leading-tight tracking-tight">Nutritious<br />Kitchen</h1>
            <p className="text-slate-500 font-medium text-[13px] md:text-sm">Discover delicious, diabetic-friendly meals to keep your sugar steady.</p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setLang(l => l === 'en' ? 'ta' : 'en')}
              className="w-11 h-11 bg-slate-50 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 border border-slate-200 transition-colors focus-ring"
              aria-label="Toggle language"
            >
              <Languages size={18} />
            </button>
            <button
              onClick={() => setPantryOpen(true)}
              className="w-11 h-11 bg-slate-900 rounded-full flex items-center justify-center text-white shadow-sm relative group focus-ring transition-transform hover:scale-105"
              aria-label="Pantry Scanner"
            >
              <ChefHat size={18} />
              {pantryItems && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>}
            </button>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={lang === 'en' ? "Search for healthy recipes..." : "சமையல் குறிப்புகளைத் தேடுங்கள்..."}
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-[12px] shadow-sm focus-ring outline-none font-medium text-[14px] text-slate-900 placeholder:text-slate-400 focus:border-slate-300 transition-colors"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 snap-x no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 mb-6 shrink-0">
        {['All', 'Low Carb', 'High Protein', 'Quick'].map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full text-[13px] font-semibold whitespace-nowrap snap-start transition-all focus-ring ${activeFilter === filter
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
              }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredRecipes.map((recipe, i) => (
          <motion.div
            key={recipe.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setSelectedRecipe(recipe)}
            className="cursor-pointer group"
          >
            <Card className="p-0 overflow-hidden relative shadow-sm hover:shadow-md transition-all duration-300 border-slate-200 flex flex-col h-full bg-white group cursor-pointer rounded-2xl">

              <div className="relative h-44 w-full shrink-0">
                <Image
                  src={recipe.imageUrl}
                  alt={recipe.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Audio Button */}
                <button
                  onClick={(e) => handleReadAloud(e, getRecipeName(recipe) + ". " + recipe.description)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/60 backdrop-blur-md rounded-full flex items-center justify-center text-slate-900 hover:bg-white shadow-sm transition-colors"
                >
                  <Volume2 size={14} />
                </button>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between border-t border-slate-100">
                <div>
                  <h3 className="font-heading font-black text-[16px] text-slate-900 leading-tight mb-1">
                    {getRecipeName(recipe)}
                  </h3>
                  <div className="flex gap-3 text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-2">
                    <span className="flex items-center gap-1"><Clock size={12} /> {recipe.prepTime}</span>
                    <span className="flex items-center gap-1"><Flame size={12} /> {recipe.calories} kcal</span>
                  </div>
                  <p className="text-slate-600 text-[13px] font-medium line-clamp-2 leading-relaxed mb-4">
                    {recipe.description}
                  </p>
                </div>
                <div className="flex gap-2 text-[11px] font-bold mt-auto hidden sm:flex">
                  <span className="bg-slate-50 text-slate-500 px-2.5 py-1 rounded-md border border-slate-100 uppercase">C: {recipe.carbs}g</span>
                  <span className="bg-slate-50 text-slate-500 px-2.5 py-1 rounded-md border border-slate-100 uppercase">P: {recipe.protein}g</span>
                  <span className="bg-slate-50 text-slate-500 px-2.5 py-1 rounded-md border border-slate-100 uppercase">F: {recipe.fat}g</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="text-center py-20 bg-cream-soft rounded-2xl border-2 border-dashed border-border">
          <ChefHat size={48} className="text-teal-primary mb-4 mx-auto opacity-50" />
          <h3 className="text-lg font-heading font-bold text-text-primary">No recipes found</h3>
          <p className="text-text-secondary font-medium">Try adjusting your filters or pantry items.</p>
        </div>
      )}

      {/* AI Pantry Scanner Modal */}
      <AnimatePresence>
        {pantryOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-card rounded-3xl w-full max-w-md p-6 shadow-2xl relative"
            >
              <button onClick={() => setPantryOpen(false)} className="absolute top-4 right-4 text-text-muted hover:text-text-primary p-2 bg-cream-soft rounded-full focus-ring">
                <X size={16} />
              </button>

              <div className="w-12 h-12 bg-status-purple/10 text-status-purple rounded-full flex items-center justify-center mb-4">
                <ChefHat size={24} />
              </div>

              <h2 className="text-xl font-heading font-bold text-text-primary mb-1">Pantry Scanner</h2>
              <p className="text-text-secondary font-medium text-sm mb-6">Tell Suggy what ingredients you have, and we'll find matching recipes.</p>

              <textarea
                value={pantryItems}
                onChange={e => setPantryItems(e.target.value)}
                placeholder="E.g., chicken, broccoli, olive oil..."
                className="w-full bg-cream-soft border-2 border-border rounded-2xl p-4 focus-ring transition-colors placeholder:text-text-muted text-text-primary font-medium text-sm mb-4 resize-none"
                rows={4}
              />

              <div className="flex gap-2">
                <button
                  onClick={() => setPantryItems('')}
                  className="flex-1 py-3 bg-cream-soft text-text-secondary rounded-xl font-bold hover:bg-border transition-colors focus-ring"
                >
                  Clear
                </button>
                <button
                  onClick={() => setPantryOpen(false)}
                  className="flex-[2] py-3 bg-teal-primary text-white rounded-xl font-bold hover:bg-teal-dark shadow-md shadow-teal-primary/30 transition-colors focus-ring"
                >
                  Find Recipes
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Recipe Detail Drawer */}
      <AnimatePresence>
        {selectedRecipe && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setSelectedRecipe(null)}
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full md:w-96 bg-white h-full shadow-2xl overflow-y-auto z-10 flex flex-col"
            >
              <div className="relative h-64 w-full shrink-0">
                <Image
                  src={selectedRecipe.imageUrl}
                  alt={selectedRecipe.name}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 border border-white/30 transition-colors shadow-sm"
                >
                  <X size={20} />
                </button>
                <button
                  onClick={(e) => handleReadAloud(e, getRecipeName(selectedRecipe) + ". " + selectedRecipe.description + ". Ingredients: " + selectedRecipe.ingredients.join(", "))}
                  className="absolute top-4 right-16 w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/40 border border-white/20 transition-colors shadow-sm"
                >
                  <Volume2 size={20} />
                </button>
              </div>

              <div className="p-6 flex-1 bg-white relative -mt-6 rounded-t-[24px] shadow-[0_-4px_20px_rgba(0,0,0,0.03)] border-t border-slate-100">
                <h2 className="text-2xl font-heading font-black text-slate-900 mb-2 leading-tight tracking-tight">
                  {getRecipeName(selectedRecipe)}
                </h2>
                <p className="text-slate-500 font-medium mb-6 leading-relaxed text-[15px]">
                  {selectedRecipe.description}
                </p>

                <div className="flex gap-3 mb-8 overflow-x-auto pb-2 snap-x no-scrollbar">
                  <div className="bg-slate-50 border border-slate-200 rounded-[16px] p-4 shrink-0 w-24 text-center snap-start">
                    <Flame className="mx-auto text-slate-400 mb-2" size={20} />
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Calories</p>
                    <p className="text-xl font-heading font-black text-slate-900 leading-none">{selectedRecipe.calories}</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-[16px] p-4 shrink-0 w-24 text-center snap-start">
                    <Droplet className="mx-auto text-slate-400 mb-2" size={20} />
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Carbs</p>
                    <p className="text-xl font-heading font-black text-slate-900 leading-none">{selectedRecipe.carbs}g</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-[16px] p-4 shrink-0 w-24 text-center snap-start">
                    <Activity className="mx-auto text-slate-400 mb-2" size={20} />
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Protein</p>
                    <p className="text-xl font-heading font-black text-slate-900 leading-none">{selectedRecipe.protein}g</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-[16px] p-4 shrink-0 w-24 text-center snap-start">
                    <Droplet className="mx-auto text-slate-400 mb-2" size={20} />
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Fat</p>
                    <p className="text-xl font-heading font-black text-slate-900 leading-none">{selectedRecipe.fat}g</p>
                  </div>
                </div>

                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 pt-6 border-t border-slate-200">Ingredients</h3>
                <ul className="space-y-3 mb-8">
                  {selectedRecipe.ingredients.map((ing, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-slate-700 font-medium text-[15px]">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                      <span className="capitalize">{ing}</span>
                    </li>
                  ))}
                </ul>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
