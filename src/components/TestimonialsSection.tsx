/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { TESTIMONIALS } from '../data';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const activeTestimonial = TESTIMONIALS[activeIndex];

  return (
    <section id="testimonials" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-32 h-32 bg-[#B71C1C]/5 rounded-r-full blur-2xl pointer-events-none"></div>
      <div className="absolute top-1/3 right-0 w-32 h-32 bg-[#234D20]/5 rounded-l-full blur-2xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] uppercase font-extrabold tracking-[0.25em] text-[#B71C1C] block mb-2">
            Trust & Endorsements
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-black text-[#1B1B1B]">
            Echoes of Pure Trust
          </h2>
          <div className="w-12 h-[1px] bg-[#B71C1C] mx-auto mt-4 mb-4"></div>
          <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-medium">
            Hear from pediatricians, sustainable partner farmers, and luxury resort chefs who refuse to compromise on chemical purity.
          </p>
        </div>

        {/* Testimonial Active Display Slide */}
        <div className="max-w-4xl mx-auto bg-[#F8F8F4] border border-neutral-200/60 rounded-3xl p-8 sm:p-14 shadow-lg hover:shadow-xl transition-all duration-500 relative flex flex-col justify-between min-h-[340px]">
          
          {/* Quote watermark */}
          <Quote className="absolute right-10 top-10 text-neutral-200/80 w-24 h-24 select-none pointer-events-none" />

          <div className="space-y-6 relative z-10">
            {/* Stars */}
            <div className="flex gap-1">
              {Array(activeTestimonial.rating).fill(null).map((_, i) => (
                <Star key={i} size={16} className="fill-[#E0A106] text-[#E0A106]" />
              ))}
            </div>

            {/* Comment */}
            <blockquote className="font-display text-xl sm:text-2xl font-semibold italic text-neutral-800 leading-relaxed">
              "{activeTestimonial.comment}"
            </blockquote>
          </div>

          {/* Author info & slide controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-8 border-t border-neutral-200/60 mt-8 relative z-10">
            <div>
              <h4 className="font-display text-lg font-bold text-[#1B1B1B]">
                {activeTestimonial.name}
              </h4>
              <p className="text-[10px] uppercase font-bold tracking-wider text-[#234D20] mt-0.5">
                {activeTestimonial.role} • {activeTestimonial.date}
              </p>
            </div>

            {/* Slide Arrows */}
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                className="p-3 bg-white border border-neutral-200 rounded-full hover:bg-neutral-100 text-neutral-600 transition-colors shadow-sm focus:outline-none"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNext}
                className="p-3 bg-white border border-neutral-200 rounded-full hover:bg-neutral-100 text-neutral-600 transition-colors shadow-sm focus:outline-none"
                aria-label="Next testimonial"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
