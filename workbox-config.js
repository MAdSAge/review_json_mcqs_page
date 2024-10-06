module.exports = {
    globDirectory: './', // The directory to cache files from
    globPatterns: [
        '**/*.{html,css,js}', // Files to cache
    ],
    swDest: 'sw.js', // Output service worker file
    clientsClaim: true, // Take control of uncontrolled clients
    skipWaiting: true, // Force the waiting service worker to become the active service worker
};
