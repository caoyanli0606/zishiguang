const CACHE = 'zishiguang-v67';
const GENERATED_AUDIO_CACHE = 'zishiguang-generated-audio-v1';
const GENERATED_AUDIO_PATH = new URL('./assets/generated-tts/', self.registration.scope).pathname;
const REPOSITORY_AUDIO_URL = 'https://raw.githubusercontent.com/caoyanli0606/zishiguang/main/assets/generated-tts/';
const PUG_GREETING_FILE = './assets/voice-pack/pipi-welcome-boy-c.mp3';
const PUG_GREETING_URL = new URL(PUG_GREETING_FILE, self.registration.scope).href;
const REVIEW_SUMMARY_FILES = ['./assets/voice-pack/review-summary-boy-c-v1.mp3', './assets/voice-pack/review-summary-boy-c-v1.json'];
const FILES = ['./', './index.html', './styles.css?v=67', './cloud-config.js?v=67', './app.js?v=67', './manifest.webmanifest', './assets/pug-runner.png', './assets/pipi-volcano.webp', PUG_GREETING_FILE, './assets/voice-pack/bingo-boy-c.mp3?v=53', './assets/voice-pack/known-boy-c.mp3?v=53', './assets/voice-pack/familiar-boy-c.mp3?v=53', './assets/voice-pack/again-boy-c.mp3?v=53', './assets/voice-pack/pair-complete.mp3', './assets/voice-pack/round-complete.mp3', './assets/voice-pack/listen-again.mp3', './assets/voice-pack/sentence-complete.mp3', ...REVIEW_SUMMARY_FILES];

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
  let response = await fetch(request);
  if (response.status === 404) {
    const file = new URL(request.url).pathname.slice(GENERATED_AUDIO_PATH.length);
    if (/^[a-f0-9]{64}\.mp3$/.test(file)) {
      const published = await fetchRepositoryAudio(file).catch(() => null);
      if (published) response = published;
    }
  }
  if (response.status === 200 && response.headers.get('Content-Type')?.startsWith('audio/')) {
    await cache?.put(request, response.clone()).catch(() => {});
  }
  return response;
}

async function fetchRepositoryAudio(file) {
  const url = new URL(file, REPOSITORY_AUDIO_URL);
  url.searchParams.set('minute', String(Math.floor(Date.now() / 60000)));
  const response = await fetch(url, {
    credentials: 'omit',
    cache: 'no-store',
    signal: AbortSignal.timeout?.(5000),
  });
  if (!response.ok) return null;
  const audio = new Uint8Array(await response.arrayBuffer());
  const frame = audio[0] === 0xff && (audio[1] & 0xe0) === 0xe0;
  const tag = audio[0] === 0x49 && audio[1] === 0x44 && audio[2] === 0x33;
  if (audio.length < 1000 || !(frame || tag)) return null;
  return new Response(audio, { headers: { 'Content-Type': 'audio/mpeg' } });
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
