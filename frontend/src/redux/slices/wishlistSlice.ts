import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { toastService } from '@/services/toastService';
import api from '@/services/api';

/* ─── Types ──────────────────────────────────────────────────────────────── */
export interface WishlistProduct {
    _id?: string;
    productId: string;
    name: string;
    image: string;
    price: number;
    category?: string;
    brand?: string;
}

interface WishlistState {
    items: WishlistProduct[];
    loading: boolean;
    error: string | null;
}

const initialState: WishlistState = {
    items: [],
    loading: false,
    error: null,
};

/* ─── Async Thunks ───────────────────────────────────────────────────────── */
export const fetchWishlist = createAsyncThunk(
    'wishlist/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/wishlist');
            const products = data.products || [];
            return products.map((item: any) => {
                const p = item.product || {};
                return {
                    _id: item._id,
                    productId: p._id || '',
                    name: p.name || 'Unknown Product',
                    image: p.images?.[0] || '',
                    price: p.price || 0,
                    category: p.category || '',
                    brand: p.brand || ''
                };
            });
        } catch (error: any) {
            if (error.response?.status === 401) return [];
            const message = error.message || error.response?.data?.message || 'Failed to fetch wishlist';
            return rejectWithValue(message);
        }
    }
);

export const addToWishlist = createAsyncThunk(
    'wishlist/add',
    async (payload: {
        productId: string;
        name?: string;
        price?: number;
        image?: string;
        category?: string;
    }, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/wishlist', payload);
            toastService.success('Added to wishlist ♥');

            const products = data.products || [];
            return products.map((item: any) => {
                const p = item.product || {};
                return {
                    _id: item._id,
                    productId: p._id || '',
                    name: p.name || 'Unknown Product',
                    image: p.images?.[0] || '',
                    price: p.price || 0,
                    category: p.category || '',
                    brand: p.brand || ''
                };
            });
        } catch (error: any) {
            toastService.error('Failed to add to wishlist');
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const removeFromWishlist = createAsyncThunk(
    'wishlist/remove',
    async (productId: string, { rejectWithValue }) => {
        try {
            const { data } = await api.delete(`/wishlist/${productId}`);
            const products = data.products || [];
            return products.map((item: any) => {
                const p = item.product || {};
                return {
                    _id: item._id,
                    productId: p._id || '',
                    name: p.name || 'Unknown Product',
                    image: p.images?.[0] || '',
                    price: p.price || 0,
                    category: p.category || '',
                    brand: p.brand || ''
                };
            });
        } catch (error: any) {
            const message = error.message || error.response?.data?.message || 'Failed to remove from wishlist';
            toastService.error(message);
            return rejectWithValue(message);
        }
    }
);

export const moveWishlistToCart = createAsyncThunk(
    'wishlist/moveToCart',
    async (payload: { productId: string; size: string; quantity?: number }, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/wishlist/move-to-cart', payload);
            toastService.success('Moved to cart');
            return data;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to move to cart';
            toastService.error(message);
            return rejectWithValue(message);
        }
    }
);

export const moveAllWishlistToCart = createAsyncThunk(
    'wishlist/moveAllToCart',
    async (size: string = 'M', { rejectWithValue }) => {
        try {
            const { data } = await api.post('/wishlist/move-all-to-cart', { selectedSize: size });
            return data;
        } catch (error: any) {
            const message = error.message || error.response?.data?.message || 'Failed to move all to cart';
            toastService.error(message);
            return rejectWithValue(message);
        }
    }
);

/* ─── Slice ───────────────────────────────────────────────────────────────── */
const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        clearWishlist: (state) => {
            state.items = [];
        },
    },
    extraReducers: (builder) => {
        /* ─── Fetch ─────────────────── */
        builder.addCase(fetchWishlist.pending, (state) => { state.loading = true; state.error = null; });
        builder.addCase(fetchWishlist.fulfilled, (state, action: PayloadAction<WishlistProduct[]>) => {
            state.loading = false;
            state.items = action.payload;
        });
        builder.addCase(fetchWishlist.rejected, (state, action) => {
            state.loading = false;
            if (action.payload) state.error = action.payload as string;
        });

        /* ─── Add ───────────────────── */
        builder.addCase(addToWishlist.pending, (state) => { state.loading = true; state.error = null; });
        builder.addCase(addToWishlist.fulfilled, (state, action: PayloadAction<WishlistProduct[]>) => {
            state.loading = false;
            state.items = action.payload;
        });
        builder.addCase(addToWishlist.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        /* ─── Remove ────────────────── */
        builder.addCase(removeFromWishlist.pending, (state) => { state.loading = true; state.error = null; });
        builder.addCase(removeFromWishlist.fulfilled, (state, action: PayloadAction<WishlistProduct[]>) => {
            state.loading = false;
            state.items = action.payload;
        });
        builder.addCase(removeFromWishlist.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        /* ─── Move to Cart ──────────── */
        builder.addCase(moveWishlistToCart.pending, (state) => { state.loading = true; state.error = null; });
        builder.addCase(moveWishlistToCart.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.items = action.payload.wishlistProducts || [];
        });
        builder.addCase(moveWishlistToCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        /* ─── Move All to Cart ──────── */
        builder.addCase(moveAllWishlistToCart.pending, (state) => { state.loading = true; state.error = null; });
        builder.addCase(moveAllWishlistToCart.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.items = action.payload.wishlistProducts || [];
        });
        builder.addCase(moveAllWishlistToCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
