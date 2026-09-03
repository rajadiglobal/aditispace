"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProductById } from "@/services/productService";
import { Product } from "@/types/product";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    if (id && typeof id === 'string') {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    setLoading(true);
    try {
      const data = await getProductById(productId);
      setProduct(data);
      if (data.images && data.images.length > 0) {
        setActiveImage(data.images[0].file_path);
      }
    } catch (error) {
      console.error("Failed to load product", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-32">
        <h2 className="text-2xl font-bold text-gray-800">Product not found</h2>
        <button onClick={() => router.push('/products')} className="mt-4 text-primary hover:underline">
          Return to catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex text-sm text-gray-500 mb-8">
        <ol className="flex items-center space-x-2">
          <li><button onClick={() => router.push('/')} className="hover:text-primary">Home</button></li>
          <li><span className="mx-2">/</span></li>
          <li><button onClick={() => router.push('/products')} className="hover:text-primary">Catalog</button></li>
          <li><span className="mx-2">/</span></li>
          <li className="text-gray-900 font-medium">{product.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden border border-gray-100">
            {activeImage ? (
              <img 
                src={`http://localhost:8000${activeImage}`} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No Image Available</div>
            )}
          </div>
          
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-4">
              {product.images.map((img) => (
                <button 
                  key={img.id}
                  onClick={() => setActiveImage(img.file_path)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    activeImage === img.file_path ? 'border-primary ring-2 ring-primary ring-opacity-50' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img src={`http://localhost:8000${img.file_path}`} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-sm text-primary font-semibold uppercase tracking-wider">
              {product.category?.name || "Premium Collection"}
            </div>
            {product.is_featured && (
              <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                Featured
              </span>
            )}
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{product.name}</h1>
          <div className="text-gray-500 text-sm mb-6 flex items-center gap-4 divide-x divide-gray-300">
            <span>SKU: {product.sku}</span>
            {product.brand?.name && <span className="pl-4">Brand: {product.brand.name}</span>}
            {product.collection?.name && <span className="pl-4">Collection: {product.collection.name}</span>}
          </div>
          
          <div className="text-3xl font-bold text-gray-900 mb-8">
            ₹{product.price.toLocaleString()}
            <span className="text-base font-normal text-gray-500 ml-2">/ {product.unit}</span>
          </div>
          
          <div className="prose prose-sm text-gray-600 mb-8">
            <p>{product.description || "No description provided."}</p>
          </div>

          <div className="mt-auto">
            <button className="w-full bg-primary text-white py-4 px-8 rounded-xl font-bold text-lg shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all transform hover:-translate-y-1">
              Add to Design Requirement
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">
              Have questions? <a href="#" className="text-primary font-medium hover:underline">Contact our design team</a>
            </p>
          </div>
        </div>
      </div>
      
      {/* Specs section (Optional) */}
      {product.specifications && product.specifications.length > 0 && (
        <div className="mt-20 border-t border-gray-100 pt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Product Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {product.specifications.map((spec) => (
              <div key={spec.id} className="flex border-b border-gray-100 py-3">
                <span className="w-1/3 text-gray-500 font-medium">{spec.name}</span>
                <span className="w-2/3 text-gray-900">{spec.value} {spec.unit || ''}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
