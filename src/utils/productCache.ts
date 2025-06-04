import type { Product } from '@/types/product';

const CACHE_KEY = 'products_cache';
const CACHE_EXPIRY = 1000 * 60 * 60; // 1 hour

interface ProductCache {
  timestamp: number;
  products: Product[];
  total: number;
}

export function getCachedProducts(): ProductCache | null {
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return null;
  try {
    const parsed: ProductCache = JSON.parse(cached);
    // Check expiry
    if (Date.now() - parsed.timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return parsed;
  } catch {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
}

export function setCachedProducts(products: Product[], total: number) {
  const cache: ProductCache = {
    timestamp: Date.now(),
    products,
    total,
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

export function isCacheComplete(cache: ProductCache, expectedTotal: number) {
  return cache.products.length === expectedTotal && cache.total === expectedTotal;
}

export function clearProductCache() {
  localStorage.removeItem(CACHE_KEY);
} 