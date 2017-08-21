self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('molovo')
      .then(cache => {
        fetch('/index.json')
          .then(response => response.json())
          .then(response => {
            cache.addAll(response.map(item => item.url))
          })

        return cache.addAll([
          '/',
          '/css/main.css',
          '/js/main.min.js',
          '/index.json',
          '/writing/',
          '/projects/',
        ])
      })
  )
})

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.open('molovo')
      .then(cache => {
        return cache.match(e.request)
          .then(response =>  response || fetch(e.request).catch())
      })
  )
})