# AI 漫畫生成工具 - 完整部署指南

## 專案概述

這是一個完整的 AI 漫畫生成工具，整合了：
- **故事解析**：使用 GPT-5.4 將故事拆分為漫畫分鏡
- **圖像生成**：使用 infip.pro API 生成漫畫風格圖像
- **前端介面**：React + Next.js + Tailwind CSS 的互動式 UI
- **部署平台**：Vercel（無需自管伺服器）

---

## 技術棧

```
前端框架：    Next.js 15 (App Router)
樣式：        Tailwind CSS
LLM：         GPT-5.4 (via ai.dooo.ng)
圖像生成：    infip.pro API (img4 模型)
部署：        Vercel
```

---

## 專案結構

```
comic-ai/
├── app/
│   ├── api/
│   │   ├── storyboard/route.ts      # LLM 分鏡生成 API
│   │   ├── generate/route.ts        # 圖像生成 API
│   │   └── health/route.ts          # 健康檢查端點
│   ├── page.tsx                     # 主頁面（故事輸入 + 結果展示）
│   ├── layout.tsx                   # 根版面
│   └── globals.css                  # 全域樣式
├── lib/
│   ├── llm.ts                       # OpenAI 客戶端（指向 ai.dooo.ng）
│   ├── storyboard.ts                # 故事解析邏輯
│   ├── infip.ts                     # 圖像生成 API 封裝
│   └── test-api.ts                  # API 測試工具
├── .env.local                       # 環境變數（本地開發）
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## 核心功能流程

### 1. 故事解析層 [`lib/storyboard.ts`](lib/storyboard.ts)

```typescript
// 輸入：故事文字
// 輸出：JSON 分鏡腳本
{
  "title": "末日廢墟中的同行者",
  "style": "manga",
  "panels": [
    {
      "panel": 1,
      "prompt": "英文圖像生成提示詞...",
      "dialogue": "繁體中文對話",
      "description": "場景描述",
      "camera_angle": "wide shot",
      "emotion": "lonely"
    },
    // ... 更多 panels
  ]
}
```

**API 端點**：`POST /api/storyboard`

### 2. 圖像生成層 [`lib/infip.ts`](lib/infip.ts)

使用 infip.pro 的 `img4` 模型生成漫畫風格圖像。

**API 端點**：`POST /api/generate`

### 3. 前端介面 [`app/page.tsx`](app/page.tsx)

- 故事輸入文本框
- 風格選擇（日漫、韓漫、美漫、Q版）
- Panel 數量選擇（2、4、6、8 格）
- 實時進度顯示
- 漫畫格框排列展示

---

## 環境變數設定

### 本地開發 (`.env.local`)

```
DOOO_API_KEY=sk-75fffbc4eadf6f7591c4bfefae884526ce8f6ff026813d7d0f7f81304c3f11ff
INFIP_API_KEY=infip-78da0595
```

### Vercel 部署

在 Vercel Dashboard → Settings → Environment Variables 中設定相同的變數。

---

## 本地開發

### 安裝依賴

```bash
cd comic-ai
npm install
```

### 啟動開發伺服器

```bash
npm run dev
```

訪問 `http://localhost:3000`

### 測試 API

```bash
# 測試分鏡生成
curl -X POST http://localhost:3000/api/storyboard \
  -H "Content-Type: application/json" \
  -d '{"story":"一個少女在廢墟城市中發現了一隻受傷的機器人","panelCount":4,"style":"manga"}'

# 測試健康檢查
curl http://localhost:3000/api/health
```

---

## 部署到 Vercel

### 步驟 1：推送到 GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/comic-ai.git
git push -u origin main
```

### 步驟 2：連接 Vercel

1. 訪問 [vercel.com](https://vercel.com)
2. 點擊「New Project」
3. 選擇 GitHub 倉庫
4. 設定環境變數（DOOO_API_KEY、INFIP_API_KEY）
5. 點擊「Deploy」

### 步驟 3：自訂域名（可選）

在 Vercel Dashboard 中設定自訂域名。

---

## API 響應範例

### 分鏡生成成功

```json
{
  "title": "末日廢墟中的同行者",
  "style": "manga",
  "panels": [
    {
      "panel": 1,
      "prompt": "A ruined post-apocalyptic city...",
      "dialogue": "你還好嗎？",
      "description": "少女在廢墟中...",
      "camera_angle": "wide shot",
      "emotion": "concerned"
    }
  ]
}
```

### 圖像生成成功

```json
{
  "panels": [
    {
      "imageUrl": "https://...",
      "dialogue": "你還好嗎？",
      "description": "少女在廢墟中..."
    }
  ]
}
```

---

## 成本估算（每月 100 個用戶）

| 項目 | 費用 |
|---|---|
| Vercel Pro | $20/月 |
| infip.pro 圖像生成（~500張） | ~$1–3/月 |
| GPT-5.4 API（分鏡生成） | ~$2–5/月 |
| **合計** | **~$25–30/月** |

---

## 故障排除

### 問題：API 金鑰無效

**解決**：檢查 `.env.local` 中的金鑰是否正確，確保沒有多餘空格。

### 問題：圖像生成超時

**解決**：infip.pro 通常需要 10–30 秒。如果超過 60 秒，檢查網路連線。

### 問題：分鏡 JSON 解析失敗

**解決**：確保 GPT-5.4 回傳有效的 JSON。檢查終端機日誌以查看完整回應。

---

## 下一步優化

1. **角色一致性**：使用 IP-Adapter 保持角色臉部一致
2. **PDF 輸出**：使用 `pdf-lib` 生成高解析度 PDF
3. **用戶帳號**：集成 NextAuth.js 進行用戶認證
4. **資料庫**：使用 Vercel Postgres 儲存用戶漫畫
5. **支付系統**：集成 Stripe 進行商業化

---

## 許可證

MIT

---

## 聯絡方式

如有問題，請提交 Issue 或 Pull Request。
