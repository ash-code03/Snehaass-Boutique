export interface ProductColor {
  name: string;
  hex: string;
}

export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice: number | null;
  images: string[];
  category: string;
  sizes: string[];
  colors: ProductColor[];
  material: string;
  stock: number;
  rating: number;
  reviewsCount: number;
  reviews: Review[];
  isFeatured: boolean;
  isTrending: boolean;
  isNewArrival: boolean;
  scheduledDate: string | null;
  createdAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: Address;
  items: OrderItem[];
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  couponCode: string;
  paymentMethod: 'UPI' | 'Card' | 'Net Banking' | 'COD';
  paymentStatus: 'Pending' | 'Paid';
  orderStatus: 'Placed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  trackingNumber: string;
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  minPurchase: number;
  active: boolean;
}

export interface Settings {
  adminPasskey: string;
  boutiqueName: string;
  whatsappNumber: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
  maxStock: number;
}
