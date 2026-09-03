"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getProducts,
  getCategories,
  getBrands,
  getCollections,
} from "@/services/productService";
import { Product, Category } from "@/types/product";
import { Filter, X } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";

export default function PublicProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);

  const [filters, setFilters] = useState({
    category_id: "",
    brand_id: "",
    collection_id: "",
    is_featured: false,
    search: "",
  });

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    Promise.all([getCategories(), getBrands(), getCollections()])
      .then(([cats, brs, cols]) => {
        setCategories(cats);
        setBrands(brs);
        setCollections(cols);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetchActiveProducts();
  }, [filters]);

  const fetchActiveProducts = async () => {
    setLoading(true);
    try {
      const activeFilters: any = { status: "ACTIVE" };
      if (filters.category_id) activeFilters.category_id = filters.category_id;
      if (filters.brand_id) activeFilters.brand_id = filters.brand_id;
      if (filters.collection_id)
        activeFilters.collection_id = filters.collection_id;
      if (filters.is_featured) activeFilters.is_featured = true;
      if (filters.search) activeFilters.search = filters.search;

      const data = await getProducts(activeFilters);
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category_id: "",
      brand_id: "",
      collection_id: "",
      is_featured: false,
      search: "",
    });
  };

  return (
    <div className="flex flex-col">
      <PageHero
        title="Interior Design Catalog"
        subtitle="OUR COLLECTION"
        description="Explore our curated selection of premium furniture, lighting, and finishes for your next project."
        imagePath="/images/hero/elegant-living-room.jpg"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Search catalog..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-xs focus:ring-primary outline-none"
            />
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg font-medium text-gray-800 ml-4"
            >
              <Filter className="w-5 h-5" /> Filters
            </button>
          </div>

          {/* Filters Sidebar */}
          <div
            className={`
          fixed inset-0 z-50 bg-white dark:bg-gray-900 p-6 overflow-y-auto transition-transform duration-300 lg:static lg:block lg:w-64 lg:p-0 lg:bg-transparent lg:z-auto
          ${mobileFiltersOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
          >
            <div className="flex justify-between items-center mb-6 lg:hidden">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Filters</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="text-gray-500 hover:text-gray-900"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="hidden lg:block mb-6">
              <input
                type="text"
                placeholder="Search catalog..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-4 py-2 focus:ring-primary outline-none"
              />
            </div>

            <div className="space-y-8">
              {/* Featured */}
              <div>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.is_featured}
                    onChange={(e) =>
                      handleFilterChange("is_featured", e.target.checked)
                    }
                    className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <span className="text-gray-800 dark:text-gray-200 font-medium">
                    Featured Only
                  </span>
                </label>
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3">Categories</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={filters.category_id === ""}
                      onChange={() => handleFilterChange("category_id", "")}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-gray-600 dark:text-gray-400">All Categories</span>
                  </label>
                  {categories.map((c) => (
                    <label
                      key={c.id}
                      className="flex items-center space-x-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category_id === c.id}
                        onChange={() => handleFilterChange("category_id", c.id)}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="text-gray-600 dark:text-gray-400">{c.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3">Brands</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="brand"
                      checked={filters.brand_id === ""}
                      onChange={() => handleFilterChange("brand_id", "")}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-gray-600 dark:text-gray-400">All Brands</span>
                  </label>
                  {brands.map((b) => (
                    <label
                      key={b.id}
                      className="flex items-center space-x-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="brand"
                        checked={filters.brand_id === b.id}
                        onChange={() => handleFilterChange("brand_id", b.id)}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="text-gray-600 dark:text-gray-400">{b.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Collections */}
              <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3">Collections</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="collection"
                      checked={filters.collection_id === ""}
                      onChange={() => handleFilterChange("collection_id", "")}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-gray-600 dark:text-gray-400">All Collections</span>
                  </label>
                  {collections.map((c) => (
                    <label
                      key={c.id}
                      className="flex items-center space-x-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="collection"
                        checked={filters.collection_id === c.id}
                        onChange={() =>
                          handleFilterChange("collection_id", c.id)
                        }
                        className="text-primary focus:ring-primary"
                      />
                      <span className="text-gray-600 dark:text-gray-400">{c.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={clearFilters}
                className="w-full py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                <p className="text-xl font-medium">
                  No products match your filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-primary hover:underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="group block"
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col h-full relative">
                      {product.is_featured && (
                        <div className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                          Featured
                        </div>
                      )}
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
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
