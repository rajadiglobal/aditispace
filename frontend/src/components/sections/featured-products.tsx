"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProducts } from "@/services/productService";
import { Product } from "@/types/product";
import { ArrowRight } from "lucide-react";

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      // Fetch only active, featured products. Limit if needed.
      const data = await getProducts({ status: 'ACTIVE', is_featured: true });
      // Take up to 4 featured products
      setProducts(data.slice(0, 4));
    } catch (error) {
      console.error("Failed to load featured products", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || products.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-gray-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 tracking-tight">Featured Collection</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
              Discover our hand-picked selection of premium furniture and decor designed to elevate your space.
            </p>
          </div>
          <Link 
            href="/products" 
            className="hidden sm:flex items-center gap-2 text-primary hover:text-primary-dark font-medium transition-colors"
          >
            View all catalog <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <Link key={product.id} href={`/products/${product.id}`} className="group block">
              <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col h-full relative">
                <div className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Featured
                </div>
                <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-700 overflow-hidden relative">
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={`http://localhost:8000${product.images[0].file_path}`} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="text-xs text-primary font-semibold tracking-wider uppercase mb-1">
                    {product.category?.name || "Furniture"}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-700">
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      ₹{product.price.toLocaleString()}
                    </span>
                    <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                      Details
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 sm:hidden">
          <Link 
            href="/products" 
            className="flex justify-center items-center gap-2 text-primary hover:text-primary-dark font-medium transition-colors w-full py-3 bg-white dark:bg-gray-800 rounded-xl border border-primary/20 shadow-sm"
          >
            View all catalog <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
