/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { X, CheckCircle, ShieldCheck, Heart, Sparkles, Container, Utensils, Clock, UserCheck } from 'lucide-react';
import { Product } from '../types';
import { RECIPES } from '../data';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  if (!product) return null;

  const [activeTab, setActiveTab] = useState<'benefits' | 'ingredients' | 'nutrition' | 'packaging' | 'recipe'>('benefits');

  // Find relevant recipe for this product
  const matchingRecipe = RECIPES.find(r => {
    const pName = product.name.toLowerCase();
    const rName = r.name.toLowerCase();
    if (pName.includes('turmeric') || pName.includes('haldi')) return rName.includes('haldi') || rName.includes('turmeric');
    if (pName.includes('chilli') || pName.includes('chili')) return rName.includes('chilli');
    if (pName.includes('chicken')) return rName.includes('chicken');
    if (pName.includes('garam')) return rName.includes('garam');
    if (pName.includes('coriander')) return rName.includes('coriander');
    if (pName.includes('jeera') || pName.includes('cumin')) return rName.includes('jeera') || rName.includes('cumin');
    return false;
  }) || RECIPES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-neutral-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Hero Banner */}
        <div className="relative h-48 bg-[#F8F8F4] overflow-hidden flex items-center justify-center p-6 border-b border-neutral-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 text-neutral-700 hover:bg-neutral-100 transition-colors shadow"
          >
            <X size={18} />
          </button>

          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover opacity-15 blur-sm"
            referrerPolicy="no-referrer"
          />

          <div className="text-center z-10">
            {product.badge && (
              <span className="inline-block px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest bg-[#B71C1C] text-white rounded-full mb-2">
                {product.badge}
              </span>
            )}
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1B1B1B]">
              {product.name}
            </h2>
            <p className="text-xs font-bold text-[#234D20] uppercase tracking-wider mt-1">
              100% Scientific Purity Guaranteed
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto">
          {/* Main Description */}
          <div className="mb-6">
            <h3 className="text-xs uppercase tracking-widest text-neutral-400 font-bold mb-2">The Heritage Profile</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Luxury Tab Navigation */}
          <div className="flex border-b border-neutral-200 mb-6 overflow-x-auto whitespace-nowrap scrollbar-none">
            <button
              onClick={() => setActiveTab('benefits')}
              className={`pb-3 text-xs uppercase font-bold tracking-wider border-b-2 mr-6 transition-all duration-300 ${
                activeTab === 'benefits' ? 'border-[#B71C1C] text-[#B71C1C]' : 'border-transparent text-neutral-400 hover:text-neutral-600'
              }`}
            >
              Health Benefits
            </button>
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`pb-3 text-xs uppercase font-bold tracking-wider border-b-2 mr-6 transition-all duration-300 ${
                activeTab === 'ingredients' ? 'border-[#B71C1C] text-[#B71C1C]' : 'border-transparent text-neutral-400 hover:text-neutral-600'
              }`}
            >
              Ingredients & Origin
            </button>
            <button
              onClick={() => setActiveTab('nutrition')}
              className={`pb-3 text-xs uppercase font-bold tracking-wider border-b-2 mr-6 transition-all duration-300 ${
                activeTab === 'nutrition' ? 'border-[#B71C1C] text-[#B71C1C]' : 'border-transparent text-neutral-400 hover:text-neutral-600'
              }`}
            >
              Nutritional Profile
            </button>
            <button
              onClick={() => setActiveTab('packaging')}
              className={`pb-3 text-xs uppercase font-bold tracking-wider border-b-2 mr-6 transition-all duration-300 ${
                activeTab === 'packaging' ? 'border-[#B71C1C] text-[#B71C1C]' : 'border-transparent text-neutral-400 hover:text-neutral-600'
              }`}
            >
              Premium Packaging
            </button>
            <button
              onClick={() => setActiveTab('recipe')}
              className={`pb-3 text-xs uppercase font-bold tracking-wider border-b-2 transition-all duration-300 flex items-center gap-1.5 ${
                activeTab === 'recipe' ? 'border-[#B71C1C] text-[#B71C1C]' : 'border-transparent text-neutral-400 hover:text-neutral-600'
              }`}
            >
              <Utensils size={14} /> Cooking Recipe
            </button>
          </div>

          {/* Tab Content Panels */}
          <div className="min-h-[160px]">
            {/* Health Benefits Tab */}
            {activeTab === 'benefits' && (
              <div className="space-y-3">
                {product.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle size={16} className="text-[#234D20] mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-neutral-700 leading-relaxed">{benefit}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Ingredients & Origin Tab */}
            {activeTab === 'ingredients' && (
              <div className="space-y-4">
                <div className="bg-[#F8F8F4] p-4 rounded-xl border border-neutral-200/50">
                  <h4 className="text-xs uppercase tracking-widest text-[#B71C1C] font-bold mb-1.5">Composition</h4>
                  <p className="text-sm font-semibold text-[#1B1B1B]">
                    {product.ingredients.join(', ')}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-neutral-400 font-bold mb-1">Storage Parameters</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                    {product.storageInstructions}
                  </p>
                </div>
              </div>
            )}

            {/* Nutritional Profile Tab */}
            {activeTab === 'nutrition' && (
              <div className="border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F8F8F4] border-b border-neutral-200 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                      <th className="px-4 py-2.5">Parameter (per 100g)</th>
                      <th className="px-4 py-2.5 text-right">Value</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs text-neutral-700 divide-y divide-neutral-100">
                    <tr>
                      <td className="px-4 py-2.5 font-medium">Energy</td>
                      <td className="px-4 py-2.5 text-right font-bold">{product.nutritionalInfo.energy}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-medium">Carbohydrates</td>
                      <td className="px-4 py-2.5 text-right font-bold">{product.nutritionalInfo.carbohydrates}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-medium">Protein</td>
                      <td className="px-4 py-2.5 text-right font-bold">{product.nutritionalInfo.protein}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-medium">Dietary Fat</td>
                      <td className="px-4 py-2.5 text-right font-bold">{product.nutritionalInfo.fat}</td>
                    </tr>
                    {product.nutritionalInfo.sodium && (
                      <tr>
                        <td className="px-4 py-2.5 font-medium">Sodium</td>
                        <td className="px-4 py-2.5 text-right font-bold">{product.nutritionalInfo.sodium}</td>
                      </tr>
                    )}
                    {product.nutritionalInfo.curcumin && (
                      <tr className="bg-[#E0A106]/10 text-[#E0A106]">
                        <td className="px-4 py-2.5 font-bold">Active Curcumin Content</td>
                        <td className="px-4 py-2.5 text-right font-extrabold">{product.nutritionalInfo.curcumin}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Packaging Tab */}
            {activeTab === 'packaging' && (
              <div className="flex items-start gap-4 bg-[#F8F8F4]/80 p-4 rounded-xl border border-neutral-200/50">
                <div className="p-3 bg-white rounded-lg text-[#B71C1C] border border-neutral-200 shadow-sm flex-shrink-0">
                  <Container size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1B1B1B] mb-1">Scientific Barrier Preservation</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {product.packagingDetails}
                  </p>
                  <div className="flex items-center gap-1.5 mt-3 text-[10px] font-bold uppercase tracking-wider text-[#234D20]">
                    <ShieldCheck size={14} /> Zero Moisture • Zero Oxidation • Zero Color Fading
                  </div>
                </div>
              </div>
            )}

            {/* Recipe Tab */}
            {activeTab === 'recipe' && (
              <div className="space-y-4 bg-[#F8F8F4]/80 p-4 rounded-xl border border-neutral-200/50">
                <div className="flex items-center justify-between border-b border-neutral-200/60 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-[#1B1B1B]">{matchingRecipe.name}</h4>
                    <div className="flex items-center gap-3 text-[11px] text-neutral-500 mt-1 font-medium">
                      <span className="flex items-center gap-1"><Clock size={12} className="text-[#B71C1C]" /> {matchingRecipe.time}</span>
                      <span className="flex items-center gap-1"><UserCheck size={12} className="text-[#234D20]" /> Serves {matchingRecipe.servings}</span>
                      <span className="bg-[#234D20]/10 text-[#234D20] px-2 py-0.5 rounded text-[9px] font-bold uppercase">{matchingRecipe.difficulty}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-800 mb-2">Ingredients</h5>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-neutral-600">
                    {matchingRecipe.ingredients.map((ing, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B71C1C] flex-shrink-0" />
                        <span>{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-800 mb-2">Cooking Instructions</h5>
                  <ol className="space-y-2 text-xs text-neutral-600 leading-relaxed">
                    {matchingRecipe.instructions.map((step, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-[#234D20] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {matchingRecipe.tip && (
                  <div className="p-3 bg-[#E0A106]/10 border border-[#E0A106]/30 rounded-lg text-xs text-[#1B1B1B]">
                    <span className="font-bold text-[#B71C1C]">Master Chef Tip:</span> {matchingRecipe.tip}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#F8F8F4] border-t border-neutral-200 flex items-center justify-between">
          <span className="text-xs text-neutral-500 flex items-center gap-1">
            <Sparkles size={14} className="text-[#E0A106]" /> Sourced from verified Indian farmers
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#1B1B1B] text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
}
