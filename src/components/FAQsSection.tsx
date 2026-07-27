/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { FAQS } from '../data';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQsSection() {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);

  const toggleExpand = (idx: number) => {
    setExpandedIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faqs" className="py-24 bg-[#F8F8F4] border-t border-b border-neutral-200/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] uppercase font-extrabold tracking-[0.25em] text-[#B71C1C] block mb-2">
            Clarifications & Transparency
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-black text-[#1B1B1B]">
            Frequently Asked Queries
          </h2>
          <div className="w-12 h-[1px] bg-[#B71C1C] mx-auto mt-4 mb-4"></div>
          <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-medium">
            Explore our scientific methodologies, direct agri-preservation systems, and secure WhatsApp pre-ordering protocols.
          </p>
        </div>

        {/* Accordion Stack */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isExpanded = expandedIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-neutral-200/60 overflow-hidden shadow-xs transition-all duration-300 hover:shadow-md"
              >
                {/* Accordion Title Trigger */}
                <button
                  onClick={() => toggleExpand(idx)}
                  className="w-full text-left p-6 flex items-center justify-between gap-4 focus:outline-none focus:ring-0"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle size={16} className="text-[#B71C1C] flex-shrink-0" />
                    <span className="font-display text-base sm:text-lg font-bold text-[#1B1B1B]">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`text-neutral-400 flex-shrink-0 transition-transform duration-500 ${isExpanded ? 'rotate-180 text-[#B71C1C]' : ''}`}
                  />
                </button>

                {/* Accordion Body Panel */}
                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isExpanded ? 'max-h-[300px] border-t border-neutral-100 p-6 bg-neutral-50/50' : 'max-h-0'
                  }`}
                >
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-medium">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
