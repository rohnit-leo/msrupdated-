/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { TIMELINE } from '../data';
import { MapPin, Sprout, ClipboardCheck, Award } from 'lucide-react';

export default function InteractiveTimeline() {
  const [activeStage, setActiveStage] = useState(0);

  const icons = [
    <Sprout size={18} />,
    <ClipboardCheck size={18} />,
    <MapPin size={18} />,
    <Award size={18} />,
    <Award size={18} />
  ];

  return (
    <section id="timeline" className="py-24 bg-[#F8F8F4] border-t border-b border-neutral-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] uppercase font-extrabold tracking-[0.25em] text-[#B71C1C] block mb-2">
            Seed to Savor Traceability
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-black text-[#1B1B1B]">
            Journey From Farm to Kitchen
          </h2>
          <div className="w-12 h-[1px] bg-[#B71C1C] mx-auto mt-4 mb-4"></div>
          <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-medium">
            At MSR Aroma Private Limited, transparency is our premium trademark. Click each stage below to witness our scientific rigor.
          </p>
        </div>

        {/* Timeline Navigation Dots */}
        <div className="relative mb-12 max-w-4xl mx-auto">
          {/* Progress Bar Line */}
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-neutral-200 -translate-y-1/2 z-0"></div>
          <div
            className="absolute top-1/2 left-0 h-[2px] bg-[#B71C1C] -translate-y-1/2 z-0 transition-all duration-500"
            style={{ width: `${(activeStage / (TIMELINE.length - 1)) * 100}%` }}
          ></div>

          {/* Nav Nodes */}
          <div className="flex justify-between items-center relative z-10">
            {TIMELINE.map((step, idx) => {
              const isCompleted = idx <= activeStage;
              const isActive = idx === activeStage;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStage(idx)}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all duration-500 ${
                    isActive
                      ? 'bg-[#B71C1C] border-[#B71C1C] text-white shadow-lg scale-110'
                      : isCompleted
                      ? 'bg-[#234D20] border-[#234D20] text-white'
                      : 'bg-white border-neutral-200 text-neutral-400 hover:border-neutral-400'
                  }`}
                  aria-label={`Go to stage ${step.stage}`}
                >
                  {step.stage}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Stage Presentation Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-neutral-200/50 p-6 sm:p-10 shadow-xl transition-all duration-500 hover:shadow-2xl relative overflow-hidden">
          {/* Subtle elegant watermarked stage identifier */}
          <div className="absolute right-4 bottom-[-20px] text-[100px] sm:text-[140px] font-black font-display text-neutral-100/70 select-none pointer-events-none">
            {TIMELINE[activeStage].stage}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            
            {/* Stage Title and Location Info */}
            <div className="md:col-span-1 space-y-4">
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-[#234D20] bg-[#234D20]/10 px-3 py-1 rounded-full border border-[#234D20]/20">
                Active Stage {TIMELINE[activeStage].stage}
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#1B1B1B] leading-tight">
                {TIMELINE[activeStage].title}
              </h3>
              
              <div className="flex items-center gap-2 text-xs font-bold text-[#B71C1C] bg-[#B71C1C]/5 p-2 rounded-lg border border-[#B71C1C]/10 w-fit">
                <MapPin size={14} />
                <span>{TIMELINE[activeStage].location}</span>
              </div>
            </div>

            {/* Stage Detailed Narrative */}
            <div className="md:col-span-2 flex flex-col justify-between space-y-6">
              <p className="text-sm text-neutral-600 leading-relaxed">
                {TIMELINE[activeStage].description}
              </p>

              {/* Lab verification footer check */}
              <div className="border-t border-neutral-100 pt-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#234D20]/10 flex items-center justify-center text-[#234D20] flex-shrink-0">
                  <ClipboardCheck size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-800">Quality Verified Sourcing</h4>
                  <p className="text-[10px] text-neutral-500">Subject to HPLC Chromatography Curcumin/Capsaicin tests.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
