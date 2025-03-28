// Food Types
export interface Addon {
  name: string;
  price: number;
  isAvailable: boolean;
}

export interface Food {
  id?: string;
  name: string;
  description: string;
  price: number;
  imagePath: string;
  category: string;
  isAvailable: boolean;
  addons: Addon[];
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
}

// Order Types
export interface Order {
  id?: string;
  userId: string;
  items: OrderItem[];
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  total: number;
  createdAt: Date;
  trackingNumber?: string;
  city: string;
  deliveryFee: number;
}

export interface OrderItem {
  foodId: string;
  quantity: number;
  addons: Addon[];
  price: number;
}

// Admin Settings Types
export interface AdminSettings {
  isGalway: boolean;
  isOutsideGalway: boolean;
  isDiscount: boolean;
  discountCode: string;
  galwayFee: number;
  outsideGalwayFee: number;
  galwayDeliveryTime: number;
  outsideGalwayDeliveryTime: number;
}

// User Types
export interface User {
  id: string;
  email: string;
  isAdmin: boolean;
  isMarketing: boolean;
} 