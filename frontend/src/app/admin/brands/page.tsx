"use client";

import { useEffect, useState } from "react";
import { getBrands, createBrand, updateBrand, deleteBrand } from "@/services/productService";
import { Trash2, Edit2, X, Check } from "lucide-react";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getBrands();
      setBrands(data);
    } catch (error) {
      console.error("Failed to load brands", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBrand({ name, description });
      setName("");
      setDescription("");
      setErrorMsg("");
      fetchData();
    } catch (error) {
      setErrorMsg("Failed to create brand");
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      await updateBrand(id, { name: editName, description: editDesc });
      setEditingId(null);
      setErrorMsg("");
      fetchData();
    } catch (error) {
      setErrorMsg("Failed to update brand");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this brand?")) return;
    try {
      await deleteBrand(id);
      setErrorMsg("");
      fetchData();
    } catch (err: any) {
      if (err.response?.status === 400) {
        setErrorMsg(err.response.data.detail || "Cannot delete brand because it has linked products.");
      } else {
        setErrorMsg("Failed to delete brand");
      }
    }
  };

  const startEdit = (brand: any) => {
    setEditingId(brand.id);
    setEditName(brand.name);
    setEditDesc(brand.description || "");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Brands</h1>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleAdd} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8 flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input 
            type="text" required
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-primary outline-none"
            value={name} onChange={e => setName(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input 
            type="text"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-primary outline-none"
            value={description} onChange={e => setDescription(e.target.value)}
          />
        </div>
        <button type="submit" className="bg-primary text-white px-6 py-2 rounded shadow hover:bg-primary/90 transition">
          Add Brand
        </button>
      </form>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Name</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Description</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600 w-32 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">No brands found.</td>
                </tr>
              ) : (
                brands.map(brand => (
                  <tr key={brand.id} className="border-b border-gray-100 hover:bg-gray-50">
                    {editingId === brand.id ? (
                      <>
                        <td className="px-4 py-2">
                          <input 
                            type="text" className="w-full border p-1 rounded" 
                            value={editName} onChange={e => setEditName(e.target.value)} 
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input 
                            type="text" className="w-full border p-1 rounded" 
                            value={editDesc} onChange={e => setEditDesc(e.target.value)} 
                          />
                        </td>
                        <td className="px-4 py-2 text-right">
                          <button onClick={() => handleUpdate(brand.id)} className="text-green-600 p-2">
                            <Check className="w-5 h-5" />
                          </button>
                          <button onClick={() => setEditingId(null)} className="text-gray-500 p-2">
                            <X className="w-5 h-5" />
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 font-medium text-gray-800">{brand.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{brand.description}</td>
                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                          <button onClick={() => startEdit(brand)} className="text-blue-500 hover:text-blue-700 p-2">
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleDelete(brand.id)} className="text-red-500 hover:text-red-700 p-2">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </>
                    )}
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
