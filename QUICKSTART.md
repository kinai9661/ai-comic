# 快速開始指南

## 5 分鐘快速上手

### 1. 本地運行

```bash
cd comic-ai
npm install
npm run dev
```

訪問 `http://localhost:3000`

### 2. 輸入故事

在文本框中輸入任何故事，例如：
```
一個少女在廢墟城市中發現了一隻受傷的機器人，兩人相互扶持，共同面對末日的危機。
```

### 3. 選擇設定

- **漫畫風格**：日漫、韓漫、美漫、Q版
- **Panel 數量**：2、4、6、8 格

### 4. 點擊生成

點擊「✨ 生成漫畫」按鈕，等待 60–120 秒。

### 5. 查看結果

系統會顯示：
- 漫畫標題
- 4 個 panel 的圖像
- 每個 panel 的對話和場景描述

---

## 部署到 Vercel（3 步）

### 步驟 1：推送到 GitHub

```bash
git init
git add .
git commit -m "AI Comic Generator"
git push origin main
```

### 步驟 2：連接 Vercel

1. 訪問 [vercel.com](https://vercel.com)
2. 點擊「Import Project」
3. 選擇 GitHub 倉庫
4. 設定環境變數：
   - `DOOO_API_KEY`
   - `INFIP_API_KEY`
5. 點擊「Deploy」

### 步驟 3：完成

Vercel 會自動部署，你的應用將在 `https://your-project.vercel.app` 上線。

---

## 環境變數

### 本地開發 (`.env.local`)

```
DOOO_API_KEY=sk-75fffbc4eadf6f7591c4bfefae884526ce8f6ff026813d7d0f7f81304c3f11ff
INFIP_API_KEY=infip-78da0595
```

### Vercel 部署

在 Vercel Dashboard 中設定相同的環境變數。

---

## 常見問題

**Q: 為什麼生成這麼慢？**
A: GPT-5.4 需要 30–40 秒生成分鏡，infip.pro 需要 10–30 秒生成圖像。總共 60–120 秒是正常的。

**Q: 可以改變漫畫風格嗎？**
A: 可以。在前端選擇不同的風格（日漫、韓漫、美漫、Q版），系統會自動調整 prompt。

**Q: 支援多少個 panel？**
A: 目前支援 2、4、6、8 格。可以在 `app/page.tsx` 中修改 `PANEL_COUNTS` 陣列。

**Q: 可以輸出 PDF 嗎？**
A: 目前只支援 PNG 圖像。可以使用瀏覽器的「列印為 PDF」功能。

---

## 技術細節

### API 端點

| 端點 | 方法 | 功能 |
|---|---|---|
| `/api/storyboard` | POST | 生成分鏡腳本 |
| `/api/generate` | POST | 生成漫畫圖像 |
| `/api/health` | GET | 健康檢查 |

### 請求格式

```bash
POST /api/storyboard
Content-Type: application/json

{
  "story": "故事文字",
  "panelCount": 4,
  "style": "manga"
}
```

### 回應格式

```json
{
  "title": "漫畫標題",
  "style": "manga",
  "panels": [
    {
      "panel": 1,
      "prompt": "英文圖像提示詞",
      "dialogue": "對話",
      "description": "場景描述",
      "camera_angle": "視角",
      "emotion": "情緒"
    }
  ]
}
```

---

## 成本

- **Vercel Pro**：$20/月
- **API 調用**：~$5–10/月（取決於使用量）
- **總計**：~$25–30/月

---

## 下一步

1. 自訂漫畫風格和 prompt 模板
2. 添加用戶認證和歷史記錄
3. 集成支付系統進行商業化
4. 優化圖像生成速度
5. 添加 PDF 輸出功能

---

祝你使用愉快！🎌
