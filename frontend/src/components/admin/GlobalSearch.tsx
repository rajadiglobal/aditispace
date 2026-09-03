"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

type SearchResult = {
  id: string;
  title: string;
  subtitle: string;
  type: string;
};

type GroupedResults = {
  [key: string]: SearchResult[];
};

export default function GlobalSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GroupedResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 2) {
        performSearch();
      } else {
        setResults(null);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/v1/search?q=${encodeURIComponent(query)}`);
      setResults(response.data);
      setIsOpen(true);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (type: string, id: string) => {
    setIsOpen(false);
    setQuery("");
    
    // Map type to route
    const routes: Record<string, string> = {
      customer: `/admin/customers/${id}`,
      lead: `/admin/leads/${id}`,
      requirement: `/admin/requirements/${id}`,
      project: `/admin/projects/${id}`,
      product: `/admin/products/${id}`,
      quotation: `/admin/quotations/${id}`
    };
    
    if (routes[type]) {
      router.push(routes[type]);
    }
  };

  const hasResults = results && Object.values(results).some(group => group.length > 0);

  return (
    <div className="relative w-full max-w-lg" ref={searchRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition duration-150 ease-in-out"
          placeholder="Search customers, leads, projects..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (query.length >= 2) setIsOpen(true) }}
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {isOpen && query.length >= 2 && (
        <div className="absolute mt-1 w-full bg-white shadow-lg max-h-96 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm z-50">
          {!loading && !hasResults ? (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              No results found for "{query}"
            </div>
          ) : (
            results && Object.entries(results).map(([groupName, items]) => {
              if (items.length === 0) return null;
              
              return (
                <div key={groupName} className="mb-2">
                  <div className="px-3 py-1 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider sticky top-0">
                    {groupName}
                  </div>
                  <ul className="divide-y divide-gray-100">
                    {items.map((item) => (
                      <li 
                        key={`${item.type}-${item.id}`}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleResultClick(item.type, item.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{item.title}</p>
                            <p className="text-xs text-gray-500">{item.subtitle}</p>
                          </div>
                          <div className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full capitalize">
                            {item.type}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
