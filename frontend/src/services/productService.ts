import { api } from '@/lib/api';
import { Product, ProductCreatePayload, Category } from '../types/product';

// --- PUBLIC ENDPOINTS ---

export const getProducts = async (params?: { 
  category_id?: string, 
  collection_id?: string,
  brand_id?: string,
  search?: string, 
  status?: string,
  is_featured?: boolean,
  min_price?: number,
  max_price?: number
}): Promise<Product[]> => {
  const response = await api.get('/api/v1/products', { params });
  return response.data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await api.get(`/api/v1/products/${id}`);
  return response.data;
};

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get('/api/v1/categories');
  return response.data;
};

export const getBrands = async (): Promise<any[]> => {
  const response = await api.get('/api/v1/brands');
  return response.data;
};

export const getCollections = async (): Promise<any[]> => {
  const response = await api.get('/api/v1/collections');
  return response.data;
};

// --- ADMIN ENDPOINTS (Requires Auth) ---

// Products
export const createProduct = async (data: ProductCreatePayload): Promise<Product> => {
  const response = await api.post('/api/v1/admin/products', data);
  return response.data;
};

export const updateProduct = async (id: string, data: Partial<ProductCreatePayload>): Promise<Product> => {
  const response = await api.put(`/api/v1/admin/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/admin/products/${id}`);
};

// Categories
export const createCategory = async (data: Partial<Category>): Promise<Category> => {
  const response = await api.post('/api/v1/admin/categories', data);
  return response.data;
};

export const updateCategory = async (id: string, data: Partial<Category>): Promise<Category> => {
  const response = await api.put(`/api/v1/admin/categories/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/admin/categories/${id}`);
};

// Brands
export const createBrand = async (data: {name: string, description?: string}): Promise<any> => {
  const response = await api.post('/api/v1/admin/brands', data);
  return response.data;
};

export const updateBrand = async (id: string, data: {name: string, description?: string}): Promise<any> => {
  const response = await api.put(`/api/v1/admin/brands/${id}`, data);
  return response.data;
};

export const deleteBrand = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/admin/brands/${id}`);
};

// Collections
export const createCollection = async (data: {name: string, description?: string}): Promise<any> => {
  const response = await api.post('/api/v1/admin/collections', data);
  return response.data;
};

export const updateCollection = async (id: string, data: {name: string, description?: string}): Promise<any> => {
  const response = await api.put(`/api/v1/admin/collections/${id}`, data);
  return response.data;
};

export const deleteCollection = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/admin/collections/${id}`);
};

// Product Images
export const uploadProductImage = async (productId: string, file: File, isMain: boolean = false) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const uploadResponse = await api.post('/api/v1/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  
  const { url } = uploadResponse.data;
  
  const linkResponse = await api.post(`/api/v1/admin/products/${productId}/images`, {
    file_path: url,
    is_main: isMain,
    display_order: 0
  });
  
  return linkResponse.data;
};

export const setMainProductImage = async (productId: string, imageId: string): Promise<void> => {
  await api.put(`/api/v1/admin/products/${productId}/images/${imageId}/main`);
};

export const deleteProductImage = async (productId: string, imageId: string): Promise<void> => {
  await api.delete(`/api/v1/admin/products/${productId}/images/${imageId}`);
};

// Product Specifications
export const addProductSpecification = async (productId: string, data: any): Promise<any> => {
  const response = await api.post(`/api/v1/admin/products/${productId}/specifications`, data);
  return response.data;
};

export const deleteProductSpecification = async (productId: string, specId: string): Promise<void> => {
  await api.delete(`/api/v1/admin/products/${productId}/specifications/${specId}`);
};

// Product Variants
export const addProductVariant = async (productId: string, data: any): Promise<any> => {
  const response = await api.post(`/api/v1/admin/products/${productId}/variants`, data);
  return response.data;
};

export const deleteProductVariant = async (productId: string, variantId: string): Promise<void> => {
  await api.delete(`/api/v1/admin/products/${productId}/variants/${variantId}`);
};
