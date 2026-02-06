# Redux Toolkit (RTK) Implementation Guide

## Overview

We've implemented **Redux Toolkit** for state management to optimize API calls and improve performance. The system ensures that restaurant data is fetched only once and reused across the application.

## Key Features

### ✅ **Smart Caching**
- Data is cached for **5 minutes** in Redux store
- Subsequent page loads use cached data (no API calls)
- Only refetches when cache expires or is manually invalidated

### ✅ **Persistent State**
- Data persists across page navigation
- No redundant API calls when switching between pages
- Faster user experience

### ✅ **Cache Invalidation**
- Automatically invalidate cache when new restaurant is registered
- Force refresh option available when needed

## File Structure

```
frontend/
├── store/
│   ├── store.ts                    # Redux store configuration
│   ├── hooks.ts                    # Typed Redux hooks
│   └── slices/
│       └── restaurantSlice.ts      # Restaurant state management
├── components/
│   └── ReduxProvider.tsx           # Redux Provider wrapper
└── app/
    ├── layout.tsx                  # Wrapped with ReduxProvider
    └── page.tsx                    # Uses Redux hooks
```

## How It Works

### 1. **Initial Load**
```typescript
// When user visits the homepage
1. User location is detected
2. Location is stored in Redux: dispatch(setUserLocation(location))
3. Restaurants are fetched: dispatch(fetchRestaurants({ lat, lng }))
4. Data is cached in Redux store with timestamp
```

### 2. **Subsequent Loads**
```typescript
// When user navigates back or refreshes
1. Redux checks if cached data exists
2. If cache is valid (< 5 minutes old), returns cached data
3. If cache expired, fetches fresh data from API
4. Console logs: "Using cached restaurant data from Redux store"
```

### 3. **New Restaurant Registration**
```typescript
// When a new restaurant is registered
import { invalidateCache, addRestaurant } from '@/store/slices/restaurantSlice';

// Option 1: Invalidate cache (will refetch on next request)
dispatch(invalidateCache());

// Option 2: Add restaurant directly to store (no refetch needed)
dispatch(addRestaurant(newRestaurantData));
```

## Usage Examples

### **In Components**

```typescript
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchRestaurants, invalidateCache } from '@/store/slices/restaurantSlice';

function MyComponent() {
  const dispatch = useAppDispatch();
  
  // Get data from Redux store
  const { restaurants, loading, error, userLocation } = useAppSelector(
    (state) => state.restaurants
  );

  // Fetch restaurants (with smart caching)
  useEffect(() => {
    if (userLocation) {
      dispatch(fetchRestaurants({
        lat: userLocation.lat,
        lng: userLocation.lng,
        maxDistance: 10000,
        forceRefresh: false, // Set to true to bypass cache
      }));
    }
  }, [dispatch, userLocation]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {restaurants.map(restaurant => (
        <div key={restaurant._id}>{restaurant.name}</div>
      ))}
    </div>
  );
}
```

### **Force Refresh**

```typescript
// Bypass cache and fetch fresh data
dispatch(fetchRestaurants({
  lat: userLocation.lat,
  lng: userLocation.lng,
  forceRefresh: true, // 👈 This bypasses the cache
}));
```

### **After Restaurant Registration**

```typescript
// In your registration form/page
import { invalidateCache } from '@/store/slices/restaurantSlice';

const handleRegistration = async (formData) => {
  const response = await api.restaurants.create(formData);
  
  if (response.success) {
    // Invalidate cache so next fetch gets fresh data
    dispatch(invalidateCache());
    
    // Or add the new restaurant directly to the store
    // dispatch(addRestaurant(response.data));
  }
};
```

## Configuration

### **Cache Duration**

Edit `frontend/store/slices/restaurantSlice.ts`:

```typescript
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes (default)

// Change to:
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
// or
const CACHE_DURATION = 60 * 1000; // 1 minute
```

## Benefits

### **Before Redux (Old System)**
❌ API call on every page load  
❌ Data lost on navigation  
❌ Redundant API calls  
❌ Slower user experience  

### **After Redux (Current System)**
✅ API call only once (or every 5 minutes)  
✅ Data persists across navigation  
✅ Smart caching reduces server load  
✅ Faster user experience  
✅ Manual cache invalidation when needed  

## Console Logs

Watch the browser console to see the caching in action:

```
// First load
"Fetching fresh restaurant data from API"
"Successfully fetched restaurants: 25"

// Subsequent loads (within 5 minutes)
"Using cached restaurant data from Redux store"

// After cache invalidation
"Restaurant cache invalidated - will fetch fresh data on next request"
"Fetching fresh restaurant data from API"
```

## API Comparison

### **Old System (Without Redux)**
```
Page Load 1: API Call → 500ms
Navigate Away
Navigate Back: API Call → 500ms
Refresh Page: API Call → 500ms
Total: 3 API calls, 1500ms
```

### **New System (With Redux)**
```
Page Load 1: API Call → 500ms (cached)
Navigate Away
Navigate Back: Cache Hit → <1ms ✨
Refresh Page: Cache Hit → <1ms ✨
Total: 1 API call, ~502ms
```

## Troubleshooting

### **Data not updating after registration?**
Make sure to call `invalidateCache()` or `addRestaurant()` after successful registration.

### **Want to force fresh data?**
Set `forceRefresh: true` when dispatching `fetchRestaurants()`.

### **Cache not working?**
Check browser console for Redux logs. Ensure ReduxProvider is wrapping your app in `layout.tsx`.

## Next Steps

Consider implementing:
1. **Redux Persist** - Save state to localStorage for persistence across browser sessions
2. **RTK Query** - More advanced caching with automatic refetching
3. **Optimistic Updates** - Update UI before API response
4. **Background Sync** - Periodically refresh data in background

---

**Note**: The Redux store is already configured and working. No additional setup needed!
