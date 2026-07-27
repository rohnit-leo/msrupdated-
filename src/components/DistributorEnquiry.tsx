/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Download, CheckCircle, FileText, Loader2, Award } from 'lucide-react';
import { addEnquiryToFirestore } from '../firebase';

export default function DistributorEnquiry() {
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    phone: '',
    email: '',
    city: '',
    type: 'Wholesale Distributor',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [brochureState, setBrochureState] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.businessName) {
      alert('Please fill out all mandatory fields.');
      return;
    }

    // Save distributor enquiry to Firestore in real-time
    try {
      addEnquiryToFirestore({
        ...formData,
        date: new Date().toLocaleString()
      });
    } catch (err) {
      console.error('Error saving distributor enquiry to Firestore:', err);
    }

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        businessName: '',
        phone: '',
        email: '',
        city: '',
        type: 'Wholesale Distributor',
        message: ''
      });
    }, 4000);
  };

  const handleDownloadBrochure = () => {
    setBrochureState('loading');
    setTimeout(() => {
      setBrochureState('success');
    }, 2000);
  };

  return (
    <section id="wholesale" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Information & Brochure Left Side */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div>
              <span className="text-[10px] uppercase font-extrabold tracking-[0.25em] text-[#B71C1C] block mb-2">
                Commercial Partnerships
              </span>
              <h2 className="font-display text-4xl sm:text-5xl font-black text-[#1B1B1B] leading-tight">
                Wholesale & distributor Partnerships
              </h2>
              <div className="w-16 h-[2px] bg-[#B71C1C] mt-4 mb-4"></div>
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-medium max-w-sm">
                Join our premium network to supply state-of-the-art scientifically purified spices directly to fine retailers, restaurants, and health-focused communities.
              </p>
            </div>

            {/* Premium Download Brochure Module */}
            <div className="bg-[#F8F8F4] border border-neutral-200/60 p-6 rounded-2xl relative overflow-hidden shadow-xs">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#E0A106]/10 rounded-bl-full pointer-events-none"></div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white border border-neutral-200 rounded-lg text-[#E0A106] shadow-sm flex-shrink-0">
                  <FileText size={22} />
                </div>
                <div>
                  <h4 className="font-display text-lg font-bold text-[#1B1B1B]">MSR Aroma Product Brochure</h4>
                  <p className="text-[11px] text-neutral-400 mt-1 uppercase font-bold tracking-wider">Scientific Catalog • 2026 Edition</p>
                  <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                    Review HPLC laboratory certifications, curcumin assays, packaging specifications, and our full retail range.
                  </p>

                  <div className="mt-4">
                    {brochureState === 'idle' && (
                      <button
                        onClick={handleDownloadBrochure}
                        className="px-4 py-2 bg-[#B71C1C] text-white text-[10px] font-extrabold uppercase tracking-widest rounded-lg shadow hover:bg-[#961818] transition-colors flex items-center gap-1.5"
                      >
                        <Download size={12} /> Download Brochure PDF
                      </button>
                    )}
                    {brochureState === 'loading' && (
                      <div className="flex items-center gap-2 text-[#E0A106] text-xs font-bold">
                        <Loader2 size={16} className="animate-spin" />
                        <span>Compiling laboratory results assays...</span>
                      </div>
                    )}
                    {brochureState === 'success' && (
                      <div className="p-2.5 bg-[#234D20]/10 border border-[#234D20]/30 rounded-lg flex items-center gap-2">
                        <CheckCircle size={16} className="text-[#234D20]" />
                        <div className="text-[10px] text-neutral-700 font-bold">
                          Brochure download initiated successfully!
                          <button
                            onClick={() => setBrochureState('idle')}
                            className="text-[#B71C1C] block hover:underline mt-0.5"
                          >
                            Download again?
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Corporate contact cards */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs text-neutral-600">
                <Phone size={14} className="text-[#B71C1C]" />
                <span>+91 83418 91704 / +91 83411 63205</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-neutral-600">
                <Mail size={14} className="text-[#B71C1C]" />
                <span>vmmspices@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-neutral-600">
                <MapPin size={14} className="text-[#B71C1C]" />
                <span>Telangana Sourcing Center, Hyderabad, India</span>
              </div>
            </div>
          </div>

          {/* Enquiry Interactive Form Right Side */}
          <div className="lg:col-span-7 bg-[#F8F8F4] border border-neutral-200/60 rounded-2xl p-6 sm:p-10 shadow-sm relative overflow-hidden flex flex-col justify-center">
            
            {isSubmitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-[#234D20]/10 border border-[#234D20]/30 rounded-full flex items-center justify-center text-[#234D20] mx-auto shadow-sm">
                  <CheckCircle size={32} />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold text-[#1B1B1B]">Partnership Query Received</h3>
                  <p className="text-xs text-neutral-500 mt-2 max-w-sm mx-auto">
                    Thank you. Your commercial inquiry has been registered in our CRM. Our Corporate Director, M. Shravan Kumar, will review your company profile and respond within 24 hours.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border-b border-neutral-200 pb-3">
                  <h3 className="font-display text-xl font-bold text-neutral-800">Direct Partner Registration</h3>
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-1">✓ Complete profile evaluation</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Vikram Rao"
                      className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#B71C1C]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block mb-1">Registered Business Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      placeholder="e.g. Rao Luxury Foods Ltd"
                      className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#B71C1C]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block mb-1">WhatsApp Mobile *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +91 9999999999"
                      className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#B71C1C]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block mb-1">Contact Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. partner@business.com"
                      className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#B71C1C]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block mb-1">Operating City/State</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Hyderabad, TS"
                      className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#B71C1C]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block mb-1">Partnership Interest Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#B71C1C] cursor-pointer font-semibold text-neutral-700"
                    >
                      <option value="Wholesale Distributor">Wholesale Distributor</option>
                      <option value="Become a Retail Partner">Become a Retail Partner</option>
                      <option value="Corporate Bulk Orders">Corporate Bulk Orders</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block mb-1">Business Query & Coverage Details</label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide details about your cold chain coverage, distribution warehouses, or bulk order quantities."
                    className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#B71C1C]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#1B1B1B] text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 shadow transition-colors flex items-center justify-center gap-1"
                >
                  <Award size={14} /> Submit Partnership Request
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
