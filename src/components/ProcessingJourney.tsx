/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { PROCESSING_STEPS } from '../data';
import { Flame, Activity, ShieldCheck, Snowflake } from 'lucide-react';

export default function ProcessingJourney() {
  const [activeStep, setActiveStep] = useState(0);

  const icons = [
    <Activity size={24} className="text-[#B71C1C]" />,
    <Snowflake size={24} className="text-sky-600" />,
    <Activity size={24} className="text-[#E0A106]" />,
    <ShieldCheck size={24} className="text-[#234D20]" />
  ];

  return (
    <section id="processing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Heading */}
        <div className="max-w-3xl mb-16">
          <span className="text-[10px] uppercase font-extrabold tracking-[0.25em] text-[#B71C1C] block mb-2">
            Food-Tech Engineering
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-black text-[#1B1B1B] leading-tight">
            Our Processing Journey:<br />
            The Alchemy of Preserving Aroma
          </h2>
          <div className="w-16 h-[2px] bg-[#B71C1C] mt-4 mb-4"></div>
          <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed max-w-2xl font-medium">
            While local grinders run hot, destroying the spice's healing oils, MSR Aroma Private Limited utilizes custom liquid-chilled cold-milling systems. Explore our technical steps.
          </p>
        </div>

        {/* Interactive Dual-Panel Board */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left panel: step selector cards */}
          <div className="lg:col-span-5 space-y-4">
            {PROCESSING_STEPS.map((step, idx) => {
              const isActive = idx === activeStep;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(idx)}
                  className={`w-full text-left p-5 rounded-xl border transition-all duration-300 flex items-start gap-4 focus:outline-none ${
                    isActive
                      ? 'bg-[#F8F8F4] border-[#B71C1C]/40 shadow-md ring-1 ring-[#B71C1C]/20'
                      : 'bg-white border-neutral-200/60 hover:border-neutral-300 hover:bg-neutral-50'
                  }`}
                >
                  <div className={`p-3 rounded-lg border flex-shrink-0 transition-colors duration-300 ${
                    isActive ? 'bg-white border-neutral-300 shadow-sm' : 'bg-[#F8F8F4] border-transparent'
                  }`}>
                    {icons[idx]}
                  </div>

                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-bold block">
                      Step 0{idx + 1} • {step.subtitle}
                    </span>
                    <h3 className="font-display text-base font-extrabold text-[#1B1B1B] mt-0.5">
                      {step.title}
                    </h3>
                    <span className="text-[10px] font-bold text-[#234D20] uppercase tracking-widest mt-1 block">
                      {step.techDetail}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right panel: visual showcase of selected step */}
          <div className="lg:col-span-7 bg-[#F8F8F4] border border-neutral-200/60 rounded-2xl p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden shadow-sm">
            
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white bg-[#B71C1C] px-3 py-1 rounded-full uppercase tracking-wider">
                  Technical specifications
                </span>
                <span className="text-xs font-semibold text-neutral-400">
                  Batch Verified 
                </span>
              </div>

              <div>
                <h3 className="font-display text-3xl font-black text-[#1B1B1B] leading-tight">
                  {PROCESSING_STEPS[activeStep].title}
                </h3>
                <p className="text-sm font-semibold text-[#234D20] uppercase tracking-widest mt-1.5">
                  {PROCESSING_STEPS[activeStep].subtitle}
                </p>
              </div>

              <p className="text-sm text-neutral-600 leading-relaxed max-w-xl">
                {PROCESSING_STEPS[activeStep].description}
              </p>
            </div>

            {/* Scientific Verification Label */}
            <div className="mt-8 pt-6 border-t border-neutral-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-neutral-800">Precision Indicator</p>
                <p className="text-[10px] text-[#234D20] font-bold uppercase tracking-wider mt-0.5">
                  ✓ {PROCESSING_STEPS[activeStep].techDetail}
                </p>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <Flame size={14} className="text-[#B71C1C] animate-pulse" />
                <span>Protects thermolabile phytonutrients</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
