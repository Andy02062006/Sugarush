"use client";

import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Search, Flame, Clock, Droplet, ChefHat, Volume2, Languages, X } from 'lucide-react';
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
      
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Recipes</h1>
          <p className="text-slate-500 font-medium mt-1">Diabetic-friendly meals</p>
        </div>
        <div className="flex gap-2">
          <button 
             onClick={() => setLang(l => l === 'en' ? 'ta' : 'en')}
             className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-500 hover:text-blue-600 shadow-sm border border-slate-200"
          >
            <Languages size={18} />
          </button>
          <button 
             onClick={() => setPantryOpen(true)}
             className="w-10 h-10 bg-primary-gradient rounded-full flex items-center justify-center text-white shadow-md relative group"
          >
            <ChefHat size={18} />
            {pantryItems && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>}
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={lang === 'en' ? "Search recipes..." : "சமையல் குறிப்புகளைத் தேடுங்கள்..."}
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 snap-x no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 mb-6 shrink-0">
        {['All', 'Low Carb', 'High Protein', 'Quick'].map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap snap-start transition-all ${
              activeFilter === filter
                ? 'bg-slate-800 text-white shadow-md shadow-slate-800/20'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
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
            <Card className="p-0 overflow-hidden relative shadow-sm hover:shadow-xl transition-all duration-300 border-slate-100 flex flex-col h-full bg-white">
              
              <div className="relative h-48 w-full shrink-0">
                <Image 
                  src={recipe.imageUrl} 
                  alt={recipe.name} 
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                   <h3 className="font-bold text-white text-lg leading-tight w-[90%] drop-shadow-md">
                     {getRecipeName(recipe)}
                   </h3>
                   <div className="flex gap-3 text-white/90 text-xs font-semibold mt-2">
                     <span className="flex items-center gap-1 drop-shadow-md"><Clock size={12}/> {recipe.prepTime}</span>
                     <span className="flex items-center gap-1 drop-shadow-md"><Flame size={12} className="text-orange-400"/> {recipe.calories} kcal</span>
                   </div>
                </div>
                
                {/* Audio Button */}
                <button 
                  onClick={(e) => handleReadAloud(e, getRecipeName(recipe) + ". " + recipe.description)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 border border-white/30 transition-colors"
                >
                  <Volume2 size={16} />
                </button>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <p className="text-slate-500 text-sm font-medium line-clamp-2 leading-relaxed mb-4">
                  {recipe.description}
                </p>
                <div className="flex justify-between items-center text-xs font-bold border-t border-slate-100 pt-3 mt-auto">
                   <span className="text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">Carbs: {recipe.carbs}g</span>
                   <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">Protein: {recipe.protein}g</span>
                   <span className="text-purple-600 bg-purple-50 px-2 py-1 rounded-lg">Fat: {recipe.fat}g</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="text-center py-20 bg-slate-100/50 rounded-2xl border-2 border-dashed border-slate-200">
           <div className="text-4xl mb-2">🧑‍🍳</div>
           <h3 className="text-lg font-bold text-slate-800">No recipes found</h3>
           <p className="text-slate-500 font-medium">Try adjusting your filters or pantry items.</p>
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
               className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl relative"
            >
              <button onClick={() => setPantryOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-2 bg-slate-100 rounded-full">
                 <X size={16} />
              </button>
              
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
                 <ChefHat size={24} />
              </div>
              
              <h2 className="text-xl font-bold text-slate-800 mb-1">Pantry Scanner</h2>
              <p className="text-slate-500 font-medium text-sm mb-6">Tell Suggy what ingredients you have, and we'll find matching recipes.</p>

              <textarea 
                value={pantryItems}
                onChange={e => setPantryItems(e.target.value)}
                placeholder="E.g., chicken, broccoli, olive oil..."
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:outline-none focus:border-purple-500 transition-colors placeholder:text-slate-400 text-slate-700 font-medium text-sm mb-4"
                rows={4}
              />
              
              <div className="flex gap-2">
                <button 
                  onClick={() => setPantryItems('')}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Clear
                </button>
                <button 
                  onClick={() => setPantryOpen(false)}
                  className="flex-[2] py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 shadow-md shadow-purple-500/30 transition-colors"
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

              <div className="p-6 flex-1 bg-white relative -mt-6 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                <h2 className="text-2xl font-black text-slate-800 mb-2 leading-tight">
                  {getRecipeName(selectedRecipe)}
                </h2>
                <p className="text-slate-500 font-medium mb-6 leading-relaxed">
                  {selectedRecipe.description}
                </p>

                <div className="flex gap-4 mb-8 overflow-x-auto pb-2 snap-x no-scrollbar">
                   <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 shrink-0 w-24 text-center snap-start">
                     <Flame className="mx-auto text-orange-500 mb-2" size={24}/>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Calories</p>
                     <p className="text-lg font-black text-slate-800">{selectedRecipe.calories}</p>
                   </div>
                   <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 shrink-0 w-24 text-center snap-start">
                     <Droplet className="mx-auto text-amber-500 mb-2" size={24}/>
                     <p className="text-[10px] font-bold text-amber-600/60 uppercase tracking-wide">Carbs</p>
                     <p className="text-lg font-black text-amber-900">{selectedRecipe.carbs}g</p>
                   </div>
                   <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 shrink-0 w-24 text-center snap-start">
                     <span className="block mx-auto text-blue-500 mb-2 text-2xl">💪</span>
                     <p className="text-[10px] font-bold text-blue-600/60 uppercase tracking-wide">Protein</p>
                     <p className="text-lg font-black text-blue-900">{selectedRecipe.protein}g</p>
                   </div>
                   <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 shrink-0 w-24 text-center snap-start">
                     <span className="block mx-auto text-purple-500 mb-2 text-2xl">🥑</span>
                     <p className="text-[10px] font-bold text-purple-600/60 uppercase tracking-wide">Fat</p>
                     <p className="text-lg font-black text-purple-900">{selectedRecipe.fat}g</p>
                   </div>
                </div>

                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Ingredients</h3>
                <ul className="space-y-3 mb-8">
                  {selectedRecipe.ingredients.map((ing, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-slate-700 font-medium">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
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
