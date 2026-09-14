export interface ISizeVariant {
  size: string;
  price: number;
  originalPrice: number;
  stock: number;
}

export interface IProduct {
  id: string; // The original id from perfumes.ts (e.g. 'santal-blanc')
  name: string;
  brand: string;
  category: string;
  type: string;
  tagline: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  baseColor: string;
  liquidColor: string;
  capColor: string;
  shapes: {
    bottle: string;
    cap: string;
  };
  qualities?: {
    longevity: string;
    sillage: string;
    season: string;
  };
  scentNotes?: {
    top: string[];
    middle: string[];
    base: string[];
  };
  sizeVariants?: ISizeVariant[];
  image: string;
  sku?: string;
  tags?: string[];
  discount_percentage?: number;
  stock_quantity?: number;
  bundle_contents?: string[];
  packaging_description?: string;
  occasion_tags?: string[];
  createdAt?: any;
  updatedAt?: any;
}

export interface ICategory {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface IUser {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  createdAt?: any;
  updatedAt?: any;
}
