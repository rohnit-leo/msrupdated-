/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { BLOGS } from '../data';
import { BookOpen, Calendar, Clock, ArrowRight, X } from 'lucide-react';
import { BlogPost } from '../types';

export default function KnowledgeCenter() {
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);

  return (
    <section id="knowledge" className="py-24 bg-[#F8F8F4] border-t border-b border-neutral-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] uppercase font-extrabold tracking-[0.25em] text-[#B71C1C] block mb-2">
            Spice Knowledge Center
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-black text-[#1B1B1B]">
            Scientific Wellness Blog
          </h2>
          <div className="w-12 h-[1px] bg-[#B71C1C] mx-auto mt-4 mb-4"></div>
          <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-medium">
            Learn how agricultural science, chemical purity, and holistic wellness interconnect to make MSR Aroma the benchmark of quality.
          </p>
        </div>

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BLOGS.map((blog) => (
            <div
              key={blog.id}
              className="group bg-white rounded-2xl border border-neutral-200/60 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
            >
              {/* Image Block */}
              <div className="relative aspect-video overflow-hidden bg-neutral-100 border-b border-neutral-100">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-750 ease-out group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-4 left-4 z-10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest bg-[#1B1B1B] text-white rounded-full">
                  {blog.category}
                </span>
              </div>

              {/* Text Block */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 text-[10px] text-neutral-400 font-semibold uppercase mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {blog.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {blog.readTime}
                    </span>
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#1B1B1B] group-hover:text-[#B71C1C] transition-colors duration-300">
                    {blog.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-500 mt-3 leading-relaxed line-clamp-3">
                    {blog.summary}
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-neutral-100">
                  <button
                    onClick={() => setActiveArticle(blog)}
                    className="text-xs font-bold uppercase tracking-wider text-[#B71C1C] hover:text-[#961818] flex items-center gap-2 group/btn"
                  >
                    Read Scientific Article <ArrowRight size={14} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Article Overlay Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setActiveArticle(null)}>
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative border border-neutral-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Banner */}
            <div className="relative h-56 bg-neutral-100 overflow-hidden">
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 text-neutral-700 hover:bg-neutral-100 transition-colors shadow"
              >
                <X size={18} />
              </button>
              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <span className="absolute bottom-4 left-6 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest bg-[#B71C1C] text-white rounded-full">
                {activeArticle.category}
              </span>
            </div>

            {/* Editorial Content */}
            <div className="p-6 sm:p-10">
              <div className="flex items-center gap-4 text-[10px] text-neutral-400 font-semibold uppercase mb-4">
                <span className="flex items-center gap-1">
                  <Calendar size={12} /> {activeArticle.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {activeArticle.readTime}
                </span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1B1B1B] leading-tight mb-6">
                {activeArticle.title}
              </h2>

              <div className="space-y-4 text-xs sm:text-sm text-neutral-600 leading-relaxed font-medium">
                {activeArticle.content.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-[#F8F8F4] border-t border-neutral-100 flex justify-end">
              <button
                onClick={() => setActiveArticle(null)}
                className="px-5 py-2 rounded-lg bg-[#1B1B1B] text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
