"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore, useAuthStore } from '../../lib/store';
import api from '../../lib/api';

export default function CheckoutPage() {
  const { cart, fetchCart } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    userName: user?.name || '',
    shippingAddress: '123 Main Street',
    city: 'Port Said',
    postalCode: '12345',
    country: 'Egypt',
    paymentMethod: 'card'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // The frontend now correctly sends user_name
      const checkoutPayload = {
        user_name: formData.userName,
        shippingAddress: formData.shippingAddress,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
        paymentMethod: formData.paymentMethod,
      };

      await api.post('/orders/checkout', checkoutPayload);
      
      // If it somehow succeeds (it won't in our bug scenario)
      await fetchCart();
      router.push('/');
    } catch (error) {
      // INTENTIONAL DEMO BUG: 
      // Checkout errors are intentionally swallowed to demonstrate the silent failure.
      // We do NOT show an alert, toast, or error message. 
      // The button will stay in the "Processing..." state (we don't reset setLoading(false) here on purpose, 
      // or we can, but nothing happens on screen).
      console.log('Error occurred but intentionally swallowed for demo');
    }
    // We intentionally leave it hanging or just do nothing.
  };

  if (!cart || !cart.items || cart.items.length === 0) {
    return <div className="text-center py-20 text-gray-500">Your cart is empty.</div>;
  }

  const subtotal = cart.items.reduce((acc: number, item: any) => acc + (parseFloat(item.product.price) * item.quantity), 0);

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Checkout</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Customer Section */}
        <section>
          <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Customer</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input 
              type="text" 
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              required 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>
        </section>

        {/* Shipping Section */}
        <section>
          <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Shipping</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input type="text" name="shippingAddress" value={formData.shippingAddress} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
              <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition"/>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
              <input type="text" name="country" value={formData.country} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition"/>
            </div>
          </div>
        </section>

        {/* Payment Section */}
        <section>
          <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Payment</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
            <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition bg-white">
              <option value="card">Credit Card (Mock)</option>
              <option value="paypal">PayPal (Mock)</option>
              <option value="cod">Cash on Delivery</option>
            </select>
          </div>
        </section>

        <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
          <div className="text-lg">
            <span className="text-gray-500">Total to pay: </span>
            <span className="font-extrabold text-gray-900">${subtotal.toFixed(2)}</span>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-indigo-600 text-white font-bold py-4 px-8 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 shadow-md hover:shadow-lg w-48"
          >
            {loading ? 'Processing...' : 'Complete Checkout'}
          </button>
        </div>

      </form>
    </div>
  );
}
