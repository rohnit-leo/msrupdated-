/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Send, CreditCard, ShieldCheck, HelpCircle } from 'lucide-react';
import { CartItem } from '../types';
import { addOrderToFirestore } from '../firebase';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  grandTotal: number;
  subtotal: number;
  discountAmount: number;
  deliveryCharge: number;
  appliedCoupon: string;
  onOrderPlaced: () => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  grandTotal,
  subtotal,
  discountAmount,
  deliveryCharge,
  appliedCoupon,
  onOrderPlaced,
}: CheckoutModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    houseNumber: '',
    street: '',
    area: '',
    city: '',
    district: '',
    state: 'Telangana',
    pincode: '',
    deliveryInstructions: '',
    paymentMethod: 'Cash on Delivery',
    orderNotes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.phone.trim() || formData.phone.length < 10) newErrors.phone = 'Valid phone number is required';
    if (!formData.email.trim()) newErrors.email = 'Email address is required';
    if (!formData.houseNumber.trim()) newErrors.houseNumber = 'House Number is required';
    if (!formData.street.trim()) newErrors.street = 'Street details are required';
    if (!formData.area.trim()) newErrors.area = 'Area/Locality is required';
    if (!formData.city.trim()) newErrors.city = 'Village/City is required';
    if (!formData.district.trim()) newErrors.district = 'District is required';
    if (!formData.pincode.trim() || formData.pincode.length !== 6) newErrors.pincode = 'Valid 6-digit Pincode is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Build the beautiful premium prefilled WhatsApp message
    const orderDate = new Date().toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const orderTime = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });

    let message = `*✦ MSR AROMA PRIVATE LIMITED - PRE-ORDER DETAILS* \n`;
    message += `_Where Tradition Meets Agricultural Science_\n\n`;
    
    message += `*Order Date:* ${orderDate}\n`;
    message += `*Order Time:* ${orderTime}\n`;
    message += `----------------------------------------------\n\n`;

    message += `*CUSTOMER INFO*\n`;
    message += `• *Name:* ${formData.fullName}\n`;
    message += `• *Phone:* ${formData.phone}\n`;
    message += `• *Email:* ${formData.email}\n\n`;

    message += `*DELIVERY ADDRESS*\n`;
    message += `• *H.No:* ${formData.houseNumber}\n`;
    message += `• *Street:* ${formData.street}\n`;
    message += `• *Area/Locality:* ${formData.area}\n`;
    message += `• *Village/City:* ${formData.city}\n`;
    message += `• *District:* ${formData.district}\n`;
    message += `• *State:* ${formData.state}\n`;
    message += `• *Pincode:* ${formData.pincode}\n\n`;

    message += `*ORDER SUMMARY*\n`;
    cartItems.forEach((item, idx) => {
      const itemPrice = item.product.pricesByWeight[item.selectedWeight];
      message += `${idx + 1}. *${item.product.name}* (${item.selectedWeight})\n`;
      message += `   Qty: ${item.quantity} x ₹${itemPrice} = *₹${itemPrice * item.quantity}*\n`;
    });
    message += `\n`;

    message += `----------------------------------------------\n`;
    message += `• *Subtotal:* ₹${subtotal}\n`;
    if (discountAmount > 0) {
      message += `• *Coupon Applied:* ${appliedCoupon || 'Special'} (-₹${discountAmount})\n`;
    }
    message += `• *Shipping/Delivery:* ${deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}\n`;
    message += `*Grand Total:* ₹${grandTotal}\n`;
    message += `----------------------------------------------\n\n`;

    message += `*Payment Selection:* ${formData.paymentMethod}\n`;
    if (formData.deliveryInstructions.trim()) {
      message += `*Delivery instructions:* ${formData.deliveryInstructions}\n`;
    }
    if (formData.orderNotes.trim()) {
      message += `*Order Notes:* ${formData.orderNotes}\n`;
    }

    message += `\nThank you for choosing MSR Aroma's scientifically pure spices to protect your family's health!`;

    // Save to Firestore and local storage for real-time tracking in Admin Panel
    const orderId = 'MSR-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder = {
      id: orderId,
      customerName: formData.fullName,
      customerPhone: formData.phone,
      customerEmail: formData.email,
      customerAddress: `${formData.houseNumber}, ${formData.street}, ${formData.area}, ${formData.city}, ${formData.district}, ${formData.state} - ${formData.pincode}`,
      items: cartItems.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        weight: item.selectedWeight,
        quantity: item.quantity,
        price: item.product.pricesByWeight[item.selectedWeight] || 0
      })),
      subtotal,
      discountAmount,
      deliveryCharge,
      grandTotal,
      paymentMethod: formData.paymentMethod,
      status: 'Pending' as const,
      date: `${orderDate} ${orderTime}`,
      timestamp: new Date().toISOString()
    };

    try {
      addOrderToFirestore(newOrder);
    } catch (e) {
      console.error('Error saving order to Firestore', e);
    }

    try {
      const existingOrdersStr = localStorage.getItem('msr_aroma_orders');
      const existingOrders = existingOrdersStr ? JSON.parse(existingOrdersStr) : [];
      existingOrders.unshift(newOrder);
      localStorage.setItem('msr_aroma_orders', JSON.stringify(existingOrders));
    } catch (e) {
      console.error('Error saving order to local storage', e);
    }

    // Encode URL and trigger browser routing
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/918341163205?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappURL, '_blank');

    // Trigger internal order completion state
    onOrderPlaced();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-neutral-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="p-6 border-b border-neutral-200 bg-[#F8F8F4] flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-[#1B1B1B]">Delivery & Order Registration</h2>
            <p className="text-xs text-neutral-500 mt-1">Provide your delivery coordinate details to complete your WhatsApp purchase.</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-black">
            <X size={20} />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 flex-1 overflow-y-auto">
          {/* Customer Details */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-[#B71C1C] font-extrabold border-b border-neutral-100 pb-1">1. Customer Identification</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block mb-1">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full bg-[#F8F8F4] border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 ${errors.fullName ? 'border-[#B71C1C] focus:ring-[#B71C1C]' : 'border-neutral-200 focus:ring-[#234D20]'}`}
                  placeholder="e.g. Renuka Reddy"
                />
                {errors.fullName && <p className="text-[10px] text-[#B71C1C] font-semibold mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block mb-1">Phone Number (WhatsApp Active) *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full bg-[#F8F8F4] border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 ${errors.phone ? 'border-[#B71C1C] focus:ring-[#B71C1C]' : 'border-neutral-200 focus:ring-[#234D20]'}`}
                  placeholder="10-digit number"
                />
                {errors.phone && <p className="text-[10px] text-[#B71C1C] font-semibold mt-1">{errors.phone}</p>}
              </div>

              <div className="sm:col-span-2">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full bg-[#F8F8F4] border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 ${errors.email ? 'border-[#B71C1C] focus:ring-[#B71C1C]' : 'border-neutral-200 focus:ring-[#234D20]'}`}
                    placeholder="e.g. name@domain.com"
                  />
                  {errors.email && <p className="text-[10px] text-[#B71C1C] font-semibold mt-1">{errors.email}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Location details */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-[#B71C1C] font-extrabold border-b border-neutral-100 pb-1">2. Delivery Logistics Address</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block mb-1">H.No / Flat *</label>
                <input
                  type="text"
                  name="houseNumber"
                  value={formData.houseNumber}
                  onChange={handleInputChange}
                  className={`w-full bg-[#F8F8F4] border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 ${errors.houseNumber ? 'border-[#B71C1C] focus:ring-[#B71C1C]' : 'border-neutral-200 focus:ring-[#234D20]'}`}
                  placeholder="e.g. Flat 304, Block-B"
                />
                {errors.houseNumber && <p className="text-[10px] text-[#B71C1C] font-semibold mt-1">{errors.houseNumber}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block mb-1">Street / Apartment *</label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  className={`w-full bg-[#F8F8F4] border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 ${errors.street ? 'border-[#B71C1C] focus:ring-[#B71C1C]' : 'border-neutral-200 focus:ring-[#234D20]'}`}
                  placeholder="e.g. Arundhati colony, Near temple"
                />
                {errors.street && <p className="text-[10px] text-[#B71C1C] font-semibold mt-1">{errors.street}</p>}
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block mb-1">Area / Locality *</label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  className={`w-full bg-[#F8F8F4] border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 ${errors.area ? 'border-[#B71C1C] focus:ring-[#B71C1C]' : 'border-neutral-200 focus:ring-[#234D20]'}`}
                  placeholder="e.g. Madhapur"
                />
                {errors.area && <p className="text-[10px] text-[#B71C1C] font-semibold mt-1">{errors.area}</p>}
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block mb-1">Village / City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`w-full bg-[#F8F8F4] border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 ${errors.city ? 'border-[#B71C1C] focus:ring-[#B71C1C]' : 'border-neutral-200 focus:ring-[#234D20]'}`}
                  placeholder="e.g. Hyderabad"
                />
                {errors.city && <p className="text-[10px] text-[#B71C1C] font-semibold mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block mb-1">District *</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className={`w-full bg-[#F8F8F4] border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 ${errors.district ? 'border-[#B71C1C] focus:ring-[#B71C1C]' : 'border-neutral-200 focus:ring-[#234D20]'}`}
                  placeholder="e.g. Rangareddy"
                />
                {errors.district && <p className="text-[10px] text-[#B71C1C] font-semibold mt-1">{errors.district}</p>}
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block mb-1">State *</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full bg-[#F8F8F4] border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#234D20]"
                >
                  <option value="Telangana">Telangana</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Delhi">Delhi</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block mb-1">Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className={`w-full bg-[#F8F8F4] border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 ${errors.pincode ? 'border-[#B71C1C] focus:ring-[#B71C1C]' : 'border-neutral-200 focus:ring-[#234D20]'}`}
                  placeholder="6-digit PIN"
                />
                {errors.pincode && <p className="text-[10px] text-[#B71C1C] font-semibold mt-1">{errors.pincode}</p>}
              </div>
            </div>
          </div>

          {/* Shipping & Notes */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-[#B71C1C] font-extrabold border-b border-neutral-100 pb-1">3. Payment & Instructions</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block mb-1">Payment Method Selection</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer bg-[#F8F8F4] p-3 rounded-xl border border-neutral-200 flex-1">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash on Delivery"
                      checked={formData.paymentMethod === 'Cash on Delivery'}
                      onChange={handleInputChange}
                      className="accent-[#B71C1C]"
                    />
                    <span className="text-xs font-bold text-neutral-800">Cash on Delivery</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer bg-[#F8F8F4] p-3 rounded-xl border border-neutral-200 flex-1 opacity-70">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Online Bank Transfer Placeholder"
                      checked={formData.paymentMethod === 'Online Bank Transfer Placeholder'}
                      onChange={handleInputChange}
                      className="accent-[#B71C1C]"
                    />
                    <span className="text-xs font-bold text-neutral-500">UPI / Online Pay</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block mb-1">Delivery Instructions (Optional)</label>
                <textarea
                  name="deliveryInstructions"
                  value={formData.deliveryInstructions}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full bg-[#F8F8F4] border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#234D20]"
                  placeholder="e.g. Leave package with gatekeeper"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block mb-1">Order Notes / Custom Requests</label>
                <textarea
                  name="orderNotes"
                  value={formData.orderNotes}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full bg-[#F8F8F4] border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#234D20]"
                  placeholder="e.g. Need high-curcumin test brochure printed copy with package"
                />
              </div>
            </div>
          </div>

          {/* Sticky Total Calculation Panel */}
          <div className="bg-[#234D20]/5 p-4 rounded-xl border border-[#234D20]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-[#234D20]" size={24} />
              <div>
                <p className="text-xs font-bold text-[#234D20] uppercase tracking-wider">Direct Agri-Link Protocol</p>
                <p className="text-[10px] text-neutral-500">Your order will be instantly formatted and redirected to our founder via WhatsApp.</p>
              </div>
            </div>
            <div className="text-right sm:text-right">
              <span className="text-xs text-neutral-500 uppercase tracking-widest block font-bold">Total Amount Due</span>
              <span className="text-2xl font-black text-[#1B1B1B] font-display">₹{grandTotal}</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl border border-neutral-200 font-bold text-xs uppercase tracking-wider text-neutral-600 hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-[#B71C1C] text-white font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-lg hover:bg-[#961818] transition-all duration-300 flex items-center gap-2"
            >
              <Send size={14} /> Place Order via WhatsApp
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
