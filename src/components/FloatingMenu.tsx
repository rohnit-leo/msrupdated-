/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { MessageSquare, Phone, Briefcase, Mail, Plus, X } from 'lucide-react';

export default function FloatingMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const handleScrollTo = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const menuItems = [
    {
      id: 'whatsapp',
      label: 'WhatsApp Chat',
      icon: <MessageSquare size={18} />,
      color: 'bg-[#25D366] text-white hover:bg-[#20ba5a]',
      href: 'https://wa.me/918341163205?text=Hello%20MSR%20Aroma%20Private%20Limited!%20I%20am%20interested%20in%20learning%20more%20about%20your%20scientifically%20pure%20and%20additive-free%20spices.',
      target: '_blank',
    },
    {
      id: 'call',
      label: 'Call Helpline',
      icon: <Phone size={18} />,
      color: 'bg-blue-600 text-white hover:bg-blue-700',
      href: 'tel:+918341163205',
    },
    {
      id: 'bulk',
      label: 'Bulk Order / Wholesale',
      icon: <Briefcase size={18} />,
      color: 'bg-[#E0A106] text-white hover:bg-[#c58d05]',
      onClick: () => handleScrollTo('wholesale'),
    },
    {
      id: 'enquiry',
      label: 'Direct Client Enquiry',
      icon: <Mail size={18} />,
      color: 'bg-[#B71C1C] text-white hover:bg-[#961818]',
      onClick: () => handleScrollTo('contact'),
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3" id="expandable-floating-menu">
      {/* Expanded Menu Actions */}
      {isOpen && (
        <div className="flex flex-col items-end gap-3 mb-1 animate-fade-in">
          {menuItems.map((item, index) => {
            const buttonContent = (
              <>
                <span className="mr-2 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#1B1B1B] text-white rounded-md shadow-md border border-neutral-700 pointer-events-none whitespace-nowrap">
                  {item.label}
                </span>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border border-white/20 transition-all duration-300 hover:scale-110 active:scale-95 ${item.color}`}>
                  {item.icon}
                </div>
              </>
            );

            return item.href ? (
              <a
                key={item.id}
                href={item.href}
                target={item.target}
                rel="noopener noreferrer"
                className="flex items-center justify-end group transition-all duration-300 transform translate-y-0"
                style={{
                  animation: `slideUp 0.2s ease-out ${index * 0.05}s both`,
                }}
                onClick={() => setIsOpen(false)}
              >
                {buttonContent}
              </a>
            ) : (
              <button
                key={item.id}
                onClick={item.onClick}
                className="flex items-center justify-end group transition-all duration-300 focus:outline-none"
                style={{
                  animation: `slideUp 0.2s ease-out ${index * 0.05}s both`,
                }}
              >
                {buttonContent}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform active:scale-90 focus:outline-none relative ${
          isOpen
            ? 'bg-[#1B1B1B] text-white border border-neutral-700 rotate-180'
            : 'bg-[#B71C1C] text-white border border-white/20 hover:scale-105 hover:bg-[#961818]'
        }`}
        aria-label="Direct Assistance Liaison Menu"
      >
        {/* Pulsing Outer Ring (only when closed) */}
        {!isOpen && (
          <span className="absolute -inset-1 rounded-full bg-[#B71C1C]/30 animate-ping opacity-65 pointer-events-none"></span>
        )}

        {isOpen ? (
          <X size={24} className="transition-transform duration-300" />
        ) : (
          <Plus size={26} className="transition-transform duration-300" />
        )}
      </button>

      {/* Custom Keyframe Styles to avoid manual CSS dependencies */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
