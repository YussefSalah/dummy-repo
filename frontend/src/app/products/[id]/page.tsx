"use client";

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import { useCartStore, useAuthStore } from '../../../lib/store';

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  
  const router = useRouter();
  const addToCart = useCartStore(state => state.addToCart);
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    setAdding(true);
    try {
      await addToCart(product.id, quantity);
      router.push('/cart');
    } catch (e) {
      alert('Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div className="text-center py-20 animate-pulse text-lg font-medium text-gray-500">Loading product...</div>;
  if (!product) return <div className="text-center py-20 text-lg text-red-500">Product not found</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
      <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="flex flex-col justify-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">{product.name}</h1>
        <p className="text-xl text-indigo-600 font-bold mb-6">${product.price}</p>
        
        <p className="text-gray-600 mb-8 leading-relaxed text-lg">
          {product.description}
        </p>

        <div className="mb-8">
          <p className="text-sm font-medium text-gray-500 mb-2">Category: <span className="text-gray-900 capitalize">{product.category}</span></p>
          <p className="text-sm font-medium text-gray-500">Availability: <span className="text-gray-900">{product.stock} in stock</span></p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium transition"
            >-</button>
            <span className="px-4 font-bold text-gray-900">{quantity}</span>
            <button 
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium transition"
            >+</button>
          </div>
          
          <button 
            onClick={handleAddToCart}
            disabled={adding || product.stock === 0}
            className="flex-1 bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 shadow-md hover:shadow-lg"
          >
            {adding ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
