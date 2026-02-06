# Example: Using Redux Cache in Restaurant Registration

## In your Restaurant Registration Form/Page

```typescript
"use client";

import { useState } from 'react';
import { api } from '@/lib/api';
import { invalidateRestaurantCache, addRestaurantToCache } from '@/lib/restaurantCache';
import { useRouter } from 'next/navigation';

export default function RegisterRestaurant() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    cuisines: [],
    // ... other fields
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Create the restaurant
      const response = await api.restaurants.create(formData);

      if (response.success) {
        // ✅ METHOD 1: Invalidate cache (will refetch on next page load)
        invalidateRestaurantCache();
        
        // OR
        
        // ✅ METHOD 2: Add restaurant directly to cache (no refetch needed)
        // addRestaurantToCache(response.data);

        // Show success message
        alert('Restaurant registered successfully!');
        
        // Redirect to homepage
        router.push('/');
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form fields */}
      <button type="submit">Register Restaurant</button>
    </form>
  );
}
```

## When to Use Each Method

### **Method 1: `invalidateRestaurantCache()`**
- ✅ Use when you want to ensure fresh data on next load
- ✅ Simpler, less code
- ❌ Requires another API call when user navigates to homepage

```typescript
const response = await api.restaurants.create(formData);
if (response.success) {
  invalidateRestaurantCache(); // 👈 Simple and safe
  router.push('/');
}
```

### **Method 2: `addRestaurantToCache(restaurant)`**
- ✅ No additional API call needed
- ✅ Instant update in UI
- ❌ Requires complete restaurant object from API response

```typescript
const response = await api.restaurants.create(formData);
if (response.success) {
  addRestaurantToCache(response.data); // 👈 Optimistic, faster
  router.push('/');
}
```

## Checking Cache Status (Optional)

```typescript
import { getCacheStatus } from '@/lib/restaurantCache';

// In your component
useEffect(() => {
  const status = getCacheStatus();
  console.log('Cache Status:', status);
  // Output: { isValid: true, ageInMinutes: 2, restaurantCount: 25, message: "Cache is valid (2 minutes old)" }
}, []);
```

## Force Refresh (Optional)

```typescript
import { forceRefreshRestaurants } from '@/lib/restaurantCache';

// Force refresh button
<button onClick={() => forceRefreshRestaurants()}>
  Refresh Data
</button>
```

---

**Recommendation**: Use **Method 1** (`invalidateRestaurantCache()`) for simplicity and reliability.
