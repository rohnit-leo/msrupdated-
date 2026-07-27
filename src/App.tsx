/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  TrendingUp,
  Award,
  Sprout,
  ShieldCheck,
  Check,
  ChevronDown,
  ShoppingBag,
  Info,
  Flame,
  Heart,
  ChevronRight,
  Instagram,
  FileText,
  UserCheck,
  Lightbulb,
  Cpu,
  BadgeCheck,
  Scale,
  PackageOpen,
  X,
  Plus,
  Minus,
  Clock,
  Camera,
  Globe,
  Shield,
  Box,
  Store
} from 'lucide-react';

import { Product, CartItem } from './types';
import { PRODUCTS } from './data';
import { 
  subscribeToProducts, 
  saveProductToFirestore, 
  deleteProductFromFirestore,
  subscribeToCategories
} from './firebase';

import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import FoundersSection from './components/FoundersSection';
import InteractiveTimeline from './components/InteractiveTimeline';
import ProcessingJourney from './components/ProcessingJourney';
import HealthComparison from './components/HealthComparison';
import RecipesSection from './components/RecipesSection';
import VideoGallery from './components/VideoGallery';
import KnowledgeCenter from './components/KnowledgeCenter';
import DistributorEnquiry from './components/DistributorEnquiry';
import TestimonialsSection from './components/TestimonialsSection';
import FloatingMenu from './components/FloatingMenu';
import FAQsSection from './components/FAQsSection';
import AdminPanel from './components/AdminPanel';

export default function App() {
  // Products list loaded from Firestore with fallback to default PRODUCTS
  const [productsList, setProductsList] = useState<Product[]>([]);

  // Subscribe to real-time products list from Firestore and seed if empty
  useEffect(() => {
    const unsubscribe = subscribeToProducts((loadedProducts) => {
      if (loadedProducts.length === 0) {
        console.log("Firestore products collection is empty. Seeding with initial products...");
        const migrated = PRODUCTS.map((p) => {
          const has500g = p.weightOptions.includes('500g');
          if (!has500g) {
            const basePrice = p.pricesByWeight['100g'] || p.pricesByWeight[p.weightOptions[0]] || 80;
            const newWeightOptions = [...p.weightOptions, '500g'];
            const newPrices = {
              ...p.pricesByWeight,
              '500g': Math.round(basePrice * 4.5)
            };
            return {
              ...p,
              weightOptions: newWeightOptions,
              pricesByWeight: newPrices
            };
          }
          return p;
        });

        // Save each product to Firestore
        migrated.forEach((product) => {
          saveProductToFirestore(product).catch((err) => {
            console.error("Error seeding product:", err);
          });
        });
      } else {
        setProductsList(loadedProducts);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleUpdateProducts = async (newProducts: Product[]) => {
    setProductsList(newProducts);
    try {
      const currentIds = new Set(newProducts.map(p => p.id));
      const deletedProducts = productsList.filter(p => !currentIds.has(p.id));

      for (const p of newProducts) {
        await saveProductToFirestore(p);
      }

      for (const p of deletedProducts) {
        await deleteProductFromFirestore(p.id);
      }
    } catch (e) {
      console.error("Error updating products in Firestore:", e);
    }
  };

  // Admin View state detection based on routing path, hash or query params
  const [isAdminView, setIsAdminView] = useState(() => {
    return window.location.pathname === '/admin' || 
           window.location.hash === '#admin' || 
           window.location.hash === '#/admin' ||
           window.location.search.includes('admin=true');
  });

  useEffect(() => {
    const handleLocationChange = () => {
      setIsAdminView(
        window.location.pathname === '/admin' || 
        window.location.hash === '#admin' || 
        window.location.hash === '#/admin' ||
        window.location.search.includes('admin=true')
      );
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Cart & Commerce States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [categoriesList, setCategoriesList] = useState<string[]>(['Spices', 'Masalas']);
  const [selectedSort, setSelectedSort] = useState<'Newest' | 'Popular'>('Newest');

  // Subscribe to real-time categories from Firestore
  useEffect(() => {
    const unsubCats = subscribeToCategories((loadedCats) => {
      if (loadedCats.length > 0) {
        setCategoriesList(loadedCats.map(c => c.name));
      }
    });
    return () => unsubCats();
  }, []);

  // Drawer / Modal triggers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSuccessNotificationOpen, setIsSuccessNotificationOpen] = useState(false);

  // Newsletter subscription
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Contact form submission
  const [contactForm, setContactForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Cart counting helper
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Add to cart helper
  const handleAddToCart = (product: Product, weight: string, qty: number) => {
    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedWeight === weight
      );
      if (existingIdx > -1) {
        const newCart = [...prevCart];
        newCart[existingIdx].quantity += qty;
        return newCart;
      } else {
        return [...prevCart, { product, selectedWeight: weight, quantity: qty }];
      }
    });
  };

  const handleUpdateCartQuantity = (productID: string, weight: string, newQty: number) => {
    if (newQty < 1) {
      handleRemoveCartItem(productID, weight);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productID && item.selectedWeight === weight
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const handleRemoveCartItem = (productID: string, weight: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.product.id === productID && item.selectedWeight === weight))
    );
  };

  const handleViewProductDetails = (product: Product) => {
    setSelectedProductForModal(product);
    // Add to recently viewed without duplicates
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((item) => item.id !== product.id);
      return [product, ...filtered].slice(0, 4); // Keep last 4
    });
  };

  // Cart aggregate pricing
  const subtotal = cart.reduce((acc, item) => {
    const price = item.product.pricesByWeight[item.selectedWeight];
    return acc + price * item.quantity;
  }, 0);
  const appliedDiscountCode = subtotal > 500 ? 'WELCOME10' : '';
  const discountAmount = appliedDiscountCode ? Math.round(subtotal * 0.10) : 0;
  const deliveryCharge = subtotal > 300 ? 0 : subtotal === 0 ? 0 : 40;
  const grandTotal = subtotal - discountAmount + deliveryCharge;

  // Filter products based on search and category tabs
  const filteredProducts = productsList.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.ingredients.some((ing) => ing.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (selectedSort === 'Popular') {
      // simulate popular: products with single-use sachet or Telangana signature on top
      const scoreA = a.badge ? 1 : 0;
      const scoreB = b.badge ? 1 : 0;
      return scoreB - scoreA;
    } else {
      // alphabetical or original
      return a.name.localeCompare(b.name);
    }
  });

  const handleOrderPlacedSuccess = () => {
    setIsCheckoutOpen(false);
    setCart([]); // Clear cart
    setIsSuccessNotificationOpen(true);
    setTimeout(() => {
      setIsSuccessNotificationOpen(false);
    }, 5000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.phone) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: '', phone: '', email: '', message: '' });
    }, 4000);
  };

  if (isAdminView) {
    return (
      <AdminPanel 
        products={productsList} 
        onUpdateProducts={handleUpdateProducts} 
        onBackToStore={() => {
          setIsAdminView(false);
          window.history.pushState({}, '', '/');
          window.location.hash = '';
        }} 
      />
    );
  }

  return (
    <div className="relative min-h-screen text-[#1B1B1B] bg-[#F8F8F4] overflow-x-hidden selection:bg-[#B71C1C] selection:text-white">
      
      {/* 1. STICKY HEADER WRAPPER */}
      <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
        {/* 1. SCROLLING ANNOUNCEMENT BAR */}
        <AnnouncementBar />

        {/* 2. NAVIGATION BAR */}
        <Navbar
          cartCount={cartCount}
          onCartClick={() => setIsCartOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={setSearchQuery}
          onProductClick={handleViewProductDetails}
        />
      </header>

      {/* 3. CINEMATIC HERO SECTION */}
      {(() => {
        const turmericProduct = productsList.find(p => p.id === 'premium-turmeric') || productsList[0];
        const chilliProduct = productsList.find(p => p.id === 'telangana-chilli') || productsList[1];

        return (
          <section
            id="home"
            className="relative min-h-screen bg-[#F8F8F4] flex flex-col justify-center pt-36 pb-16 overflow-hidden border-b border-neutral-200/50"
          >
            {/* Real background image requested by user */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img 
                src="https://falh4wp7xhmztgpi.public.blob.vercel-storage.com/WhatsApp%20Image%202026-07-26%20at%209.59.26%20PM.jpeg"
                alt="MSR Aroma Pure Spices Field Background"
                className="w-full h-full object-cover opacity-15 transform scale-105 pointer-events-none select-none filter saturate-[80%]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#F8F8F4]/98 via-[#F8F8F4]/92 to-[#F8F8F4]/40"></div>
            </div>

            {/* Subtle grid accent */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay z-0">
              <div className="absolute inset-0 bg-[radial-gradient(#1B1B1B_1px,transparent_1px)] [background-size:16px_16px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                
                {/* Left side column (col-span-7) */}
                <div className="lg:col-span-7 flex flex-col items-start text-left relative pl-0 xl:pl-10">
                  
                  {/* Vertical floating accent text on the far left (hidden on mobile and smaller desktop) */}
                  <div className="hidden xl:flex absolute left-[-40px] top-1/2 -translate-y-1/2 -rotate-90 origin-left whitespace-nowrap items-center gap-2 text-[9px] font-bold tracking-[0.4em] text-neutral-400 select-none">
                    <span>AUTHENTICITY</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B71C1C]"></span>
                    <span>PURITY</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#234D20]"></span>
                    <span>SCIENCE</span>
                  </div>

                  {/* Tag/Badge */}
                  <div className="inline-flex items-center gap-2 bg-white/80 border border-[#B71C1C]/20 px-3.5 py-1 mb-6 rounded-full text-[#B71C1C] text-[10px] font-extrabold uppercase tracking-widest shadow-sm backdrop-blur-xs">
                    <Sparkles size={12} className="text-[#E0A106]" />
                    <span>MSR AROMA • 100% Purity Verified</span>
                  </div>

                  {/* Main Headline */}
                  <h1 className="text-4xl sm:text-6xl lg:text-[76px] xl:text-[84px] font-display leading-[1.05] lg:leading-[0.9] text-[#1B1B1B] mb-6 font-bold tracking-tight">
                    Purity <span className="italic font-light text-[#B71C1C] font-display">You Can</span> <br className="hidden sm:inline" />
                    Taste. <span className="font-light text-3xl sm:text-5xl lg:text-5xl xl:text-6xl block sm:inline mt-2 sm:mt-0 text-neutral-800">Science You Trust.</span>
                  </h1>

                  {/* Quote/Description Border block */}
                  <div className="max-w-lg text-xs sm:text-sm leading-relaxed text-neutral-600 mb-8 border-l-2 border-[#E0A106] pl-6 italic font-medium">
                    "Every spoon of MSR Aroma spices is sourced directly from certified Telangana farms, processed with professional agricultural expertise, and low-temperature ground to preserve 100% of the natural volatile oils and essential curcumin. Zero adulterants. Safe for healthy families."
                  </div>

                  {/* CTA Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <a
                      href="#products"
                      className="bg-[#1B1B1B] text-white px-8 py-3.5 text-xs uppercase tracking-widest font-extrabold hover:bg-[#B71C1C] transition-all duration-500 shadow-md text-center border border-[#1B1B1B]"
                    >
                      Shop Our Collection
                    </a>
                    <a
                      href="#story"
                      className="border border-[#1B1B1B]/20 bg-[#FFFFFF]/60 hover:bg-[#FFFFFF] px-8 py-3.5 text-xs uppercase tracking-widest font-bold text-[#1B1B1B] transition-all duration-300 text-center"
                    >
                      Discover Our Story
                    </a>
                  </div>

                  {/* Minimalist scroll indicator */}
                  <div className="hidden lg:flex items-center gap-3 mt-12 text-[10px] text-neutral-400 uppercase tracking-widest font-bold">
                    <div className="w-4 h-6 border border-neutral-300 rounded-full flex justify-center p-0.5">
                      <div className="w-0.5 h-1.5 bg-[#B71C1C] rounded-full animate-bounce"></div>
                    </div>
                    <span>Scroll to explore</span>
                  </div>

                </div>

                {/* Right side column (col-span-5) */}
                <div className="lg:col-span-5 flex flex-col gap-5 w-full px-0 sm:px-6 lg:px-0">
                  
                  {/* Featured Masterpiece 1: Turmeric */}
                  {turmericProduct && (
                    <div className="bg-white/95 border border-neutral-200/60 p-4 shadow-md relative overflow-hidden group rounded-xl backdrop-blur-xs">
                      {turmericProduct.badge && (
                        <div className="absolute top-3 right-3 bg-[#B71C1C] text-white text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 shadow-xs">
                          {turmericProduct.badge}
                        </div>
                      )}

                      <div className="flex gap-4 items-center mb-2.5">
                        <div className="w-14 h-14 bg-[#F8F8F4] overflow-hidden border border-neutral-200 rounded-lg flex-shrink-0">
                          <img 
                            src={turmericProduct.image} 
                            alt={turmericProduct.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <span className="text-[9px] uppercase tracking-widest text-[#B71C1C] font-extrabold block">Featured Masterpiece</span>
                          <h3 className="font-display text-sm font-bold text-[#1B1B1B] line-clamp-1 leading-none">{turmericProduct.name}</h3>
                          <p className="text-[10px] text-[#234D20] font-semibold mt-1">
                            ₹{turmericProduct.pricesByWeight['250g'] || turmericProduct.pricesByWeight['100g']} / 250g
                          </p>
                        </div>
                      </div>

                      <p className="text-[11px] text-neutral-500 leading-relaxed font-medium mb-3 line-clamp-1">
                        {turmericProduct.description}
                      </p>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewProductDetails(turmericProduct)}
                          className="flex-1 bg-[#1B1B1B] hover:bg-[#B71C1C] text-white text-[9px] uppercase tracking-widest font-extrabold py-2 transition-colors duration-300 text-center cursor-pointer rounded"
                        >
                          Specs
                        </button>
                        <button
                          onClick={() => handleAddToCart(turmericProduct, turmericProduct.weightOptions.includes('250g') ? '250g' : turmericProduct.weightOptions[0], 1)}
                          className="px-4 bg-[#234D20] hover:bg-[#1C3E19] text-white text-[9px] uppercase tracking-widest font-extrabold py-2 transition-colors duration-300 cursor-pointer rounded"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Featured Masterpiece 2: Chilli Powder (Requested Same as Haldi) */}
                  {chilliProduct && (
                    <div className="bg-white/95 border border-neutral-200/60 p-4 shadow-md relative overflow-hidden group rounded-xl backdrop-blur-xs">
                      {chilliProduct.badge && (
                        <div className="absolute top-3 right-3 bg-[#B71C1C] text-white text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 shadow-xs">
                          {chilliProduct.badge}
                        </div>
                      )}

                      <div className="flex gap-4 items-center mb-2.5">
                        <div className="w-14 h-14 bg-[#F8F8F4] overflow-hidden border border-neutral-200 rounded-lg flex-shrink-0">
                          <img 
                            src="https://falh4wp7xhmztgpi.public.blob.vercel-storage.com/IMG_2839.PNG"
                            alt={chilliProduct.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <span className="text-[9px] uppercase tracking-widest text-[#B71C1C] font-extrabold block">Featured Masterpiece</span>
                          <h3 className="font-display text-sm font-bold text-[#1B1B1B] line-clamp-1 leading-none">{chilliProduct.name}</h3>
                          <p className="text-[10px] text-[#234D20] font-semibold mt-1">
                            ₹{chilliProduct.pricesByWeight['250g'] || chilliProduct.pricesByWeight['100g']} / 250g
                          </p>
                        </div>
                      </div>

                      <p className="text-[11px] text-neutral-500 leading-relaxed font-medium mb-3 line-clamp-1">
                        {chilliProduct.description}
                      </p>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewProductDetails(chilliProduct)}
                          className="flex-1 bg-[#1B1B1B] hover:bg-[#B71C1C] text-white text-[9px] uppercase tracking-widest font-extrabold py-2 transition-colors duration-300 text-center cursor-pointer rounded"
                        >
                          Specs
                        </button>
                        <button
                          onClick={() => handleAddToCart(chilliProduct, chilliProduct.weightOptions.includes('250g') ? '250g' : chilliProduct.weightOptions[0], 1)}
                          className="px-4 bg-[#234D20] hover:bg-[#1C3E19] text-white text-[9px] uppercase tracking-widest font-extrabold py-2 transition-colors duration-300 cursor-pointer rounded"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Stats Block Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    
                    {/* Green Stat block */}
                    <div className="bg-[#234D20]/95 text-[#F8F8F4] p-4 shadow-md relative flex flex-col justify-between rounded-xl">
                      <div className="mb-2">
                        <ShieldCheck size={16} className="text-[#E0A106]" />
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-emerald-100/70 font-semibold block mb-0.5">Traceability</span>
                        <h4 className="font-display text-xs font-semibold leading-tight">100% Sourced Directly From Telangana Farms</h4>
                      </div>
                    </div>

                    {/* Gold/White Border Stat block */}
                    <div className="bg-white/95 border-b-2 border-[#E0A106] p-4 shadow-md relative flex flex-col justify-between rounded-xl">
                      <div className="mb-2">
                        <Sparkles size={16} className="text-[#E0A106]" />
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-semibold block mb-0.5">Bio-Active</span>
                        <h4 className="font-display text-xs font-semibold text-[#1B1B1B] leading-tight">Rich Volatile Oils & High Curcumin</h4>
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            </div>

            {/* Continuous Infinite Scrolling Partner logos (Requested beneath Traceability & Bio-Active block) */}
            <div className="mt-16 border-t border-b border-neutral-200/50 py-5 overflow-hidden relative bg-white/60 backdrop-blur-xs">
              <style>{`
                @keyframes scrollMarquee {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
                .animate-scroll-marquee {
                  animation: scrollMarquee 22s linear infinite;
                }
              `}</style>
              <div className="max-w-7xl mx-auto px-4 mb-2.5">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#B71C1C] block text-center">
                  ✦ WE COMING SOON ON QUICK COMMERCE & E-COMMERCE PLATFORMS ✦
                </span>
              </div>
              
              <div className="relative w-full flex overflow-x-hidden">
                {/* Mask overlays for elegant fading on edges */}
                <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#F8F8F4] to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#F8F8F4] to-transparent z-10 pointer-events-none" />

                <div className="animate-scroll-marquee flex whitespace-nowrap gap-12 py-1 items-center">
                  {[...Array(3)].map((_, loopIdx) => (
                    <React.Fragment key={loopIdx}>
                      <div className="flex items-center gap-2 font-black tracking-tighter text-xs sm:text-sm text-[#1B1B1B] opacity-70">
                        <span className="w-2 h-2 rounded-full bg-[#E0A106]"></span>
                        <span>ZEPTO</span>
                      </div>
                      <div className="flex items-center gap-2 font-black tracking-tighter text-xs sm:text-sm text-[#1B1B1B] opacity-70">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span>BLINKIT</span>
                      </div>
                      <div className="flex items-center gap-2 font-black tracking-tighter text-xs sm:text-sm text-[#1B1B1B] opacity-70">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        <span>SWIGGY INSTAMART</span>
                      </div>
                      <div className="flex items-center gap-2 font-black tracking-tighter text-xs sm:text-sm text-[#1B1B1B] opacity-70">
                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                        <span>BIGBASKET</span>
                      </div>
                      <div className="flex items-center gap-2 font-black tracking-tighter text-xs sm:text-sm text-[#1B1B1B] opacity-70">
                        <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                        <span>AMAZON</span>
                      </div>
                      <div className="flex items-center gap-2 font-black tracking-tighter text-xs sm:text-sm text-[#1B1B1B] opacity-70">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        <span>JIOMART</span>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

          </section>
        );
      })()}

      {/* 4. BRAND STORY SECTION (Our Story & Founders & Farmers) */}
      <FoundersSection />

      {/* 5. WHY CHOOSE MSR AROMA (Why Choose Cards) */}
      <section id="why-msr" className="py-24 bg-[#F8F8F4] border-t border-b border-neutral-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] uppercase font-extrabold tracking-[0.25em] text-[#B71C1C] block mb-2">
              Uncompromising Quality Standard
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-[#1B1B1B]">
              Why Choose MSR Aroma
            </h2>
            <div className="w-12 h-[1px] bg-[#B71C1C] mx-auto mt-4 mb-4"></div>
            <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-medium">
              We operate under the rigid "Mother's Standard," combining agricultural bio-tech with native practices to deliver culinary purity.
            </p>
          </div>

          {/* Grid of 12 beautiful benefits cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Farmer Direct Sourcing', desc: 'Bypassing middle-men. Our agronomists procure whole crops directly from selected sustainable fields in Telangana.', icon: <Sprout className="text-[#234D20]" /> },
              { title: 'Scientifically Processed', desc: 'Grinding with liquid-cooled milling systems keeping temperatures below 28°C to retain natural volatile therapeutic oils.', icon: <Cpu className="text-[#B71C1C]" /> },
              { title: 'Zero Additives Allowed', desc: '100% pure ingredient profiles. We strictly verify that every mill contains only natural whole spices.', icon: <Sparkles className="text-[#E0A106]" /> },
              { title: 'No Artificial Colors', desc: 'Vibrant reds and rich golds are achieved purely by botanical selection. Free from cancer-causing industrial dyes.', icon: <BadgeCheck className="text-[#234D20]" /> },
              { title: 'No Artificial Fillers', desc: 'Zero starches, chalk, spent material, salt, or sawdust mixed in to artificially increase bulk weight.', icon: <Scale className="text-[#B71C1C]" /> },
              { title: 'Rich Natural Aroma', desc: 'Volatile pinene, linalool, and curcuminoids are preserved, delivering a fragrant signature that fills the home.', icon: <Award className="text-[#E0A106]" /> },
              { title: 'High Curcumin Turmeric', desc: 'We guarantee a bio-active Curcumin level of over 5.0%, providing powerful anti-inflammatory and cellular health.', icon: <TrendingUp className="text-[#234D20]" /> },
              { title: 'Premium Telangana Chillies', desc: 'Hand-selected Guntur and local capsicum varieties with precise moisture levels for unmatched heat and red hue.', icon: <Flame className="text-[#B71C1C]" /> },
              { title: 'Freshly Nitrogen Packed', desc: 'Flushed with dry nitrogen inside thick triple-laminate foil packs, preventing humidity decay and oxidation.', icon: <PackageOpen className="text-[#E0A106]" /> },
              { title: '100% Certified Authentic', desc: 'Fully compliant with laboratory spectrophotometer checks and regional certification standards.', icon: <UserCheck className="text-[#234D20]" /> },
              { title: 'Traditional Home Taste', desc: 'Sensory profiles crafted based on generations-old regional family cookbooks and master chef ratios.', icon: <Lightbulb className="text-[#B71C1C]" /> },
              { title: 'Health Focused Legacy', desc: 'Spices are the active foundation of family nutrition. We design every batch to defend your cell vitality.', icon: <Heart className="text-[#E0A106]" /> }
            ].map((card, idx) => (
              <div
                key={idx}
                className="bg-white border border-neutral-200/60 p-6 rounded-2xl shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 bg-[#F8F8F4] rounded-lg border border-neutral-200/40 flex items-center justify-center mb-4 shadow-xs">
                    {card.icon}
                  </div>
                  <h3 className="font-display text-base font-bold text-[#1B1B1B]">
                    {card.title}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. INTERACTIVE TIMELINE (Journey From Farm to Kitchen) */}
      <InteractiveTimeline />

      {/* 7. PROCESSING JOURNEY (Our Processing Journey) */}
      <ProcessingJourney />

      {/* 8. PRODUCTS CATALOG (eCommerce Layout) */}
      <section id="products" className="py-24 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Heading & Search Filter row */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12 pb-6 border-b border-neutral-100">
            <div className="max-w-xl">
              <span className="text-[10px] uppercase font-extrabold tracking-[0.25em] text-[#B71C1C] block mb-2">
                Standard & Signature Blend Range
              </span>
              <h2 className="font-display text-4xl sm:text-5xl font-black text-[#1B1B1B]">
                Shop Premium Spices
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-2 leading-relaxed font-medium">
                Sourced at botanical maturity. Ground under cryo-cooled milling to lock in medicinal properties.
              </p>
            </div>

            {/* Live Sorting Selection */}
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-stretch sm:items-center">
              {/* Category tabs */}
              <div className="flex bg-[#F8F8F4] rounded-xl p-1 border border-neutral-200/50 flex-wrap gap-1">
                {Array.from(new Set(['All', ...categoriesList, ...productsList.map(p => p.category)])).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors duration-200 ${
                      selectedCategory === cat
                        ? 'bg-white text-[#B71C1C] shadow-sm'
                        : 'text-neutral-500 hover:text-neutral-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Sorting */}
              <div className="flex items-center gap-2 bg-[#F8F8F4] px-3 py-2 rounded-xl border border-neutral-200/50">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Sort</span>
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value as 'Newest' | 'Popular')}
                  className="bg-transparent border-none focus:outline-none text-xs font-bold text-neutral-700 cursor-pointer"
                >
                  <option value="Newest">Newest Sourcing</option>
                  <option value="Popular">Most Popular</option>
                </select>
              </div>
            </div>
          </div>

          {/* Seasonal Spotlights */}
          <div className="mb-12 bg-gradient-to-r from-[#234D20]/5 via-white to-[#234D20]/5 p-6 rounded-2xl border border-[#234D20]/15 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest bg-[#234D20] text-white rounded-full mb-2">
                Seasonal Health Recommendation
              </span>
              <h3 className="font-display text-lg sm:text-xl font-extrabold text-[#1B1B1B]">
                Boost Immunity with Nizamabad Turmeric and Black Pepper
              </h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-xl">
                During cold seasons, clinical trials prove that combining high-curcumin turmeric with small amounts of active black pepper (Jeera/Garam Masala) boosts anti-inflammatory bio-absorption by 2000%.
              </p>
            </div>
            <div className="flex justify-start md:justify-end">
              <button
                onClick={() => {
                  const item = productsList.find((p) => p.id === 'premium-turmeric');
                  if (item) handleViewProductDetails(item);
                }}
                className="px-4 py-2 bg-[#234D20] hover:bg-[#1a3817] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow transition-colors"
              >
                View Turmeric Science
              </button>
            </div>
          </div>

          {/* Products Grid */}
          {sortedProducts.length === 0 ? (
            <div className="text-center py-24 bg-[#F8F8F4] rounded-2xl border border-dashed border-neutral-300">
              <p className="font-display text-xl font-bold text-neutral-600">No premium products match your query</p>
              <p className="text-xs text-neutral-400 mt-1">Try refining your search keyword or resetting category filters.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="mt-4 px-4 py-2 bg-[#B71C1C] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onAddToCart={handleAddToCart}
                  onViewDetails={handleViewProductDetails}
                />
              ))}
            </div>
          )}

          {/* Recently Viewed Panel */}
          {recentlyViewed.length > 0 && (
            <div className="mt-24 pt-12 border-t border-neutral-100">
              <h3 className="font-display text-xl font-bold text-neutral-800 mb-6 flex items-center gap-2">
                <Clock size={20} className="text-[#B71C1C]" /> Recently Viewed Science Overviews
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {recentlyViewed.map((prod) => (
                  <button
                    key={prod.id}
                    onClick={() => handleViewProductDetails(prod)}
                    className="group bg-[#F8F8F4] border border-neutral-200/50 p-3 rounded-xl hover:bg-white hover:shadow-md transition-all text-left flex items-center gap-3"
                  >
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-10 h-10 object-cover rounded-md flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-[11px] font-extrabold text-[#1B1B1B] line-clamp-1 group-hover:text-[#B71C1C]">
                        {prod.name}
                      </h4>
                      <span className="text-[9px] uppercase tracking-wider font-bold text-[#234D20]">
                        {prod.category}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* 9. HEALTH AND COMPARISON SECTION (Market Spices VS MSR) */}
      <HealthComparison />

      {/* 10. PREMIUM MOISTURE-LOCK PACKAGING SECTION */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Graphics info */}
            <div className="lg:col-span-5 bg-[#F8F8F4] border border-neutral-200/60 p-8 sm:p-12 rounded-3xl relative overflow-hidden shadow-xs min-h-[360px] flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#B71C1C]/5 rounded-bl-full pointer-events-none"></div>
              
              <div>
                <span className="text-[10px] uppercase font-black text-[#B71C1C] tracking-widest block mb-1">✓ Zero Exposure Standard</span>
                <h3 className="font-display text-3xl font-black text-[#1B1B1B] leading-tight">Zero Additives.<br />Maximum Purity.</h3>
                <p className="text-xs text-neutral-500 mt-3 leading-relaxed">
                  Traditional paper bags let humidity in, generating toxic carcinogenic aflatoxin mold inside spices. MSR Aroma packaging is hermetically closed under high-tech nitrogen gas.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-8">
                {[
                  { title: 'No Sudha Red', val: '0% Chemical' },
                  { title: 'No Chemical Fillers', val: '0% Adulterant' },
                  { title: 'No Artificial Dyes', val: '0% Preservative' },
                  { title: 'Triple Tested', val: '100% Traceable' }
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-3 rounded-xl border border-neutral-200/50">
                    <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-400 block">{stat.title}</span>
                    <span className="text-xs font-black text-[#234D20]">{stat.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right copywriting descriptions */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[10px] uppercase font-extrabold tracking-[0.25em] text-[#B71C1C] block">
                Advanced Barrier Chemistry
              </span>
              <h2 className="font-display text-4xl sm:text-5xl font-black text-[#1B1B1B] leading-tight">
                Our Nitrogen-Flushed Multi-Shield Pouches
              </h2>
              <div className="w-16 h-[2px] bg-[#B71C1C]"></div>

              <div className="space-y-4 text-xs sm:text-sm text-neutral-600 leading-relaxed font-medium">
                <p>
                  Oxygen is the mortal enemy of freshly ground spices. It oxidizes high capsaicin heat, fades bright curcumin pigments, and decays therapeutic volatile pinene oils within days of grinding.
                </p>
                <p>
                  MSR Aroma packs are constructed from three food-grade protection layers: a light-blocking outer layer, a solid aluminum moisture barrier, and a thick nitrogen-flushed sealant. Oxygen is completely extracted and replaced with pure medical nitrogen. This guarantees that when you break the pouch seal, the spice has precisely the same curcumin volume and natural aroma as the hour it was ground.
                </p>
              </div>

              <div className="flex gap-4 pt-4 border-t border-neutral-100 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-bold">
                  <Check size={14} className="text-[#234D20]" /> Safe Food Barrier
                </div>
                <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-bold">
                  <Check size={14} className="text-[#234D20]" /> Curcumin Bio-Stabilized
                </div>
                <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-bold">
                  <Check size={14} className="text-[#234D20]" /> 12-Month Aroma Lock
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 11. RECIPES SECTIONS */}
      <RecipesSection />

      {/* 11b. HERITAGE VIDEO GALLERY */}
      <VideoGallery />

      {/* 12. PARTNERSHIP & RETAIL SHOWCASE (Coming soon on Amazon, Flipkart, Blinkit, etc.) */}
      <section className="py-24 bg-[#F8F8F4] border-t border-b border-neutral-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] uppercase font-extrabold tracking-[0.25em] text-[#B71C1C] block mb-2">
              Digital Marketplace Ecosystem
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#1B1B1B]">
              Coming Soon On Top Indian Grocery Networks
            </h2>
            <p className="text-xs text-neutral-500 mt-2 font-medium">
              We are finalizing national cleanroom warehouses integration. MSR Aroma will soon be delivered to your kitchen door in 10 minutes.
            </p>
          </div>

          {/* Premium animated/hover logo boards */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
            {[
              { name: 'AMAZON', color: 'bg-amber-500/10 text-amber-800 border-amber-500/25', hover: 'hover:bg-amber-500 hover:text-white hover:border-amber-500' },
              { name: 'FLIPKART', color: 'bg-blue-500/10 text-blue-800 border-blue-500/25', hover: 'hover:bg-blue-500 hover:text-white hover:border-blue-500' },
              { name: 'JIOMART', color: 'bg-indigo-500/10 text-indigo-800 border-indigo-500/25', hover: 'hover:bg-indigo-500 hover:text-white hover:border-indigo-500' },
              { name: 'BLINKIT', color: 'bg-yellow-500/10 text-yellow-800 border-yellow-500/25', hover: 'hover:bg-yellow-500 hover:text-black hover:border-yellow-500' },
              { name: 'ZEPTO', color: 'bg-purple-500/10 text-purple-800 border-purple-500/25', hover: 'hover:bg-purple-500 hover:text-white hover:border-purple-500' },
              { name: 'SWIGGY INSTAMART', color: 'bg-orange-500/10 text-orange-800 border-orange-500/25', hover: 'hover:bg-orange-500 hover:text-white hover:border-orange-500' }
            ].map((partner, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-xl border text-center font-black tracking-widest text-xs transition-all duration-300 shadow-xs cursor-default ${partner.color} ${partner.hover}`}
              >
                {partner.name}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 13. TESTIMONIALS SLIDER */}
      <TestimonialsSection />

      {/* 14. DISTRIBUTOR ENQUIRY & COORPORATE ORDERS */}
      <DistributorEnquiry />

      {/* 15. KNOWLEDGE CENTER (Blogs) */}
      <KnowledgeCenter />

      {/* 16. FAQS SECTION */}
      <FAQsSection />

      {/* 17. INSTAGRAM GALLERY GRID */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] uppercase font-extrabold tracking-[0.25em] text-[#B71C1C] block mb-2">
              Gallery & Aesthetics
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#1B1B1B]">
              Life At Sustainable Farms
            </h2>
            <p className="text-xs text-neutral-500 mt-2 font-medium">
              A collection of daily work snapshots from our sustainable red-soil farms and state-of-the-art testing cleanrooms.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[
              'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80',
              'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80',
              'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=400&q=80',
              'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=400&q=80',
              'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80',
              'https://images.unsplash.com/photo-1618037351659-19ec0ca80d5e?auto=format&fit=crop&w=400&q=80'
            ].map((img, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden group border border-neutral-200/50">
                <img
                  src={img}
                  alt={`MSR Aroma Farm Snapshot ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Instagram size={20} className="text-white" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 18. CONTACT SECTION (Luxury Minimal Layout + Contact Form + Maps placeholder) */}
      <section id="contact" className="py-24 bg-[#F8F8F4] border-t border-neutral-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Coordinates Contact Left side */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-[0.25em] text-[#B71C1C] block mb-2">
                  Corporate Headquarters
                </span>
                <h2 className="font-display text-4xl sm:text-5xl font-black text-[#1B1B1B] leading-tight">
                  Connect With MSR Aroma
                </h2>
                <div className="w-16 h-[2px] bg-[#B71C1C] mt-4 mb-4"></div>
                <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-medium max-w-sm">
                  Whether you are a customer searching for pure spices or a distributor seeking high-volume clinical grade supply, our directors are here to assist.
                </p>
              </div>

              {/* Address detail stack */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] uppercase font-extrabold tracking-wider text-[#B71C1C] mb-2">1. Registered Office Coordinates</h4>
                  <p className="text-xs text-neutral-700 font-semibold flex items-start gap-2 max-w-xs leading-relaxed">
                    <MapPin size={16} className="text-[#234D20] mt-0.5 flex-shrink-0" />
                    <span>
                      MSR Aroma Private Limited,<br />
                      Telangana Sourcing Facility, Hyderabad, India.
                    </span>
                  </p>
                </div>

                <div>
                  <h4 className="text-[10px] uppercase font-extrabold tracking-wider text-[#B71C1C] mb-2">2. Direct Telephone Lines</h4>
                  <p className="text-xs text-neutral-700 font-semibold flex flex-col gap-1 pl-6">
                    <span className="flex items-center gap-2">
                      <Phone size={14} className="text-[#234D20]" /> +91 83418 91704 (CEO Shravan Kumar)
                    </span>
                    <span className="flex items-center gap-2">
                      <Phone size={14} className="text-[#234D20]" /> +91 83411 63205 (Company Helpline)
                    </span>
                  </p>
                </div>

                <div>
                  <h4 className="text-[10px] uppercase font-extrabold tracking-wider text-[#B71C1C] mb-2">3. Corporate Email Support</h4>
                  <p className="text-xs text-neutral-700 font-semibold flex items-center gap-2 pl-6">
                    <Mail size={14} className="text-[#234D20]" /> vmmspices@gmail.com
                  </p>
                </div>
              </div>

              {/* Google Maps placeholder visual illustration */}
              <div className="border border-neutral-200 bg-white p-4 rounded-2xl shadow-xs">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#234D20] block mb-2">Google Maps Geolocation</span>
                <div className="aspect-video bg-[#F8F8F4] rounded-lg border border-neutral-200/60 flex flex-col items-center justify-center text-center p-4">
                  <MapPin size={24} className="text-[#B71C1C] animate-bounce" />
                  <p className="text-[11px] font-bold text-[#1B1B1B] mt-2">MSR Aroma Sourcing Headquarters</p>
                  <p className="text-[9px] text-neutral-400">Hyderabad, Telangana State, India</p>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    className="text-[9px] font-bold text-[#B71C1C] hover:underline mt-2 uppercase tracking-wider"
                  >
                    Open Live Navigation Map
                  </a>
                </div>
              </div>
            </div>

            {/* Direct enquiry form right side */}
            <div className="lg:col-span-7 bg-white border border-neutral-200/60 rounded-3xl p-6 sm:p-10 shadow-lg flex flex-col justify-center">
              
              {contactSubmitted ? (
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 bg-[#234D20]/10 border border-[#234D20]/30 rounded-full flex items-center justify-center text-[#234D20] mx-auto">
                    <CheckCircle size={32} />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-[#1B1B1B]">Message Logged</h3>
                    <p className="text-xs text-neutral-500 mt-2 max-w-xs mx-auto leading-relaxed">
                      Thank you for contacting MSR Aroma Private Limited. Your support ticket has been forwarded to our CRM queue. We will telephone you shortly.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="border-b border-neutral-100 pb-3">
                    <h3 className="font-display text-xl font-bold text-[#1B1B1B]">Direct Client Liaison Message</h3>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-1">✓ Instantly verified secure channel</p>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full bg-[#F8F8F4] border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#B71C1C]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block mb-1">Mobile Line *</label>
                      <input
                        type="tel"
                        required
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        placeholder="e.g. +91 9876543210"
                        className="w-full bg-[#F8F8F4] border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#B71C1C]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block mb-1">Email Address (Optional)</label>
                      <input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="e.g. name@domain.com"
                        className="w-full bg-[#F8F8F4] border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#B71C1C]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block mb-1">Message Detail *</label>
                    <textarea
                      required
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Explain what spices or information you need. Our team responds within a few hours."
                      className="w-full bg-[#F8F8F4] border border-neutral-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#B71C1C]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#B71C1C] hover:bg-[#961818] text-white rounded-lg text-xs font-bold uppercase tracking-widest shadow transition-colors"
                  >
                    Send Direct Message
                  </button>
                </form>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* 19. LUXURY PREMIUM FOOTER */}
      <footer className="bg-[#1B1B1B] text-[#F8F8F4] pt-20 pb-8 border-t border-[#B71C1C]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Main Footer grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            
            {/* Logo/Brand column */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <img 
                  src="https://a8cw5fshupvoh5ik.public.blob.vercel-storage.com/IMG_2829.PNG" 
                  alt="MSR Aroma Logo" 
                  className="h-16 w-auto object-contain bg-white rounded-xl p-1 shadow-md border border-neutral-800"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <span className="text-lg font-black tracking-widest font-display block text-white">MSR AROMA</span>
                  <span className="text-[10px] tracking-widest uppercase font-bold text-[#E0A106]">Where Tradition Meets Agricultural Science</span>
                </div>
              </div>
              <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
                MSR Aroma Private Limited is a premium food-tech brand engineered to deliver chemically tested, 100% pure single-origin spices directly from certified Telangana soils. 
              </p>
              <div className="flex gap-3 text-neutral-400">
                <a href="https://instagram.com" className="p-2 rounded-full border border-neutral-700/60 hover:bg-neutral-800 transition-colors">
                  <Instagram size={14} />
                </a>
                <a href="https://whatsapp.com" className="p-2 rounded-full border border-neutral-700/60 hover:bg-neutral-800 transition-colors">
                  <MessageCircle size={14} />
                </a>
              </div>
            </div>

            {/* Quick Links Column */}
            <div className="md:col-span-2 space-y-4">
              <h4 className="text-xs uppercase tracking-widest font-extrabold text-[#E0A106]">Brand Portal</h4>
              <ul className="space-y-2.5 text-xs text-neutral-400 font-semibold">
                <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#story" className="hover:text-white transition-colors">Our Story Begins</a></li>
                <li><a href="#why-msr" className="hover:text-white transition-colors">Why Choose MSR</a></li>
                <li><a href="#processing" className="hover:text-white transition-colors">Our Processing</a></li>
                <li><a href="#wholesale" className="hover:text-white transition-colors">Wholesale Partnerships</a></li>
              </ul>
            </div>

            {/* Products link column */}
            <div className="md:col-span-2 space-y-4">
              <h4 className="text-xs uppercase tracking-widest font-extrabold text-[#E0A106]">Premium Catalog</h4>
              <ul className="space-y-2.5 text-xs text-neutral-400 font-semibold">
                <li><a href="#products" className="hover:text-white transition-colors">Telangana Chilli</a></li>
                <li><a href="#products" className="hover:text-white transition-colors">Nizamabad Turmeric</a></li>
                <li><a href="#products" className="hover:text-white transition-colors">Aromatic Coriander</a></li>
                <li><a href="#products" className="hover:text-white transition-colors">Chicken & Garam Masala</a></li>
                <li><a href="#products" className="hover:text-white transition-colors">Jeera & Mutton Masala</a></li>
              </ul>
            </div>

            {/* Newsletter Column */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="text-xs uppercase tracking-widest font-extrabold text-[#E0A106]">Laboratory Updates</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Subscribe to receive pre-order launch notifications and chromatography results assays.
              </p>

              {newsletterSubscribed ? (
                <div className="p-2.5 bg-[#234D20]/15 border border-[#234D20]/40 rounded-lg text-xs text-[#E8F8E8] font-bold flex items-center gap-1.5">
                  <Check size={14} className="text-[#234D20]" /> Subscribed successfully!
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newsletterEmail.trim()) return;
                    setNewsletterSubscribed(true);
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="email"
                    required
                    placeholder="Enter email..."
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 bg-neutral-800 border border-neutral-700/60 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#B71C1C] text-white"
                  />
                  <button
                    type="submit"
                    className="px-3 bg-[#B71C1C] text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#961818] transition-colors"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>

          </div>

          {/* Bottom Copyright line */}
          <div className="pt-8 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">
            <p>© 2026 MSR AROMA PRIVATE LIMITED. All Rights Reserved. Sourced & milled under Food Safety licenses.</p>
            <p>Designed for healthy families • Direct Agri Sourcing</p>
          </div>

        </div>
      </footer>



      {/* 21. PROFESSIONAL EXPANDABLE FLOATING MENU */}
      <FloatingMenu />

      {/* 22. SHOPPING BASKET DRAWER OVERLAY */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* 23. CHECKOUT STATE DETAILS OVERLAY MODAL */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        subtotal={subtotal}
        discountAmount={discountAmount}
        deliveryCharge={deliveryCharge}
        grandTotal={grandTotal}
        appliedCoupon={appliedDiscountCode}
        onOrderPlaced={handleOrderPlacedSuccess}
      />

      {/* 24. OVERALL DETAILED SPECIFICATION OVERLAY MODAL */}
      <ProductModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
      />

      {/* 25. PLACE ORDER SUCCESS VICTORY NOTIFICATION CONTAINER */}
      {isSuccessNotificationOpen && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 max-w-sm w-full px-4">
          <div className="bg-[#234D20] border border-[#E0A106]/40 text-white p-4 rounded-xl shadow-2xl flex items-start gap-3 animate-slide-in">
            <CheckCircle className="text-[#E0A106] flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-display text-sm font-bold">Order Registered Successfully!</h4>
              <p className="text-[10px] text-neutral-200 mt-1">
                Your pre-order has been formatted and redirected to WhatsApp for immediate COD/Online payment validation. Check your WhatsApp screen.
              </p>
            </div>
            <button
              onClick={() => setIsSuccessNotificationOpen(false)}
              className="p-1 rounded text-white/60 hover:text-white"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

// Simple supporting icon representation wrapper to avoid build failures
function CheckCircle(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || "24"}
      height={props.size || "24"}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
