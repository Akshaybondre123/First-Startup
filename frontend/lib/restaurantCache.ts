/**
 * Restaurant Cache Management Utilities
 * 
 * Use these functions when you need to invalidate or update the restaurant cache
 * after operations like creating, updating, or deleting restaurants.
 */

import { store } from '@/store/store';
import { invalidateCache, addRestaurant, fetchRestaurants } from '@/store/slices/restaurantSlice';
import type { Restaurant } from '@/store/slices/restaurantSlice';

/**
 * Invalidate the restaurant cache
 * Call this after a new restaurant is registered or when you want to force a refresh
 * 
 * @example
 * ```typescript
 * import { invalidateRestaurantCache } from '@/lib/restaurantCache';
 * 
 * // After successful registration
 * await api.restaurants.create(data);
 * invalidateRestaurantCache();
 * ```
 */
export const invalidateRestaurantCache = () => {
    store.dispatch(invalidateCache());
    console.log('✅ Restaurant cache invalidated');
};

/**
 * Add a new restaurant to the cache without refetching
 * Use this when you have the complete restaurant data after registration
 * 
 * @param restaurant - The restaurant object to add
 * 
 * @example
 * ```typescript
 * import { addRestaurantToCache } from '@/lib/restaurantCache';
 * 
 * const response = await api.restaurants.create(data);
 * if (response.success) {
 *   addRestaurantToCache(response.data);
 * }
 * ```
 */
export const addRestaurantToCache = (restaurant: Restaurant) => {
    store.dispatch(addRestaurant(restaurant));
    console.log('✅ Restaurant added to cache:', restaurant.name);
};

/**
 * Force refresh restaurant data
 * Bypasses cache and fetches fresh data from the API
 * 
 * @param location - User location coordinates
 * 
 * @example
 * ```typescript
 * import { forceRefreshRestaurants } from '@/lib/restaurantCache';
 * 
 * forceRefreshRestaurants({ lat: 19.0760, lng: 72.8777 });
 * ```
 */
export const forceRefreshRestaurants = (location?: { lat: number; lng: number }) => {
    const state = store.getState();
    const userLocation = location || state.restaurants.userLocation;

    if (userLocation) {
        store.dispatch(fetchRestaurants({
            lat: userLocation.lat,
            lng: userLocation.lng,
            maxDistance: 10000,
            forceRefresh: true,
        }));
        console.log('🔄 Force refreshing restaurant data');
    } else {
        console.warn('⚠️ Cannot refresh: No user location available');
    }
};

/**
 * Get current cache status
 * Returns information about the cache state
 * 
 * @returns Cache status object
 * 
 * @example
 * ```typescript
 * import { getCacheStatus } from '@/lib/restaurantCache';
 * 
 * const status = getCacheStatus();
 * console.log('Cache age:', status.ageInMinutes, 'minutes');
 * console.log('Is valid:', status.isValid);
 * ```
 */
export const getCacheStatus = () => {
    const state = store.getState();
    const { lastFetched, restaurants } = state.restaurants;

    if (!lastFetched) {
        return {
            isValid: false,
            ageInMinutes: null,
            restaurantCount: restaurants.length,
            message: 'No cache available',
        };
    }

    const ageInMs = Date.now() - lastFetched;
    const ageInMinutes = Math.floor(ageInMs / 60000);
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    const isValid = ageInMs < CACHE_DURATION;

    return {
        isValid,
        ageInMinutes,
        restaurantCount: restaurants.length,
        message: isValid
            ? `Cache is valid (${ageInMinutes} minutes old)`
            : `Cache expired (${ageInMinutes} minutes old)`,
    };
};

export default {
    invalidateRestaurantCache,
    addRestaurantToCache,
    forceRefreshRestaurants,
    getCacheStatus,
};
