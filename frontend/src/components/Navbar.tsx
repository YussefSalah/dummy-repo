"use client";

import Link from 'next/link';
import { useAuthStore, useCartStore } from '../lib/store';
import { ShoppingCart, User, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const cart = useCartStore(state => state.cart);

  const cartItemCount = cart?.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;

  return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex">
            <Link href="/" className="text-2xl font-bold tracking-tighter text-indigo-400 hover:text-indigo-300 transition">
              NexStore
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/products" className="hover:text-indigo-300 transition">
              Products
            </Link>
            
            <Link href="/cart" className="relative hover:text-indigo-300 transition">
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-300 hidden sm:block">Hi, {user.name}</span>
                <button 
                  onClick={logout}
                  className="flex items-center space-x-1 text-sm text-red-400 hover:text-red-300 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link href="/login" className="flex items-center space-x-1 hover:text-indigo-300 transition">
                <User className="w-5 h-5" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
