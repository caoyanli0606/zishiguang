import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-family-id',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const encoder = new TextEncoder();

function xmlEscape(value: string) {
  return value.replace(/[<>&'\"]/g, (char) => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;',
  }[char] || char));
}

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

    const region = Deno.env.get('AZURE_SPEECH_REGION');
    const speechKey = Deno.env.get('AZURE_SPEECH_KEY');
    if (!region || !speechKey) return new Response('Speech service is not configured', { status: 503, headers: corsHeaders });

    const cacheKey = `${await sha256(`yunxia|-6|10|${normalizedText}`)}.mp3`;
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

    const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="zh-CN"><voice name="zh-CN-YunxiaNeural"><prosody pitch="-6%" rate="+10%">${xmlEscape(normalizedText)}</prosody></voice></speak>`;
    const speechResponse = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': speechKey,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
        'User-Agent': 'zishiguang',
      },
      body: ssml,
    });
    if (!speechResponse.ok) {
      const detail = await speechResponse.text();
      console.error('Azure Speech error', speechResponse.status, detail);
      return new Response('Speech synthesis failed', { status: 502, headers: corsHeaders });
    }

    const audio = new Uint8Array(await speechResponse.arrayBuffer());
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
