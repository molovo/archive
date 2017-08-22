---
---

// Cache name is updated each time the site is compiled
const CACHE_NAME = 'molovo-{{ site.time | date: '%Y%m%d%H%M%S' }}'

// Listen for an installation request
self.addEventListener('install', event => {
  event.waitUntil(
    // Open the current cache
    caches.open(CACHE_NAME).then(cache => {
      // Fetch the JSON article index
      fetch('/index.json')
        .then(response => response.ok && response.json())
        .then(response => {
          // Cache all URLs in the index
          cache.addAll(response.map(item => item.url))

          // Calculate the number of pages
          let pages = Math.floor(response.length / 5) + 1
          for (var i = 2; i <= pages; i++) {
            // Cache the index page
            cache.add('/writing/' + i + '/')
          }
        })

      // Cache important pages and assets
      return cache.addAll([
        // Important pages
        '/',
        '/writing/',
        '/projects/',
        '/search/',

        // Error pages
        '/offline.html',
        '/404.html',
        '/500.html',

        // Static assets
        '/css/main.css',
        '/js/main.min.js',

        // The article index
        '/index.json',
      ])
    })
  )
})

// Listen for an activation request
self.addEventListener('activate', event => {
  event.waitUntil(
    // Capture the keys of all caches
    caches.keys().then(cacheNames => {
      return Promise.all(
        // Delete any out-of-date caches
        cacheNames.filter(cacheName => (cacheName !== CACHE_NAME))
          .map(cacheName => caches.delete(cacheName))
      )
    })
  )
})

// Listen for network requests
self.addEventListener('fetch', event => {
  // Capture the request URL
  var requestURL = new URL(event.request.url)

  // For all request methods other than GET,
  // pass the original request straight back
  if (event.request.method !== 'GET') {
    event.respondWith(fetch(event.request))
    return
  }

  event.respondWith(
    // Attempt to fetch the original request
    fetch(event.request).then(response => {
      // Clone the response so we have a cacheable copy
      // before we use it
      const cacheable = response.clone()

      // Check if the network request is successful so we
      // don't update the cache with error pages
      if (response.ok && requestURL.origin == location.origin) {
        // If request domain matches service worker domain,
        // refresh the cached version
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, cacheable)
        })
      }

      // All other successful requests
      if (response.ok || response.redirected || response.type === 'opaqueredirect') {
        // Return the original response
        return response
      }

      // Handle errors for pages on the service worker domain
      if (requestURL.origin == location.origin) {
        return caches.open(CACHE_NAME).then(cache => {
          // If the page was not found, return the 404 page
          if (response.status == 404) {
            return fetch('/404.html').then(response => {
              return new Response(response.body, {
                status: 404
              })
            })
          }

          // Return a generic error page
          return fetch('/500.html').then(response => {
            return new Response(response.body, {
              status: 500
            })
          })
        })
      }

      // Return the original response
      return response
    }).catch(err => {
      // First, check the service worker cache
      return caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(response => {
          // Return the response if found,
          // or return the cached offline page
          return response || (() => {
            if (requestURL.origin == location.origin) {
              return cache.match('/offline.html')
            }

            return new Response(cache.match('/500.html').body, {
              status: 500
            })
          })()
        })
      })
    })
  )
})