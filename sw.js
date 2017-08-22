---
---

const CACHE_NAME = 'molovo-{{ site.time | date_to_xml_schema }}'

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      fetch('/index.json')
        .then(response => response.ok && response.json())
        .then(response => {
          cache.addAll(response.map(item => item.url))
        })

      return cache.addAll([
        '/',
        '/offline.html',
        '/css/main.css',
        '/js/main.min.js',
        '/index.json',
        '/writing/',
        '/projects/',
      ])
    })
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => (cacheName !== CACHE_NAME))
          .map(cacheName => caches.delete(cacheName))
      )
    })
  )
})

self.addEventListener('fetch', event => {
  var requestURL = new URL(event.request.url)

  if (event.request.method !== 'GET') {
    event.respondWith(fetch(event.request))
    return
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(response => {
        // If there is a cached response return this otherwise grab from network
        return response || fetch(event.request).then(response => {
          // Check if the network request is successful
          // don't update the cache with error pages!!
          // Also check the request domain matches service worker domain
          if (response.ok && requestURL.origin == location.origin) {
            // All good? Update the cache with the network response
            cache.put(event.request, response.clone())
          }

          return response
        }).catch(() => caches.match('/offline.html'))
      })
    })
  )
})