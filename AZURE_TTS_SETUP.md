# 字时光动态男孩语音配置

语音参数：`zh-CN-YunxiaNeural`，音调 `-6Hz`，语速 `+10%`（C 版）。

不需要 Azure 账号或密钥。只需在 Supabase Edge Function 中设置以下 Secret：

- `TTS_FAMILY_ID`：`progress-4c817d69a1e84bd9b23ff670cf93d6ad`

部署函数：

```powershell
npx supabase login
npx supabase functions deploy tts --project-ref qzddjudxsgmkssdayhlu --no-verify-jwt
```

函数通过 Edge 在线神经语音生成音频，并缓存在私有的 `tts-cache` Storage bucket 中，相同文本只生成一次。
