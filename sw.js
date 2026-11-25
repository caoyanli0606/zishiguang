const CACHE = 'zishiguang-v56';
const GENERATED_AUDIO_CACHE = 'zishiguang-generated-audio-v1';
const GENERATED_AUDIO_PATH = new URL('./assets/generated-tts/', self.registration.scope).pathname;
const FILES = ['./', './index.html', './styles.css?v=56', './cloud-config.js?v=56', './app.js?v=56', './manifest.webmanifest', './assets/pug-runner.png', './assets/voice-pack/bingo-boy-c.mp3?v=53', './assets/voice-pack/known-boy-c.mp3?v=53', './assets/voice-pack/familiar-boy-c.mp3?v=53', './assets/voice-pack/again-boy-c.mp3?v=53', './assets/voice-pack/pair-complete.mp3', './assets/voice-pack/round-complete.mp3', './assets/voice-pack/listen-again.mp3', './assets/voice-pack/sentence-complete.mp3'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => /^zishiguang-v\d+$/.test(key) && key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

async function loadGeneratedAudio(request) {
  const cache = await caches.open(GENERATED_AUDIO_CACHE).catch(() => null);
  const cached = await cache?.match(request).catch(() => null);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.status === 200 && response.headers.get('Content-Type')?.startsWith('audio/')) {
    await cache?.put(request, response.clone()).catch(() => {});
  }
  return response;
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith(GENERATED_AUDIO_PATH)) {
    event.respondWith(loadGeneratedAudio(event.request));
    return;
  }

  const mustBeFresh = event.request.mode === 'navigate'
    || url.pathname.endsWith('/index.html')
    || url.pathname.endsWith('/styles.css')
    || url.pathname.endsWith('/app.js');
  if (mustBeFresh) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(event.request, copy));
          }
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
