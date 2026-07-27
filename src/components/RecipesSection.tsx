/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { RECIPES } from '../data';
import { Clock, Users, Flame, ChevronRight, Check } from 'lucide-react';

export default function RecipesSection() {
  const [selectedRecipeIdx, setSelectedRecipeIdx] = useState(0);

  const activeRecipe = RECIPES[selectedRecipeIdx];

  return (
    <section id="recipes" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] uppercase font-extrabold tracking-[0.25em] text-[#B71C1C] block mb-2">
            Culinary Health Artistry
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-black text-[#1B1B1B]">
            Healthy Recipes & Spice Pairings
          </h2>
          <div className="w-12 h-[1px] bg-[#B71C1C] mx-auto mt-4 mb-4"></div>
          <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-medium">
            Unlock the therapeutic medical properties of high-curcumin turmeric and premium Telangana chillies with these expert culinary recipes.
          </p>
        </div>

        {/* Tab-like recipe buttons */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {RECIPES.map((recipe, idx) => (
            <button
              key={recipe.id}
              onClick={() => setSelectedRecipeIdx(idx)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all duration-300 ${
                idx === selectedRecipeIdx
                  ? 'bg-[#1B1B1B] text-white border-[#1B1B1B] shadow-md'
                  : 'bg-[#F8F8F4] text-neutral-600 border-neutral-200/60 hover:bg-neutral-100'
              }`}
            >
              {recipe.name}
            </button>
          ))}
        </div>

        {/* Selected Recipe card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start bg-[#F8F8F4] border border-neutral-200/50 rounded-3xl p-6 sm:p-10 shadow-sm">
          
          {/* Recipe Image & Stats */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative aspect-video sm:aspect-square rounded-2xl overflow-hidden border border-neutral-200 shadow-md">
              <img
                src={activeRecipe.image}
                alt={activeRecipe.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#E0A106]">
                  Nutritionist Recommended
                </span>
                <h4 className="font-display text-xl font-bold leading-tight mt-1">
                  {activeRecipe.name}
                </h4>
              </div>
            </div>

            {/* Stats metadata */}
            <div className="grid grid-cols-3 gap-2 bg-white rounded-xl border border-neutral-200/50 p-4 shadow-xs">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-neutral-500 mb-1">
                  <Clock size={14} />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Duration</span>
                </div>
                <span className="text-sm font-bold text-neutral-800">{activeRecipe.time}</span>
              </div>

              <div className="text-center border-x border-neutral-100">
                <div className="flex items-center justify-center gap-1 text-neutral-500 mb-1">
                  <Users size={14} />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Yield</span>
                </div>
                <span className="text-sm font-bold text-neutral-800">{activeRecipe.servings} guests</span>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-neutral-500 mb-1">
                  <Flame size={14} />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Skill</span>
                </div>
                <span className="text-sm font-bold text-neutral-800">{activeRecipe.difficulty}</span>
              </div>
            </div>
          </div>

          {/* Recipe details */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Ingredients column */}
            <div>
              <h3 className="text-xs uppercase tracking-widest text-[#B71C1C] font-extrabold mb-4 pb-1 border-b border-neutral-200">
                1. Sourced Ingredients
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeRecipe.ingredients.map((ingredient, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs font-semibold text-neutral-700">
                    <Check size={14} className="text-[#234D20] flex-shrink-0" />
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Step by step directions */}
            <div>
              <h3 className="text-xs uppercase tracking-widest text-[#B71C1C] font-extrabold mb-4 pb-1 border-b border-neutral-200">
                2. Preparation Directions
              </h3>
              <ol className="space-y-4">
                {activeRecipe.instructions.map((step, idx) => (
                  <li key={idx} className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-[#1B1B1B] text-white flex items-center justify-center text-xs font-extrabold flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Nutrition Synergy Secret Tip */}
            <div className="bg-[#E0A106]/10 border border-[#E0A106]/30 rounded-xl p-5 relative overflow-hidden">
              <span className="text-[10px] uppercase tracking-widest text-[#E0A106] font-black block mb-1">
                Scientific Synergy Secret
              </span>
              <p className="text-xs text-neutral-700 leading-relaxed font-medium">
                {activeRecipe.tip}
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
