// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://first-startup-cav7-2sxsnctmh-akshay-bondres-projects.vercel.app/api';

export const api = {
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

      return fetch(`${API_BASE_URL}/restaurants?${queryParams.toString()}`).then(res => res.json());
    },
    getById: (id: string) => {
      return fetch(`${API_BASE_URL}/restaurants/${id}`).then(res => res.json());
    },
    create: (data: any) => {
      return fetch(`${API_BASE_URL}/restaurants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(res => res.json());
    },
    update: (id: string, data: any) => {
      return fetch(`${API_BASE_URL}/restaurants/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(res => res.json());
    },
    delete: (id: string) => {
      return fetch(`${API_BASE_URL}/restaurants/${id}`, {
        method: 'DELETE',
      }).then(res => res.json());
    },
    seed: () => {
      return fetch(`${API_BASE_URL}/restaurants/seed`, {
        method: 'POST',
      }).then(res => res.json());
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
      return fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(res => res.json());
    },
    getByRestaurant: (restaurantId: string, page?: number, limit?: number) => {
      const queryParams = new URLSearchParams();
      if (page) queryParams.append('page', page.toString());
      if (limit) queryParams.append('limit', limit.toString());
      return fetch(`${API_BASE_URL}/reviews/${restaurantId}?${queryParams.toString()}`).then(res => res.json());
    },
  },
};
