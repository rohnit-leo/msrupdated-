/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShieldAlert, ShieldCheck, AlertCircle, Sparkles, AlertTriangle } from 'lucide-react';

export default function HealthComparison() {
  const points = [
    {
      title: 'Dyes & Colorants',
      market: 'Industrial Sudan Red dyes, Lead Chromate for yellow shine, toxic carcinogenic materials.',
      aroma: '100% natural, deep hues achieved solely by selecting high-capsaicin chillies and high-curcumin rhizomes.',
    },
    {
      title: 'Bulk Fillers & Starch',
      market: 'Chalk powder, brick dust, husks, spent materials, and cheap flour starches to artificial swell weight.',
      aroma: 'Absolutely zero fillers. Every gram is pure spice milled straight from premium whole seed harvests.',
    },
    {
      title: 'Aromatic Volatile Oils',
      market: 'Grinding at high speeds generates temperatures over 60°C, vaporizing healing oils and leaving stale residue.',
      aroma: 'Cryo-cooled milling preserves linalool, curcumin, and volatile pinene oils for intense aroma and wellness.',
    },
    {
      title: 'Traceability & Origin',
      market: 'Anonymous open warehouse bulk collections mixed from multiple states with high pesticide residues.',
      aroma: 'B.Sc Agronomist monitored, direct-farmer contracts from pristine Telangana red-soil farmlands.',
    },
    {
      title: 'Hygienic Preservation',
      market: 'Stored in open gunny bags susceptible to high humidity, fungal aflatoxins, and pest contamination.',
      aroma: 'Three-layer food-grade nitrogen-sealed pouches completely locking out moisture and UV deterioration.',
    }
  ];

  return (
    <section id="quality" className="py-24 bg-[#F8F8F4] border-t border-b border-neutral-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] uppercase font-extrabold tracking-[0.25em] text-[#B71C1C] block mb-2">
            Protecting Your Family
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-black text-[#1B1B1B] leading-tight">
            Your Kitchen Deserves Better.
          </h2>
          <div className="w-12 h-[1px] bg-[#B71C1C] mx-auto mt-4 mb-4"></div>
          <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-medium">
            Standard market spices are often loaded with chemical fillers and artificial coloring. Understand the stark clinical difference.
          </p>
        </div>

        {/* Visual Dual Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Market Spices Threat Card */}
          <div className="bg-white border border-red-200/60 rounded-2xl p-6 sm:p-10 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-bl-full pointer-events-none"></div>
            
            <div>
              <div className="flex items-center gap-3 text-[#B71C1C] mb-6">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold">Standard Market Spices</h3>
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400">Industry Compromises</p>
                </div>
              </div>

              <div className="space-y-6">
                {points.map((point, index) => (
                  <div key={index} className="flex items-start gap-3 pb-5 border-b border-neutral-100 last:border-b-0 last:pb-0">
                    <AlertCircle size={16} className="text-[#B71C1C] mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-xs font-extrabold text-[#1B1B1B] uppercase tracking-wider">{point.title}</h4>
                      <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{point.market}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center gap-2 text-xs font-bold text-[#B71C1C] bg-red-50 p-3 rounded-xl">
              <AlertTriangle size={16} />
              <span>Chronic exposure to synthetic dyes poses long-term gastrointestinal health risks.</span>
            </div>
          </div>

          {/* MSR Aroma Pure Solution Card */}
          <div className="bg-white border border-[#234D20]/30 rounded-2xl p-6 sm:p-10 shadow-xl flex flex-col justify-between relative overflow-hidden ring-1 ring-[#234D20]/10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#234D20]/5 rounded-bl-full pointer-events-none"></div>
            
            <div>
              <div className="flex items-center gap-3 text-[#234D20] mb-6">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold">MSR Aroma Private Limited</h3>
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400">The Mother\'s Standard</p>
                </div>
              </div>

              <div className="space-y-6">
                {points.map((point, index) => (
                  <div key={index} className="flex items-start gap-3 pb-5 border-b border-neutral-100 last:border-b-0 last:pb-0">
                    <ShieldCheck size={16} className="text-[#234D20] mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-xs font-extrabold text-[#1B1B1B] uppercase tracking-wider">{point.title}</h4>
                      <p className="text-xs text-neutral-600 mt-1 leading-relaxed">{point.aroma}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center gap-2 text-xs font-bold text-[#234D20] bg-emerald-50 p-3 rounded-xl">
              <Sparkles size={16} className="text-[#E0A106]" />
              <span>Scientifically tested pure whole spices for premium dietary safety and taste.</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
