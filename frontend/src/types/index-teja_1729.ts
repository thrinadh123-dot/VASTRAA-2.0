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

export interface User {
    _id: string;
    username: string;
    name?: string;
    email: string;
    phone?: string;
    avatar?: string;
    sizePreferences?: {
        tshirt?: string;
        shirt?: string;
        jeans?: string;
        shoes?: string;
        top?: string;
        dress?: string;
        waist?: string;
        footwear?: string;
    };
    role: 'user' | 'admin';
    token?: string;
    createdAt?: string;
}

export interface Review {
    _id: string;
    name: string;
    rating: number;
    comment: string;
    user: string;
    createdAt: string;
    updatedAt: string;
}

export interface Product {
    _id?: string;
    id?: string; // For compatibility with static data
    name: string;
    image?: string;
    images: string[];
    brand?: string;
    category: 'Men' | 'Women' | 'Kids';
    productType?: 'tshirt' | 'shirt' | 'jeans' | 'shoes' | 'other';
    subcategory: string;
    badge?: 'NEW' | 'SALE' | 'LIMITED' | '';
    description: string;
    price: number;
    originalPrice?: number;
    isOnSale?: boolean;
    salePrice?: number;
    discountPercentage?: number;
    rating: number;
    numReviews?: number;
    reviews?: Review[] | number;
    stock?: number;
    countInStock?: number; // Legacy/Optional
    sizes: string[];
    isActive?: boolean;
    recommendedSize?: string | null;
    isNewDrop?: boolean;
    isBestseller?: boolean;
    season?: 'summer' | 'winter' | 'all';
    styleTags?: StyleTag[];
}

export interface CartItem {
    product: string;
    name: string;
    image: string;
    price: number;
    originalPrice?: number;
    stock?: number;
    quantity: number;
    size?: string;
    originalPrice?: number;
    discountPercentage?: number;
    color?: string;
}

export interface WishlistItem {
    _id: string;
    name: string;
    image: string;
    images?: string[];
    price: number;
    category: string;
}

export interface Order {
    _id: string;
    user: User | string;
    orderItems: {
        product: string;
        name: string;
        image: string;
        size: string;
        quantity: number;
        price: number;
    }[];
    items?: any[]; // Alias for admin/legacy compatibility
    shippingAddress: {
        fullName: string;
        phone: string;
        address: string;
        city: string;
        pincode: string;
        state: string;
    };
    paymentMethod: string;
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
    totalAmount?: number;
    paymentStatus: 'Pending' | 'Paid';
    isPaid?: boolean; // Admin compatibility
    isDelivered?: boolean; // Admin compatibility
    status: 'processing' | 'confirmed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
    deliveryStatus?: string; // Admin compatibility
    trackingId?: string;
    paidAt?: string;
    deliveredAt?: string;
    cancelledAt?: string;
    cancelledBy?: string;
    cancellationReason?: string;
    cancellationNote?: string;
    refundStatus?: 'None' | 'Initiated' | 'Completed' | 'Failed';
    updatedAt?: string;
    createdAt: string;
}
