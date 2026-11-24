import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { EdgeTTS } from 'npm:edge-tts-universal@1.4.0';

const FAMILY_ID = 'progress-4c817d69a1e84bd9b23ff670cf93d6ad';
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-family-id',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  if (request.headers.get('x-family-id') !== FAMILY_ID) {
    return new Response('Unauthorized', { status: 401, headers: corsHeaders });
  }

  try {
    const { text } = await request.json();
    const value = String(text || '').trim();
    if (!value || value.length > 300) {
      return new Response('Invalid text', { status: 400, headers: corsHeaders });
    }

    const tts = new EdgeTTS(value, 'zh-CN-YunxiaNeural', {
      pitch: '-6Hz',
      rate: '+10%',
      volume: '+0%',
    });
    const result = await tts.synthesize();
    const audio = await result.audio.arrayBuffer();

    return new Response(audio, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error(error);
    return new Response('Speech synthesis failed', { status: 502, headers: corsHeaders });
  }
});
