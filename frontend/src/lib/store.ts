import { create } from 'zustand';
import api from './api';

interface AuthState {
  user: any | null;
  token: string | null;
  login: (token: string, user: any) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  login: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, user: null });
  },
  checkAuth: () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        set({ token, user: JSON.parse(userStr) });
      } catch {
        // ignore
      }
    }
  },
}));

interface CartState {
  cart: any | null;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  fetchCart: async () => {
    try {
      const res = await api.get('/cart');
      set({ cart: res.data });
    } catch (e) {
      console.error('Failed to fetch cart', e);
    }
  },
  addToCart: async (productId, quantity) => {
    try {
      const res = await api.post('/cart/items', { productId, quantity });
      set({ cart: res.data });
    } catch (e) {
      console.error('Failed to add to cart', e);
      throw e;
    }
  },
  updateQuantity: async (productId, quantity) => {
    try {
      const res = await api.patch(`/cart/items/${productId}`, { quantity });
      set({ cart: res.data });
    } catch (e) {
      console.error('Failed to update cart', e);
      throw e;
    }
  },
  removeFromCart: async (productId) => {
    try {
      const res = await api.delete(`/cart/items/${productId}`);
      set({ cart: res.data });
    } catch (e) {
      console.error('Failed to remove from cart', e);
      throw e;
    }
  },
  clearCart: () => {
    set({ cart: null });
  },
}));
