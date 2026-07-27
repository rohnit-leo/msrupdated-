/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FOUNDERS as DEFAULT_FOUNDERS } from '../data';
import { Founder } from '../types';
import { Quote, Sparkles, Sprout, HeartHandshake } from 'lucide-react';

interface FoundersSectionProps {
  founders?: Founder[];
}

export default function FoundersSection({ founders }: FoundersSectionProps) {
  const displayFounders = (founders && founders.length > 0) ? founders : DEFAULT_FOUNDERS;
  return (
    <section id="story" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        
        {/* Brand Story block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left panel: text brand storytelling */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[10px] uppercase font-extrabold tracking-[0.25em] text-[#B71C1C] block">
              Heritage & Maternal Promise
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-[#1B1B1B] leading-tight">
              Our Story Begins With<br />A Mother's Promise
            </h2>
            <div className="w-16 h-[2px] bg-[#B71C1C]"></div>
            
            <div className="space-y-4 text-neutral-600 font-medium text-xs sm:text-sm leading-relaxed">
              <p>
                MSR Aroma Private Limited was born from one simple belief—every Indian family deserves spices that are as pure as those prepared in their own home.
              </p>
              <p>
                While the commercial market became crowded with cheap artificial colors, bulk starches, and adulterated chemical powders, our founders envisioned something radically different.
              </p>
              <p>
                We established a premium workspace where advanced agricultural science, soil analytics, and ancient culinary traditions work hand-in-hand. Every single pouch carries not only premium single-origin spices, but also a mother's uncompromising promise of dietary health and safety.
              </p>
            </div>

            {/* Farm direct promise sub-alert */}
            <div className="p-4 bg-[#234D20]/5 rounded-xl border border-[#234D20]/10 flex items-start gap-3">
              <Sprout className="text-[#234D20] mt-0.5 flex-shrink-0" size={18} />
              <div>
                <h4 className="text-xs font-bold text-neutral-800">Sustainable Farmer Trust</h4>
                <p className="text-[10px] text-neutral-500 leading-relaxed">
                  We contract directly with marginal Telangana farms, conducting pre-harvest soil analyses and offering fair sustainable wages, which protects agricultural ecosystems.
                </p>
              </div>
            </div>
          </div>

          {/* Right panel: artistic visual representation */}
          <div className="lg:col-span-5 bg-[#F8F8F4] border border-neutral-200/60 rounded-3xl p-8 sm:p-10 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[360px]">
            <div className="absolute top-[-10px] left-[-10px] text-[120px] font-black text-neutral-100/50 pointer-events-none select-none">
              MSR
            </div>
            
            <div className="space-y-6 relative z-10">
              <span className="text-xs font-black text-[#B71C1C] uppercase tracking-widest block">
                Single-Origin Standards
              </span>
              <p className="font-display text-xl sm:text-2xl font-bold italic text-neutral-800 leading-relaxed">
                "Spices should heal, not harm. We founded MSR Aroma to treat every consumer as a extension of our own home kitchen."
              </p>
            </div>

            <div className="border-t border-neutral-200/80 pt-6 flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-full bg-[#B71C1C]/10 flex items-center justify-center text-[#B71C1C] flex-shrink-0">
                <HeartHandshake size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-neutral-800">100% Additive Free</h4>
                <p className="text-[10px] text-neutral-500">Meticulously sifted, cool-milled, and safety sealed.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Founders Grid */}
        <div>
          {/* Founders Subsection Title */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] uppercase font-extrabold tracking-[0.25em] text-[#B71C1C] block mb-2">
              The Directors Board
            </span>
            <h3 className="font-display text-3xl sm:text-4xl font-bold text-[#1B1B1B]">
              Meet Our Visionaries
            </h3>
            <div className="w-8 h-[1px] bg-[#B71C1C] mx-auto mt-3"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayFounders.map((founder, idx) => (
              <div
                key={idx}
                className="group bg-[#F8F8F4] rounded-2xl border border-neutral-200/60 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
              >
                {/* Image panel */}
                <div className="relative aspect-square overflow-hidden bg-neutral-100 border-b border-neutral-100">
                  <img
                    src={founder.image}
                    alt={founder.name}
                    className="w-full h-full object-cover transition-transform duration-750 ease-out group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-transparent opacity-80"></div>
                  
                  <div className="absolute bottom-4 left-4 text-white">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#E0A106]">
                      {founder.credentials}
                    </span>
                    <h4 className="font-display text-xl font-bold mt-1">
                      {founder.name}
                    </h4>
                    <p className="text-[10px] tracking-wider text-neutral-300 font-medium">
                      {founder.role}
                    </p>
                  </div>
                </div>

                {/* Text bio details */}
                <div className="p-6 flex-1 flex flex-col justify-between bg-white">
                  <p className="text-xs text-neutral-500 leading-relaxed font-medium">
                    {founder.description}
                  </p>

                  {/* Highlight Quote */}
                  <div className="mt-5 pt-4 border-t border-neutral-100 bg-[#F8F8F4]/50 p-3 rounded-lg relative">
                    <Quote size={14} className="text-[#B71C1C]/40 absolute top-2 left-2" />
                    <p className="text-[11px] italic font-semibold text-neutral-700 leading-relaxed pl-4">
                      {founder.quote}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
