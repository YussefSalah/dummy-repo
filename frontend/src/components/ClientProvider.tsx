"use client";

import { useEffect } from 'react';
import { useAuthStore, useCartStore } from '../lib/store';

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  const checkAuth = useAuthStore(state => state.checkAuth);
  const token = useAuthStore(state => state.token);
  const fetchCart = useCartStore(state => state.fetchCart);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (token) {
      fetchCart();
    }
  }, [token, fetchCart]);

  return <>{children}</>;
}
