import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Wampin - Discover Best Restaurants',
    short_name: 'Wampin',
    description: 'Find the best restaurants, cafes, and party places around you',
    start_url: '/',
    display: 'standalone',
    background_color: '#050505',
    theme_color: '#8b5cf6',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}

