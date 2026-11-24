import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { EdgeTTS } from 'npm:edge-tts-universal@1.4.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-family-id',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const encoder = new TextEncoder();

async function sha256(value: string) {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: corsHeaders });

  try {
    const expectedFamilyId = Deno.env.get('TTS_FAMILY_ID');
    if (!expectedFamilyId || request.headers.get('x-family-id') !== expectedFamilyId) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }

    const { text } = await request.json();
    const normalizedText = String(text || '').trim();
    if (!normalizedText || normalizedText.length > 300) {
      return new Response('Invalid text', { status: 400, headers: corsHeaders });
    }

    const cacheKey = `${await sha256(`edge-yunxia|-6Hz|10|${normalizedText}`)}.mp3`;
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const bucket = supabase.storage.from('tts-cache');
    const cached = await bucket.download(cacheKey);
    if (cached.data) {
      return new Response(cached.data, {
        headers: { ...corsHeaders, 'Content-Type': 'audio/mpeg', 'Cache-Control': 'public, max-age=31536000, immutable' },
      });
    }

    const tts = new EdgeTTS(normalizedText, 'zh-CN-YunxiaNeural', {
      pitch: '-6Hz',
      rate: '+10%',
      volume: '+0%',
    });
    const result = await tts.synthesize();
    const audio = new Uint8Array(await result.audio.arrayBuffer());
    const bucketInfo = await supabase.storage.getBucket('tts-cache');
    if (!bucketInfo.data) await supabase.storage.createBucket('tts-cache', { public: false, fileSizeLimit: 1048576 });
    await bucket.upload(cacheKey, audio, { contentType: 'audio/mpeg', cacheControl: '31536000', upsert: false });

    return new Response(audio, {
      headers: { ...corsHeaders, 'Content-Type': 'audio/mpeg', 'Cache-Control': 'public, max-age=31536000, immutable' },
    });
  } catch (error) {
    console.error(error);
    return new Response('Internal error', { status: 500, headers: corsHeaders });
  }
});
