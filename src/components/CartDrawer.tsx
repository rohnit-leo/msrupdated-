/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { X, Plus, Minus, Trash2, Ticket, Check, ShieldAlert } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productID: string, weight: string, newQty: number) => void;
  onRemoveItem: (productID: string, weight: string) => void;
  onProceedToCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}: CartDrawerProps) {
  const [coupon, setCoupon] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isOpen) return null;

  // Calculators
  const calculateSubtotal = () => {
    return cartItems.reduce((acc, item) => {
      const price = item.product.pricesByWeight[item.selectedWeight];
      return acc + price * item.quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const discountAmount = Math.round(subtotal * appliedDiscount);
  const deliveryCharge = subtotal > 300 ? 0 : subtotal === 0 ? 0 : 40;
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryCharge);

  const handleApplyCoupon = () => {
    setCouponError('');
    setCouponSuccess('');
    const code = coupon.trim().toUpperCase();
    if (code === 'MSRAROMA10' || code === 'PURESPICES') {
      setAppliedDiscount(0.10);
      setCouponSuccess('10% VIP Coupon Applied Successfully!');
    } else if (code === 'MOTHERSPROMISE') {
      setAppliedDiscount(0.15);
      setCouponSuccess('15% Mother\'s Standard discount applied!');
    } else {
      setCouponError('Invalid coupon code. Try "PURESPICES" or "MOTHERSPROMISE".');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs" onClick={onClose}>
      <div
        className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 flex items-center justify-between bg-[#F8F8F4]">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-xl font-bold text-[#1B1B1B]">Your Aroma Basket</h2>
            <span className="text-xs bg-[#B71C1C] text-white px-2 py-0.5 rounded-full font-bold">
              {cartItems.length}
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-neutral-500 hover:bg-neutral-200/50 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Item List Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-[#F8F8F4] rounded-full flex items-center justify-center text-neutral-400 border border-neutral-200/60">
                <X size={24} />
              </div>
              <div>
                <p className="font-display text-lg font-bold text-neutral-700">Your basket is empty</p>
                <p className="text-xs text-neutral-400 mt-1 max-w-[240px]">
                  Add our farm-sourced, chemically tested spices to start your health journey.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-[#B71C1C] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow hover:bg-[#961818]"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => {
              const itemPrice = item.product.pricesByWeight[item.selectedWeight];
              return (
                <div key={`${item.product.id}-${item.selectedWeight}`} className="flex items-center gap-4 bg-[#F8F8F4]/50 p-3 rounded-xl border border-neutral-200/40 relative group">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-lg object-cover border border-neutral-200"
                    referrerPolicy="no-referrer"
                  />
                  
                  <div className="flex-1">
                    <h4 className="text-xs font-extrabold text-[#1B1B1B] line-clamp-1">{item.product.name}</h4>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{item.selectedWeight}</span>
                    
                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-neutral-200 rounded bg-white">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.selectedWeight, item.quantity - 1)}
                          className="p-1 text-neutral-500 hover:bg-neutral-100"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-neutral-800">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.selectedWeight, item.quantity + 1)}
                          className="p-1 text-neutral-500 hover:bg-neutral-100"
                        >
                          <Plus size={10} />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <span className="text-sm font-bold text-[#1B1B1B] font-display">
                        ₹{itemPrice * item.quantity}
                      </span>
                    </div>
                  </div>

                  {/* Trash Icon */}
                  <button
                    onClick={() => onRemoveItem(item.product.id, item.selectedWeight)}
                    className="p-1.5 rounded-full text-neutral-400 hover:text-[#B71C1C] hover:bg-red-50 transition-colors absolute top-2 right-2"
                    aria-label="Remove item"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Summary Footer Area */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-neutral-200 bg-[#F8F8F4] space-y-4">
            
            {/* Promo Code Fields */}
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block">
                Have a premium coupon?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. PURESPICES"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="flex-1 bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#B71C1C]"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="px-3 bg-[#1B1B1B] text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center gap-1"
                >
                  <Ticket size={12} /> Apply
                </button>
              </div>
              {couponError && <p className="text-[10px] text-[#B71C1C] font-semibold">{couponError}</p>}
              {couponSuccess && (
                <p className="text-[10px] text-[#234D20] font-bold flex items-center gap-1">
                  <Check size={12} /> {couponSuccess}
                </p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-neutral-600 border-t border-neutral-200/60 pt-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-neutral-800">₹{subtotal}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-[#234D20] font-bold">
                  <span>Special Discount</span>
                  <span>- ₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Delivery</span>
                {deliveryCharge === 0 ? (
                  <span className="text-[#234D20] font-bold">FREE DELIVERY</span>
                ) : (
                  <span className="font-bold text-neutral-800">₹{deliveryCharge}</span>
                )}
              </div>
              {subtotal < 300 && (
                <p className="text-[9px] text-[#B71C1C] font-bold">
                  Add ₹{300 - subtotal} more to unlock FREE shipping!
                </p>
              )}
              
              <div className="flex justify-between text-base font-extrabold text-[#1B1B1B] font-display border-t border-neutral-200/60 pt-2">
                <span>Estimated Total</span>
                <span className="text-lg">₹{grandTotal}</span>
              </div>
            </div>

            {/* Proceed to Checkout Action */}
            <button
              onClick={onProceedToCheckout}
              className="w-full py-3.5 bg-[#B71C1C] text-white text-xs font-extrabold uppercase tracking-widest rounded-xl shadow-lg hover:bg-[#961818] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2"
            >
              Proceed to Secure Checkout
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[9px] text-neutral-400 font-semibold">
              <ShieldAlert size={12} className="text-[#E0A106]" /> Secure WhatsApp Checkout protocol
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
