import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/lib/api';

export interface Restaurant {
    _id: string;
    name: string;
    image: string;
    rating: number;
    reviewCount: number;
    priceRange: string;
    cuisines: string[];
    tags: string[];
    address: string;
    description: string;
    location: {
        type: 'Point';
        coordinates: [number, number];
    };
    features: string[];
    verified: boolean;
    distance?: number;
}

// Update the parameters to include filters
interface FetchParams {
    lat?: number;
    lng?: number;
    maxDistance?: number;
    search?: string;
    tags?: string[];
    verified?: boolean;
    sortBy?: "rating" | "distance" | "name";
    forceRefresh?: boolean;
}

interface RestaurantState {
    restaurants: Restaurant[];
    loading: boolean;
    error: string | null;
    lastFetched: number | null;
    userLocation: { lat: number; lng: number } | null;
    lastParams: Omit<FetchParams, 'forceRefresh'> | null; // Track parameters for caching
}

const initialState: RestaurantState = {
    restaurants: [],
    loading: false,
    error: null,
    lastFetched: null,
    userLocation: null,
    lastParams: null,
};

// Async thunk to fetch restaurants with filtering and caching
export const fetchRestaurants = createAsyncThunk(
    'restaurants/fetchRestaurants',
    async (params: FetchParams, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { restaurants: RestaurantState };
            const { lastFetched, restaurants, lastParams } = state.restaurants;

            // Check if parameters have changed (excluding forceRefresh)
            const { forceRefresh, ...currentParams } = params;
            const paramsChanged = JSON.stringify(currentParams) !== JSON.stringify(lastParams);

            // If params haven't changed, we have data, and it's fresh, return cached data
            const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
            if (
                !forceRefresh &&
                !paramsChanged &&
                lastFetched &&
                Date.now() - lastFetched < CACHE_DURATION &&
                restaurants.length > 0
            ) {
                console.log('Using cached restaurant data (params match)');
                return { data: restaurants, fromCache: true, params: currentParams };
            }

            console.log('Fetching fresh restaurant data from API', currentParams);
            const response = await api.restaurants.getAll({
                lat: params.lat,
                lng: params.lng,
                maxDistance: params.maxDistance || 50000,
                search: params.search,
                tags: params.tags,
                verified: params.verified,
                sortBy: params.sortBy,
            });

            if (response.success) {
                return { data: response.data || [], fromCache: false, params: currentParams };
            } else {
                return rejectWithValue(response.error || 'Failed to fetch restaurants');
            }
        } catch (error: any) {
            return rejectWithValue(error.message || 'An error occurred');
        }
    }
);

const restaurantSlice = createSlice({
    name: 'restaurants',
    initialState,
    reducers: {
        setUserLocation: (state, action: PayloadAction<{ lat: number; lng: number } | null>) => {
            state.userLocation = action.payload;
        },
        // Call this when a new restaurant is registered to invalidate cache
        invalidateCache: (state) => {
            state.lastFetched = null;
            console.log('Restaurant cache invalidated - will fetch fresh data on next request');
        },
        // Add a new restaurant to the store (when registered)
        addRestaurant: (state, action: PayloadAction<Restaurant>) => {
            state.restaurants.unshift(action.payload);
            state.lastFetched = Date.now();
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRestaurants.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRestaurants.fulfilled, (state, action) => {
                state.loading = false;
                if (!action.payload.fromCache) {
                    state.restaurants = action.payload.data;
                    state.lastFetched = Date.now();
                }
                state.lastParams = action.payload.params;
                state.error = null;
            })
            .addCase(fetchRestaurants.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setUserLocation, invalidateCache, addRestaurant } = restaurantSlice.actions;
export default restaurantSlice.reducer;
