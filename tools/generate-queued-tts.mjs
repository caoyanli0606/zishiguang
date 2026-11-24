import fs from 'node:fs/promises';
import path from 'node:path';
import edgeTtsPackage from 'node-edge-tts';

const { EdgeTTS } = edgeTtsPackage;
const SUPABASE_URL = 'https://qzddjudxsgmkssdayhlu.supabase.co';
const PUBLISHABLE_KEY = 'sb_publishable_3jp85sBXPl37Uze3zsrv2g_s6VgyqDI';
const FAMILY_ID = 'progress-4c817d69a1e84bd9b23ff670cf93d6ad';
const OUTPUT_DIR = path.resolve('assets/generated-tts');
const RESULT_FILE = path.resolve('generated-tts-results.json');
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const headers = {
  apikey: PUBLISHABLE_KEY,
  Authorization: `Bearer ${PUBLISHABLE_KEY}`,
  'x-family-id': FAMILY_ID,
};

async function loadQueue() {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/tts_queue?status=eq.pending&select=id,text&order=created_at.asc&limit=8`, { headers });
  if (!response.ok) throw new Error(`读取语音队列失败：${response.status} ${await response.text()}`);
  return response.json();
}

async function generateAudio(item, target) {
  for (let attempt = 1; attempt <= 4; attempt += 1) {
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
      await tts.ttsPromise(item.text, target);
      const stat = await fs.stat(target);
      if (stat.size < 1000) throw new Error('生成的音频文件为空');
      return;
    } catch (error) {
      await fs.rm(target, { force: true });
      if (attempt === 4) throw error;
      await wait(attempt * 12000);
    }
  }
}

await fs.mkdir(OUTPUT_DIR, { recursive: true });
const queue = await loadQueue();
const completed = [];

for (const item of queue) {
  if (!/^[a-f0-9]{64}$/.test(item.id) || typeof item.text !== 'string') continue;
  const target = path.join(OUTPUT_DIR, `${item.id}.mp3`);
  try {
    const existing = await fs.stat(target).catch(() => null);
    if (!existing || existing.size < 1000) await generateAudio(item, target);
    completed.push(item.id);
    process.stdout.write(`generated ${item.id} ${item.text}\n`);
  } catch (error) {
    console.error(`failed ${item.id}`, error);
  }
  await wait(8000);
}

await fs.writeFile(RESULT_FILE, JSON.stringify(completed));
process.stdout.write(`completed ${completed.length} item(s)\n`);
