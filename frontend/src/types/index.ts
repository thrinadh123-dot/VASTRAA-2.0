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
    };
    role: 'user' | 'admin';
    token?: string;
    createdAt?: string;
}

export interface Product {
    _id: string;
    name: string;
    image: string;
    brand: string;
    category: 'Men' | 'Women' | 'Kids';
    productType?: 'tshirt' | 'shirt' | 'jeans' | 'shoes' | 'other';
    subcategory?: string;
    badge?: 'NEW' | 'SALE' | 'LIMITED' | '';
    description: string;
    price: number;
    rating: number;
    numReviews: number;
    reviews?: any[]; // For backend compatibility
    stock: number;
    countInStock?: number; // Legacy/Optional
    sizes?: string[];
    images?: string[];
    isActive?: boolean;
    originalPrice?: number;
    isOnSale?: boolean;
    recommendedSize?: string | null;
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
    status: 'processing' | 'confirmed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
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
