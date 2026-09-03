"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createProduct, uploadProductImage, getCategories, getBrands, getCollections } from "@/services/productService";
import { ProductCreatePayload } from "@/types/product";
import { Category } from "@/types/product";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  
  const [formData, setFormData] = useState<ProductCreatePayload>({
    name: "",
    sku: "",
    price: 0,
    unit: "Piece",
    description: "",
    status: "DRAFT",
    is_featured: false,
    category_id: null,
    brand_id: null,
    collection_id: null
  });

  useEffect(() => {
    // Fetch dropdown data
    getCategories().then(setCategories).catch(console.error);
    getBrands().then(setBrands).catch(console.error);
    getCollections().then(setCollections).catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : name === "price" ? (value === "" ? "" : parseFloat(value)) : (value === "" ? null : value)
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Create the product
      const newProduct = await createProduct(formData);
      
      // 2. Upload images if selected
      if (imageFiles.length > 0) {
        // Upload first as main, others as gallery
        for (let i = 0; i < imageFiles.length; i++) {
          await uploadProductImage(newProduct.id, imageFiles[i], i === 0);
        }
      }
      
      router.push("/admin/products");
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
        <button 
          onClick={() => router.back()} 
          className="text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
            <input 
              type="text" required name="name"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-primary outline-none"
              value={formData.name} onChange={handleChange}
            />
          </div>
          
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
            <input 
              type="text" required name="sku"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-primary outline-none"
              value={formData.sku} onChange={handleChange}
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
            <input 
              type="number" required min="0" step="0.01" name="price"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-primary outline-none"
              value={formData.price} onChange={handleChange}
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select 
              name="status"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-primary outline-none bg-white"
              value={formData.status} onChange={handleChange}
            >
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select 
              name="category_id"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-primary outline-none bg-white"
              value={formData.category_id || ""} onChange={handleChange}
            >
              <option value="">Select Category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <select 
              name="brand_id"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-primary outline-none bg-white"
              value={formData.brand_id || ""} onChange={handleChange}
            >
              <option value="">Select Brand</option>
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Collection</label>
            <select 
              name="collection_id"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-primary outline-none bg-white"
              value={formData.collection_id || ""} onChange={handleChange}
            >
              <option value="">Select Collection</option>
              {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="col-span-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input 
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
                className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
              />
              <span className="text-gray-800 font-medium">Mark as Featured Product</span>
            </label>
          </div>
          
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              name="description" rows={4}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-primary outline-none"
              value={formData.description} onChange={handleChange}
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50 transition">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600 justify-center">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none">
                    <span>Upload files</span>
                    <input id="file-upload" name="file-upload" type="file" multiple className="sr-only" accept="image/jpeg, image/png, image/webp" onChange={handleImageChange} />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</p>
                {imageFiles.length > 0 && <p className="text-sm text-green-600 font-medium mt-2">{imageFiles.length} files selected</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-primary text-white px-6 py-2 rounded shadow hover:bg-primary/90 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
