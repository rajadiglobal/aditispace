"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProducts, deleteProduct, updateProduct, getCategories } from "@/services/productService";
import { Product, Category } from "@/types/product";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodData, catData] = await Promise.all([
        getProducts(),
        getCategories()
      ]);
      setProducts(prodData);
      setCategories(catData);
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
      setErrorMsg("");
    } catch (err: any) {
      if (err.response?.status === 400) {
        setErrorMsg(err.response.data.detail || "Cannot delete product because it is linked to CRM records. Please Archive it instead.");
      } else {
        setErrorMsg("Failed to delete product.");
      }
    }
  };

  const handleArchive = async (id: string) => {
    if (!confirm("Are you sure you want to archive this product? It will be hidden from the public catalog.")) return;
    try {
      const updated = await updateProduct(id, { status: 'ARCHIVED' });
      setProducts(products.map(p => p.id === id ? updated : p));
      setErrorMsg("");
    } catch (err) {
      setErrorMsg("Failed to archive product.");
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory ? p.category_id === selectedCategory : true;
    const matchesStatus = selectedStatus ? p.status === selectedStatus : true;
    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products Catalog</h1>
        <Link 
          href="/admin/products/new" 
          className="bg-primary text-white px-4 py-2 rounded shadow hover:bg-primary/90 transition"
        >
          + Add Product
        </Link>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {errorMsg}
        </div>
      )}

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6 flex gap-4">
        <input 
          type="text"
          placeholder="Search by name or SKU..."
          className="flex-1 border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select 
          className="border border-gray-300 rounded px-4 py-2 bg-white"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select 
          className="border border-gray-300 rounded px-4 py-2 bg-white"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="DRAFT">Draft</option>
          <option value="ARCHIVED">Archived</option>
          <option value="OUT_OF_STOCK">Out of Stock</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading products...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Product</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">SKU</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Price</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Status</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded object-cover overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <img src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${product.images[0].file_path}`} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
                        )}
                      </div>
                      <span className="font-medium text-gray-800">{product.name}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.sku}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">₹{product.price.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        product.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                        product.status === 'ARCHIVED' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.status}
                      </span>
                      {product.is_featured && <span className="ml-2 text-xs text-saffron font-semibold">★ Featured</span>}
                    </td>
                    <td className="px-6 py-4 text-right text-sm space-x-3">
                      <Link href={`/admin/products/${product.id}`} className="text-primary hover:underline">Edit</Link>
                      {product.status !== 'ARCHIVED' && (
                        <button onClick={() => handleArchive(product.id)} className="text-amber-600 hover:underline">Archive</button>
                      )}
                      <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
