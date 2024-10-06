module.exports = {
    globDirectory: './', // The directory to cache files from
    globPatterns: [
        '**/*.{html,css,js,png}', // Files to cache
    ],
    swDest: 'sw.js', // Output service worker file
    clientsClaim: true, // Take control of uncontrolled clients
    skipWaiting: true, // Force the waiting service worker to become the active service worker
    runtimeCaching: [
        {
            urlPattern: ({ request }) => request.destination === 'document', // Cache HTML files
            handler: 'StaleWhileRevalidate',
            options: {
                cacheName: 'html-cache',
                expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 Days
                },
            },
        },
        {
            urlPattern: ({ request }) => request.destination === 'script', // Cache JS files
            handler: 'StaleWhileRevalidate',
            options: {
                cacheName: 'js-cache',
                expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 Days
                },
            },
        },
        {
            urlPattern: ({ request }) => request.destination === 'style', // Cache CSS files
            handler: 'StaleWhileRevalidate',
            options: {
                cacheName: 'css-cache',
                expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 Days
                },
            },
        },
    ],
};
