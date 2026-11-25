import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import edgeTtsPackage from 'node-edge-tts';

const { EdgeTTS } = edgeTtsPackage;
const SUPABASE_URL = 'https://qzddjudxsgmkssdayhlu.supabase.co';
const PUBLISHABLE_KEY = 'sb_publishable_3jp85sBXPl37Uze3zsrv2g_s6VgyqDI';
const FAMILY_ID = 'progress-4c817d69a1e84bd9b23ff670cf93d6ad';
const OUTPUT_DIR = path.resolve('assets/generated-tts');
const RESULT_FILE = path.resolve('generated-tts-results.json');
const BATCH_LIMIT = 64;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const headers = {
  apikey: PUBLISHABLE_KEY,
  'x-family-id': FAMILY_ID,
};

async function loadQueue() {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/tts_queue?status=eq.pending&select=id,text&order=created_at.asc,id.asc&limit=${BATCH_LIMIT}`, {
    headers,
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`读取语音队列失败：${response.status}`);
  return response.json();
}

function isRateLimit(error) {
  return /\b429\b/.test(String(error?.message));
}

async function generateAudio(item, target) {
  const partial = `${target}.partial`;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const tts = new EdgeTTS({
        voice: 'zh-CN-YunxiaNeural',
        lang: 'zh-CN',
        outputFormat: 'audio-24khz-48kbitrate-mono-mp3',
        pitch: '-6%',
        rate: '+10%',
        volume: '+0%',
        timeout: 30000,
      });
      await tts.ttsPromise(item.text, partial);
      const audio = await fs.readFile(partial);
      const frame = audio[0] === 0xff && (audio[1] & 0xe0) === 0xe0;
      const tag = audio.subarray(0, 3).toString() === 'ID3';
      if (audio.length < 1000 || !(frame || tag)) throw new Error('生成的文件不是有效的 MP3');
      await fs.rename(partial, target);
      return;
    } catch (error) {
      await fs.rm(partial, { force: true });
      if (attempt === 1) throw error;
      await wait(isRateLimit(error) ? 45000 : 5000);
    }
  }
}

await fs.mkdir(OUTPUT_DIR, { recursive: true });
const queue = await loadQueue();
const completed = [];
let failed = 0;
let rateLimited = false;
console.log(`Found ${queue.length} pending voice clips.`);

for (const item of queue) {
  if (!/^[a-f0-9]{64}$/.test(item.id) || typeof item.text !== 'string') continue;
  if (createHash('sha256').update(`yunxia-c|${item.text}`).digest('hex') !== item.id) {
    failed += 1;
    console.warn(`Skipped queue entry ${item.id}: audio key does not match.`);
    continue;
  }
  const target = path.join(OUTPUT_DIR, `${item.id}.mp3`);
  try {
    const existing = await fs.stat(target).catch(() => null);
    if (!existing || existing.size < 1000) {
      await generateAudio(item, target);
      await wait(5000);
    }
    completed.push(item.id);
    console.log(`Ready: ${item.id}`);
  } catch (error) {
    failed += 1;
    if (isRateLimit(error)) {
      rateLimited = true;
      console.warn('Voice provider is rate-limiting requests. Remaining clips stay pending for a later run.');
      break;
    }
    console.warn(`Generation failed for ${item.id}. This clip stays pending.`);
  }
}

await fs.writeFile(RESULT_FILE, JSON.stringify(completed));
console.log(`Ready: ${completed.length}/${queue.length}; failed: ${failed}${rateLimited ? '; rate limited' : ''}.`);
