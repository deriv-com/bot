// Comprehensive Service Worker for Deriv Bot Offline Functionality
const CACHE_NAME = 'deriv-bot-v1';
const OFFLINE_URL = '/offline.html';

// Files to cache immediately on install
const PRECACHE_URLS = ['/', '/index.html', '/offline.html', '/manifest.json', '/deriv-logo.svg'];

console.log('[SW] Service worker script loaded');

// Install event - cache essential files
self.addEventListener('install', event => {
    console.log('[SW] Installing service worker...');

    event.waitUntil(
        (async () => {
            try {
                const cache = await caches.open(CACHE_NAME);
                console.log('[SW] Caching precache URLs');

                // Cache essential files
                await cache.addAll(PRECACHE_URLS);
                console.log('[SW] Precache URLs cached successfully');

                // Force activation
                await self.skipWaiting();
                console.log('[SW] Service worker installed and skipping waiting');
            } catch (error) {
                console.error('[SW] Install failed:', error);
                // Still skip waiting even if caching fails
                await self.skipWaiting();
            }
        })()
    );
});

// Activate event - clean up and take control
self.addEventListener('activate', event => {
    console.log('[SW] Activating service worker...');

    event.waitUntil(
        (async () => {
            try {
                // Clean up old caches
                const cacheNames = await caches.keys();
                await Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );

                // Take control of all clients
                await self.clients.claim();
                console.log('[SW] Service worker activated and claimed clients');

                // Notify all clients that SW is ready
                const clients = await self.clients.matchAll();
                clients.forEach(client => {
                    client.postMessage({
                        type: 'SW_ACTIVATED',
                        message: 'Service worker is ready for offline functionality',
                    });
                });
            } catch (error) {
                console.error('[SW] Activation failed:', error);
            }
        })()
    );
});

// Fetch event - handle all network requests
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip chrome-extension and other non-http requests
    if (!request.url.startsWith('http')) {
        return;
    }

    // Skip JavaScript chunks and CSS to prevent chunk loading errors
    if (
        url.pathname.includes('.js') ||
        url.pathname.includes('.css') ||
        url.pathname.includes('/static/js/') ||
        url.pathname.includes('/static/css/') ||
        url.pathname.includes('chunk') ||
        url.pathname.includes('.mjs')
    ) {
        console.log('[SW] Skipping JS/CSS chunk:', url.pathname);
        return;
    }

    // Skip authentication requests
    if (isAuthRequest(url)) {
        console.log('[SW] Skipping auth request:', url.pathname);
        return;
    }

    // Skip API requests to prevent interference
    if (isApiRequest(url)) {
        console.log('[SW] Skipping API request:', url.pathname);
        return;
    }

    // Skip requests with no-cache headers
    if (request.headers.get('cache-control') === 'no-cache') {
        return;
    }

    // Skip requests with authentication headers
    if (request.headers.get('authorization') || request.headers.get('x-auth-token')) {
        return;
    }

    event.respondWith(handleRequest(request));
});

async function handleRequest(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    console.log('[SW] Handling request:', pathname);

    try {
        // Handle different types of requests
        if (isNavigationRequest(request)) {
            return await handleNavigation(request);
        } else if (isStaticAsset(pathname)) {
            return await handleStaticAsset(request);
        } else if (isApiRequest(url)) {
            return await handleApiRequest(request);
        } else {
            return await handleGenericRequest(request);
        }
    } catch (error) {
        console.error('[SW] Request handling failed:', error);
        return await handleOfflineFallback(request);
    }
}

// Handle navigation requests (HTML pages)
async function handleNavigation(request) {
    try {
        console.log('[SW] Handling navigation request');

        // Try network first for navigation
        const networkResponse = await fetch(request, { timeout: 3000 });

        if (networkResponse.ok) {
            // Cache successful navigation responses
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, networkResponse.clone());
            console.log('[SW] Cached navigation response');
        }

        return networkResponse;
    } catch (error) {
        console.log('[SW] Network failed for navigation, trying cache');

        // Try cache first
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('[SW] Serving navigation from cache');
            return cachedResponse;
        }

        // Try to serve index.html for SPA routing
        const indexResponse = (await caches.match('/')) || (await caches.match('/index.html'));
        if (indexResponse) {
            console.log('[SW] Serving index.html for SPA routing');
            return indexResponse;
        }

        // Last resort: offline page
        const offlineResponse = await caches.match(OFFLINE_URL);
        if (offlineResponse) {
            console.log('[SW] Serving offline page');
            return offlineResponse;
        }

        throw error;
    }
}

// Handle static assets (JS, CSS, images, fonts)
async function handleStaticAsset(request) {
    try {
        console.log('[SW] Handling static asset:', request.url);

        // Check cache first for static assets
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('[SW] Serving static asset from cache');
            return cachedResponse;
        }

        // Try network
        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
            // Cache successful responses
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, networkResponse.clone());
            console.log('[SW] Cached static asset');
        }

        return networkResponse;
    } catch (error) {
        console.log('[SW] Static asset failed:', error);

        // Try cache again as fallback
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        throw error;
    }
}

// Handle API requests
async function handleApiRequest(request) {
    try {
        console.log('[SW] Handling API request:', request.url);

        // Always try network first for API requests
        const networkResponse = await fetch(request, { timeout: 5000 });
        return networkResponse;
    } catch (error) {
        console.log('[SW] API request failed, returning offline response');

        // Return structured offline response for API failures
        return new Response(
            JSON.stringify({
                error: 'Offline',
                message: 'API not available offline',
                offline: true,
                timestamp: new Date().toISOString(),
                url: request.url,
            }),
            {
                status: 503,
                statusText: 'Service Unavailable',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Offline-Mode': 'true',
                },
            }
        );
    }
}

// Handle generic requests
async function handleGenericRequest(request) {
    try {
        console.log('[SW] Handling generic request:', request.url);

        // Try network first
        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
            // Cache successful responses
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        // Try cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        throw error;
    }
}

// Handle offline fallbacks
async function handleOfflineFallback(request) {
    console.log('[SW] Providing offline fallback for:', request.url);

    // For HTML requests, serve cached page or offline page
    if (request.headers.get('accept')?.includes('text/html')) {
        // Try to serve cached index.html
        const cachedIndex = (await caches.match('/')) || (await caches.match('/index.html'));
        if (cachedIndex) {
            return cachedIndex;
        }

        // Serve offline page
        const offlineResponse = await caches.match(OFFLINE_URL);
        if (offlineResponse) {
            return offlineResponse;
        }

        // Create basic offline HTML response
        return new Response(
            `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Offline - Deriv Bot</title>
                <style>
                    body { 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        background: #0e0e0e; 
                        color: #ffffff; 
                        margin: 0;
                        padding: 0;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                    }
                    .container { 
                        text-align: center; 
                        max-width: 500px; 
                        padding: 40px 20px;
                    }
                    h1 { 
                        color: #ff444f; 
                        font-size: 2.5rem;
                        margin-bottom: 1rem;
                    }
                    p { 
                        font-size: 1.1rem; 
                        line-height: 1.6;
                        margin-bottom: 2rem;
                        opacity: 0.9;
                    }
                    button { 
                        background: #ff444f; 
                        color: white; 
                        border: none; 
                        padding: 15px 30px; 
                        border-radius: 8px; 
                        cursor: pointer; 
                        font-size: 16px; 
                        font-weight: 600;
                        transition: background-color 0.2s;
                    }
                    button:hover {
                        background: #e63946;
                    }
                    .status {
                        margin-top: 2rem;
                        padding: 15px;
                        background: rgba(255, 68, 79, 0.1);
                        border-radius: 8px;
                        border-left: 4px solid #ff444f;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>You're Offline</h1>
                    <p>Deriv Bot requires an internet connection to function properly. Please check your connection and try again.</p>
                    <button onclick="window.location.reload()">Try Again</button>
                    <div class="status">
                        <strong>Connection Status:</strong> <span id="status">Offline</span>
                    </div>
                </div>
                <script>
                    function updateStatus() {
                        document.getElementById('status').textContent = navigator.onLine ? 'Online' : 'Offline';
                    }
                    
                    window.addEventListener('online', () => {
                        updateStatus();
                        setTimeout(() => window.location.reload(), 1000);
                    });
                    
                    window.addEventListener('offline', updateStatus);
                    updateStatus();
                </script>
            </body>
            </html>
        `,
            {
                status: 200,
                headers: {
                    'Content-Type': 'text/html',
                    'Cache-Control': 'no-cache',
                },
            }
        );
    }

    // For other requests, return generic offline response
    return new Response(
        JSON.stringify({
            error: 'Offline',
            message: 'Content not available offline',
            url: request.url,
            timestamp: new Date().toISOString(),
        }),
        {
            status: 503,
            statusText: 'Service Unavailable',
            headers: {
                'Content-Type': 'application/json',
                'X-Offline-Mode': 'true',
            },
        }
    );
}

// Helper functions
function isNavigationRequest(request) {
    return (
        request.mode === 'navigate' ||
        (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'))
    );
}

function isStaticAsset(pathname) {
    return (
        /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|webp|avif)$/i.test(pathname) ||
        pathname.startsWith('/assets/') ||
        pathname.startsWith('/static/') ||
        pathname.startsWith('/_assets/')
    );
}

// [AI]
function isAuthRequest(url) {
    // Helper function to check if hostname is allowed domain or subdomain
    function isAllowedDomain(hostname, allowedDomain) {
        return hostname === allowedDomain || hostname.endsWith('.' + allowedDomain);
    }

    // Skip all authentication-related requests
    return (
        // OAuth/OIDC endpoints
        url.pathname.includes('/oauth') ||
        url.pathname.includes('/auth') ||
        url.pathname.includes('/login') ||
        url.pathname.includes('/logout') ||
        url.pathname.includes('/token') ||
        url.pathname.includes('/authorize') ||
        url.pathname.includes('/callback') ||
        // Deriv-specific auth endpoints (using secure domain validation)
        isAllowedDomain(url.hostname, 'oauth.deriv.com') ||
        isAllowedDomain(url.hostname, 'auth.deriv.com') ||
        isAllowedDomain(url.hostname, 'accounts.deriv.com') ||
        // Third-party auth providers (using secure domain validation)
        isAllowedDomain(url.hostname, 'google.com') ||
        isAllowedDomain(url.hostname, 'googleapis.com') ||
        isAllowedDomain(url.hostname, 'facebook.com') ||
        isAllowedDomain(url.hostname, 'apple.com') ||
        isAllowedDomain(url.hostname, 'microsoft.com') ||
        isAllowedDomain(url.hostname, 'live.com') ||
        // Auth-related query parameters
        url.search.includes('code=') ||
        url.search.includes('state=') ||
        url.search.includes('token=') ||
        url.search.includes('access_token=') ||
        url.search.includes('id_token=')
    );
}
// [/AI]

// [AI]
function isApiRequest(url) {
    // Helper function to check if hostname is allowed domain or subdomain
    function isAllowedDomain(hostname, allowedDomain) {
        return hostname === allowedDomain || hostname.endsWith('.' + allowedDomain);
    }

    return (
        url.pathname.startsWith('/api/') ||
        url.pathname.startsWith('/v1/') ||
        url.pathname.startsWith('/v2/') ||
        isAllowedDomain(url.hostname, 'deriv.com') ||
        isAllowedDomain(url.hostname, 'deriv.me') ||
        isAllowedDomain(url.hostname, 'binary.com') ||
        url.hostname.startsWith('api.') ||
        // WebSocket connections
        url.protocol === 'ws:' ||
        url.protocol === 'wss:' ||
        // Real-time data endpoints
        url.hostname.startsWith('ws.') ||
        url.hostname.includes('websocket') ||
        // Analytics and tracking (let them fail naturally rather than cache)
        url.hostname.includes('analytics') ||
        url.hostname.includes('tracking') ||
        url.hostname.includes('metrics')
    );
}
// [/AI]

// Handle messages from main thread
self.addEventListener('message', event => {
    const { type, data } = event.data || {};

    console.log('[SW] Received message:', type, data);

    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
        case 'GET_CACHE_STATUS':
            getCacheStatus().then(status => {
                event.ports[0]?.postMessage({ type: 'CACHE_STATUS', data: status });
            });
            break;
        case 'CLEAR_CACHE':
            clearCache().then(() => {
                event.ports[0]?.postMessage({ type: 'CACHE_CLEARED' });
            });
            break;
    }
});

// Get cache status
async function getCacheStatus() {
    try {
        const cache = await caches.open(CACHE_NAME);
        const keys = await cache.keys();
        return {
            cacheName: CACHE_NAME,
            cachedUrls: keys.map(request => request.url),
            cacheSize: keys.length,
        };
    } catch (error) {
        console.error('[SW] Failed to get cache status:', error);
        return { error: error.message };
    }
}

// Clear cache
async function clearCache() {
    try {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
        console.log('[SW] All caches cleared');
    } catch (error) {
        console.error('[SW] Failed to clear cache:', error);
    }
}

console.log('[SW] Service worker setup complete');
