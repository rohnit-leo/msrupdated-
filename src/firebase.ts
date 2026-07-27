import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocFromServer,
  onSnapshot, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  updateDoc 
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';
import { Product, Founder } from './types';
import { FOUNDERS } from './data';

// Initialize Firebase with auto-provisioned configuration
const app = initializeApp(firebaseConfig);

// Initialize Firestore with custom database ID from configuration
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Test server connection on boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, '_connection_test_', 'init'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

// Error Handler for Firestore Operations
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

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
    onUpdate(productsList);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, 'products');
  });
}

export async function saveProductToFirestore(product: Product) {
  try {
    const productRef = doc(db, 'products', product.id);
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
    handleFirestoreError(error, OperationType.WRITE, `products/${product.id}`);
  }
}

export async function deleteProductFromFirestore(productId: string) {
  try {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `products/${productId}`);
  }
}

// ==========================================
// ORDERS PERSISTENCE
// ==========================================

export function subscribeToOrders(onUpdate: (orders: any[]) => void) {
  const ordersCollection = collection(db, 'orders');
  return onSnapshot(ordersCollection, (snapshot) => {
    const ordersList: any[] = [];
    snapshot.forEach((docSnap) => {
      ordersList.push({ id: docSnap.id, ...docSnap.data() });
    });
    ordersList.sort((a, b) => {
      const dateA = new Date(a.timestamp || a.date || 0).getTime();
      const dateB = new Date(b.timestamp || b.date || 0).getTime();
      return dateB - dateA;
    });
    onUpdate(ordersList);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, 'orders');
  });
}

export async function addOrderToFirestore(order: any) {
  try {
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
    handleFirestoreError(error, OperationType.WRITE, 'orders');
  }
}

export async function updateOrderStatusInFirestore(orderId: string, status: string) {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
  }
}

export async function deleteOrderFromFirestore(orderId: string) {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await deleteDoc(orderRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `orders/${orderId}`);
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
    handleFirestoreError(error, OperationType.GET, 'enquiries');
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
    handleFirestoreError(error, OperationType.CREATE, 'enquiries');
  }
}

export async function deleteEnquiryFromFirestore(enquiryId: string) {
  try {
    const enquiryRef = doc(db, 'enquiries', enquiryId);
    await deleteDoc(enquiryRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `enquiries/${enquiryId}`);
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
    handleFirestoreError(error, OperationType.GET, 'categories');
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
    handleFirestoreError(error, OperationType.WRITE, 'categories');
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
    handleFirestoreError(error, OperationType.UPDATE, `categories/${id}`);
  }
}

export async function deleteCategoryFromFirestore(id: string) {
  try {
    const catRef = doc(db, 'categories', id);
    await deleteDoc(catRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `categories/${id}`);
  }
}

// ==========================================
// FOUNDERS / DIRECTORS BOARD PERSISTENCE
// ==========================================

export function subscribeToFounders(onUpdate: (founders: Founder[]) => void) {
  const foundersCollection = collection(db, 'founders');
  return onSnapshot(foundersCollection, (snapshot) => {
    const foundersList: Founder[] = [];
    snapshot.forEach((docSnap) => {
      foundersList.push({ id: docSnap.id, ...docSnap.data() } as Founder);
    });

    if (foundersList.length === 0) {
      console.log("Firestore founders collection is empty. Seeding with initial Directors Board...");
      FOUNDERS.forEach((f, index) => {
        const founderId = f.id || `director-${index + 1}-${f.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
        const founderWithId = { ...f, id: founderId };
        saveFounderToFirestore(founderWithId).catch((err) => {
          console.error("Error seeding founder:", err);
        });
      });
    } else {
      onUpdate(foundersList);
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, 'founders');
  });
}

export async function saveFounderToFirestore(founder: Founder) {
  try {
    const founderId = founder.id || `director-${Date.now()}-${founder.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    const founderRef = doc(db, 'founders', founderId);
    await setDoc(founderRef, {
      id: founderId,
      name: founder.name,
      role: founder.role,
      credentials: founder.credentials || '',
      description: founder.description || '',
      quote: founder.quote || '',
      image: founder.image
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `founders/${founder.id}`);
  }
}

export async function deleteFounderFromFirestore(founderId: string) {
  try {
    const founderRef = doc(db, 'founders', founderId);
    await deleteDoc(founderRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `founders/${founderId}`);
  }
}
