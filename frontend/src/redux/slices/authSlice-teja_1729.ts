import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';
import type { User } from '../../types';

interface AuthState {
    userInfo: User | null;
    users: User[]; // Admin uses this
    loading: boolean;
    success: boolean; // For operation tracking
    error: string | null;
}

const initialState: AuthState = {
    userInfo: null,
    users: [],
    loading: false,
    success: false,
    error: null,
};

// Async Thunks
export const login = createAsyncThunk(
    'auth/login',
    async (credentials: any, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/auth/login', credentials);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async (userData: any, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/auth/register', userData);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

export const googleLogin = createAsyncThunk(
    'auth/googleLogin',
    async (token: string, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/auth/google', { token });
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

export const fetchUser = createAsyncThunk(
    'auth/fetchUser',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/auth/me');
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            await api.post('/auth/logout');
            dispatch({ type: 'cart/clearCart' });
            return null;
        } catch (error: any) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

// Admin: Get all users
export const listUsers = createAsyncThunk(
    'auth/listUsers',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/auth');
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

export const deleteUser = createAsyncThunk(
    'auth/deleteUser',
    async (id: string, { rejectWithValue }) => {
        try {
            await api.delete(`/auth/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

export const updateUserRole = createAsyncThunk(
    'auth/updateRole',
    async ({ id, role }: { id: string, role: string }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/auth/${id}/role`, { role });
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async (profileData: any, { rejectWithValue }) => {
        try {
            const { data } = await api.put('/auth/profile', profileData);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

export const updateSizes = createAsyncThunk(
    'auth/updateSizes',
    async ({ gender, data: sizesData }: { gender: string, data: any }, { rejectWithValue }) => {
        try {
            const { data } = await api.put('/auth/sizes', { gender, data: sizesData });
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

export const deleteMyAccount = createAsyncThunk(
    'auth/deleteMyAccount',
    async (_, { rejectWithValue }) => {
        try {
            await api.delete('/auth/me');
            return null;
        } catch (error: any) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

export const addAddress = createAsyncThunk(
    'auth/addAddress',
    async (addressData: any, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/users/addresses', addressData);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

export const updateAddress = createAsyncThunk(
    'auth/updateAddress',
    async ({ id, data: addressData }: { id: string, data: any }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/users/addresses/${id}`, addressData);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

export const deleteAddress = createAsyncThunk(
    'auth/deleteAddress',
    async (id: string, { rejectWithValue }) => {
        try {
            const { data } = await api.delete(`/users/addresses/${id}`);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

export const setDefaultAddress = createAsyncThunk(
    'auth/setDefaultAddress',
    async (id: string, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/users/addresses/${id}/default`);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetAuthState: (state) => {
            state.success = false;
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // fetchUser
        builder.addCase(fetchUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchUser.fulfilled, (state, action: PayloadAction<User>) => {
            state.loading = false;
            state.userInfo = action.payload;
        });
        builder.addCase(fetchUser.rejected, (state) => {
            state.loading = false;
            state.userInfo = null;
        });

        // logoutUser
        builder.addCase(logoutUser.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(logoutUser.fulfilled, (state) => {
            state.loading = false;
            state.userInfo = null;
            state.error = null;
            state.users = [];
        });
        builder.addCase(logoutUser.rejected, (state) => {
            state.loading = false;
            state.userInfo = null;
            state.error = null;
            state.users = [];
        });

        // Login
        builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
            state.loading = false;
            state.userInfo = action.payload;
        });
        builder.addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Register
        builder.addCase(register.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
            state.loading = false;
            state.userInfo = action.payload;
        });
        builder.addCase(register.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Google Login
        builder.addCase(googleLogin.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(googleLogin.fulfilled, (state, action: PayloadAction<User>) => {
            state.loading = false;
            state.userInfo = action.payload;
        });
        builder.addCase(googleLogin.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // List Users (Admin)
        builder.addCase(listUsers.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(listUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
            state.loading = false;
            state.users = action.payload;
        });
        builder.addCase(listUsers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Delete User
        builder.addCase(deleteUser.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(deleteUser.fulfilled, (state) => {
            state.loading = false;
            state.success = true;
        });
        builder.addCase(deleteUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Update Role
        builder.addCase(updateUserRole.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateUserRole.fulfilled, (state) => {
            state.loading = false;
            state.success = true;
        });
        builder.addCase(updateUserRole.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Update Profile
        builder.addCase(updateProfile.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateProfile.fulfilled, (state, action: PayloadAction<User>) => {
            state.loading = false;
            state.success = true;
            state.userInfo = action.payload;
        });
        builder.addCase(updateProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Update Sizes
        builder.addCase(updateSizes.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateSizes.fulfilled, (state, action: PayloadAction<User>) => {
            state.loading = false;
            state.success = true;
            state.userInfo = action.payload;
        });
        builder.addCase(updateSizes.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Delete My Account
        builder.addCase(deleteMyAccount.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(deleteMyAccount.fulfilled, (state) => {
            state.loading = false;
            state.userInfo = null;
        });
        builder.addCase(deleteMyAccount.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Address actions
        const addressFulfilled = (state: any, action: PayloadAction<any>) => {
            state.loading = false;
            state.success = true;
            if (state.userInfo) {
                state.userInfo.addresses = action.payload;
            }
        };

        builder.addCase(addAddress.pending, (state) => { state.loading = true; });
        builder.addCase(addAddress.fulfilled, addressFulfilled);
        builder.addCase(addAddress.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });

        builder.addCase(updateAddress.pending, (state) => { state.loading = true; });
        builder.addCase(updateAddress.fulfilled, addressFulfilled);
        builder.addCase(updateAddress.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });

        builder.addCase(deleteAddress.pending, (state) => { state.loading = true; });
        builder.addCase(deleteAddress.fulfilled, addressFulfilled);
        builder.addCase(deleteAddress.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });

        builder.addCase(setDefaultAddress.pending, (state) => { state.loading = true; });
        builder.addCase(setDefaultAddress.fulfilled, addressFulfilled);
        builder.addCase(setDefaultAddress.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
    },
});

export const { clearError, resetAuthState } = authSlice.actions;
export default authSlice.reducer;
