import fs from 'node:fs/promises';

const SUPABASE_URL = 'https://qzddjudxsgmkssdayhlu.supabase.co';
const PUBLISHABLE_KEY = 'sb_publishable_3jp85sBXPl37Uze3zsrv2g_s6VgyqDI';
const FAMILY_ID = 'progress-4c817d69a1e84bd9b23ff670cf93d6ad';
const ids = JSON.parse(await fs.readFile('generated-tts-results.json', 'utf8')).filter((id) => /^[a-f0-9]{64}$/.test(id));

if (ids.length) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/tts_queue?id=in.(${ids.join(',')})&status=eq.pending&select=id`, {
    method: 'PATCH',
    headers: {
      apikey: PUBLISHABLE_KEY,
      'x-family-id': FAMILY_ID,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({ status: 'generated', generated_at: new Date().toISOString() }),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`更新队列失败：${response.status}`);
  const updated = await response.json();
  console.log(`Marked ${updated.length} voice clips as generated.`);
}
