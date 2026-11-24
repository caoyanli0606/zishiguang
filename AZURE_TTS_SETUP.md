# 字时光动态男孩语音配置

语音参数：`zh-CN-YunxiaNeural`，音调 `-6%`，语速 `+10%`（C 版）。

需要在 Supabase Edge Function 中设置以下 Secrets：

- `AZURE_SPEECH_KEY`：Azure Speech 资源密钥
- `AZURE_SPEECH_REGION`：Azure Speech 资源区域，例如 `eastasia`
- `TTS_FAMILY_ID`：`progress-4c817d69a1e84bd9b23ff670cf93d6ad`

部署函数：

```powershell
npx supabase login
npx supabase functions deploy tts --project-ref qzddjudxsgmkssdayhlu --no-verify-jwt
```

函数会把合成结果缓存在私有的 `tts-cache` Storage bucket 中，相同文本只调用 Azure 一次。
