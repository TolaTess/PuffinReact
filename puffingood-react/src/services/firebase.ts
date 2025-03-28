import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  onSnapshot,
  DocumentData
} from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { Food, Order, AdminSettings, User } from '../types';

class FirebaseService {
  // Food Collection Methods
  async addFood(food: Omit<Food, 'id'>) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      // Validate food data
      if (!food.name || !food.price || !food.category) {
        throw new Error('Missing required food fields');
      }

      const docRef = await addDoc(collection(db, 'foods'), {
        ...food,
        createdAt: serverTimestamp(),
        createdBy: user.email,
        updatedAt: serverTimestamp(),
        updatedBy: user.email,
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding food:', error);
      throw new Error(`Failed to add food: ${error}`);
    }
  }

  subscribeToFoods(callback: (foods: Food[]) => void) {
    const q = query(
      collection(db, 'foods'),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, 
      (snapshot) => {
        const foods = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Food));
        callback(foods);
      },
      (error) => {
        console.error('Error in foods subscription:', error);
      }
    );
  }

  async updateFood(id: string, food: Partial<Food>) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      const foodRef = doc(db, 'foods', id);
      const foodDoc = await getDoc(foodRef);
      
      if (!foodDoc.exists()) {
        throw new Error('Food not found');
      }

      await updateDoc(foodRef, {
        ...food,
        updatedAt: serverTimestamp(),
        updatedBy: user.email,
      });
    } catch (error) {
      console.error('Error updating food:', error);
      throw new Error(`Failed to update food: ${error}`);
    }
  }

  async deleteFood(id: string) {
    try {
      await deleteDoc(doc(db, 'foods', id));
    } catch (error) {
      throw new Error(`Failed to delete food: ${error}`);
    }
  }

  // Order Collection Methods
  async createOrder(order: Omit<Order, 'id' | 'createdAt'>) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      // Validate order data
      if (!order.items || order.items.length === 0) {
        throw new Error('Order must contain at least one item');
      }

      const docRef = await addDoc(collection(db, 'orders'), {
        ...order,
        userId: user.uid,
        createdAt: serverTimestamp(),
        status: 'pending',
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error(`Failed to create order: ${error}`);
    }
  }

  subscribeToUserOrders(callback: (orders: Order[]) => void) {
    const user = auth.currentUser;
    if (!user) return () => {};

    const q = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, 
      (snapshot) => {
        const orders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Order));
        callback(orders);
      },
      (error) => {
        console.error('Error in orders subscription:', error);
      }
    );
  }

  // Admin Settings Methods
  async updateAdminSettings(settings: Partial<AdminSettings>) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      const settingsRef = doc(db, 'adminData', 'settings');
      await updateDoc(settingsRef, {
        ...settings,
        updatedAt: serverTimestamp(),
        updatedBy: user.email,
      });
    } catch (error) {
      console.error('Error updating admin settings:', error);
      throw new Error(`Failed to update admin settings: ${error}`);
    }
  }

  subscribeToAdminSettings(callback: (settings: AdminSettings) => void) {
    return onSnapshot(doc(db, 'adminData', 'settings'), 
      (doc) => {
        if (doc.exists()) {
          callback(doc.data() as AdminSettings);
        }
      },
      (error) => {
        console.error('Error in admin settings subscription:', error);
      }
    );
  }

  // User Methods
  async updateUserProfile(userId: string, data: Partial<User>) {
    try {
      await updateDoc(doc(db, 'users', userId), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      throw new Error(`Failed to update user profile: ${error}`);
    }
  }

  async getDeliveryFee(city: string): Promise<number> {
    try {
      const settingsDoc = await getDoc(doc(db, 'adminData', 'settings'));
      if (!settingsDoc.exists()) return 3.50; // Default fee

      const settings = settingsDoc.data() as AdminSettings;
      
      if (city.toLowerCase().includes('galway') && settings.isGalway) {
        return settings.galwayFee;
      } else if (settings.isOutsideGalway) {
        return settings.outsideGalwayFee;
      }
      
      return 0; // No delivery available
    } catch (error) {
      throw new Error(`Failed to get delivery fee: ${error}`);
    }
  }
}

export const firebaseService = new FirebaseService(); 