/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  category: string;
  weightOptions: string[]; // e.g., ["100g", "250g", "500g"]
  pricesByWeight: Record<string, number>; // e.g., {"100g": 85, "250g": 195}
  description: string;
  benefits: string[];
  ingredients: string[];
  storageInstructions: string;
  nutritionalInfo: {
    energy: string;      // per 100g
    carbohydrates: string;
    protein: string;
    fat: string;
    sodium?: string;
    curcumin?: string;   // specific to Turmeric
  };
  packagingDetails: string;
  badge?: string; // e.g. "Best Seller", "100% Curcumin", "New Sensation"
  image: string;
}

export interface CartItem {
  product: Product;
  selectedWeight: string;
  quantity: number;
}

export interface Founder {
  id?: string;
  name: string;
  role: string;
  credentials: string;
  description: string;
  quote: string;
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  comment: string;
  rating: number;
  date: string;
}

export interface Recipe {
  id: string;
  name: string;
  time: string;
  servings: string;
  difficulty: string;
  ingredients: string[];
  instructions: string[];
  image: string;
  tip: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  date: string;
  content: string[];
  image: string;
}

export interface TimelineEvent {
  id: string;
  stage: string;
  title: string;
  description: string;
  location: string;
}

export interface ProcessingStep {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  techDetail: string;
}
