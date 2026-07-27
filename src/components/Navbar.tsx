/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { PRODUCTS } from '../data';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onProductClick?: (product: any) => void;
}

export default function Navbar({
  cartCount,
  onCartClick,
  onSearch,
  searchQuery,
  setSearchQuery,
  onProductClick,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Our Story', href: '#story' },
    { name: 'Why MSR', href: '#why-msr' },
    { name: 'Processing', href: '#processing' },
    { name: 'Products', href: '#products' },
    { name: 'Quality & Science', href: '#science' },
    { name: 'Recipes', href: '#recipes' },
    { name: 'Video Gallery', href: '#gallery' },
    { name: 'FAQs', href: '#faqs' },
    { name: 'Contact', href: '#contact' },
  ];

  const matchedProducts = searchQuery.trim()
    ? PRODUCTS.filter(
        (prod) =>
          prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prod.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prod.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  return (
    <>
      <nav
        id="navbar"
        className={`w-full transition-all duration-300 ease-in-out border-b ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md py-1 shadow-sm border-neutral-200/30'
            : 'bg-white py-3 border-neutral-200/50'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo Brand Title - compact and elegant logo */}
          <a href="#home" className="flex items-center group py-0.5" id="logo-link">
            <img 
              src="https://a8cw5fshupvoh5ik.public.blob.vercel-storage.com/IMG_2829.PNG" 
              alt="MSR Aroma" 
              className={`${
                isScrolled ? 'h-8 sm:h-9 md:h-10' : 'h-10 sm:h-11 md:h-12'
              } w-auto object-contain transition-all duration-300 group-hover:scale-105`}
              referrerPolicy="no-referrer"
            />
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-semibold uppercase tracking-wider text-[#1B1B1B]/80 transition-all duration-300 hover:text-[#B71C1C] relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-[#B71C1C] after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Icons Bar */}
          <div className="flex items-center space-x-4">
            {/* Search Toggle */}
            <div className="relative">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-full transition-all duration-300 hover:bg-neutral-100/10 focus:outline-none text-[#1B1B1B]"
                aria-label="Search spices"
              >
                {isSearchOpen ? <X size={18} /> : <Search size={18} />}
              </button>
            </div>

            {/* Shopping Bag Button */}
            <button
              onClick={onCartClick}
              className="p-2 rounded-full transition-all duration-300 relative hover:bg-neutral-100/10 focus:outline-none text-[#1B1B1B]"
              aria-label="Shopping Cart"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#B71C1C] text-white font-extrabold text-[9px] w-5 h-5 rounded-full flex items-center justify-center border border-white shadow-sm animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full transition-all duration-300 focus:outline-none text-[#1B1B1B]"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Expandable Search Input Block */}
        {isSearchOpen && (
          <div className="w-full bg-white border-t border-neutral-200 py-3 px-4 shadow-inner transition-all duration-300 relative">
            <div className="max-w-3xl mx-auto flex items-center gap-2">
              <Search className="text-neutral-400" size={18} />
              <input
                type="text"
                placeholder="Search premium single-origin spices, hand-blended masalas..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  onSearch(e.target.value);
                }}
                className="w-full bg-transparent border-none text-[#1B1B1B] text-sm focus:outline-none focus:ring-0 placeholder-neutral-400 font-medium"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    onSearch('');
                  }}
                  className="text-xs text-neutral-400 hover:text-neutral-600 font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* LIVE PRODUCT SEARCH SUGGESTIONS */}
            {matchedProducts.length > 0 && (
              <div className="absolute left-0 right-0 top-full bg-white border-t border-b border-neutral-200 shadow-2xl z-50 overflow-hidden divide-y divide-neutral-100 max-h-[350px] overflow-y-auto">
                <div className="max-w-3xl mx-auto px-4 py-2 text-[10px] uppercase tracking-widest font-extrabold text-[#B71C1C] flex items-center justify-between">
                  <span>Matched Spices & Blends ({matchedProducts.length})</span>
                  <span className="text-neutral-400 normal-case font-medium">Click to view scientific details</span>
                </div>
                <div className="max-w-3xl mx-auto divide-y divide-neutral-100">
                  {matchedProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => {
                        if (onProductClick) {
                          onProductClick(product);
                        }
                        setIsSearchOpen(false);
                        setSearchQuery('');
                        onSearch('');
                      }}
                      className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-[#FDFBF7] transition-colors group focus:outline-none cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-12 h-12 object-cover rounded-lg border border-neutral-200 bg-white"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-[#1B1B1B] group-hover:text-[#B71C1C] transition-colors line-clamp-1">
                            {product.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="inline-block px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded bg-[#234D20]/10 text-[#234D20]">
                              {product.category}
                            </span>
                            {product.badge && (
                              <span className="inline-block px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded bg-[#B71C1C]/10 text-[#B71C1C]">
                                {product.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-[10px] text-neutral-400 block font-semibold uppercase">Starting From</span>
                          <span className="text-xs font-bold text-[#234D20]">
                            ₹{Object.values(product.pricesByWeight)[0]}
                          </span>
                        </div>
                        <div className="w-7 h-7 rounded-full bg-neutral-100 group-hover:bg-[#B71C1C]/10 flex items-center justify-center text-neutral-400 group-hover:text-[#B71C1C] transition-all">
                          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
          <div
            className="fixed top-0 right-0 w-4/5 max-w-sm h-full bg-white shadow-2xl p-6 flex flex-col justify-between transition-transform duration-300 ease-out"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-neutral-100">
                <div className="flex items-center">
                  <img 
                    src="https://a8cw5fshupvoh5ik.public.blob.vercel-storage.com/IMG_2829.PNG" 
                    alt="MSR Aroma" 
                    className="h-16 w-auto object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 rounded-full text-neutral-500 hover:bg-neutral-100">
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col space-y-4 py-8">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-sm font-bold uppercase tracking-wider text-neutral-800 hover:text-[#B71C1C] transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>

            <div className="border-t border-neutral-100 pt-6">
              <a
                href="#products"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full bg-[#B71C1C] text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-semibold text-xs tracking-wider uppercase shadow-md hover:bg-[#961818] transition-colors"
              >
                Shop Our Collection <ArrowRight size={14} />
              </a>
              <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-neutral-500">
                <ShieldCheck size={12} className="text-[#234D20]" />
                100% Certified Chemical-Free Spices
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
