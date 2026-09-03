export interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  parent_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  file_path: string;
  is_main: boolean;
  display_order: number;
  created_at: string;
}

export interface ProductSpecification {
  id: string;
  product_id: string;
  name: string;
  value: string;
  unit?: string;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  sku?: string;
  price?: number;
  color?: string;
  size?: string;
  material?: string;
  availability: boolean;
  image_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category_id?: string;
  collection_id?: string;
  brand_id?: string;
  description?: string;
  short_description?: string;
  price: number;
  sale_price?: number;
  unit: string;
  availability: boolean;
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK' | 'ARCHIVED';
  is_featured: boolean;
  created_at: string;
  updated_at?: string;
  
  images?: ProductImage[];
  specifications?: ProductSpecification[];
  variants?: ProductVariant[];
  category?: Category;
  brand?: any;
  collection?: any;
}

export interface ProductCreatePayload {
  name: string;
  sku: string;
  category_id?: string | null;
  brand_id?: string | null;
  collection_id?: string | null;
  description?: string;
  price: number;
  unit?: string;
  status?: string;
  is_featured?: boolean;
}
