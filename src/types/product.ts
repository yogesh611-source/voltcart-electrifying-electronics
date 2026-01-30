export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  category: string;
  subcategory?: string;
  brand: string;
  rating: number;
  reviewCount: number;
  stock: number;
  features: string[];
  specifications: Record<string, string>;
  colors?: ProductColor[];
  variants?: ProductVariant[];
  isFeatured?: boolean;
  isFlashDeal?: boolean;
  flashDealEnds?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image: string;
  description: string;
  productCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: ProductColor;
  selectedVariant?: ProductVariant;
}

export interface WishlistItem {
  product: Product;
  addedAt: string;
}
