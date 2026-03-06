import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { toastService } from '../../services/toastService';
import api from '../../services/api';
import type { CartItem } from '../../types';

interface CartState {
    items: CartItem[];
    loading: boolean;
    error: string | null;
}

const GUEST_KEY = 'vastraa_guest_cart';

const loadGuestCart = (): CartItem[] => {
    try {
        const raw = localStorage.getItem(GUEST_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch { return []; }
};

const saveGuestCart = (items: CartItem[]) =>
    localStorage.setItem(GUEST_KEY, JSON.stringify(items));

const initialState: CartState = {
    items: loadGuestCart(),
    loading: false,
    error: null,
};

const mapItems = (items: any[]): CartItem[] =>
    items.map(item => ({
        product: item.product?._id || item.product,
        _id: item.product?._id || item.product, // Ensure _id is also present
        name: item.product?.name || item.name || 'Product',
        image: item.product?.images?.[0] || item.product?.image || item.image || '',
        price: item.price ?? item.product?.price ?? 0,
        originalPrice: item.originalPrice ?? item.product?.originalPrice,
        stock: item.product?.stock ?? item.stock ?? 0,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
    }));

export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/cart');
            return data.items || [];
        } catch (error: any) {
            if (error.response?.status === 401) return [];
            const message = error.message || error.response?.data?.message || 'Failed to fetch cart';
            toastService.error(message, 'cart-fetch-error');
            return rejectWithValue(message);
        }
    }
);

export const mergeCart = createAsyncThunk(
    'cart/merge',
    async (guestItems: CartItem[], { rejectWithValue }) => {
        try {
            // Filter out items with local slugs (non-MongoIds) to prevent backend CastErrors
            const filteredItems = guestItems.filter(item => {
                const productId = typeof item.product === 'string' ? item.product : (item as any).productId;
                return /^[a-f\d]{24}$/i.test(productId ?? '');
            });

            const { data } = await api.post('/cart/merge', { guestItems: filteredItems });
            localStorage.removeItem(GUEST_KEY);
            return data.items || [];
        } catch (error: any) {
            const message = error.message || error.response?.data?.message || 'Failed to merge cart';
            toastService.error(message, 'cart-merge-error');
            return rejectWithValue(message);
        }
    }
);

export const addCartItem = createAsyncThunk(
    'cart/add',
    async (itemData: {
        product: string;
        quantity: number;
        size?: string;
        color?: string;
        name?: string;
        price?: number;
        image?: string;
        images?: string[];
        category?: string;
        description?: string;
        stock?: number;
        originalPrice?: number;
    }, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/cart/add', itemData);
            return data.items || data;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to add to cart';
            toastService.error(message, 'cart-add-error');
            return rejectWithValue(message);
        }
    }
);

export const removeCartItem = createAsyncThunk(
    'cart/remove',
    async ({ product, size }: { product: string; size?: string }, { rejectWithValue }) => {
        try {
            const { data } = await api.delete(`/cart/remove/${product}`, {
                params: { size },
            });
            return data.items || [];
        } catch (error: any) {
            const message = error.message || error.response?.data?.message || 'Failed to remove item';
            toastService.error(message, 'cart-remove-error');
            return rejectWithValue(message);
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearCart: (state) => {
            state.items = [];
            saveGuestCart([]);
        },
        addGuestItem: (state, action: PayloadAction<CartItem>) => {
            const item = action.payload;
            const idx = state.items.findIndex(
                c => c.product === item.product && c.size === item.size && c.color === item.color
            );
            if (idx > -1) {
                state.items[idx].quantity = (state.items[idx].quantity || 0) + (item.quantity || 1);
            } else {
                state.items.push(item);
            }
            saveGuestCart(state.items);
        },
        removeGuestItem: (state, action: PayloadAction<{ product: string; size?: string }>) => {
            state.items = state.items.filter(
                c => !(c.product === action.payload.product && c.size === action.payload.size)
            );
            saveGuestCart(state.items);
        },
        updateGuestItem: (state, action: PayloadAction<{ product: string; size?: string; quantity: number }>) => {
            const idx = state.items.findIndex(
                c => c.product === action.payload.product && c.size === action.payload.size
            );
            if (idx > -1) {
                state.items[idx].quantity = action.payload.quantity;
            }
            saveGuestCart(state.items);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCart.pending, (state) => { state.loading = true; state.error = null; });
        builder.addCase(fetchCart.fulfilled, (state, action: PayloadAction<any[]>) => {
            state.loading = false;
            state.items = mapItems(action.payload);
        });
        builder.addCase(fetchCart.rejected, (state, action) => {
            state.loading = false;
            if (action.payload) state.error = action.payload as string;
        });

        builder.addCase(mergeCart.pending, (state) => { state.loading = true; });
        builder.addCase(mergeCart.fulfilled, (state, action: PayloadAction<any[]>) => {
            state.loading = false;
            state.items = mapItems(action.payload);
            toastService.success('Cart synced successfully!', [], 'cart-sync-success');
        });
        builder.addCase(mergeCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        builder.addCase(addCartItem.pending, (state) => { state.loading = true; state.error = null; });
        builder.addCase(addCartItem.fulfilled, (state, action: PayloadAction<any[]>) => {
            state.loading = false;
            state.items = mapItems(action.payload);
        });
        builder.addCase(addCartItem.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        builder.addCase(removeCartItem.pending, (state) => { state.loading = true; });
        builder.addCase(removeCartItem.fulfilled, (state, action: PayloadAction<any[]>) => {
            state.loading = false;
            state.items = mapItems(action.payload);
            toastService.success('Item removed from cart', [], 'cart-remove-success');
        });
        builder.addCase(removeCartItem.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export const { clearCart, addGuestItem, removeGuestItem, updateGuestItem } = cartSlice.actions;
export default cartSlice.reducer;
