"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../lib/api';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products')
      .then(res => setProducts(res.data.items))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1,2,3,4,5,6,7,8].map(i => (
          <div key={i} className="animate-pulse bg-white rounded-2xl p-4 shadow-sm border border-gray-100 h-80">
            <div className="bg-gray-200 h-48 rounded-xl w-full mb-4"></div>
            <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
            <div className="bg-gray-200 h-4 w-1/4 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">All Products</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <Link href={`/products/${product.id}`} key={product.id} className="group bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-100 mb-4 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
              />
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1 truncate max-w-[200px]">{product.name}</h3>
                <p className="text-sm text-gray-500 capitalize">{product.category}</p>
              </div>
              <p className="text-lg font-extrabold text-indigo-600">${product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
