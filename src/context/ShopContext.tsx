import React, { createContext, useState, useEffect, useContext } from 'react';
import type { Product, CartItem, Order, Coupon, Settings, Address } from '../types';

interface ShopContextType {
  products: Product[];
  orders: Order[];
  coupons: Coupon[];
  settings: Settings | null;
  cart: CartItem[];
  wishlist: Product[];
  adminToken: string | null;
  loading: boolean;
  error: string | null;
  fetchProducts: (adminMode?: boolean) => Promise<void>;
  fetchOrders: () => Promise<void>;
  fetchCoupons: () => Promise<void>;
  fetchSettings: () => Promise<void>;
  verifyAdmin: (passkey: string) => Promise<boolean>;
  logoutAdmin: () => void;
  addToCart: (product: Product, quantity: number, size: string, color: string) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateCartQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  applyCoupon: (code: string, amount: number) => Promise<{ success: boolean; discount: number; message: string; coupon?: Coupon }>;
  placeOrder: (
    name: string,
    email: string,
    phone: string,
    address: Address,
    paymentMethod: 'UPI' | 'Card' | 'Net Banking' | 'COD',
    couponCode?: string
  ) => Promise<{ success: boolean; order?: Order; message?: string }>;
  updateOrderStatus: (orderId: string, status: Order['orderStatus']) => Promise<boolean>;
  addProduct: (formData: FormData) => Promise<boolean>;
  editProduct: (productId: string, formData: FormData) => Promise<boolean>;
  deleteProduct: (productId: string) => Promise<boolean>;
  addReview: (productId: string, user: string, rating: number, comment: string) => Promise<Product | null>;
  updateSettings: (settingsData: Partial<Settings>) => Promise<boolean>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  
  // LocalStorage state initialization
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('snehaas_cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('snehaas_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('snehaas_admin_token');
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync Cart to localStorage
  useEffect(() => {
    localStorage.setItem('snehaas_cart', JSON.stringify(cart));
  }, [cart]);

  // Sync Wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('snehaas_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // API Call Helpers
  const fetchProducts = async (adminMode = false) => {
    try {
      const response = await fetch(`/api/products${adminMode ? '?admin=true' : ''}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
        setError(null);
      } else {
        throw new Error('Failed to fetch products');
      }
    } catch (err) {
      console.warn('API error fetching products, running in offline mode. Error:', err);
      setError(err instanceof Error ? err.message : 'Error fetching products');
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (err) {
      console.warn('API error fetching settings, using offline defaults:', err);
      setSettings({
        adminPasskey: 'Snehaas2026',
        boutiqueName: 'Snehaas Boutique',
        whatsappNumber: '919876543210',
        contactEmail: 'info@snehaasboutique.com',
        contactPhone: '+91 98765 43210',
        address: '45, Elite Avenue, Near Rose Garden, Chennai, Tamil Nadu - 600018'
      });
    }
  };

  const fetchCoupons = async () => {
    try {
      const response = await fetch('/api/coupons');
      if (response.ok) {
        const data = await response.json();
        setCoupons(data);
      }
    } catch (err) {
      console.warn('API error fetching coupons.', err);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (err) {
      console.warn('API error fetching orders.', err);
    }
  };

  // Initial Load
  useEffect(() => {
    const initStore = async () => {
      setLoading(true);
      await Promise.all([fetchProducts(), fetchSettings(), fetchCoupons(), fetchOrders()]);
      setLoading(false);
    };
    initStore();
  }, []);

  // Admin Verification
  const verifyAdmin = async (passkey: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passkey })
      });
      if (response.ok) {
        const data = await response.json();
        setAdminToken(data.token);
        localStorage.setItem('snehaas_admin_token', data.token);
        // Refresh full admin list of products and orders
        await Promise.all([fetchProducts(true), fetchOrders()]);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Admin verification error:', err);
      // Offline support bypass (for testing front-end directly)
      if (settings && passkey === settings.adminPasskey) {
        const offlineToken = 'snehaas-authenticated-session';
        setAdminToken(offlineToken);
        localStorage.setItem('snehaas_admin_token', offlineToken);
        return true;
      }
      return false;
    }
  };

  const logoutAdmin = () => {
    setAdminToken(null);
    localStorage.removeItem('snehaas_admin_token');
    fetchProducts(false); // remove scheduled products
  };

  // Cart Operations
  const addToCart = (product: Product, quantity: number, size: string, color: string) => {
    setCart((prevCart) => {
      // Find if item with same size/color exists
      const existingIndex = prevCart.findIndex(
        (item) => item.productId === product.id && item.size === size && item.color === color
      );

      if (existingIndex > -1) {
        const newCart = [...prevCart];
        const newQty = newCart[existingIndex].quantity + quantity;
        newCart[existingIndex].quantity = Math.min(newQty, product.stock);
        return newCart;
      } else {
        return [
          ...prevCart,
          {
            productId: product.id,
            name: product.name,
            price: product.discountPrice !== null ? product.discountPrice : product.price,
            quantity: Math.min(quantity, product.stock),
            size,
            color,
            image: product.images[0] || '',
            maxStock: product.stock
          }
        ];
      }
    });
  };

  const removeFromCart = (productId: string, size: string, color: string) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(item.productId === productId && item.size === size && item.color === color)
      )
    );
  };

  const updateCartQuantity = (productId: string, size: string, color: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId && item.size === size && item.color === color
          ? { ...item, quantity: Math.max(1, Math.min(quantity, item.maxStock)) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist Operations
  const toggleWishlist = (product: Product) => {
    setWishlist((prevWishlist) => {
      const exists = prevWishlist.some((item) => item.id === product.id);
      if (exists) {
        return prevWishlist.filter((item) => item.id !== product.id);
      } else {
        return [...prevWishlist, product];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  // Coupon Verification
  const applyCoupon = async (code: string, amount: number) => {
    try {
      const dbCoupons = coupons.length > 0 ? coupons : (await (await fetch('/api/coupons')).json());
      const coupon = dbCoupons.find((c: Coupon) => c.code.toUpperCase() === code.toUpperCase() && c.active);
      
      if (!coupon) {
        return { success: false, discount: 0, message: 'Invalid or inactive coupon code' };
      }
      if (amount < coupon.minPurchase) {
        return { success: false, discount: 0, message: `Minimum purchase of ₹${coupon.minPurchase} required` };
      }

      let discount = 0;
      if (coupon.discountType === 'percent') {
        discount = Math.round((amount * coupon.discountValue) / 100);
      } else {
        discount = coupon.discountValue;
      }

      return { success: true, discount, message: 'Coupon applied successfully!', coupon };
    } catch (err) {
      return { success: false, discount: 0, message: 'Failed to apply coupon' };
    }
  };

  // Checkout / Orders
  const placeOrder = async (
    name: string,
    email: string,
    phone: string,
    address: Address,
    paymentMethod: 'UPI' | 'Card' | 'Net Banking' | 'COD',
    couponCode = ''
  ) => {
    try {
      const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
      let discountAmount = 0;
      
      if (couponCode) {
        const couponResult = await applyCoupon(couponCode, totalAmount);
        if (couponResult.success) {
          discountAmount = couponResult.discount;
        }
      }

      const finalAmount = Math.max(0, totalAmount - discountAmount);

      const orderBody = {
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        address,
        items: cart.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: item.image
        })),
        totalAmount,
        discountAmount,
        finalAmount,
        couponCode,
        paymentMethod
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderBody)
      });

      if (response.ok) {
        const data = await response.json();
        // Update local state orders list
        setOrders(prev => [data.order, ...prev]);
        clearCart();
        fetchProducts(); // Refresh stock quantities
        return { success: true, order: data.order };
      } else {
        const errData = await response.json();
        return { success: false, message: errData.message || 'Failed to complete order' };
      }
    } catch (err) {
      console.error('Order creation failure:', err);
      return { success: false, message: 'Server communication error. Order could not be placed.' };
    }
  };

  // Update Status (Admin)
  const updateOrderStatus = async (orderId: string, status: Order['orderStatus']): Promise<boolean> => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: status })
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(prev => prev.map(o => o.id === orderId ? data.order : o));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to update status:', err);
      return false;
    }
  };

  // Product CRUD (Admin)
  const addProduct = async (formData: FormData): Promise<boolean> => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        await fetchProducts(true);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Product addition error:', err);
      return false;
    }
  };

  const editProduct = async (productId: string, formData: FormData): Promise<boolean> => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        body: formData
      });
      if (response.ok) {
        await fetchProducts(true);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Product edit error:', err);
      return false;
    }
  };

  const deleteProduct = async (productId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setProducts(prev => prev.filter(p => p.id !== productId));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Product delete error:', err);
      return false;
    }
  };

  const addReview = async (productId: string, user: string, rating: number, comment: string): Promise<Product | null> => {
    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, rating, comment })
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(prev => prev.map(p => p.id === productId ? data.product : p));
        return data.product;
      }
      return null;
    } catch (err) {
      console.error('Failed to submit review:', err);
      return null;
    }
  };

  const updateSettings = async (settingsData: Partial<Settings>): Promise<boolean> => {
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsData)
      });
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to update settings:', err);
      return false;
    }
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        orders,
        coupons,
        settings,
        cart,
        wishlist,
        adminToken,
        loading,
        error,
        fetchProducts,
        fetchOrders,
        fetchCoupons,
        fetchSettings,
        verifyAdmin,
        logoutAdmin,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        applyCoupon,
        placeOrder,
        updateOrderStatus,
        addProduct,
        editProduct,
        deleteProduct,
        addReview,
        updateSettings
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
