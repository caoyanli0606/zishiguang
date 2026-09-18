# 开启家庭云同步

只需要配置一次。配置完成并重新发布后，所有家庭成员都可以直接在应用中使用相同口令连接。

## 1. 创建免费数据库

1. 打开 https://supabase.com 并注册。
2. 创建一个新项目，等待项目初始化完成。
3. 打开项目的 **SQL Editor**。
4. 新建查询，复制 `supabase-setup.sql` 的全部内容并运行。

## 2. 填写网页连接信息

1. 在 Supabase 项目中打开 **Settings → API**。
2. 复制 **Project URL**。
3. 复制 **Publishable key**；旧版界面中可能显示为 `anon public` key。
4. 打开 `cloud-config.js`，填写：

```js
window.CLOUD_CONFIG = {
  url: '你的 Project URL',
  publishableKey: '你的 Publishable key'
};
```

不要填写 `secret` 或 `service_role` key。

## 3. 更新 GitHub Pages

把新增或修改的文件重新上传到 GitHub 仓库：

- `index.html`
- `styles.css`
- `app.js`
- `sw.js`
- `cloud-config.js`

等待 GitHub Pages 发布完成。已经添加到 iPhone 主屏幕的应用会自动更新；如未更新，可在 Safari 中重新打开网站一次。

## 4. 连接家庭

1. 点击首页右上角的“未连接”。
2. 输入至少 8 位的家庭口令，建议混合字母和数字。
3. 其他设备输入完全相同的口令，即可共享数据。

家庭口令没有找回功能，请由家人妥善保存。使用不同口令会创建不同的家庭字库。
