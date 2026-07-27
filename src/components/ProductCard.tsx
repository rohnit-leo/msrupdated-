/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Heart, Plus, Minus, Info, Check, ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: string | number;
  product: Product;
  onAddToCart: (product: Product, weight: string, quantity: number) => void;
  onViewDetails: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart, onViewDetails }: ProductCardProps): React.JSX.Element {
  const [selectedWeight, setSelectedWeight] = useState(product.weightOptions[0]);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedPop, setAddedPop] = useState(false);

  const price = product.pricesByWeight[selectedWeight];

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAdd = () => {
    onAddToCart(product, selectedWeight, quantity);
    setAddedPop(true);
    setTimeout(() => setAddedPop(false), 2000);
  };

  return (
    <div className="group bg-white rounded-xl border border-neutral-200/60 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between relative">
      
      {/* Product Image Stage */}
      <div className="relative overflow-hidden aspect-square bg-[#F8F8F4] flex items-center justify-center p-4">
        {/* Wishlist Icon */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-neutral-200/50 text-[#1B1B1B] hover:text-[#B71C1C] hover:scale-110 active:scale-95 transition-all duration-300"
          aria-label="Add to wishlist"
        >
          <Heart size={16} className={isWishlisted ? 'fill-[#B71C1C] text-[#B71C1C]' : ''} />
        </button>

        {/* Product Badge */}
        {product.badge && (
          <span className="absolute top-4 left-4 z-10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest bg-[#B71C1C] text-white rounded-full shadow-sm border border-[#E0A106]/40">
            {product.badge}
          </span>
        )}

        {/* Zoomable Image */}
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full rounded-lg transition-transform duration-700 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Glassmorphic Hover Action */}
        <div className="absolute inset-0 bg-neutral-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={() => onViewDetails(product)}
            className="px-4 py-2.5 rounded-lg bg-[#FFFFFF]/95 backdrop-blur-md text-[#1B1B1B] font-semibold text-xs tracking-wider uppercase shadow-lg border border-neutral-200 hover:bg-[#B71C1C] hover:text-white hover:border-[#B71C1C] transition-all duration-300 flex items-center gap-2"
          >
            <Info size={14} /> Scientific Overview
          </button>
        </div>
      </div>

      {/* Content details */}
      <div className="p-5 flex-1 flex flex-col justify-between bg-white">
        <div>
          {/* Category */}
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#234D20]">
              {product.category}
            </span>
            <span className="text-[10px] text-neutral-400 font-semibold uppercase">
              Lab Certified
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-display text-lg sm:text-xl font-bold text-[#1B1B1B] group-hover:text-[#B71C1C] transition-colors duration-300 line-clamp-1">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-neutral-500 mt-2 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Interactive Controls Panel */}
        <div className="mt-5 pt-4 border-t border-neutral-100">
          
          {/* Weight Select Option & Pricing */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1">
                Net Weight
              </span>
              {product.weightOptions.length > 1 ? (
                <select
                  value={selectedWeight}
                  onChange={(e) => {
                    setSelectedWeight(e.target.value);
                    setQuantity(1); // reset quantity to avoid massive calculations
                  }}
                  className="bg-[#F8F8F4] border border-neutral-200/80 rounded px-2.5 py-1 text-xs font-semibold text-neutral-800 focus:outline-none focus:ring-1 focus:ring-[#B71C1C]/50 hover:border-neutral-300 cursor-pointer transition-colors"
                >
                  {product.weightOptions.map((weight) => (
                    <option key={weight} value={weight}>
                      {weight}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-xs font-bold text-neutral-800 bg-[#F8F8F4] px-2.5 py-1 rounded border border-neutral-200/40">
                  {selectedWeight}
                </span>
              )}
            </div>

            {/* Price Marker */}
            <div className="text-right">
              <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold block mb-0.5">
                Price
              </span>
              <span className="text-xl font-bold text-[#1B1B1B] font-display">
                ₹{price}
              </span>
            </div>
          </div>

          {/* Incrementer and Cart Action */}
          <div className="flex items-center gap-2">
            {/* Quantity Selector */}
            <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-[#F8F8F4]">
              <button
                onClick={handleDecrement}
                className="p-2 text-neutral-500 hover:bg-neutral-200/40 hover:text-black transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus size={12} />
              </button>
              <span className="px-3 text-xs font-bold text-neutral-800 select-none min-w-[20px] text-center">
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                className="p-2 text-neutral-500 hover:bg-neutral-200/40 hover:text-black transition-colors"
                aria-label="Increase quantity"
              >
                <Plus size={12} />
              </button>
            </div>

            {/* Quick Add Button */}
            <button
              onClick={handleAdd}
              disabled={addedPop}
              className={`flex-1 py-2 px-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
                addedPop
                  ? 'bg-[#234D20] text-white'
                  : 'bg-[#B71C1C] text-white hover:bg-[#961818] shadow-md active:scale-95'
              }`}
            >
              {addedPop ? (
                <>
                  <Check size={14} /> Added
                </>
              ) : (
                <>
                  <ShoppingCart size={13} /> Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
