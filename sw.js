const CACHE = 'zishiguang-v58';
const GENERATED_AUDIO_CACHE = 'zishiguang-generated-audio-v1';
const GENERATED_AUDIO_PATH = new URL('./assets/generated-tts/', self.registration.scope).pathname;
const PUG_GREETING_FILE = './assets/voice-pack/pipi-welcome-boy-c.mp3';
const PUG_GREETING_URL = new URL(PUG_GREETING_FILE, self.registration.scope).href;
const FILES = ['./', './index.html', './styles.css?v=58', './cloud-config.js?v=58', './app.js?v=58', './manifest.webmanifest', './assets/pug-runner.png', PUG_GREETING_FILE, './assets/voice-pack/bingo-boy-c.mp3?v=53', './assets/voice-pack/known-boy-c.mp3?v=53', './assets/voice-pack/familiar-boy-c.mp3?v=53', './assets/voice-pack/again-boy-c.mp3?v=53', './assets/voice-pack/pair-complete.mp3', './assets/voice-pack/round-complete.mp3', './assets/voice-pack/listen-again.mp3', './assets/voice-pack/sentence-complete.mp3'];

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

async function loadPugGreeting(request) {
  const cached = await caches.match(request, { cacheName: CACHE });
  if (!cached) return fetch(request);
  const range = request.headers.get('Range');
  if (!range) return cached;
  const match = /^bytes=(\d*)-(\d*)$/.exec(range);
  if (!match || (!match[1] && !match[2])) return fetch(request);
  const audio = await cached.arrayBuffer();
  const lastByte = audio.byteLength - 1;
  const start = match[1] ? Number(match[1]) : Math.max(0, audio.byteLength - Number(match[2]));
  const end = match[1] && match[2] ? Math.min(lastByte, Number(match[2])) : lastByte;
  if (start > end) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${audio.byteLength}` } });
  return new Response(audio.slice(start, end + 1), {
    status: 206,
    headers: {
      'Content-Type': 'audio/mpeg',
      'Content-Length': String(end - start + 1),
      'Content-Range': `bytes ${start}-${end}/${audio.byteLength}`,
      'Accept-Ranges': 'bytes',
    },
  });
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (url.href === PUG_GREETING_URL) {
    event.respondWith(loadPugGreeting(event.request));
    return;
  }
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
