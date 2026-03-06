export type { Product, StyleTag } from './types';
export { menProducts } from './menProducts';
export { womenProducts } from './womenProducts';
export { kidsProducts } from './kidsProducts';

import type { Product, StyleTag } from './types';
import { menProducts } from './menProducts';
import { womenProducts } from './womenProducts';
import { kidsProducts } from './kidsProducts';

/* ─── Style tag enrichment ────────────────────────────────────────────────────
 * We assign styleTags, season, isBestseller, and isNewDrop based on
 * subcategory rules and badge field, so we don't need to change individual
 * product objects. Add new subcategory mappings here as the catalog grows.
 * ─────────────────────────────────────────────────────────────────────────── */

type SubcategoryRule = {
    styleTags: StyleTag[];
    season?: 'summer' | 'winter' | 'all';
};

const SUBCATEGORY_RULES: Record<string, SubcategoryRule> = {
    'T-Shirts': { styleTags: ['lightweight', 'breathable', 'summer', 'casual'], season: 'summer' },
    'Tops': { styleTags: ['lightweight', 'breathable', 'summer', 'casual'], season: 'summer' },
    'Dresses': { styleTags: ['lightweight', 'breathable', 'summer', 'casual'], season: 'summer' },
    'Skirts': { styleTags: ['lightweight', 'summer', 'casual'], season: 'summer' },
    'Footwear': { styleTags: ['casual'], season: 'all' },
    'Sneakers': { styleTags: ['casual'], season: 'all' },
    'Accessories': { styleTags: ['casual', 'seasonal'], season: 'all' },
    'Formal Shirts': { styleTags: ['formal', 'breathable'], season: 'all' },
    'Jeans': { styleTags: ['casual'], season: 'all' },
    'Hoodies': { styleTags: ['knitwear', 'winter'], season: 'winter' },
    'Jackets': { styleTags: ['jackets', 'outerwear', 'winter'], season: 'winter' },
    'Blazers': { styleTags: ['formal', 'jackets', 'outerwear', 'seasonal'], season: 'all' },
};

function enrichProduct(p: Product): Product {
    const rule = SUBCATEGORY_RULES[p.subcategory];
    return {
        ...p,
        styleTags: rule?.styleTags ?? ['casual'],
        season: rule?.season ?? 'all',
        // isBestseller: explicit flag, OR high rating (≥4.5) with decent reviews, OR very high reviews > 50
        isBestseller: !!(p as any).isBestseller || (p.rating >= 4.5 && (p.numReviews ?? 0) > 50) || (p.numReviews ?? 0) > 200,
        isNewDrop: p.badge === 'NEW' || p.isNewDrop,
    };
}

const raw: Product[] = [...menProducts, ...womenProducts, ...kidsProducts];
export const allProducts: Product[] = raw.map(enrichProduct);
