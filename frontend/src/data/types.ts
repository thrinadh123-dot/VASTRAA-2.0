export type StyleTag =
    | 'lightweight'
    | 'breathable'
    | 'summer'
    | 'winter'
    | 'jackets'
    | 'outerwear'
    | 'formal'
    | 'casual'
    | 'seasonal'
    | 'knitwear';

export interface Product {
    id: string;
    name: string;
    category: 'Men' | 'Women' | 'Kids';
    subcategory: string;
    price: number; // Final selling price
    originalPrice?: number; // Exists only if discounted
    isOnSale?: boolean;
    rating: number;
    reviews: number;
    badge: 'NEW' | 'SALE' | 'LIMITED' | '';
    sizes: string[];
    description: string;
    images: string[];
    // Style-filter metadata
    season?: 'summer' | 'winter' | 'all';
    styleTags?: StyleTag[];
    isBestseller?: boolean;
    isNewDrop?: boolean;
}
