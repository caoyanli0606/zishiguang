const CACHE = 'zishiguang-v54';
const FILES = ['./', './index.html', './styles.css?v=54', './cloud-config.js?v=54', './app.js?v=54', './manifest.webmanifest', './assets/pug-runner.png', './assets/voice-pack/bingo-boy-c.mp3?v=53', './assets/voice-pack/known-boy-c.mp3?v=53', './assets/voice-pack/familiar-boy-c.mp3?v=53', './assets/voice-pack/again-boy-c.mp3?v=53', './assets/voice-pack/pair-complete.mp3', './assets/voice-pack/round-complete.mp3', './assets/voice-pack/listen-again.mp3', './assets/voice-pack/sentence-complete.mp3'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  const mustBeFresh = event.request.mode === 'navigate'
    || url.pathname.endsWith('/index.html')
    || url.pathname.endsWith('/styles.css')
    || url.pathname.endsWith('/app.js');
  if (mustBeFresh) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match('./index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fresh = fetch(event.request).then((response) => {
        caches.open(CACHE).then((cache) => cache.put(event.request, response.clone()));
        return response;
      }).catch(() => cached);
      return cached || fresh;
    })
  );
});
