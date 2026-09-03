"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  getProductById, updateProduct, getCategories, getBrands, getCollections,
  uploadProductImage, setMainProductImage, deleteProductImage,
  addProductSpecification, deleteProductSpecification,
  addProductVariant, deleteProductVariant
} from "@/services/productService";
import { Product, Category } from "@/types/product";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  
  const [activeTab, setActiveTab] = useState("basic");

  // For forms
  const [formData, setFormData] = useState<any>({
    name: "", sku: "", price: 0, unit: "Piece", description: "",
    status: "DRAFT", is_featured: false, category_id: "", brand_id: "", collection_id: ""
  });
  
  // Spec form
  const [specForm, setSpecForm] = useState({ name: "", value: "", unit: "" });
  // Variant form
  const [varForm, setVarForm] = useState({ name: "", sku: "", price: "", color: "", size: "" });

  useEffect(() => {
    if (id && typeof id === 'string') {
      fetchData(id);
    }
  }, [id]);

  const fetchData = async (productId: string) => {
    setLoading(true);
    try {
      const [prod, cats, brs, cols] = await Promise.all([
        getProductById(productId),
        getCategories(), getBrands(), getCollections()
      ]);
      
      setCategories(cats); setBrands(brs); setCollections(cols); setProduct(prod);
      
      setFormData({
        name: prod.name, sku: prod.sku, price: prod.price, unit: prod.unit,
        description: prod.description || "", status: prod.status, is_featured: prod.is_featured || false,
        category_id: prod.category_id || "", brand_id: prod.brand_id || "", collection_id: prod.collection_id || ""
      });
    } catch (error) {
      console.error("Failed to fetch product data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : name === "price" ? (value === "" ? "" : parseFloat(value)) : (value === "" ? null : value)
    }));
  };

  const handleSaveBasic = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (id && typeof id === 'string') {
        const updated = await updateProduct(id, formData);
        setProduct(updated);
        alert("Basic details saved.");
      }
    } catch (error) {
      alert("Failed to update product.");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !id || typeof id !== 'string') return;
    const file = e.target.files[0];
    setSaving(true);
    try {
      await uploadProductImage(id, file);
      fetchData(id);
    } catch (error) {
      alert("Failed to upload image.");
    } finally {
      setSaving(false);
    }
  };

  const handleSetMainImg = async (imgId: string) => {
    if (!id || typeof id !== 'string') return;
    try {
      await setMainProductImage(id, imgId);
      fetchData(id);
    } catch (e) {}
  };

  const handleDeleteImg = async (imgId: string) => {
    if (!id || typeof id !== 'string') return;
    try {
      await deleteProductImage(id, imgId);
      fetchData(id);
    } catch (e) {}
  };

  const handleAddSpec = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || typeof id !== 'string') return;
    try {
      await addProductSpecification(id, specForm);
      setSpecForm({ name: "", value: "", unit: "" });
      fetchData(id);
    } catch (error) {}
  };

  const handleDeleteSpec = async (specId: string) => {
    if (!id || typeof id !== 'string') return;
    try {
      await deleteProductSpecification(id, specId);
      fetchData(id);
    } catch (error) {}
  };

  const handleAddVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || typeof id !== 'string') return;
    try {
      await addProductVariant(id, { ...varForm, price: varForm.price ? parseFloat(varForm.price) : null });
      setVarForm({ name: "", sku: "", price: "", color: "", size: "" });
      fetchData(id);
    } catch (error) {}
  };

  const handleDeleteVariant = async (varId: string) => {
    if (!id || typeof id !== 'string') return;
    try {
      await deleteProductVariant(id, varId);
      fetchData(id);
    } catch (error) {}
  };

  if (loading || !product) {
    return <div className="p-10 text-center">Loading product details...</div>;
  }

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit Product: {product.name}</h1>
        <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700">Back</button>
      </div>

      <div className="flex space-x-4 border-b border-gray-200 mb-6">
        {["basic", "images", "specifications", "variants"].map(tab => (
          <button 
            key={tab}
            className={`pb-2 px-2 capitalize ${activeTab === tab ? "border-b-2 border-primary text-primary font-bold" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "basic" && (
        <form onSubmit={handleSaveBasic} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input type="text" required name="name" className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-primary outline-none" value={formData.name} onChange={handleChange} />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
              <input type="text" required name="sku" className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-primary outline-none" value={formData.sku} onChange={handleChange} />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
              <input type="number" required min="0" step="0.01" name="price" className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-primary outline-none" value={formData.price} onChange={handleChange} />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select name="status" className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-primary outline-none bg-white" value={formData.status} onChange={handleChange}>
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Active</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select name="category_id" className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-primary outline-none bg-white" value={formData.category_id || ""} onChange={handleChange}>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <select name="brand_id" className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-primary outline-none bg-white" value={formData.brand_id || ""} onChange={handleChange}>
                <option value="">Select Brand</option>
                {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Collection</label>
              <select name="collection_id" className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-primary outline-none bg-white" value={formData.collection_id || ""} onChange={handleChange}>
                <option value="">Select Collection</option>
                {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary" />
                <span className="text-gray-800 font-medium">Mark as Featured Product</span>
              </label>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" rows={4} className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-primary outline-none" value={formData.description} onChange={handleChange} />
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button type="submit" disabled={saving} className="bg-primary text-white px-6 py-2 rounded shadow hover:bg-primary/90 transition disabled:opacity-50">
              {saving ? "Saving..." : "Save Basic Info"}
            </button>
          </div>
        </form>
      )}

      {activeTab === "images" && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-lg font-bold">Product Images</h2>
            <div>
              <label className="bg-primary text-white px-4 py-2 rounded cursor-pointer hover:bg-primary/90">
                {saving ? "Uploading..." : "+ Upload Image"}
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={saving} />
              </label>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {product.images?.map(img => (
              <div key={img.id} className="relative border border-gray-200 rounded p-1 group">
                <img src={`${BASE_URL}${img.file_path}`} alt="Product" className="w-full h-32 object-cover rounded" />
                {img.is_main && <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">Primary</span>}
                <div className="absolute top-2 right-2 space-y-1 opacity-0 group-hover:opacity-100 transition">
                  {!img.is_main && (
                    <button onClick={() => handleSetMainImg(img.id)} className="block bg-blue-500 text-white text-xs px-2 py-1 rounded w-full">Set Main</button>
                  )}
                  <button onClick={() => handleDeleteImg(img.id)} className="block bg-red-500 text-white text-xs px-2 py-1 rounded w-full">Delete</button>
                </div>
              </div>
            ))}
            {(!product.images || product.images.length === 0) && (
              <div className="col-span-full text-gray-500 text-center py-6">No images uploaded yet.</div>
            )}
          </div>
        </div>
      )}

      {activeTab === "specifications" && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4">Specifications</h2>
          <form onSubmit={handleAddSpec} className="flex gap-4 mb-6 items-end">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 mb-1">Name (e.g. Material)</label>
              <input required type="text" className="w-full border border-gray-300 rounded px-3 py-2" value={specForm.name} onChange={e => setSpecForm({...specForm, name: e.target.value})} />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 mb-1">Value (e.g. Teak Wood)</label>
              <input required type="text" className="w-full border border-gray-300 rounded px-3 py-2" value={specForm.value} onChange={e => setSpecForm({...specForm, value: e.target.value})} />
            </div>
            <div className="w-24">
              <label className="block text-xs font-medium text-gray-500 mb-1">Unit (opt)</label>
              <input type="text" className="w-full border border-gray-300 rounded px-3 py-2" value={specForm.unit} onChange={e => setSpecForm({...specForm, unit: e.target.value})} />
            </div>
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Add</button>
          </form>
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-y border-gray-200">
              <tr>
                <th className="px-4 py-2 text-sm font-semibold">Name</th>
                <th className="px-4 py-2 text-sm font-semibold">Value</th>
                <th className="px-4 py-2 text-sm font-semibold">Unit</th>
                <th className="px-4 py-2 text-sm font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {product.specifications?.map(s => (
                <tr key={s.id} className="border-b border-gray-100">
                  <td className="px-4 py-2">{s.name}</td>
                  <td className="px-4 py-2">{s.value}</td>
                  <td className="px-4 py-2">{s.unit}</td>
                  <td className="px-4 py-2 text-right">
                    <button onClick={() => handleDeleteSpec(s.id)} className="text-red-500 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "variants" && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4">Variants</h2>
          <form onSubmit={handleAddVariant} className="flex gap-3 mb-6 items-end flex-wrap">
            <div className="flex-1 min-w-[120px]">
              <label className="block text-xs font-medium text-gray-500 mb-1">Name (e.g. 3-Seater)</label>
              <input required type="text" className="w-full border border-gray-300 rounded px-3 py-2" value={varForm.name} onChange={e => setVarForm({...varForm, name: e.target.value})} />
            </div>
            <div className="flex-1 min-w-[120px]">
              <label className="block text-xs font-medium text-gray-500 mb-1">SKU</label>
              <input type="text" className="w-full border border-gray-300 rounded px-3 py-2" value={varForm.sku} onChange={e => setVarForm({...varForm, sku: e.target.value})} />
            </div>
            <div className="w-24">
              <label className="block text-xs font-medium text-gray-500 mb-1">Price (opt)</label>
              <input type="number" step="0.01" className="w-full border border-gray-300 rounded px-3 py-2" value={varForm.price} onChange={e => setVarForm({...varForm, price: e.target.value})} />
            </div>
            <div className="w-24">
              <label className="block text-xs font-medium text-gray-500 mb-1">Color</label>
              <input type="text" className="w-full border border-gray-300 rounded px-3 py-2" value={varForm.color} onChange={e => setVarForm({...varForm, color: e.target.value})} />
            </div>
            <div className="w-24">
              <label className="block text-xs font-medium text-gray-500 mb-1">Size</label>
              <input type="text" className="w-full border border-gray-300 rounded px-3 py-2" value={varForm.size} onChange={e => setVarForm({...varForm, size: e.target.value})} />
            </div>
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Add</button>
          </form>
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-y border-gray-200">
              <tr>
                <th className="px-4 py-2 text-sm font-semibold">Name</th>
                <th className="px-4 py-2 text-sm font-semibold">SKU</th>
                <th className="px-4 py-2 text-sm font-semibold">Price</th>
                <th className="px-4 py-2 text-sm font-semibold">Attributes</th>
                <th className="px-4 py-2 text-sm font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {product.variants?.map(v => (
                <tr key={v.id} className="border-b border-gray-100">
                  <td className="px-4 py-2">{v.name}</td>
                  <td className="px-4 py-2">{v.sku}</td>
                  <td className="px-4 py-2">{v.price ? `₹${v.price}` : 'Default'}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {v.color && `Color: ${v.color} `}
                    {v.size && `Size: ${v.size} `}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button onClick={() => handleDeleteVariant(v.id)} className="text-red-500 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
