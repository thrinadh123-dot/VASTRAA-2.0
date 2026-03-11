import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import api from '@/services/api';
import type { Address } from '@/types';

interface AddressState {
    addresses: Address[];
    loading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: AddressState = {
    addresses: [],
    loading: false,
    error: null,
    success: false,
};

export const fetchAddresses = createAsyncThunk(
    'address/fetchAddresses',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/users/addresses');
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const addAddress = createAsyncThunk(
    'address/addAddress',
    async (addressData: Omit<Address, '_id' | 'user'>, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/users/addresses', addressData);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updateAddress = createAsyncThunk(
    'address/updateAddress',
    async ({ id, data }: { id: string, data: Partial<Address> }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/users/addresses/${id}`, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const deleteAddress = createAsyncThunk(
    'address/deleteAddress',
    async (id: string, { rejectWithValue }) => {
        try {
            await api.delete(`/users/addresses/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const setDefaultAddress = createAsyncThunk(
    'address/setDefaultAddress',
    async (id: string, { rejectWithValue }) => {
        try {
            const { data } = await api.patch(`/users/addresses/${id}/default`);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {
        clearAddressState: (state) => {
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchAddresses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAddresses.fulfilled, (state, action: PayloadAction<Address[]>) => {
                state.loading = false;
                state.addresses = action.payload;
            })
            .addCase(fetchAddresses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Add
            .addCase(addAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(addAddress.fulfilled, (state, action: PayloadAction<Address[]>) => {
                state.loading = false;
                state.addresses = action.payload;
                state.success = true;
            })
            .addCase(addAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update
            .addCase(updateAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updateAddress.fulfilled, (state, action: PayloadAction<Address[]>) => {
                state.loading = false;
                state.addresses = action.payload;
                state.success = true;
            })
            .addCase(updateAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Delete
            .addCase(deleteAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(deleteAddress.fulfilled, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.addresses = state.addresses.filter(a => a._id !== action.payload);
                state.success = true;
            })
            .addCase(deleteAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Set Default
            .addCase(setDefaultAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(setDefaultAddress.fulfilled, (state, action: PayloadAction<Address[]>) => {
                state.loading = false;
                state.addresses = action.payload;
                state.success = true;
            })
            .addCase(setDefaultAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { clearAddressState } = addressSlice.actions;
export default addressSlice.reducer;
