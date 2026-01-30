// API configuration
// Using deployed backend for production
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://first-startup-pink.vercel.app/api";

// Helper function to handle fetch errors
const handleFetch = async (url: string, options?: RequestInit) => {
  console.log('Making API request to:', url);
  
  try {
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    
    clearTimeout(timeoutId);
    
    console.log('Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      
      // Try to get error details from response
      try {
        const errorData = await response.json();
        console.error('Error response data:', errorData);
        return { 
          success: false, 
          data: [], 
          error: errorData.message || errorData.error || `Server error: ${response.status}` 
        };
      } catch {
        return { success: false, data: [], error: `Server error: ${response.status} ${response.statusText}` };
      }
    }
    
    const data = await response.json();
    console.log('API response success:', data);
    return data;
  } catch (error) {
    console.error('Network error details:', error);
    
    // Handle timeout specifically
    if (error instanceof Error && error.name === 'AbortError') {
      return { 
        success: false, 
        data: [], 
        error: 'Request timed out. Server is taking too long to respond.' 
      };
    }
    
    // More specific error handling
    if (error instanceof TypeError) {
      if (error.message.includes('Failed to fetch')) {
        return { 
          success: false, 
          data: [], 
          error: 'Server is starting up. Please wait a moment and try again.' 
        };
      }
    }
    
    return { 
      success: false, 
      data: [], 
      error: `Connection error: ${error instanceof Error ? error.message : 'Please try again'}` 
    };
  }
};

// Test backend connectivity
const testConnection = async () => {
  console.log('Testing backend connection...');
  try {
    const response = await fetch(`${API_BASE_URL}/health`, { 
      method: 'GET',
      mode: 'cors'
    });
    console.log('Backend connection test:', response.status, response.statusText);
    return response.ok;
  } catch (error) {
    console.error('Backend connection failed:', error);
    return false;
  }
};

const api = {
  testConnection,
  health: () => {
    return handleFetch(`${API_BASE_URL}/health`);
  },
  restaurants: {
    getAll: (params?: {
      lat?: number;
      lng?: number;
      tags?: string[];
      verified?: boolean;
      search?: string;
      maxDistance?: number;
      page?: number;
      limit?: number;
      sortBy?: 'rating' | 'distance' | 'name';
    }) => {
      const queryParams = new URLSearchParams();
      if (params?.lat) queryParams.append('lat', params.lat.toString());
      if (params?.lng) queryParams.append('lng', params.lng.toString());
      if (params?.tags && params.tags.length > 0) queryParams.append('tags', params.tags.join(','));
      if (params?.verified) queryParams.append('verified', 'true');
      if (params?.search) queryParams.append('search', params.search);
      if (params?.maxDistance) queryParams.append('maxDistance', params.maxDistance.toString());
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);

      return handleFetch(`${API_BASE_URL}/restaurants?${queryParams.toString()}`);
    },
    getById: (id: string) => {
      return handleFetch(`${API_BASE_URL}/restaurants/${id}`);
    },
    create: (data: any) => {
      return handleFetch(`${API_BASE_URL}/restaurants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    },
    update: (id: string, data: any) => {
      return handleFetch(`${API_BASE_URL}/restaurants/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    },
    delete: (id: string) => {
      return handleFetch(`${API_BASE_URL}/restaurants/${id}`, {
        method: 'DELETE',
      });
    },
    seed: () => {
      return handleFetch(`${API_BASE_URL}/restaurants/seed`, {
        method: 'POST',
      });
    },
  },
  reviews: {
    create: (data: {
      restaurantId: string;
      userName: string;
      userEmail?: string;
      rating: number;
      comment: string;
    }) => {
      return handleFetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    },
    getByRestaurant: (restaurantId: string, page?: number, limit?: number) => {
      const queryParams = new URLSearchParams();
      if (page) queryParams.append('page', page.toString());
      if (limit) queryParams.append('limit', limit.toString());
      return handleFetch(`${API_BASE_URL}/reviews/${restaurantId}?${queryParams.toString()}`);
    },
  },
};

// Export both named and default
export { api };
export default api;

