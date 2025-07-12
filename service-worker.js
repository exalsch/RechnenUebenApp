const STATIC_CACHE_NAME = 'rechnen-ueben-app-static-cache-v1';
const DYNAMIC_CACHE_NAME = 'rechnen-ueben-app-dynamic-cache-v1';

// Alle statischen Assets, die zum App-Grundgerüst gehören
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/sounds/correct.mp3',
  '/sounds/correct_pups.mp3',
  '/sounds/wrong.mp3',
  '/img/end_1.gif',
  '/img/end_2.gif',
  '/img/end_3.gif',
  '/img/end_4.gif',
  '/img/end_5.gif',
  '/img/end_6.gif'
  // HINWEIS: App-Icons aus der manifest.json sind nicht enthalten,
  // da sie noch nicht existieren. Füge sie hier hinzu, sobald sie erstellt sind.
  // '/img/icon-192x192.png',
  // '/img/icon-512x512.png'
];

// Service Worker installieren und statische Assets zwischenspeichern
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('Opened static cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Alte Caches bei Aktivierung bereinigen
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          // Lösche alle Caches, die mit dem App-Namen beginnen, aber nicht die aktuellen sind
          return cacheName.startsWith('rechnen-ueben-app-') &&
                 cacheName !== STATIC_CACHE_NAME &&
                 cacheName !== DYNAMIC_CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// Anfragen abfangen: Zuerst aus dem Cache bedienen, dann vom Netzwerk holen und zwischenspeichern
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache-Treffer - Antwort aus dem Cache zurückgeben
        if (response) {
          return response;
        }

        // Nicht im Cache - vom Netzwerk holen
        return fetch(event.request).then(
          networkResponse => {
            // Prüfen, ob wir eine gültige Antwort erhalten haben
            if(!networkResponse || networkResponse.status !== 200 || (networkResponse.type !== 'basic' && networkResponse.type !== 'cors')) {
              return networkResponse;
            }

            // WICHTIG: Die Antwort klonen. Eine Antwort ist ein Stream.
            // Da wir möchten, dass sowohl der Browser als auch der Cache die Antwort konsumieren,
            // müssen wir sie klonen, damit wir zwei Streams haben.
            const responseToCache = networkResponse.clone();

            // Die neue Antwort für die zukünftige Verwendung zwischenspeichern
            caches.open(DYNAMIC_CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        );
      })
  );
});
