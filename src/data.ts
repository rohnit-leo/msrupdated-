/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Founder, Testimonial, Recipe, BlogPost, TimelineEvent, ProcessingStep } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'premium-turmeric',
    name: 'High-Curcumin Premium Turmeric Powder',
    category: 'Spices',
    weightOptions: ['100g', '250g', '500g'],
    pricesByWeight: {
      '100g': 75,
      '250g': 175,
      '500g': 335,
    },
    description: 'Boasting a naturally high curcumin content (>5%), our turmeric is sourced directly from sustainable farms in Nizamabad. Extracted under scientific surveillance, it preserves maximum antioxidant and anti-inflammatory benefits, delivering a rich, deep golden-yellow color and warm earthy notes.',
    benefits: [
      'Guaranteed high Curcumin content (>5%) for potent anti-inflammatory properties',
      'Acts as a powerful natural antioxidant boosting daily immunity',
      'Processed under cool-milling tech to protect volatile aromatic oils',
      'Zero lead chromate or starch adulteration—100% pure'
    ],
    ingredients: ['100% Pure Single-Origin Nizamabad Turmeric Rhizomes'],
    storageInstructions: 'Keep in an airtight container in a dark, dry space. Avoid exposure to direct sunlight to prevent curcumin degradation.',
    nutritionalInfo: {
      energy: '356 kcal',
      carbohydrates: '64.9g',
      protein: '7.8g',
      fat: '9.9g',
      curcumin: '> 5.2%'
    },
    packagingDetails: 'Aesthetic light-shielding premium metallic barrier zip-lock pouch to preserve biochemical activity.',
    badge: 'High Curcumin (5%+)',
    image: 'https://falh4wp7xhmztgpi.public.blob.vercel-storage.com/IMG_2834.PNG'
  },
  {
    id: 'telangana-chilli',
    name: 'Premium Telangana Chilli Powder',
    category: 'Spices',
    weightOptions: ['100g', '250g', '500g'],
    pricesByWeight: {
      '100g': 85,
      '250g': 195,
      '500g': 375,
    },
    description: 'Sourced from the heart of Telangana, this premium chilli powder is processed from selected high-capsaicin chillies. Sun-dried under hygienic conditions and scientifically milled to retain its high natural oils, vibrant deep-red color, and intense heat without any artificial dyes.',
    benefits: [
      'High capsaicin content triggers metabolism and aids digestion',
      'Naturally rich in Vitamin C, promoting cell health and immunity',
      'Vibrant red color achieved naturally without harmful Sudan dyes',
      'Aromatic oils preserved via advanced low-temperature grinding'
    ],
    ingredients: ['100% Pure Premium Telangana Red Chillies'],
    storageInstructions: 'Store in a cool, dry, airtight container away from direct sunlight and moisture to maintain natural pungency and color.',
    nutritionalInfo: {
      energy: '394 kcal',
      carbohydrates: '51.3g',
      protein: '13.4g',
      fat: '14.8g',
      sodium: '31mg'
    },
    packagingDetails: '3-layer food-grade nitrogen-flushed metallic pouch to lock in color, heat, and freshness for up to 12 months.',
    badge: 'Telangana Signature',
    image: 'https://falh4wp7xhmztgpi.public.blob.vercel-storage.com/IMG_2839.PNG'
  },
  {
    id: 'coriander-powder',
    name: 'Aromatic Coriander Powder',
    category: 'Spices',
    weightOptions: ['100g', '250g', '500g'],
    pricesByWeight: {
      '100g': 55,
      '250g': 125,
      '500g': 240,
    },
    description: 'Made from select, plump coriander seeds of high essential oil content, freshly crushed to release a soothing citrusy and earthy aroma. Meticulously cleaned, cool-ground, and packed under sterile conditions to elevate your everyday culinary experience.',
    benefits: [
      'High linalool content delivers superior therapeutic aroma and digestion aid',
      'Provides subtle, refreshing citrusy undertones that balance rich masalas',
      'Zero starches, husks, or spent materials mixed inside',
      'Rich in dietary fiber and essential minerals'
    ],
    ingredients: ['100% Pure Whole Coriander Seeds (Dhania)'],
    storageInstructions: 'Store in a cool, dry place. Re-seal carefully after opening to prevent the escape of volatile citrus oils.',
    nutritionalInfo: {
      energy: '298 kcal',
      carbohydrates: '54.2g',
      protein: '12.3g',
      fat: '17.8g',
      sodium: '35mg'
    },
    packagingDetails: 'Hygienically packed premium foil pouch that completely blocks air and moisture ingress.',
    badge: 'Freshly Ground',
    image: 'https://falh4wp7xhmztgpi.public.blob.vercel-storage.com/IMG_2836.PNG'
  },
  {
    id: 'jeera-powder',
    name: 'Scientific Jeera (Cumin) Powder Sachet',
    category: 'Masalas',
    weightOptions: ['12g', '100g'],
    pricesByWeight: {
      '12g': 10,
      '100g': 80,
    },
    description: 'Finest cumin seeds, cleaned through state-of-the-art gravity separators and roasted at an exact thermal profile to trigger essential oil release without scorching. Ground with low-temperature technology to deliver unmatched digestive efficacy and an intensely earthy, smoky flavor.',
    benefits: [
      'High concentration of thymol which stimulates pancreatic enzymes',
      'Sifted through triple-gravity separators for absolute grit-free purity',
      'Smoky, nutty aroma that enhances both Indian curries and buttermilk',
      'Packed under rigid quality control to prevent moisture absorption'
    ],
    ingredients: ['100% Roasted Pure Cumin Seeds'],
    storageInstructions: 'Store in a cool dry space. Consume immediately upon opening for maximum sensory impact.',
    nutritionalInfo: {
      energy: '375 kcal',
      carbohydrates: '44.2g',
      protein: '17.8g',
      fat: '22.3g',
      sodium: '168mg'
    },
    packagingDetails: 'Premium quality laminate foil pocket guarding against aroma decay and relative humidity.',
    badge: 'Perfect Roast',
    image: 'https://falh4wp7xhmztgpi.public.blob.vercel-storage.com/IMG_2837.PNG'
  },
  {
    id: 'garam-masala',
    name: 'Royal Garam Masala Sachet',
    category: 'Masalas',
    weightOptions: ['12g', '100g'],
    pricesByWeight: {
      '12g': 10,
      '100g': 95,
    },
    description: 'A royal blend of warm spices. We do not use fillers like stone flower or heavy starches. Our Royal Garam Masala is a highly concentrated blend of costly, high-grade spices like green cardamom, cloves, cinnamon, and black pepper, roasted gently and crushed with cold-milling technology.',
    benefits: [
      'Highly concentrated: a small pinch delivers deep, complex warmth',
      'Contains zero cheap fillers, artificial colors, or MSG',
      'Stimulates digestive fire (Agni) naturally and boosts nutrient assimilation',
      'Single-use freshness protection'
    ],
    ingredients: [
      'Black Pepper',
      'Cumin',
      'Cardamom',
      'Cloves',
      'Cinnamon',
      'Mace',
      'Nutmeg',
      'Star Anise',
      'Dry Ginger'
    ],
    storageInstructions: 'Keep in a dry place. Use immediately or store in a tiny tightly sealed spice bottle.',
    nutritionalInfo: {
      energy: '412 kcal',
      carbohydrates: '46.1g',
      protein: '12.8g',
      fat: '19.4g',
      sodium: '110mg'
    },
    packagingDetails: 'Nitrogen-sealed thick foil sachet to preserve premium sweet and savory essential wood notes.',
    badge: 'Royal Blend',
    image: 'https://falh4wp7xhmztgpi.public.blob.vercel-storage.com/IMG_2838.PNG'
  },
  {
    id: 'chicken-masala',
    name: 'Signature Chicken Masala Sachet',
    category: 'Masalas',
    weightOptions: ['12g', '100g'],
    pricesByWeight: {
      '12g': 10,
      '100g': 85,
    },
    description: 'An exquisite heritage blend crafted with scientific precision to lock in the absolute best flavors of a traditional home kitchen. Balanced carefully with rich coriander, robust pepper, cinnamon, and cardamoms, this spice mix ensures a rich, thick, deeply satisfying gravy with high natural fragrance.',
    benefits: [
      'Pre-balanced spice ratios derived from months of sensory research',
      'Authentic regional restaurant-grade taste right in your home',
      'Contains black pepper and ginger which aid digestion and nutrition absorption',
      'Single-use luxury sachet format to guarantee fresh aroma every single time'
    ],
    ingredients: [
      'Coriander',
      'Chilli',
      'Cumin',
      'Turmeric',
      'Black Pepper',
      'Cassia',
      'Garlic',
      'Ginger',
      'Cardamom',
      'Clove',
      'Nutmeg',
      'Fenugreek',
      'Fennel'
    ],
    storageInstructions: 'Keep in a cool, dry place. Best used immediately upon opening the single-serving sachet.',
    nutritionalInfo: {
      energy: '382 kcal',
      carbohydrates: '48.5g',
      protein: '11.8g',
      fat: '15.6g',
      sodium: '450mg'
    },
    packagingDetails: 'Sealed, nitrogen-flushed high-barrier single-use mini sachet for zero oxidation.',
    badge: 'Heritage Blend',
    image: 'https://falh4wp7xhmztgpi.public.blob.vercel-storage.com/IMG_2839.PNG'
  },
  {
    id: 'mutton-masala',
    name: 'Heritage Mutton Masala Sachet',
    category: 'Masalas',
    weightOptions: ['12g', '100g'],
    pricesByWeight: {
      '12g': 10,
      '100g': 90,
    },
    description: 'A slow-cook recipe helper of extraordinary class. Handpicked regional ingredients are combined using our proprietary scientific formula to perfectly tenderize meat while infusing every fiber with a rich, aromatic, mildly spicy, and savory profile worthy of grand banquets.',
    benefits: [
      'Acts as a natural mild tenderizer for rich mutton and lamb cuts',
      'Provides deep, layered umami and woody notes that withstand slow cooking',
      'Contains high-grade black pepper, cassia, and ginger for digestion support',
      'Aroma-lock single sachet packaging preserves freshness on every cook'
    ],
    ingredients: [
      'Coriander',
      'Chilli',
      'Cumin',
      'Ginger',
      'Fennel',
      'Black Pepper',
      'Turmeric',
      'Garlic',
      'Cassia',
      'Clove',
      'Mace',
      'Nutmeg',
      'Cardamom',
      'Salt'
    ],
    storageInstructions: 'Store in a cool, dry place. Best consumed immediately after breaking the seal.',
    nutritionalInfo: {
      energy: '369 kcal',
      carbohydrates: '49.1g',
      protein: '10.5g',
      fat: '14.2g',
      sodium: '520mg'
    },
    packagingDetails: 'Premium metallic airless single sachet packaging protecting aromatic oils from evaporation.',
    badge: 'Rich Slow-Cook',
    image: 'https://falh4wp7xhmztgpi.public.blob.vercel-storage.com/IMG_2840.PNG'
  },
  {
    id: 'biryani-masala',
    name: 'Special Biryani Masala Sachet',
    category: 'Masalas',
    weightOptions: ['12g', '100g'],
    pricesByWeight: {
      '12g': 12,
      '100g': 110,
    },
    description: 'An premium, ultra-aromatic blend curated for authentic Nizami biryani. We source costly royal spices like saffron strands, shahi jeera, mace, nutmeg, and green cardamoms to create a sensory explosion. Low-temperature processing guarantees your biryani smells heavenly.',
    benefits: [
      'Contains premium whole spices for an authentic Nizami dining experience',
      'Saffron and green cardamom essential oils preserved via cold-milling',
      'Perfect spice balance, eliminating the need for any other spice flavoring',
      'Aroma-locked single sachet formatting'
    ],
    ingredients: [
      'Shahi Jeera',
      'Green Cardamom',
      'Mace',
      'Nutmeg',
      'Star Anise',
      'Cinnamon',
      'Cloves',
      'Black Cardamom',
      'Bay Leaf',
      'Black Pepper',
      'Kashmiri Red Chilli',
      'Saffron'
    ],
    storageInstructions: 'Keep in a dark, dry container. Seal tightly to prevent volatile rose-citrus wood tones from fading.',
    nutritionalInfo: {
      energy: '419 kcal',
      carbohydrates: '43.2g',
      protein: '11.2g',
      fat: '21.5g',
      sodium: '85mg'
    },
    packagingDetails: 'Luxurious double-foil light-shielded laminate pouch preserving delicate saffron aromatics.',
    badge: 'Signature Blend',
    image: 'https://falh4wp7xhmztgpi.public.blob.vercel-storage.com/IMG_2841.PNG'
  },
  {
    id: 'sambar-masala',
    name: 'Spiced Sambar Masala Sachet',
    category: 'Masalas',
    weightOptions: ['12g', '100g'],
    pricesByWeight: {
      '12g': 10,
      '100g': 75,
    },
    description: 'Bring the authentic taste of premium southern kitchens right to your home. Composed of roasted handpicked lentils, premium red chillies, and aromatic fenugreek, balanced meticulously to produce a warm, tangy, and earthy sambar with high dietary value.',
    benefits: [
      'Authentic recipe containing premium roasted pulses and whole spices',
      'Naturally rich in proteins and fiber from natural organic pulses',
      'Features high-grade asafoetida (Hing) for superior digestion',
      'Perfect consistency and aroma on every boil'
    ],
    ingredients: [
      'Coriander Seeds',
      'Bengal Gram Lentils',
      'Red Chilli',
      'Toor Gram Lentils',
      'Cumin',
      'Fenugreek Seeds',
      'Asafoetida',
      'Turmeric',
      'Black Pepper',
      'Curry Leaves'
    ],
    storageInstructions: 'Store in an airtight jar in a cool place. Avoid using wet spoons to maintain pristine dryness.',
    nutritionalInfo: {
      energy: '345 kcal',
      carbohydrates: '50.1g',
      protein: '14.8g',
      fat: '9.2g',
      sodium: '190mg'
    },
    packagingDetails: '3-layer airless nitrogen-purged foil packet locking in earthy fenugreek volatiles.',
    badge: 'Traditional Taste',
    image: 'https://falh4wp7xhmztgpi.public.blob.vercel-storage.com/IMG_2842.PNG'
  },
  {
    id: 'fish-masala',
    name: 'Zesty Fish Fry Masala Sachet',
    category: 'Masalas',
    weightOptions: ['12g', '100g'],
    pricesByWeight: {
      '12g': 10,
      '100g': 85,
    },
    description: 'Crafted specifically to make mouthwatering, crispy fish fries and rich coastal curries. We combine natural tangy agents with robust Telangana red chilli and warming spices to coat the fish perfectly, sealing in moisture and adding premium regional flavor.',
    benefits: [
      'Features a proprietary natural coating agent for crispy uniform textures',
      'Combines tangy, citrusy and hot profiles to eliminate raw fish scent',
      'Includes premium mustard and cumin to aid smooth nutrition absorption',
      'Free from synthetic food colors or chemical preservatives'
    ],
    ingredients: [
      'Red Chilli',
      'Coriander',
      'Turmeric',
      'Ginger',
      'Garlic',
      'Black Pepper',
      'Mustard',
      'Cumin',
      'Fenugreek',
      'Cassia',
      'Salt'
    ],
    storageInstructions: 'Store in a dry, cool cupboard. Re-seal instantly if multi-serving is chosen.',
    nutritionalInfo: {
      energy: '372 kcal',
      carbohydrates: '47.5g',
      protein: '12.1g',
      fat: '14.9g',
      sodium: '680mg'
    },
    packagingDetails: 'Moisture-proof medical-grade multi-barrier pouch preventing oxidation and spice clumping.',
    badge: 'Coastal Special',
    image: 'https://falh4wp7xhmztgpi.public.blob.vercel-storage.com/IMG_2843.PNG'
  },
  {
    id: 'rasam-masala',
    name: 'Classic Rasam Masala Sachet',
    category: 'Masalas',
    weightOptions: ['12g', '100g'],
    pricesByWeight: {
      '12g': 10,
      '100g': 75,
    },
    description: 'An legendary scientific blend to brew the ultimate, hot, soothing rasam soup. Rich in whole black pepper (piperine) and heavy roasted cumin, this formulation has potent ayurvedic healing values, clearing congestion and comforting the digestive tract.',
    benefits: [
      'Rich in high-grade black pepper and cumin to boost metabolic rates',
      'Brew opens up congested respiratory systems and relieves cold instantly',
      'Deep, earthy, peppery flavor profile that requires zero manual filtering',
      'Authentic southern household recipe certified by nutrition experts'
    ],
    ingredients: [
      'Black Pepper',
      'Cumin Seeds',
      'Toor Gram Lentils',
      'Red Chilli',
      'Coriander Seeds',
      'Turmeric',
      'Asafoetida',
      'Fenugreek'
    ],
    storageInstructions: 'Keep in an airtight jar in a dry, shaded area to retain volatile peppery oils.',
    nutritionalInfo: {
      energy: '339 kcal',
      carbohydrates: '51.8g',
      protein: '15.2g',
      fat: '8.1g',
      sodium: '150mg'
    },
    packagingDetails: 'High-barrier, light-blocking hermetic packaging safeguarding the sharp, therapeutic oils.',
    badge: 'Ayurvedic Formula',
    image: 'https://falh4wp7xhmztgpi.public.blob.vercel-storage.com/IMG_2844.PNG'
  },
  {
    id: 'sabji-masala',
    name: 'Pure Sabji Masala Sachet',
    category: 'Masalas',
    weightOptions: ['12g', '100g'],
    pricesByWeight: {
      '12g': 10,
      '100g': 70,
    },
    description: 'The ultimate daily culinary companion. Formulated to enhance any vegetable preparation, dry subji, or mild curry. Carefully balanced so it does not overpower the natural taste of green vegetables, adding a rich, golden hue and mouthwatering homestyle flavor.',
    benefits: [
      'Highly versatile blend suitable for all standard vegetable preparations',
      'Enhances natural vegetable sweetness without excessive heat',
      'Features high-grade coriander and dry ginger for superior digestive ease',
      '100% free of artificial flavor enhancers, starch, or colors'
    ],
    ingredients: [
      'Coriander',
      'Cumin',
      'Turmeric',
      'Dry Ginger',
      'Black Pepper',
      'Dry Mango (Amchur)',
      'Fennel',
      'Cassia',
      'Cardamom',
      'Clove',
      'Nutmeg'
    ],
    storageInstructions: 'Keep in a cool, dark, dry shelf. Avoid moisture contact.',
    nutritionalInfo: {
      energy: '360 kcal',
      carbohydrates: '53.4g',
      protein: '11.5g',
      fat: '11.8g',
      sodium: '280mg'
    },
    packagingDetails: 'Premium food-safe multi-layered pouch keeping aroma locked and dust particles out.',
    badge: 'Daily Essential',
    image: 'https://falh4wp7xhmztgpi.public.blob.vercel-storage.com/IMG_2845.PNG'
  }
];

export const FOUNDERS: Founder[] = [
  {
    name: 'Renuka',
    role: 'Director & Inspiration',
    credentials: 'The Emotional Heart & Guardian of Purity',
    description: 'Renuka is the guiding compass who defines our "Mother’s Standard". Having spent decades preparing pure spice blends for her own family, she ensures that no packet leaving our sterile facility contains anything she wouldn\'t feed her grandchildren. Her rigorous standards of absolute purity, zero artificial colors, and natural textures define the soul of MSR Aroma.',
    quote: '"My kitchen was built on trust, safety, and health. I started MSR Aroma to bring that very same mother\'s standard of purity and hygiene to every dining table across India."',
    image: 'https://falh4wp7xhmztgpi.public.blob.vercel-storage.com/WhatsApp%20Image%202026-07-26%20at%2010.03.40%20PM.jpeg'
  },
  {
    name: 'M. Shravan Kumar',
    role: 'Founder & CEO',
    credentials: 'B.Sc Agriculture | Agronomist',
    description: 'With a deep educational foundation in Agricultural Science, Shravan bridges the gap between traditional Indian farming and modern agricultural engineering. He manages our exclusive farmer-direct sourcing network in Telangana, ensuring that crops are grown sustainably, harvested at peak maturity, and tested rigorously for biochemical properties directly on the soil levels.',
    quote: '"Purity isn\'t created in a factory. It is grown on healthy, chemical-free soils. By partnering directly with farmers, we ensure our seeds are premium, resilient, and scientifically monitored."',
    image: 'https://falh4wp7xhmztgpi.public.blob.vercel-storage.com/WhatsApp%20Image%202026-07-26%20at%2010.03.39%20PM.jpeg'
  },
  {
    name: 'Tharun Reddy',
    role: 'Co-Founder & COO',
    credentials: 'MBA | B.Sc Technical Operations',
    description: 'Tharun combines scientific food-tech knowledge with rigorous business management. He has pioneered our state-of-the-art cold-milling processing framework. Under his technical supervision, we ensure that vulnerable essential oils (which give spices their health properties and fragrance) are never vaporized during grinding, guaranteeing a 10x richer natural aroma.',
    quote: '"Our goal was simple: to make spices an active component of healthy lifestyle. Through cold-milling and light-proof oxygen-flushed packaging, we keep the volatile medicinal oils intact."',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80'
  }
];

export const TIMELINE: TimelineEvent[] = [
  {
    id: 't1',
    stage: '01',
    title: 'Seed & Soil Selection',
    description: 'Our agronomists, led by Shravan Kumar (B.Sc Agriculture), test soil mineral health and source single-origin, non-GMO heritage seeds from chosen farmer partners in Nizamabad and Telangana districts.',
    location: 'Sourcing Hub, Telangana'
  },
  {
    id: 't2',
    stage: '02',
    title: 'Peak Harvest & Hygienic Sun-Drying',
    description: 'Spices are harvested at precise botanical maturity. They are dried under shaded, dust-free food-grade solar tents to maintain moisture at an exact 8% level, preventing any fungal or aflatoxin growth.',
    location: 'Sustainable Partner Farms'
  },
  {
    id: 't3',
    stage: '03',
    title: 'Gravity & Metallic Cleaning',
    description: 'Whole spices pass through premium pneumatic gravity separators and multi-stage metal detectors. This removes heavy dust, dirt, husks, stones, or metallic micro-impurities, delivering absolute 99.9% clean crops.',
    location: 'MSR Aroma Research Lab'
  },
  {
    id: 't4',
    stage: '04',
    title: 'Scientific Low-Temp Milling',
    description: 'Traditional mills heat spices up to 60°C, vaporizing vital health compounds. We use slow-milling liquid-cooled grinders keeping temperatures under 28°C, sealing in every molecule of capsaicin and curcumin.',
    location: 'State-of-the-Art Processing Center'
  },
  {
    id: 't5',
    stage: '05',
    title: 'Nitrogen-Flushed Premium Packaging',
    description: 'Finally, ground powders are packed in 3-layer light-blocking metallic laminates. Air is vacuumed out and food-grade nitrogen is flushed in, stopping oxidation and preserving freshness for up to 12 months.',
    location: 'Cleanroom Packaging Zone'
  }
];

export const PROCESSING_STEPS: ProcessingStep[] = [
  {
    id: 'p1',
    title: 'Triple Destoning',
    subtitle: 'Gravity Cleaning',
    description: 'Using high-frequency vibrations and density-based air sifting, we completely isolate heavy grit, dust particles, and organic chaff from core whole spices.',
    techDetail: 'Eliminates 100% of soil impurities'
  },
  {
    id: 'p2',
    title: 'Cryo-Cool Grinding',
    subtitle: 'Essential Oil Shield',
    description: 'Instead of dry hammering which scorching spices, our rotors are insulated with cool liquid circulation to prevent heat-build-up, keeping medicinal oils completely safe.',
    techDetail: 'Grinding temperature held below 28°C'
  },
  {
    id: 'p3',
    title: 'Spectrophotometer Audit',
    subtitle: 'Curcumin & Quality Check',
    description: 'Each batch is tested in our quality assurance laboratory. Curcumin content is checked via UV-Vis Spectrophotometry to guarantee levels remain above therapeutic grade.',
    techDetail: 'Turmeric verified at >5.0% curcumin'
  },
  {
    id: 'p4',
    title: 'Nitrogen Sealing',
    subtitle: 'Long-Lasting Freshness',
    description: 'Our custom packaging completely blocks UV rays, humidity, and oxygen. Flushed with pure medical-grade nitrogen, the spices remain perfectly dry and incredibly fragrant.',
    techDetail: '0% oxygen contact inside pouch'
  }
];

export const RECIPES: Recipe[] = [
  {
    id: 'r1',
    name: 'Immunity-Boosting Haldi Milk (Golden Elixir)',
    time: '8 mins',
    servings: '2',
    difficulty: 'Easy',
    ingredients: [
      '2 cups Fresh Organic Whole Milk or Almond Milk',
      '1/2 tsp MSR Aroma High-Curcumin Turmeric Powder',
      '1/4 tsp Freshly crushed Black Pepper',
      '1 inch Cinnamon Stick',
      '1 tsp Raw Honey or Maple Syrup'
    ],
    instructions: [
      'Pour milk into a thick saucepan and bring to a gentle simmer over medium heat.',
      'Whisk in the MSR Aroma Turmeric Powder and add the cinnamon stick along with the crushed black pepper (piperine in pepper boosts curcumin absorption by 2000%!).',
      'Let it simmer gently for 5 minutes on low heat, stirring occasionally to let the spices infuse fully.',
      'Strain into ceramic cups, let cool slightly, and stir in raw honey. Drink warm before sleep.'
    ],
    image: 'https://falh4wp7xhmztgpi.public.blob.vercel-storage.com/IMG_2834.PNG',
    tip: 'Add a tiny drop of pure ghee (clarified butter) to the milk. Curcumin is fat-soluble and dissolves beautifully in healthy fats, multiplying its anti-inflammatory value.'
  },
  {
    id: 'r2',
    name: 'Authentic Telangana Country Chicken Curry (Chicken Masala)',
    time: '45 mins',
    servings: '4',
    difficulty: 'Medium',
    ingredients: [
      '500g Farm-fresh Country Chicken, cut into medium pieces',
      '2 tbsp MSR Aroma Telangana Chilli Powder',
      '1 sachet MSR Aroma Chicken Masala (12g)',
      '1/2 tsp MSR Aroma Premium Turmeric Powder',
      '2 large Onions, finely sliced',
      '1 tbsp Fresh Ginger-Garlic paste',
      '3 tbsp Cold-pressed Groundnut oil',
      'Fresh curry leaves & coriander for garnish'
    ],
    instructions: [
      'Marinate chicken pieces with turmeric, salt, 1 tbsp Telangana Chilli Powder, and ginger-garlic paste for 30 minutes.',
      'Heat groundnut oil in a heavy clay pot or kadhai. Add curry leaves and sliced onions; saute until deep golden-brown.',
      'Add the marinated chicken and sear on high heat for 5 minutes to seal in the juices.',
      'Reduce heat to medium, add the remaining Telangana Chilli Powder and the entire packet of MSR Aroma Chicken Masala.',
      'Stir well, letting the spices roast gently in oil for 2 minutes until fragrant. Add 1.5 cups of warm water.',
      'Cover with a lid and simmer slowly for 25-30 minutes until chicken is perfectly tender and oil separates at the top.',
      'Garnish with fresh coriander and serve hot with steamed Sona Masuri rice.'
    ],
    image: 'https://falh4wp7xhmztgpi.public.blob.vercel-storage.com/IMG_2839.PNG',
    tip: 'Avoid adding tomatoes to this authentic recipe. The natural tang of MSR Aroma coriander and spices creates the perfect dry masala crust.'
  },
  {
    id: 'r3',
    name: 'Fiery Telangana Roast Paneer & Veggies (Chilli Powder)',
    time: '25 mins',
    servings: '3',
    difficulty: 'Easy',
    ingredients: [
      '250g Fresh Organic Cottage Cheese (Paneer), cubed',
      '1.5 tbsp MSR Aroma Pure Telangana Chilli Powder',
      '1/2 tsp MSR Aroma Turmeric Powder',
      '1 tsp MSR Aroma Coriander Powder',
      '1 tbsp Lemon Juice & 2 tbsp Cold-Pressed Oil',
      '1 Green Bell Pepper & 1 Onion, diced'
    ],
    instructions: [
      'In a bowl, mix MSR Aroma Chilli Powder, Turmeric, Coriander Powder, lemon juice, salt, and 1 tbsp oil into a thick marinade rub.',
      'Coat paneer cubes and diced vegetables evenly with the spice rub. Rest for 15 minutes.',
      'Heat 1 tbsp oil in a heavy iron skillet on medium-high heat.',
      'Pan-roast the coated paneer and vegetables for 6-8 minutes until golden crisp on edges and fragrant.',
      'Squeeze fresh lime juice over the fiery roast and serve hot as a healthy, protein-packed appetizer.'
    ],
    image: 'https://falh4wp7xhmztgpi.public.blob.vercel-storage.com/IMG_2839.PNG',
    tip: 'MSR Aroma Chilli Powder delivers a deep natural red hue without artificial dyes, infusing natural capsaicin to boost cellular metabolism.'
  },
  {
    id: 'r4',
    name: 'Royal Shahi Veg & Paneer Handi (Garam Masala)',
    time: '35 mins',
    servings: '4',
    difficulty: 'Medium',
    ingredients: [
      '200g Fresh Paneer & 1 cup Mixed Diced Veggies (Carrots, Peas)',
      '1 tbsp MSR Aroma Royal Garam Masala Powder',
      '1/2 tsp MSR Aroma Turmeric Powder',
      '1 tsp MSR Aroma Chilli Powder',
      '2 ripe Tomatoes & 10 Cashews (pureed)',
      '2 tbsp Fresh Cream & 1 tbsp Pure Ghee'
    ],
    instructions: [
      'Heat ghee in a pan, saute cumins and onions till golden.',
      'Pour in cashew-tomato puree, turmeric, and chilli powder. Cook till oil separates.',
      'Add paneer and veggies along with 1 cup warm water. Simmer covered for 10 minutes.',
      'Finish by sprinkling 1 tbsp MSR Aroma Royal Garam Masala Powder and fresh cream.',
      'Garam masala added at the end preserves the delicate volatile oils (eugenol and cardamom aromatics) for maximum fragrance.'
    ],
    image: 'https://falh4wp7xhmztgpi.public.blob.vercel-storage.com/IMG_2845.PNG',
    tip: 'Always add MSR Aroma Garam Masala in the last 2 minutes of cooking. This prevents heat oxidation of precious essential oils.'
  },
  {
    id: 'r5',
    name: 'Aromatic Home-style Dal Tadka & Aloo Gobi (Coriander Powder)',
    time: '20 mins',
    servings: '4',
    difficulty: 'Easy',
    ingredients: [
      '1 cup Boiled Yellow Toor Dal or Cauliflower florets',
      '1.5 tbsp MSR Aroma Aromatic Coriander Powder',
      '1/2 tsp MSR Aroma Turmeric Powder',
      '1/2 tsp MSR Aroma Jeera Powder',
      '2 tbsp Ghee, 1 tsp Cumin seeds, 2 dry Red Chillies'
    ],
    instructions: [
      'Whisk boiled yellow dal with salt, turmeric, and 1.5 tbsp MSR Aroma Coriander Powder.',
      'Simmer dal for 8 minutes to let coriander fragrance meld smoothly.',
      'For tadka, heat ghee in a small pan, crackle cumin seeds and dry red chillies.',
      'Pour sizzling hot ghee tadka over the dal and cover immediately with a lid for 3 minutes to trap the aroma.'
    ],
    image: 'https://falh4wp7xhmztgpi.public.blob.vercel-storage.com/IMG_2834.PNG',
    tip: 'Pure unadulterated coriander powder acts as a natural cooling agent for the stomach, rich in dietary fiber and linalool.'
  },
  {
    id: 'r6',
    name: 'Digestive Cumin Chaas & Fragrant Jeera Rice (Jeera Powder)',
    time: '10 mins',
    servings: '2',
    difficulty: 'Easy',
    ingredients: [
      '2 cups Fresh Chilled Yogurt / Curd',
      '1 tsp MSR Aroma Roasted Jeera Powder',
      '1/2 tsp Black Salt & Rock Salt',
      '1 tbsp Chopped Fresh Mint & Cilantro',
      'Chilled Water'
    ],
    instructions: [
      'Blend curd, 1 cup chilled water, black salt, and 1 tsp MSR Aroma Roasted Jeera Powder until frothy.',
      'Pour into chilled tall clay glasses.',
      'Garnish with extra roasted cumin powder and mint leaves. Serve chilled after lunch for instant digestion relief.'
    ],
    image: 'https://falh4wp7xhmztgpi.public.blob.vercel-storage.com/IMG_2845.PNG',
    tip: 'Jeera contains cuminaldehyde which stimulates salivary glands and digestive enzymes, preventing acidity after heavy meals.'
  }
];

export const BLOGS: BlogPost[] = [
  {
    id: 'b1',
    title: 'The Bio-Science of Piperine and Curcumin Synergy',
    category: 'Scientific Wellness',
    readTime: '4 mins read',
    summary: 'Did you know that taking turmeric alone might not give you full medical benefits? Discover how black pepper activates the healing properties of turmeric.',
    date: 'July 24, 2026',
    content: [
      'Turmeric contains curcumin, a compound celebrated for its extraordinary anti-inflammatory and antioxidant properties. However, curcumin is poorly absorbed into the human bloodstream on its own.',
      'This is where agricultural science and food pairing join hands. Black pepper contains an active alkaloid called Piperine. Clinical trials have proven that combining piperine with curcumin increases curcumin bioavailability by a staggering 2000%.',
      'At MSR Aroma, our mission is not just spice sales, but premium health. By crafting spices rich in active natural oils and curcumin levels exceeding 5%, we provide the scientific baseline for premium cellular wellness.'
    ],
    image: 'https://falh4wp7xhmztgpi.public.blob.vercel-storage.com/IMG_2834.PNG'
  },
  {
    id: 'b2',
    title: 'The Hidden Dangers of Sudan Red Dye in Market Chillies',
    category: 'Family Safety',
    readTime: '5 mins read',
    summary: 'A look into chemical adulterants in standard commercial spices and how MSR Aroma Private Limited guarantees zero-chemical absolute safety.',
    date: 'July 18, 2026',
    content: [
      'Many low-cost chilli powders found on shelves look incredibly red. Sadly, this is often the result of Sudan Red dye, a synthetic industrial colorant classified as a toxic carcinogen.',
      'Standard commercial brands also blend brick powder, toxic lead chromate, and expired starches to increase bulk weight. This damages the stomach lining, kidneys, and overall health over a lifetime.',
      'Our Director Renuka established the "Mother\'s Standard". MSR Aroma chilli powder is sourced directly from clean Telangana regions, completely free of additives. We invite independent laboratory tests on every packet we ship.'
    ],
    image: 'https://falh4wp7xhmztgpi.public.blob.vercel-storage.com/IMG_2835.PNG'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Dr. Anjali Deshmukh',
    role: 'Pediatrician & Clinical Nutritionist',
    comment: 'Finding pure, lead-free turmeric with verified curcumin levels was extremely difficult. MSR Aroma\'s turmeric has become a staple in my home. The laboratory-verified purity gives me absolute peace of mind for my children.',
    rating: 5,
    date: 'June 2026'
  },
  {
    id: '2',
    name: 'Chef Shailendra Prasad',
    role: 'Executive Chef, Indus Luxury Resort',
    comment: 'The Telangana Chilli Powder from MSR Aroma has an exceptional essential oil profile. You don\'t just get heat, you get a deep sweet-smoky complexity and a beautiful rich natural red. Highly recommended for premium hospitality kitchens.',
    rating: 5,
    date: 'May 2026'
  },
  {
    id: '3',
    name: 'K. Rajender Prasad',
    role: 'Sustainable Farmer Partner, Nizamabad',
    comment: 'Shravan Kumar and Tharun are true friends of farmers. They buy directly from us, pay fair wages instantly, and provide soil test inputs. Because they do not ask us to rush harvests, we produce high-grade organic crops.',
    rating: 5,
    date: 'April 2026'
  }
];

export const FAQS = [
  {
    question: 'Why are MSR Aroma spices different from standard supermarket brands?',
    answer: 'Standard supermarket spices are often stored in open warehouses, processed at high temperatures which burn out volatile health oils, and adulterated with starches, Sudan dyes, or lead chromates. MSR Aroma is co-founded by an agronomist (B.Sc Agriculture) and utilizes custom cold-milling technology under 28°C to retain natural oils, ensuring 100% purity and medicinal grade curcumin/capsaicin.'
  },
  {
    question: 'Are there any artificial colors, fillers, or preservatives in your spices?',
    answer: 'None whatsoever. We follow our Director Renuka’s strict "Mother\'s Standard". All of our spices contain precisely one ingredient—the pure spice itself. We never use starch, spent materials, salt fillers, or chemical preservatives.'
  },
  {
    question: 'How are MSR Aroma spices sourced?',
    answer: 'We bypass middle-men completely. Our agronomist team negotiates directly with certified spice farmers in Telangana (Nizamabad, Warangal, etc.). We inspect soil chemistry, test moisture levels, and source peak-harvested crops to ensure premium biochemical properties.'
  },
  {
    question: 'What is cold-milling technology and why does it matter?',
    answer: 'Spices contain microscopic pockets of volatile essential oils (like curcumin, piperine, coriander linalool). Traditional grinding heats spices up to 60°C, vaporizing these oils and destroying aroma. Our cold-milled grinding uses low-temperature liquid cooling under 28°C, sealing in 100% of the active oils, scent, and natural healing values.'
  },
  {
    question: 'How do I place an order and how does the WhatsApp delivery work?',
    answer: 'You can shop our products right here. When you proceed to checkout, enter your delivery address and details. On clicking "Place Order via WhatsApp", our secure portal generates a prefilled luxury invoice message. It opens WhatsApp immediately, allowing you to send the details directly to our customer relationship director at 8341891704 for immediate hand-packed cash-on-delivery or secure online payment fulfillment.'
  }
];
