import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import api from '../../services/api';

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
            return data.products || [];
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
        description?: string;
        stock?: number;
    }, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/wishlist/add', payload);
            toast.success('Added to wishlist ♥');
            return data.products;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to add to wishlist';
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const removeFromWishlist = createAsyncThunk(
    'wishlist/remove',
    async (productId: string, { rejectWithValue }) => {
        try {
            const { data } = await api.delete(`/wishlist/remove/${productId}`);
            return data.products;
        } catch (error: any) {
            const message = error.message || error.response?.data?.message || 'Failed to remove from wishlist';
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const moveWishlistToCart = createAsyncThunk(
    'wishlist/moveToCart',
    async (payload: { product: string; size: string; quantity?: number }, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/wishlist/move-to-cart', payload);
            toast.success('Moved to cart');
            return data;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to move to cart';
            toast.error(message);
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
            toast.error(message);
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
