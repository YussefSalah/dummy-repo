"use client";

import { useCartStore } from '../../lib/store';
import Link from 'next/link';
import { Trash2, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useCartStore();

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link href="/products" className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-indigo-700 transition shadow-md">
          Start Shopping
        </Link>
      </div>
    );
  }

  const subtotal = cart.items.reduce((acc: number, item: any) => acc + (parseFloat(item.product.price) * item.quantity), 0);

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Shopping Cart</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item: any) => (
            <div key={item.id} className="flex flex-col sm:flex-row items-center gap-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-bold text-gray-900 truncate">{item.product.name}</h3>
                <p className="text-indigo-600 font-bold mt-1">${item.product.price}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))} className="px-3 py-1 bg-gray-50 hover:bg-gray-100 font-medium">-</button>
                  <span className="px-3 font-bold text-sm">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product.id, Math.min(item.product.stock, item.quantity + 1))} className="px-3 py-1 bg-gray-50 hover:bg-gray-100 font-medium">+</button>
                </div>
                <button onClick={() => removeFromCart(item.product.id)} className="text-red-400 hover:text-red-500 transition p-2 rounded-lg hover:bg-red-50">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
          <div className="space-y-3 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-medium text-green-600">Free</span>
            </div>
          </div>
          <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <Link href="/checkout" className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition shadow-md hover:shadow-lg">
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
