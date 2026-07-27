/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Trash2, 
  Edit, 
  ArrowLeft, 
  Lock, 
  Eye, 
  EyeOff, 
  TrendingUp, 
  Users, 
  Database, 
  Package, 
  Save, 
  X, 
  Upload, 
  Check, 
  AlertCircle, 
  ListOrdered,
  Tag,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Camera,
  UserCheck,
  CheckCircle,
  Image as ImageIcon
} from 'lucide-react';
import { Product, Founder } from '../types';
import { 
  subscribeToOrders, 
  updateOrderStatusInFirestore, 
  deleteOrderFromFirestore,
  subscribeToEnquiries,
  deleteEnquiryFromFirestore,
  addOrderToFirestore,
  addEnquiryToFirestore,
  subscribeToCategories,
  addCategoryToFirestore,
  updateCategoryInFirestore,
  deleteCategoryFromFirestore,
  saveProductToFirestore,
  subscribeToFounders,
  saveFounderToFirestore,
  deleteFounderFromFirestore
} from '../firebase';

interface AdminPanelProps {
  products: Product[];
  founders?: Founder[];
  onUpdateProducts: (newProducts: Product[]) => void;
  onBackToStore: () => void;
}

interface OrderItem {
  productId: string;
  productName: string;
  weight: string;
  quantity: number;
  price: number;
}

interface AdminOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress: string;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  deliveryCharge: number;
  grandTotal: number;
  paymentMethod: string;
  status: 'Pending' | 'Shipped' | 'Completed' | 'Cancelled';
  date: string;
  timestamp?: string;
}

export default function AdminPanel({ products, founders: initialFounders, onUpdateProducts, onBackToStore }: AdminPanelProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Admin Navigation
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'categories' | 'enquiries' | 'directors'>('overview');

  // Orders State
  const [orders, setOrders] = useState<AdminOrder[]>([]);

  // Enquiries State
  const [enquiries, setEnquiries] = useState<any[]>([]);

  // Directors Board / Visionaries State
  const [foundersList, setFoundersList] = useState<Founder[]>(initialFounders || []);
  const [editingDirector, setEditingDirector] = useState<Founder | null>(null);
  const [directorSuccessMsg, setDirectorSuccessMsg] = useState<string | null>(null);
  const [isAddingDirector, setIsAddingDirector] = useState(false);
  const [dirName, setDirName] = useState('');
  const [dirRole, setDirRole] = useState('');
  const [dirCredentials, setDirCredentials] = useState('');
  const [dirQuote, setDirQuote] = useState('');
  const [dirDescription, setDirDescription] = useState('');
  const [dirImage, setDirImage] = useState('');

  // Editing/Form States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // New Product Form Values
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Spices');
  const [formDescription, setFormDescription] = useState('');
  const [formBadge, setFormBadge] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formStorage, setFormStorage] = useState('Store in an airtight container in a cool, dry place.');
  const [formPackaging, setFormPackaging] = useState('3-layer Nitrogen flushed premium pouch.');
  
  // Weights and Prices mapping
  const [weightsList, setWeightsList] = useState<{ weight: string; price: number }[]>([
    { weight: '100g', price: 80 },
    { weight: '250g', price: 190 },
    { weight: '500g', price: 360 }
  ]);
  const [newWeightName, setNewWeightName] = useState('');
  const [newWeightPrice, setNewWeightPrice] = useState<number | ''>('');

  // Benefits & Ingredients tags
  const [benefitsList, setBenefitsList] = useState<string[]>([]);
  const [newBenefit, setNewBenefit] = useState('');
  const [ingredientsList, setIngredientsList] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState('');

  // Nutritional details
  const [nutritionEnergy, setNutritionEnergy] = useState('350 kcal');
  const [nutritionCarbs, setNutritionCarbs] = useState('65g');
  const [nutritionProtein, setNutritionProtein] = useState('10g');
  const [nutritionFat, setNutritionFat] = useState('10g');
  const [nutritionSodium, setNutritionSodium] = useState('30mg');
  const [nutritionCurcumin, setNutritionCurcumin] = useState('');

  // Categories list
  const [categories, setCategories] = useState<string[]>(['Spices', 'Masalas']);
  const [categoryObjects, setCategoryObjects] = useState<{ id: string; name: string }[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState('');

  // Load orders, enquiries, and categories from Firestore in real-time
  useEffect(() => {
    // 1. Subscribe to Orders in real-time
    const unsubscribeOrders = subscribeToOrders((loadedOrders) => {
      if (loadedOrders.length === 0) {
        // Seed database with sample orders if empty so there is visual data
        const sampleOrders: AdminOrder[] = [
          {
            id: 'MSR-784102',
            customerName: 'Rohit Sharma',
            customerPhone: '9848022338',
            customerEmail: 'rohit.sharma@gmail.com',
            customerAddress: 'Flat 402, Gauri Apartments, Jubilee Hills, Hyderabad, Telangana - 500033',
            items: [
              { productId: 'premium-turmeric', productName: 'High-Curcumin Premium Turmeric Powder', weight: '500g', quantity: 2, price: 335 },
              { productId: 'telangana-chilli', productName: 'Premium Telangana Chilli Powder', weight: '500g', quantity: 1, price: 375 }
            ],
            subtotal: 1045,
            discountAmount: 105,
            deliveryCharge: 0,
            grandTotal: 940,
            paymentMethod: 'Cash on Delivery (COD)',
            status: 'Pending',
            date: 'Sunday, July 26, 2026 09:12 PM',
            timestamp: new Date().toISOString()
          },
          {
            id: 'MSR-521943',
            customerName: 'Ananya Rao',
            customerPhone: '9123456789',
            customerEmail: 'ananya.rao@outlook.com',
            customerAddress: 'H.No 12-2-41/A, Shanti Nagar, Nizamabad, Telangana - 503001',
            items: [
              { productId: 'coriander-powder', productName: 'Aromatic Coriander Powder', weight: '250g', quantity: 2, price: 125 }
            ],
            subtotal: 250,
            discountAmount: 0,
            deliveryCharge: 40,
            grandTotal: 290,
            paymentMethod: 'UPI / Online Transfer',
            status: 'Shipped',
            date: 'Saturday, July 25, 2026 04:30 PM',
            timestamp: new Date(Date.now() - 86400000).toISOString()
          }
        ];
        
        sampleOrders.forEach(o => {
          addOrderToFirestore(o).catch(err => console.error("Error seeding order:", err));
        });
      } else {
        setOrders(loadedOrders);
      }
    });

    // 2. Subscribe to Enquiries in real-time
    const unsubscribeEnquiries = subscribeToEnquiries((loadedEnquiries) => {
      if (loadedEnquiries.length === 0) {
        const sampleEnquiry = {
          name: 'Vikram Singh',
          businessName: 'Singh Agri-Trading Corp',
          phone: '9876543210',
          email: 'vikram.singh@singhtraders.com',
          city: 'Nagpur',
          type: 'Super Stockist',
          message: 'Interested in distributing MSR Aroma High-Curcumin Turmeric and Spices in Eastern Maharashtra. We have an active network of over 400 premium retail stores.',
          date: 'Sunday, July 26, 2026 11:15 AM',
          timestamp: new Date().toISOString()
        };
        addEnquiryToFirestore(sampleEnquiry).catch(err => console.error("Error seeding enquiry:", err));
      } else {
        setEnquiries(loadedEnquiries);
      }
    });

    // 3. Subscribe to Categories in real-time
    const unsubscribeCategories = subscribeToCategories((loadedCategories) => {
      setCategoryObjects(loadedCategories);
      const names = loadedCategories.map(c => c.name);
      // Merge with product categories to ensure no category is lost
      const uniqueFromProducts = Array.from(new Set(products.map(p => p.category)));
      const allMerged = Array.from(new Set([...names, ...uniqueFromProducts]));
      setCategories(allMerged);
    });

    // 4. Subscribe to Founders / Directors Board in real-time
    const unsubscribeFounders = subscribeToFounders((loadedFounders) => {
      setFoundersList(loadedFounders);
    });

    return () => {
      unsubscribeOrders();
      unsubscribeEnquiries();
      unsubscribeCategories();
      unsubscribeFounders();
    };
  }, [products]);

  // Director Form Management Helpers
  const resetDirectorForm = () => {
    setDirName('');
    setDirRole('');
    setDirCredentials('');
    setDirQuote('');
    setDirDescription('');
    setDirImage('');
    setEditingDirector(null);
    setIsAddingDirector(false);
  };

  const handleEditDirectorClick = (f: Founder) => {
    setEditingDirector(f);
    setIsAddingDirector(true);
    setDirName(f.name);
    setDirRole(f.role);
    setDirCredentials(f.credentials || '');
    setDirQuote(f.quote || '');
    setDirDescription(f.description || '');
    setDirImage(f.image);
  };

  const handleDirectorImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, directorId?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert("Image is too large. Please select an image under 8MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Img = reader.result as string;
      if (directorId) {
        const targetDir = foundersList.find(f => f.id === directorId);
        if (targetDir) {
          const updated = { ...targetDir, image: base64Img };
          try {
            await saveFounderToFirestore(updated);
            setDirectorSuccessMsg(`✓ Photo for ${targetDir.name} successfully replaced and permanently saved on server & site!`);
            setTimeout(() => setDirectorSuccessMsg(null), 5000);
          } catch (err) {
            console.error("Error updating founder image:", err);
            alert("Failed to save image to Firestore.");
          }
        }
      } else {
        setDirImage(base64Img);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveDirector = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dirName.trim() || !dirRole.trim() || !dirImage) {
      alert("Please provide the Director Name, Role, and Profile Image.");
      return;
    }

    const payload: Founder = {
      id: editingDirector?.id || `director-${Date.now()}-${dirName.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      name: dirName.trim(),
      role: dirRole.trim(),
      credentials: dirCredentials.trim(),
      quote: dirQuote.trim(),
      description: dirDescription.trim(),
      image: dirImage
    };

    try {
      await saveFounderToFirestore(payload);
      setDirectorSuccessMsg(`✓ ${payload.name}'s profile and image permanently saved to server & site!`);
      setTimeout(() => setDirectorSuccessMsg(null), 5000);
      resetDirectorForm();
    } catch (err) {
      console.error("Error saving founder profile:", err);
      alert("Failed to save director profile.");
    }
  };

  const handleDeleteDirector = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name} from The Directors Board?`)) {
      try {
        await deleteFounderFromFirestore(id);
        setDirectorSuccessMsg(`Removed ${name} from Directors Board.`);
        setTimeout(() => setDirectorSuccessMsg(null), 3000);
      } catch (err) {
        console.error(err);
        alert("Failed to delete director.");
      }
    }
  };

  // Handle Admin Log in
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === 'admin123' || passcode.trim() === '8341163205' || passcode.trim() === 'msraroma') {
      setIsLoggedIn(true);
      sessionStorage.setItem('msr_aroma_admin_logged_in', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid Administrator Passcode. Please try again.');
    }
  };

  // Log out
  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('msr_aroma_admin_logged_in');
  };

  // Convert local uploaded image to base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add a weight option to the temporary list
  const handleAddWeight = () => {
    if (!newWeightName.trim() || newWeightPrice === '' || newWeightPrice <= 0) return;
    if (weightsList.some(item => item.weight.toLowerCase() === newWeightName.trim().toLowerCase())) {
      alert('This weight option already exists');
      return;
    }
    setWeightsList([...weightsList, { weight: newWeightName.trim(), price: Number(newWeightPrice) }]);
    setNewWeightName('');
    setNewWeightPrice('');
  };

  // Remove a weight option from the temporary list
  const handleRemoveWeight = (wName: string) => {
    setWeightsList(weightsList.filter(item => item.weight !== wName));
  };

  // Add benefits list item
  const handleAddBenefit = () => {
    if (newBenefit.trim()) {
      setBenefitsList([...benefitsList, newBenefit.trim()]);
      setNewBenefit('');
    }
  };

  // Remove benefit
  const handleRemoveBenefit = (idx: number) => {
    setBenefitsList(benefitsList.filter((_, i) => i !== idx));
  };

  // Add ingredients list item
  const handleAddIngredient = () => {
    if (newIngredient.trim()) {
      setIngredientsList([...ingredientsList, newIngredient.trim()]);
      setNewIngredient('');
    }
  };

  // Remove ingredient
  const handleRemoveIngredient = (idx: number) => {
    setIngredientsList(ingredientsList.filter((_, i) => i !== idx));
  };

  // Set form values for edit
  const handleEditProductClick = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormCategory(product.category);
    setFormDescription(product.description);
    setFormBadge(product.badge || '');
    setFormImage(product.image);
    setFormStorage(product.storageInstructions || '');
    setFormPackaging(product.packagingDetails || '');

    // Map weights and prices
    const weightsMapped = product.weightOptions.map(w => ({
      weight: w,
      price: product.pricesByWeight[w] || 0
    }));
    setWeightsList(weightsMapped);

    setBenefitsList(product.benefits || []);
    setIngredientsList(product.ingredients || []);

    // Nutritional Info
    setNutritionEnergy(product.nutritionalInfo?.energy || '350 kcal');
    setNutritionCarbs(product.nutritionalInfo?.carbohydrates || '65g');
    setNutritionProtein(product.nutritionalInfo?.protein || '10g');
    setNutritionFat(product.nutritionalInfo?.fat || '10g');
    setNutritionSodium(product.nutritionalInfo?.sodium || '');
    setNutritionCurcumin(product.nutritionalInfo?.curcumin || '');

    setIsFormOpen(true);
  };

  // Open empty form for creating new product
  const handleAddProductClick = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory(categories[0] || 'Spices');
    setFormDescription('');
    setFormBadge('');
    setFormImage('');
    setFormStorage('Keep in an airtight container in a dark, dry space. Avoid exposure to direct sunlight.');
    setFormPackaging('Nitrogen-sealed thick foil sachet to preserve premium volatile oils.');
    setWeightsList([
      { weight: '100g', price: 80 },
      { weight: '250g', price: 190 },
      { weight: '500g', price: 360 }
    ]);
    setBenefitsList([]);
    setIngredientsList([]);
    setNutritionEnergy('350 kcal');
    setNutritionCarbs('60g');
    setNutritionProtein('8g');
    setNutritionFat('10g');
    setNutritionSodium('30mg');
    setNutritionCurcumin('');
    setIsFormOpen(true);
  };

  // Save product (Add or Update)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formDescription.trim()) {
      alert('Please fill out the product name and description.');
      return;
    }
    if (weightsList.length === 0) {
      alert('Please add at least one net weight option and price.');
      return;
    }

    // Structure weight options and pricesByWeight
    const weightOptions = weightsList.map(item => item.weight);
    const pricesByWeight: Record<string, number> = {};
    weightsList.forEach(item => {
      pricesByWeight[item.weight] = item.price;
    });

    const productPayload: Product = {
      id: editingProduct ? editingProduct.id : 'prod-' + Date.now().toString().slice(-6),
      name: formName.trim(),
      category: formCategory,
      weightOptions,
      pricesByWeight,
      description: formDescription.trim(),
      benefits: benefitsList.length > 0 ? benefitsList : ['100% pure ingredient profiles', 'Rich natural fragrance preserved'],
      ingredients: ingredientsList.length > 0 ? ingredientsList : ['100% pure single-origin ground crop'],
      storageInstructions: formStorage,
      nutritionalInfo: {
        energy: nutritionEnergy,
        carbohydrates: nutritionCarbs,
        protein: nutritionProtein,
        fat: nutritionFat,
        ...(nutritionSodium ? { sodium: nutritionSodium } : {}),
        ...(nutritionCurcumin ? { curcumin: nutritionCurcumin } : {})
      },
      packagingDetails: formPackaging,
      badge: formBadge.trim() || undefined,
      image: formImage || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80'
    };

    let updatedProducts: Product[];
    if (editingProduct) {
      updatedProducts = products.map(p => p.id === editingProduct.id ? productPayload : p);
    } else {
      updatedProducts = [...products, productPayload];
    }

    onUpdateProducts(updatedProducts);
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  // Delete product
  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you absolutely sure you want to permanently delete this product?')) {
      const updated = products.filter(p => p.id !== productId);
      onUpdateProducts(updated);
    }
  };

  // Add Category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    if (categories.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      alert('Category already exists');
      return;
    }
    try {
      await addCategoryToFirestore(trimmed);
      setNewCategoryName('');
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to save category. Please try again.');
    }
  };

  // Edit Category Name
  const handleSaveCategoryEdit = async (catId: string, oldName: string) => {
    const trimmed = editingCatName.trim();
    if (!trimmed) return;
    try {
      await updateCategoryInFirestore(catId, trimmed);
      // Update any products assigned to old category name
      const updatedProducts = products.map(p => {
        if (p.category === oldName) {
          const updatedP = { ...p, category: trimmed };
          saveProductToFirestore(updatedP).catch(console.error);
          return updatedP;
        }
        return p;
      });
      onUpdateProducts(updatedProducts);
      setEditingCatId(null);
      setEditingCatName('');
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Failed to update category name.');
    }
  };

  // Delete Category
  const handleDeleteCategory = async (catObj: { id: string; name: string }) => {
    if (catObj.name === 'Spices' || catObj.name === 'Masalas') {
      alert('Core categories "Spices" and "Masalas" cannot be deleted.');
      return;
    }
    if (window.confirm(`Delete category "${catObj.name}"? Products assigned to it will remain.`)) {
      try {
        await deleteCategoryFromFirestore(catObj.id);
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category.');
      }
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: AdminOrder['status']) => {
    const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    setOrders(updatedOrders);
    try {
      await updateOrderStatusInFirestore(orderId, newStatus);
    } catch (e) {
      console.error('Error updating order status in Firestore', e);
    }
    localStorage.setItem('msr_aroma_orders', JSON.stringify(updatedOrders));
  };

  // Delete Order
  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm(`Are you sure you want to remove Order reference ${orderId}?`)) {
      const updated = orders.filter(o => o.id !== orderId);
      setOrders(updated);
      try {
        await deleteOrderFromFirestore(orderId);
      } catch (e) {
        console.error('Error deleting order from Firestore', e);
      }
      localStorage.setItem('msr_aroma_orders', JSON.stringify(updated));
    }
  };

  // Calculate stats
  const totalRevenue = orders
    .filter(o => o.status === 'Completed' || o.status === 'Shipped' || o.status === 'Pending')
    .reduce((acc, o) => acc + o.grandTotal, 0);

  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F8F8F4] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center mb-4">
            <img 
              src="https://a8cw5fshupvoh5ik.public.blob.vercel-storage.com/IMG_2829.PNG" 
              alt="MSR Aroma Logo" 
              className="h-20 w-auto object-contain bg-white rounded-2xl p-2 shadow-lg border border-neutral-200"
              referrerPolicy="no-referrer"
            />
          </div>
          <h2 className="text-center font-display text-3xl font-black text-[#1B1B1B] tracking-tight">
            MSR Aroma Admin Panel
          </h2>
          <p className="mt-2 text-center text-xs font-bold text-[#E0A106] uppercase tracking-wider">
            Secure Sourcing & Operations Gate
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-neutral-200/50 sm:px-10">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="passcode" className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                  Security Passcode
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                    <Lock size={16} />
                  </div>
                  <input
                    id="passcode"
                    type={showPasscode ? 'text' : 'password'}
                    required
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter admin passcode"
                    className="block w-full pl-10 pr-10 py-3 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-[#B71C1C] focus:ring-1 focus:ring-[#B71C1C]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasscode(!showPasscode)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 focus:outline-none"
                  >
                    {showPasscode ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="bg-red-50 border border-red-200 p-3 rounded-lg flex items-start gap-2 text-red-700 text-xs font-semibold">
                  <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-xs font-bold uppercase tracking-widest text-white bg-[#B71C1C] hover:bg-[#961818] focus:outline-none transition-colors cursor-pointer"
                >
                  Verify Credentials
                </button>
                
                <button
                  type="button"
                  onClick={onBackToStore}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-neutral-200 rounded-lg text-xs font-bold uppercase tracking-widest text-neutral-600 bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  <ArrowLeft size={14} /> Back to Customer Website
                </button>
              </div>
            </form>
            
            <div className="mt-6 pt-6 border-t border-neutral-100 text-center">
              <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-widest block">
                Enterprise Sourcing Portal v2.6
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F4] flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-white border-b border-neutral-200/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="https://a8cw5fshupvoh5ik.public.blob.vercel-storage.com/IMG_2829.PNG" 
              alt="MSR Aroma Logo" 
              className="h-10 w-auto object-contain bg-white rounded-lg p-0.5 border border-neutral-200"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="text-sm font-black tracking-widest font-display text-[#1B1B1B] block">MSR AROMA ADMIN</span>
              <span className="text-[9px] tracking-wider uppercase font-bold text-[#E0A106]">Agricultural Operations Controls</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStore}
              className="px-3.5 py-2 bg-[#234D20] hover:bg-[#1a3a18] text-white rounded-lg text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <ArrowLeft size={12} /> View Live Store
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-2 border border-neutral-200 hover:bg-neutral-50 text-neutral-600 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Sub-Bar */}
      <div className="bg-white border-b border-neutral-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto whitespace-nowrap gap-8 py-3 scrollbar-none">
            {[
              { id: 'overview', label: 'Operations Overview', icon: <TrendingUp size={14} /> },
              { id: 'products', label: 'Manage Products', icon: <Package size={14} /> },
              { id: 'directors', label: 'Directors Board', icon: <Camera size={14} /> },
              { id: 'orders', label: 'Client Orders', icon: <ListOrdered size={14} /> },
              { id: 'categories', label: 'Sourcing Categories', icon: <Tag size={14} /> },
              { id: 'enquiries', label: 'Partnership Enquiries', icon: <Users size={14} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setIsFormOpen(false);
                }}
                className={`flex items-center gap-2 pb-1 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-[#B71C1C] text-[#B71C1C]'
                    : 'border-transparent text-neutral-400 hover:text-neutral-600'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Admin Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-neutral-200/50 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-extrabold text-neutral-400 tracking-wider">Total Products Sourced</span>
                  <h3 className="font-display text-3xl font-black text-neutral-800 mt-1">{products.length}</h3>
                  <p className="text-[10px] text-emerald-600 font-bold mt-1">✓ 100% Scientific Purity Checked</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-red-50 text-[#B71C1C] flex items-center justify-center">
                  <Package size={22} />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-neutral-200/50 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-extrabold text-neutral-400 tracking-wider">Total Orders Handled</span>
                  <h3 className="font-display text-3xl font-black text-neutral-800 mt-1">{orders.length}</h3>
                  <p className="text-[10px] text-[#E0A106] font-bold mt-1">{pendingOrdersCount} Pending Sourcing</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-yellow-50 text-[#E0A106] flex items-center justify-center">
                  <ListOrdered size={22} />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-neutral-200/50 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-extrabold text-neutral-400 tracking-wider">Total Sourcing Revenue</span>
                  <h3 className="font-display text-3xl font-black text-neutral-800 mt-1">₹{totalRevenue.toLocaleString('en-IN')}</h3>
                  <p className="text-[10px] text-emerald-600 font-bold mt-1">Direct Farmer Value Flow</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <DollarSign size={22} />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-neutral-200/50 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-extrabold text-neutral-400 tracking-wider">Partnership Enquiries</span>
                  <h3 className="font-display text-3xl font-black text-neutral-800 mt-1">{enquiries.length}</h3>
                  <p className="text-[10px] text-blue-600 font-bold mt-1">✓ Firestore Live Sync</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Users size={22} />
                </div>
              </div>
            </div>

            {/* Quick Sourcing Operations and Guides */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left: Quick Actions and Sourcing Operations */}
              <div className="lg:col-span-8 bg-white border border-neutral-200/50 rounded-2xl p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="font-display text-lg font-bold text-neutral-800">Operational Quick Actions</h3>
                  <p className="text-xs text-neutral-400">Manage real-time catalog items and configure weights seamlessly.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={handleAddProductClick}
                    className="p-5 border border-dashed border-neutral-300 hover:border-[#B71C1C] hover:bg-[#B71C1C]/5 rounded-xl text-left transition-colors flex flex-col justify-between group"
                  >
                    <Plus className="text-neutral-400 group-hover:text-[#B71C1C] mb-2" size={24} />
                    <div>
                      <h4 className="text-xs font-bold text-neutral-800 group-hover:text-[#B71C1C]">Sustainably Add New Product</h4>
                      <p className="text-[10px] text-neutral-400 mt-0.5">Specify single-origin sourcing coordinates, curcumin values, and prices.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('orders')}
                    className="p-5 border border-dashed border-neutral-300 hover:border-[#234D20] hover:bg-[#234D20]/5 rounded-xl text-left transition-colors flex flex-col justify-between group"
                  >
                    <ListOrdered className="text-neutral-400 group-hover:text-[#234D20] mb-2" size={24} />
                    <div>
                      <h4 className="text-xs font-bold text-neutral-800 group-hover:text-[#234D20]">Review Pending Sourcing Orders</h4>
                      <p className="text-[10px] text-neutral-400 mt-0.5">Track raw invoice details, update statuses, and fulfill shipments.</p>
                    </div>
                  </button>
                </div>

                {/* Sourcing Guidelines Info Box */}
                <div className="bg-[#234D20]/5 p-4 rounded-xl border border-[#234D20]/10 flex items-start gap-3">
                  <AlertCircle size={18} className="text-[#234D20] mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-[#234D20]">The Mother's Quality Control Standard</h4>
                    <p className="text-[11px] text-neutral-600 leading-relaxed mt-1">
                      Before introducing any new spices or masalas, verify with agricultural laboratory reports that total Curcumin content is verified, moisture remains under 8%, and zero artificial dyes are used. All updates to weights and pricing are pushed dynamically in real-time across the client application.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: Sourcing Categories list */}
              <div className="lg:col-span-4 bg-white border border-neutral-200/50 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="font-display text-sm font-bold text-neutral-800 uppercase tracking-wider">Active Sourcing Channels</h3>
                  <div className="divide-y divide-neutral-100">
                    {categories.map((cat, i) => {
                      const count = products.filter(p => p.category === cat).length;
                      return (
                        <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                          <span className="font-semibold text-neutral-700">{cat}</span>
                          <span className="bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full font-bold text-[10px]">
                            {count} Items
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('categories')}
                  className="w-full text-center py-2 bg-neutral-50 hover:bg-neutral-100 rounded-lg text-[10px] font-bold text-neutral-500 uppercase tracking-widest transition-colors mt-6"
                >
                  Manage Categories
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-neutral-800">Sourcing Catalogue ({products.length})</h3>
                <p className="text-xs text-neutral-400">All products below are live on the client-facing store with real-time updates.</p>
              </div>
              {!isFormOpen && (
                <button
                  onClick={handleAddProductClick}
                  className="px-4 py-2.5 bg-[#B71C1C] hover:bg-[#961818] text-white rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                >
                  <Plus size={14} /> Add Spice Blend
                </button>
              )}
            </div>

            {isFormOpen ? (
              /* PRODUCT ADD/EDIT FORM CONTAINER */
              <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-md">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
                  <h4 className="font-display text-base font-bold text-neutral-800">
                    {editingProduct ? `Edit Sourcing Details: ${editingProduct.name}` : 'Introduce New Botanical Spice / Blend'}
                  </h4>
                  <button
                    onClick={() => {
                      setIsFormOpen(false);
                      setEditingProduct(null);
                    }}
                    className="p-1.5 rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                <form onSubmit={handleSaveProduct} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Left form column */}
                    <div className="md:col-span-8 space-y-5">
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                          Product Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          placeholder="e.g. High-Curcumin Premium Turmeric Powder"
                          className="w-full text-xs border border-neutral-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#B71C1C]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                            Sourcing Category *
                          </label>
                          <select
                            value={formCategory}
                            onChange={(e) => setFormCategory(e.target.value)}
                            className="w-full text-xs border border-neutral-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#B71C1C] cursor-pointer"
                          >
                            {categories.map((cat, i) => (
                              <option key={i} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                            Aesthetic Badge (Optional)
                          </label>
                          <input
                            type="text"
                            value={formBadge}
                            onChange={(e) => setFormBadge(e.target.value)}
                            placeholder="e.g. High Curcumin (5%+)"
                            className="w-full text-xs border border-neutral-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#B71C1C]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                          Heritage Profile Description *
                        </label>
                        <textarea
                          rows={3}
                          required
                          value={formDescription}
                          onChange={(e) => setFormDescription(e.target.value)}
                          placeholder="Provide the organic origin story, sensory parameters, and processing standards..."
                          className="w-full text-xs border border-neutral-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#B71C1C]"
                        />
                      </div>

                      {/* BENEFITS LIST EDITOR */}
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                          Verified Health Benefits
                        </label>
                        <div className="flex gap-2 mb-3">
                          <input
                            type="text"
                            value={newBenefit}
                            onChange={(e) => setNewBenefit(e.target.value)}
                            placeholder="Add health benefit (e.g. Guaranteed Curcumin 5%...)"
                            className="flex-1 text-xs border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#B71C1C]"
                          />
                          <button
                            type="button"
                            onClick={handleAddBenefit}
                            className="px-3 bg-neutral-800 hover:bg-[#B71C1C] text-white rounded-lg text-xs font-bold"
                          >
                            Add
                          </button>
                        </div>
                        {benefitsList.length > 0 && (
                          <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 space-y-2">
                            {benefitsList.map((item, i) => (
                              <div key={i} className="flex items-center justify-between text-xs text-neutral-600 bg-white p-2 rounded border border-neutral-100">
                                <span>{item}</span>
                                <button type="button" onClick={() => handleRemoveBenefit(i)} className="text-red-500 hover:text-red-700">
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* INGREDIENTS EDITOR */}
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                          Ingredients & Sourcing Origins
                        </label>
                        <div className="flex gap-2 mb-3">
                          <input
                            type="text"
                            value={newIngredient}
                            onChange={(e) => setNewIngredient(e.target.value)}
                            placeholder="Add ingredient (e.g. 100% Pure Nizamabad Turmeric)"
                            className="flex-1 text-xs border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#B71C1C]"
                          />
                          <button
                            type="button"
                            onClick={handleAddIngredient}
                            className="px-3 bg-neutral-800 hover:bg-[#B71C1C] text-white rounded-lg text-xs font-bold"
                          >
                            Add
                          </button>
                        </div>
                        {ingredientsList.length > 0 && (
                          <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 space-y-2">
                            {ingredientsList.map((item, i) => (
                              <div key={i} className="flex items-center justify-between text-xs text-neutral-600 bg-white p-2 rounded border border-neutral-100">
                                <span>{item}</span>
                                <button type="button" onClick={() => handleRemoveIngredient(i)} className="text-red-500 hover:text-red-700">
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right form column (Weights, Image, Nutrition) */}
                    <div className="md:col-span-4 space-y-5">
                      {/* Image Sourcing & Upload */}
                      <div className="bg-[#F8F8F4] p-4 rounded-xl border border-neutral-200">
                        <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                          Spice Display Image
                        </label>
                        
                        {formImage && (
                          <div className="w-full aspect-square bg-white rounded-lg border border-neutral-200 overflow-hidden mb-3">
                            <img src={formImage} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        )}

                        <div className="space-y-3">
                          {/* File input base64 simulator */}
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              id="image-file-upload"
                              className="hidden"
                            />
                            <label
                              htmlFor="image-file-upload"
                              className="w-full flex items-center justify-center gap-2 py-2 px-3 border border-neutral-300 rounded-lg text-xs font-bold bg-white text-neutral-600 hover:bg-neutral-50 cursor-pointer transition-colors"
                            >
                              <Upload size={14} /> Upload Local Image
                            </label>
                          </div>

                          <div className="text-center text-[10px] text-neutral-400 font-bold uppercase">OR</div>

                          <input
                            type="text"
                            value={formImage}
                            onChange={(e) => setFormImage(e.target.value)}
                            placeholder="Paste direct Image URL"
                            className="w-full text-xs border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#B71C1C] bg-white"
                          />
                        </div>
                      </div>

                      {/* WEIGHTS & PRICING MANAGER */}
                      <div className="bg-white p-4 rounded-xl border border-neutral-200 space-y-3">
                        <h5 className="text-xs font-bold text-neutral-800 uppercase tracking-wider pb-1.5 border-b border-neutral-100">
                          Net Weights & Prices
                        </h5>

                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            value={newWeightName}
                            onChange={(e) => setNewWeightName(e.target.value)}
                            placeholder="Weight (e.g. 500g)"
                            className="w-1/2 text-xs border border-neutral-300 rounded px-2 py-1.5 focus:outline-none focus:border-[#B71C1C]"
                          />
                          <input
                            type="number"
                            value={newWeightPrice}
                            onChange={(e) => setNewWeightPrice(e.target.value === '' ? '' : Number(e.target.value))}
                            placeholder="Price (₹)"
                            className="w-1/3 text-xs border border-neutral-300 rounded px-2 py-1.5 focus:outline-none focus:border-[#B71C1C]"
                          />
                          <button
                            type="button"
                            onClick={handleAddWeight}
                            className="bg-[#234D20] text-white px-2.5 rounded text-xs font-bold hover:bg-[#1a3a18]"
                          >
                            Add
                          </button>
                        </div>

                        {weightsList.length > 0 && (
                          <div className="divide-y divide-neutral-100 bg-neutral-50 p-2 rounded-lg border border-neutral-200 space-y-1">
                            {weightsList.map((item, i) => (
                              <div key={i} className="flex items-center justify-between py-1 text-xs">
                                <span className="font-bold text-neutral-700">{item.weight}</span>
                                <div className="flex items-center gap-3">
                                  <span className="font-extrabold text-[#234D20]">₹{item.price}</span>
                                  <button type="button" onClick={() => handleRemoveWeight(item.weight)} className="text-red-500 hover:text-red-700">
                                    <Trash2 size={11} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* NUTRITIONAL PROFILE VALUE FORM */}
                      <div className="bg-white p-4 rounded-xl border border-neutral-200 space-y-3">
                        <h5 className="text-xs font-bold text-[#E0A106] uppercase tracking-wider pb-1.5 border-b border-neutral-100">
                          Nutritional Info (per 100g)
                        </h5>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="block text-[10px] text-neutral-500 font-semibold mb-1">Energy</label>
                            <input type="text" value={nutritionEnergy} onChange={(e) => setNutritionEnergy(e.target.value)} className="w-full border border-neutral-300 rounded p-1.5 text-[11px]" />
                          </div>
                          <div>
                            <label className="block text-[10px] text-neutral-500 font-semibold mb-1">Carbs</label>
                            <input type="text" value={nutritionCarbs} onChange={(e) => setNutritionCarbs(e.target.value)} className="w-full border border-neutral-300 rounded p-1.5 text-[11px]" />
                          </div>
                          <div>
                            <label className="block text-[10px] text-neutral-500 font-semibold mb-1">Protein</label>
                            <input type="text" value={nutritionProtein} onChange={(e) => setNutritionProtein(e.target.value)} className="w-full border border-neutral-300 rounded p-1.5 text-[11px]" />
                          </div>
                          <div>
                            <label className="block text-[10px] text-neutral-500 font-semibold mb-1">Fat</label>
                            <input type="text" value={nutritionFat} onChange={(e) => setNutritionFat(e.target.value)} className="w-full border border-neutral-300 rounded p-1.5 text-[11px]" />
                          </div>
                          <div>
                            <label className="block text-[10px] text-neutral-500 font-semibold mb-1">Sodium</label>
                            <input type="text" value={nutritionSodium} onChange={(e) => setNutritionSodium(e.target.value)} className="w-full border border-neutral-300 rounded p-1.5 text-[11px]" placeholder="e.g. 30mg" />
                          </div>
                          <div>
                            <label className="block text-[10px] text-neutral-500 font-semibold mb-1">Curcumin %</label>
                            <input type="text" value={nutritionCurcumin} onChange={(e) => setNutritionCurcumin(e.target.value)} className="w-full border border-neutral-300 rounded p-1.5 text-[11px]" placeholder="e.g. 5.2%" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t border-neutral-100">
                    <button
                      type="button"
                      onClick={() => {
                        setIsFormOpen(false);
                        setEditingProduct(null);
                      }}
                      className="px-4 py-2.5 border border-neutral-200 hover:bg-neutral-50 rounded-lg text-xs font-bold uppercase tracking-widest text-neutral-600 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#234D20] hover:bg-[#1C3E19] text-white rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
                    >
                      <Save size={14} /> Save Product Specs
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* PRODUCTS LIST TABLE */
              <div className="bg-white border border-neutral-200/50 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-neutral-50 border-b border-neutral-200/60 text-[10px] uppercase font-black text-neutral-500 tracking-wider">
                        <th className="py-4 px-6">Product Details</th>
                        <th className="py-4 px-6">Sourcing Category</th>
                        <th className="py-4 px-6">Configured Weights & Prices</th>
                        <th className="py-4 px-6 text-right">Operational Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 text-xs">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-neutral-50/50 transition-colors">
                          <td className="py-4 px-6 flex items-center gap-4">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-14 h-14 object-cover rounded-lg border border-neutral-200 bg-white"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <h4 className="font-bold text-neutral-800 text-sm line-clamp-1">{product.name}</h4>
                              <div className="flex gap-2 mt-1">
                                {product.badge && (
                                  <span className="inline-block px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded bg-[#B71C1C]/10 text-[#B71C1C]">
                                    {product.badge}
                                  </span>
                                )}
                                <span className="text-[10px] text-neutral-400 font-semibold uppercase">ID: {product.id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 font-bold text-neutral-600 uppercase tracking-wider text-[10px]">
                            {product.category}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex flex-wrap gap-1.5">
                              {product.weightOptions.map((w) => (
                                <span key={w} className="inline-block px-2 py-1 rounded bg-[#234D20]/5 text-[#234D20] font-bold text-[10px] border border-[#234D20]/10">
                                  {w}: ₹{product.pricesByWeight[w] || 0}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEditProductClick(product)}
                                className="p-2 bg-neutral-100 hover:bg-[#B71C1C]/10 hover:text-[#B71C1C] rounded text-neutral-600 transition-colors cursor-pointer"
                                title="Edit Product Specs"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-2 bg-neutral-100 hover:bg-red-100 hover:text-red-600 rounded text-neutral-600 transition-colors cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-display text-lg font-bold text-neutral-800 font-semibold">Active Client Orders ({orders.length})</h3>
              <p className="text-xs text-neutral-400">Manage order invoice items and change dispatch statuses in real time.</p>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white border border-neutral-200 p-12 text-center rounded-2xl flex flex-col items-center justify-center">
                <ListOrdered size={36} className="text-neutral-300 mb-2 animate-pulse" />
                <h4 className="text-sm font-bold text-neutral-800 uppercase">No Client Orders Placed Yet</h4>
                <p className="text-xs text-neutral-400 max-w-sm mt-1 leading-relaxed">
                  When customers click "Place Order via WhatsApp", their pre-orders are tracked in real-time right here for logistics processing.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => {
                  let statusBg = 'bg-yellow-50 text-yellow-700 border-yellow-200';
                  if (order.status === 'Shipped') statusBg = 'bg-blue-50 text-blue-700 border-blue-200';
                  if (order.status === 'Completed') statusBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                  if (order.status === 'Cancelled') statusBg = 'bg-red-50 text-red-700 border-red-200';

                  return (
                    <div key={order.id} className="bg-white border border-neutral-200/60 rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                      {/* Order top bar */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3.5 border-b border-neutral-100">
                        <div className="flex items-center gap-3">
                          <span className="font-extrabold text-neutral-800 text-sm">{order.id}</span>
                          <span className="text-[10px] text-neutral-400 font-semibold flex items-center gap-1">
                            <Calendar size={12} /> {order.date}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="text-[10px] uppercase font-bold text-neutral-400">Sourcing Status</label>
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as any)}
                            className="bg-neutral-50 border border-neutral-200 rounded px-2.5 py-1 text-xs font-bold focus:outline-none cursor-pointer"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                          
                          <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${statusBg}`}>
                            {order.status}
                          </span>
                          
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="p-1.5 text-neutral-400 hover:text-red-500 rounded hover:bg-red-50 transition-colors"
                            title="Remove order record"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Order main data body */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs text-neutral-600 leading-relaxed">
                        
                        {/* Customer Coordinate Card (col-span-4) */}
                        <div className="md:col-span-4 space-y-2 border-r border-neutral-100 pr-4">
                          <h5 className="text-[10px] uppercase font-black tracking-widest text-[#B71C1C]">Client Coordinates</h5>
                          <p className="font-bold text-neutral-800 text-sm">{order.customerName}</p>
                          <p className="flex items-center gap-1.5"><Phone size={12} /> {order.customerPhone}</p>
                          {order.customerEmail && <p className="flex items-center gap-1.5"><Mail size={12} /> {order.customerEmail}</p>}
                          <p className="flex items-start gap-1.5 mt-2"><MapPin size={13} className="mt-0.5 flex-shrink-0" /> {order.customerAddress}</p>
                        </div>

                        {/* Order Items Stack (col-span-5) */}
                        <div className="md:col-span-5 space-y-2">
                          <h5 className="text-[10px] uppercase font-black tracking-widest text-[#234D20]">Invoice Items</h5>
                          <div className="space-y-1.5">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center bg-[#F8F8F4] p-2 rounded">
                                <div>
                                  <span className="font-bold text-neutral-800 block">{item.productName}</span>
                                  <span className="text-[10px] text-neutral-500">Weight: {item.weight} • Qty: {item.quantity}</span>
                                </div>
                                <span className="font-bold text-neutral-700">₹{item.price * item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Bill Breakdown Total box (col-span-3) */}
                        <div className="md:col-span-3 space-y-1.5 flex flex-col justify-end text-right">
                          <h5 className="text-[10px] uppercase font-black tracking-widest text-neutral-400 text-left">Bill Accounting</h5>
                          <div className="space-y-1 bg-neutral-50 p-3 rounded-xl border border-neutral-100 text-[11px]">
                            <div className="flex justify-between">
                              <span>Subtotal:</span>
                              <span>₹{order.subtotal}</span>
                            </div>
                            {order.discountAmount > 0 && (
                              <div className="flex justify-between text-red-600 font-medium">
                                <span>Discount:</span>
                                <span>-₹{order.discountAmount}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span>Delivery:</span>
                              <span>{order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}</span>
                            </div>
                            <div className="border-t border-neutral-200 mt-2 pt-2 flex justify-between text-xs font-black text-neutral-800">
                              <span>Grand Total:</span>
                              <span className="text-[#234D20]">₹{order.grandTotal}</span>
                            </div>
                          </div>
                          <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider text-center mt-1">
                            Paid via {order.paymentMethod}
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* CATEGORIES TAB */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="max-w-xl">
              <h3 className="font-display text-lg font-bold text-neutral-800">Sourcing Categories ({categories.length})</h3>
              <p className="text-xs text-neutral-400">Classify spices and masalas. Core categories Spices and Masalas cannot be removed. All changes sync in real-time.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: List Categories */}
              <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 bg-neutral-50 border-b border-neutral-200 text-xs font-bold uppercase tracking-wider text-neutral-500 flex justify-between items-center">
                  <span>Sourcing Channels</span>
                  <span className="text-[10px] text-neutral-400 font-semibold">Real-Time Firestore Sync Active</span>
                </div>
                <div className="divide-y divide-neutral-100">
                  {categories.map((catName, idx) => {
                    const count = products.filter(p => p.category === catName).length;
                    const isCore = catName === 'Spices' || catName === 'Masalas';
                    const catObj = categoryObjects.find(c => c.name.toLowerCase() === catName.toLowerCase()) || { id: catName.toLowerCase().replace(/\s+/g, '-'), name: catName };
                    const isEditing = editingCatId === catObj.id;

                    return (
                      <div key={idx} className="p-4 flex items-center justify-between hover:bg-neutral-50/40">
                        <div className="flex items-center gap-3 flex-1 pr-4">
                          <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-500 flex-shrink-0">
                            <Tag size={14} />
                          </div>
                          {isEditing ? (
                            <div className="flex items-center gap-2 flex-1">
                              <input
                                type="text"
                                value={editingCatName}
                                onChange={(e) => setEditingCatName(e.target.value)}
                                className="text-xs font-bold border border-[#B71C1C] rounded px-2 py-1 focus:outline-none w-full"
                                autoFocus
                              />
                              <button
                                onClick={() => handleSaveCategoryEdit(catObj.id, catName)}
                                className="p-1 bg-[#234D20] text-white rounded hover:bg-[#1C3E19]"
                                title="Save Edit"
                              >
                                <Save size={12} />
                              </button>
                              <button
                                onClick={() => { setEditingCatId(null); setEditingCatName(''); }}
                                className="p-1 bg-neutral-200 text-neutral-700 rounded hover:bg-neutral-300"
                                title="Cancel"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ) : (
                            <div>
                              <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider block">{catName}</span>
                              <span className="text-[10px] text-neutral-400">{count} Active products</span>
                            </div>
                          )}
                        </div>

                        {!isEditing && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => { setEditingCatId(catObj.id); setEditingCatName(catName); }}
                              className="text-neutral-400 hover:text-neutral-800 transition-colors p-1.5 rounded hover:bg-neutral-100"
                              title="Edit Category Name"
                            >
                              <Edit size={14} />
                            </button>

                            {isCore ? (
                              <span className="text-[9px] uppercase font-extrabold tracking-widest text-[#234D20] bg-[#234D20]/10 px-2 py-0.5 rounded">
                                Core
                              </span>
                            ) : (
                              <button
                                onClick={() => handleDeleteCategory(catObj)}
                                className="text-neutral-400 hover:text-red-500 transition-colors p-1.5 rounded hover:bg-red-50"
                                title="Delete Category"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Add Category Form */}
              <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h4 className="font-display text-sm font-bold text-neutral-800 uppercase tracking-wider">Add Sourcing Category</h4>
                <form onSubmit={handleAddCategory} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                      Category Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="e.g. Whole Spices, Blends, Extracts"
                      className="w-full text-xs border border-neutral-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#B71C1C]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#234D20] hover:bg-[#1C3E19] text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Plus size={14} /> Create Channel
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ENQUIRIES TAB */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6">
            <div className="max-w-xl">
              <h3 className="font-display text-lg font-bold text-neutral-800">Partnership Enquiries ({enquiries.length})</h3>
              <p className="text-xs text-neutral-400">Review distributor and wholesale inquiries submitted in real-time from the storefront.</p>
            </div>

            {enquiries.length === 0 ? (
              <div className="bg-white border border-neutral-200/60 rounded-2xl p-10 text-center space-y-3">
                <div className="w-12 h-12 bg-neutral-50 border border-neutral-100 rounded-full flex items-center justify-center text-neutral-400 mx-auto shadow-sm">
                  <Users size={18} />
                </div>
                <h4 className="text-sm font-bold text-neutral-800 uppercase">No Commercial Enquiries Yet</h4>
                <p className="text-xs text-neutral-400 max-w-sm mt-1 leading-relaxed">
                  When potential partners submit the wholesale enquiry form, their details will stream here live.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enquiries.map((enq) => {
                  return (
                    <div key={enq.id} className="bg-white border border-neutral-200/60 rounded-2xl p-6 shadow-sm space-y-4 hover:shadow-md transition-all relative group">
                      <button
                        onClick={async () => {
                          if (window.confirm("Are you sure you want to delete this partnership inquiry?")) {
                            try {
                              await deleteEnquiryFromFirestore(enq.id);
                            } catch (e) {
                              console.error(e);
                            }
                          }
                        }}
                        className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-red-500 rounded hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove enquiry record"
                      >
                        <Trash2 size={13} />
                      </button>

                      <div className="flex items-start gap-3 pb-3 border-b border-neutral-100">
                        <div className="p-2.5 bg-[#B71C1C]/10 border border-[#B71C1C]/20 rounded-lg text-[#B71C1C] text-xs font-bold">
                          {enq.type || 'Distributor'}
                        </div>
                        <div>
                          <h4 className="font-bold text-neutral-800 text-sm">{enq.businessName || 'Business Name'}</h4>
                          <p className="text-[10px] text-neutral-400 font-semibold">{enq.date || 'Just now'}</p>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs text-neutral-600 leading-relaxed">
                        <p><span className="font-bold text-neutral-800">Contact Person:</span> {enq.name}</p>
                        <p><span className="font-bold text-neutral-800">Phone:</span> {enq.phone}</p>
                        {enq.email && <p><span className="font-bold text-neutral-800">Email:</span> {enq.email}</p>}
                        <p><span className="font-bold text-neutral-800">Sourcing Area:</span> {enq.city}</p>
                        {enq.message && (
                          <div className="bg-[#F8F8F4] p-3 rounded-lg border border-neutral-100 text-neutral-500 italic mt-2">
                            "{enq.message}"
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* DIRECTORS BOARD / VISIONARIES MANAGEMENT TAB */}
        {activeTab === 'directors' && (
          <div className="space-y-8">
            {/* Header & Success Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-[0.2em] text-[#B71C1C] block">
                  Meet Our Visionaries Management
                </span>
                <h3 className="font-display text-2xl font-black text-neutral-800">
                  The Directors Board ({foundersList.length})
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Upload & replace photos or update credentials & bio for the Directors Board. All uploads reflect live and permanently on the server and website.
                </p>
              </div>

              {!isAddingDirector && (
                <button
                  onClick={() => {
                    resetDirectorForm();
                    setIsAddingDirector(true);
                  }}
                  className="px-4 py-2.5 bg-[#B71C1C] hover:bg-[#900000] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer flex items-center gap-2 self-start md:self-auto"
                >
                  <Plus size={14} /> Add Visionary Director
                </button>
              )}
            </div>

            {directorSuccessMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-xs font-bold animate-fadeIn">
                <CheckCircle size={18} className="text-emerald-600 flex-shrink-0" />
                <span>{directorSuccessMsg}</span>
              </div>
            )}

            {/* Modal / Inline Editor for adding or editing a director */}
            {isAddingDirector && (
              <div className="bg-white border-2 border-[#B71C1C]/20 rounded-2xl p-6 sm:p-8 shadow-lg space-y-6 relative">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                  <h4 className="font-display text-lg font-bold text-neutral-800">
                    {editingDirector ? `Edit Director: ${editingDirector.name}` : 'Add New Visionary Director'}
                  </h4>
                  <button
                    onClick={resetDirectorForm}
                    className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSaveDirector} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Left Column: Image Upload */}
                    <div className="md:col-span-5 space-y-3">
                      <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                        Director Photo *
                      </label>
                      <div className="relative aspect-square w-full rounded-2xl border-2 border-dashed border-neutral-300 bg-[#F8F8F4] overflow-hidden flex flex-col items-center justify-center group">
                        {dirImage ? (
                          <>
                            <img
                              src={dirImage}
                              alt="Director Preview"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                              <Camera className="text-white mb-2" size={28} />
                              <span className="text-white text-xs font-bold">Click below to change image</span>
                            </div>
                          </>
                        ) : (
                          <div className="p-6 text-center space-y-2">
                            <ImageIcon size={36} className="text-neutral-400 mx-auto" />
                            <p className="text-xs font-bold text-neutral-600">Upload Director Photo</p>
                            <p className="text-[10px] text-neutral-400 font-medium">PNG, JPG, WEBP up to 8MB</p>
                          </div>
                        )}
                      </div>

                      {/* File input button */}
                      <div>
                        <label className="w-full py-2.5 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs">
                          <Upload size={14} /> Select & Upload Photo
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleDirectorImageUpload(e)}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Or image URL input */}
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">
                          Or Paste Image URL directly
                        </label>
                        <input
                          type="url"
                          value={dirImage}
                          onChange={(e) => setDirImage(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full text-xs border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#B71C1C]"
                        />
                      </div>
                    </div>

                    {/* Right Column: Text Details */}
                    <div className="md:col-span-7 space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={dirName}
                          onChange={(e) => setDirName(e.target.value)}
                          placeholder="e.g. M. Shravan Kumar"
                          className="w-full text-xs border border-neutral-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#B71C1C]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                            Official Role / Title *
                          </label>
                          <input
                            type="text"
                            required
                            value={dirRole}
                            onChange={(e) => setDirRole(e.target.value)}
                            placeholder="e.g. CEO & Managing Director"
                            className="w-full text-xs border border-neutral-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#B71C1C]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                            Credentials / Sub-Title
                          </label>
                          <input
                            type="text"
                            value={dirCredentials}
                            onChange={(e) => setDirCredentials(e.target.value)}
                            placeholder="e.g. B.Tech Agro-Tech & Culinary Visionary"
                            className="w-full text-xs border border-neutral-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#B71C1C]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                          Personal Quote / Vision Statement
                        </label>
                        <textarea
                          rows={2}
                          value={dirQuote}
                          onChange={(e) => setDirQuote(e.target.value)}
                          placeholder="e.g. Spices are active natural medicine. When we mill without heat..."
                          className="w-full text-xs border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#B71C1C]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                          Biography & Background
                        </label>
                        <textarea
                          rows={3}
                          value={dirDescription}
                          onChange={(e) => setDirDescription(e.target.value)}
                          placeholder="e.g. Spearheads agricultural direct-buy partnerships across 200+ Telangana farms..."
                          className="w-full text-xs border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#B71C1C]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
                    <button
                      type="button"
                      onClick={resetDirectorForm}
                      className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#234D20] hover:bg-[#1C3E19] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Save size={14} /> Save Profile & Permanently Publish
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Existing Directors Grid with direct upload options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {foundersList.map((founder) => (
                <div
                  key={founder.id || founder.name}
                  className="bg-white rounded-2xl border border-neutral-200/80 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Photo with direct replace button */}
                  <div className="relative aspect-square bg-neutral-100 border-b border-neutral-100 overflow-hidden">
                    <img
                      src={founder.image}
                      alt={founder.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                    {/* Quick Replace Image Overlay */}
                    <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
                      <label className="flex-1 bg-white/95 hover:bg-white text-neutral-900 text-[10px] font-bold uppercase tracking-wider py-2 px-3 rounded-lg shadow-md backdrop-blur-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all hover:scale-[1.02]">
                        <Camera size={13} className="text-[#B71C1C]" />
                        <span>Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleDirectorImageUpload(e, founder.id)}
                          className="hidden"
                        />
                      </label>

                      <button
                        onClick={() => handleEditDirectorClick(founder)}
                        className="p-2 bg-white/90 hover:bg-white text-neutral-800 rounded-lg shadow-md transition-all hover:scale-105 cursor-pointer"
                        title="Edit Full Profile"
                      >
                        <Edit size={13} />
                      </button>

                      {foundersList.length > 1 && (
                        <button
                          onClick={() => founder.id && handleDeleteDirector(founder.id, founder.name)}
                          className="p-2 bg-white/90 hover:bg-red-50 text-red-600 rounded-lg shadow-md transition-all hover:scale-105 cursor-pointer"
                          title="Delete Director"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>

                    <div className="absolute top-3 left-3 bg-[#B71C1C] text-white text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded shadow-xs">
                      {founder.credentials || 'Director'}
                    </div>
                  </div>

                  {/* Bio summary */}
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-display font-bold text-base text-neutral-800">{founder.name}</h4>
                      <p className="text-[11px] font-extrabold text-[#B71C1C] tracking-wide uppercase mt-0.5">{founder.role}</p>
                      <p className="text-xs text-neutral-500 mt-2 leading-relaxed font-medium line-clamp-3">
                        {founder.description}
                      </p>
                    </div>

                    {founder.quote && (
                      <div className="pt-3 border-t border-neutral-100 bg-[#F8F8F4] p-3 rounded-lg text-[11px] font-medium italic text-neutral-600">
                        "{founder.quote}"
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
