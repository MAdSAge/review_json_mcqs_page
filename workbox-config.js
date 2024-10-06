module.exports = {
  globDirectory: './',  // Root directory to cache from
  globPatterns: [
    '**/*.{html,js,css,png,jpg,svg}'  // Patterns of files to cache
  ],
  swDest: 'service-worker.js',  // Output for the generated service worker
  runtimeCaching: [
    {
      urlPattern: ({request}) => request.destination === 'document',
      handler: 'NetworkFirst',  // Caches pages with NetworkFirst strategy
      options: {
        cacheName: 'pages-cache',
        // Optionally customize cache behavior
        networkTimeoutSeconds: 10, // Optional: allow 10 seconds to fetch from the network
      }
    },
    {
      urlPattern: ({request}) => request.destination === 'image',
      handler: 'CacheFirst',  // Caches images with CacheFirst strategy
      options: {
        cacheName: 'images-cache',
        expiration: {
          maxEntries: 20,  // Only cache 20 images
          maxAgeSeconds: 30 * 24 * 60 * 60,  // Cache images for 30 days
        }
      }
    }
  ],
  // Background Sync section
  backgroundSync: {
    // This section is not necessary here; handle it in your service worker.
  }
};
