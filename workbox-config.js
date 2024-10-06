module.exports = {
    globDirectory: './',  // Root directory to cache from
    globPatterns: [
      '**/*.{html,js,css,png,jpg,svg}'  // Patterns of files to cache
    ],
    swDest: 'service-worker.js',  // Output for the generated service worker
    runtimeCaching: [{
      urlPattern: ({request}) => request.destination === 'document',
      handler: 'NetworkFirst',  // Caches pages with NetworkFirst strategy
      options: {
        cacheName: 'pages-cache',
      }
    }, {
      urlPattern: ({request}) => request.destination === 'image',
      handler: 'CacheFirst',  // Caches images with CacheFirst strategy
      options: {
        cacheName: 'images-cache',
        expiration: {
          maxEntries: 20,  // Only cache 20 images
          maxAgeSeconds: 30 * 24 * 60 * 60,  // Cache images for 30 days
        }
      }
    }]
  };
  