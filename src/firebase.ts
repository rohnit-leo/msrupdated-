import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { Product } from './types';

const firebaseConfig = {
  projectId: "true-chassis-4t3g1",
  appId: "1:630951274376:web:c835d94b05d83c0477fc3d",
  apiKey: "AIzaSyDp5QwMfLxnFMIR3uekOIisOLw2vzm0NT8",
  authDomain: "true-chassis-4t3g1.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-msraromapremiums-b63f27f7-6e62-4880-80ce-641a9cc8798d",
  storageBucket: "true-chassis-4t3g1.firebasestorage.app",
  messagingSenderId: "630951274376"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with the custom database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// ==========================================
// PRODUCTS PERSISTENCE
// ==========================================

export function subscribeToProducts(onUpdate: (products: Product[]) => void) {
  const productsCollection = collection(db, 'products');
  return onSnapshot(productsCollection, (snapshot) => {
    const productsList: Product[] = [];
    snapshot.forEach((docSnap) => {
      productsList.push({ id: docSnap.id, ...docSnap.data() } as Product);
    });
    // If database is empty, we don't return an empty array instantly; 
    // the calling code will seed the database with the default products list.
    onUpdate(productsList);
  }, (error) => {
    console.error("Error subscribing to products:", error);
  });
}

export async function saveProductToFirestore(product: Product) {
  try {
    const productRef = doc(db, 'products', product.id);
    // Use setDoc so we can specify the id (to match products from data.ts)
    await setDoc(productRef, {
      name: product.name,
      category: product.category,
      weightOptions: product.weightOptions,
      pricesByWeight: product.pricesByWeight,
      description: product.description,
      benefits: product.benefits,
      ingredients: product.ingredients,
      storageInstructions: product.storageInstructions,
      nutritionalInfo: product.nutritionalInfo,
      packagingDetails: product.packagingDetails,
      badge: product.badge || '',
      image: product.image
    });
  } catch (error) {
    console.error("Error saving product to Firestore:", error);
    throw error;
  }
}

export async function deleteProductFromFirestore(productId: string) {
  try {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
  } catch (error) {
    console.error("Error deleting product from Firestore:", error);
    throw error;
  }
}

// ==========================================
// ORDERS PERSISTENCE
// ==========================================

export function subscribeToOrders(onUpdate: (orders: any[]) => void) {
  const ordersCollection = collection(db, 'orders');
  // Order by date descending or keep unordered if no firestore index is ready
  return onSnapshot(ordersCollection, (snapshot) => {
    const ordersList: any[] = [];
    snapshot.forEach((docSnap) => {
      ordersList.push({ id: docSnap.id, ...docSnap.data() });
    });
    // Sort in client side by default to ensure we don't run into "missing index" errors in Firestore
    ordersList.sort((a, b) => {
      const dateA = new Date(a.timestamp || a.date || 0).getTime();
      const dateB = new Date(b.timestamp || b.date || 0).getTime();
      return dateB - dateA;
    });
    onUpdate(ordersList);
  }, (error) => {
    console.error("Error subscribing to orders:", error);
  });
}

export async function addOrderToFirestore(order: any) {
  try {
    // We can use a custom ID or let Firestore generate it. If the order has an id, use setDoc.
    const orderId = order.id || 'MSR-' + Math.floor(100000 + Math.random() * 900000);
    const orderRef = doc(db, 'orders', orderId);
    const orderData = {
      ...order,
      id: orderId,
      timestamp: order.timestamp || new Date().toISOString()
    };
    await setDoc(orderRef, orderData);
    return orderId;
  } catch (error) {
    console.error("Error adding order to Firestore:", error);
    throw error;
  }
}

export async function updateOrderStatusInFirestore(orderId: string, status: string) {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { status });
  } catch (error) {
    console.error("Error updating order status in Firestore:", error);
    throw error;
  }
}

export async function deleteOrderFromFirestore(orderId: string) {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await deleteDoc(orderRef);
  } catch (error) {
    console.error("Error deleting order from Firestore:", error);
    throw error;
  }
}

// ==========================================
// DISTRIBUTOR ENQUIRIES PERSISTENCE
// ==========================================

export function subscribeToEnquiries(onUpdate: (enquiries: any[]) => void) {
  const enquiriesCollection = collection(db, 'enquiries');
  return onSnapshot(enquiriesCollection, (snapshot) => {
    const enquiriesList: any[] = [];
    snapshot.forEach((docSnap) => {
      enquiriesList.push({ id: docSnap.id, ...docSnap.data() });
    });
    enquiriesList.sort((a, b) => {
      const dateA = new Date(a.timestamp || 0).getTime();
      const dateB = new Date(b.timestamp || 0).getTime();
      return dateB - dateA;
    });
    onUpdate(enquiriesList);
  }, (error) => {
    console.error("Error subscribing to enquiries:", error);
  });
}

export async function addEnquiryToFirestore(enquiry: any) {
  try {
    const enquiryWithTimestamp = {
      ...enquiry,
      timestamp: enquiry.timestamp || new Date().toISOString()
    };
    const enquiriesCollection = collection(db, 'enquiries');
    await addDoc(enquiriesCollection, enquiryWithTimestamp);
  } catch (error) {
    console.error("Error adding enquiry to Firestore:", error);
    throw error;
  }
}

export async function deleteEnquiryFromFirestore(enquiryId: string) {
  try {
    const enquiryRef = doc(db, 'enquiries', enquiryId);
    await deleteDoc(enquiryRef);
  } catch (error) {
    console.error("Error deleting enquiry from Firestore:", error);
    throw error;
  }
}

// ==========================================
// CATEGORIES PERSISTENCE
// ==========================================

export function subscribeToCategories(onUpdate: (categories: { id: string; name: string }[]) => void) {
  const categoriesCollection = collection(db, 'categories');
  return onSnapshot(categoriesCollection, (snapshot) => {
    const categoriesList: { id: string; name: string }[] = [];
    snapshot.forEach((docSnap) => {
      categoriesList.push({ id: docSnap.id, name: docSnap.data().name });
    });

    if (categoriesList.length === 0) {
      // Seed default categories if database is empty
      const defaultCategories = ['Spices', 'Masalas'];
      defaultCategories.forEach(async (catName) => {
        try {
          const catId = catName.toLowerCase().replace(/\s+/g, '-');
          await setDoc(doc(db, 'categories', catId), { name: catName, createdAt: new Date().toISOString() });
        } catch (err) {
          console.error("Error seeding default category:", err);
        }
      });
    } else {
      onUpdate(categoriesList);
    }
  }, (error) => {
    console.error("Error subscribing to categories:", error);
  });
}

export async function addCategoryToFirestore(name: string) {
  try {
    const catId = name.toLowerCase().trim().replace(/[^a-z0-9]/g, '-');
    const catRef = doc(db, 'categories', catId || 'cat-' + Date.now());
    await setDoc(catRef, {
      name: name.trim(),
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error adding category to Firestore:", error);
    throw error;
  }
}

export async function updateCategoryInFirestore(id: string, newName: string) {
  try {
    const catRef = doc(db, 'categories', id);
    await updateDoc(catRef, {
      name: newName.trim(),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error updating category in Firestore:", error);
    throw error;
  }
}

export async function deleteCategoryFromFirestore(id: string) {
  try {
    const catRef = doc(db, 'categories', id);
    await deleteDoc(catRef);
  } catch (error) {
    console.error("Error deleting category from Firestore:", error);
    throw error;
  }
}
