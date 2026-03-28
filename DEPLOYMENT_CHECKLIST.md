# 部署檢查清單

## 本地開發檢查

- [x] Next.js 專案已建立
- [x] 依賴套件已安裝（openai）
- [x] `.env.local` 已配置
- [x] LLM 客戶端已實現 (`lib/llm.ts`)
- [x] 故事解析邏輯已實現 (`lib/storyboard.ts`)
- [x] 圖像生成 API 已實現 (`lib/infip.ts`)
- [x] API 路由已建立
  - [x] `/api/storyboard` — 分鏡生成
  - [x] `/api/generate` — 圖像生成
  - [x] `/api/health` — 健康檢查
- [x] 前端 UI 已完成 (`app/page.tsx`)
- [x] 本地測試成功（`npm run dev`）

## 部署前檢查

### 代碼質量

- [ ] 移除所有 `console.log` 調試語句
- [ ] 檢查 TypeScript 類型錯誤
- [ ] 運行 `npm run build` 確保無編譯錯誤
- [ ] 檢查環境變數是否正確設定

### 安全性

- [ ] API 金鑰不在代碼中硬寫
- [ ] `.env.local` 已添加到 `.gitignore`
- [ ] 敏感信息已從 Git 歷史中移除
- [ ] CORS 設定正確（如需要）

### 性能

- [ ] 圖像已優化（使用 Next.js Image 組件）
- [ ] API 響應時間在可接受範圍內（< 120 秒）
- [ ] 前端加載時間 < 3 秒

### 功能測試

- [ ] 故事輸入功能正常
- [ ] 風格選擇功能正常
- [ ] Panel 數量選擇功能正常
- [ ] 分鏡生成成功
- [ ] 圖像生成成功
- [ ] 錯誤處理正確（顯示用戶友好的錯誤信息）

## Vercel 部署步驟

### 步驟 1：準備 GitHub 倉庫

```bash
# 初始化 Git
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: AI Comic Generator"

# 添加遠程倉庫
git remote add origin https://github.com/YOUR_USERNAME/comic-ai.git

# 推送到 GitHub
git push -u origin main
```

### 步驟 2：連接 Vercel

1. 訪問 [vercel.com](https://vercel.com)
2. 使用 GitHub 帳號登錄
3. 點擊「Add New...」→「Project」
4. 選擇 `comic-ai` 倉庫
5. 點擊「Import」

### 步驟 3：配置環境變數

在 Vercel 部署頁面中：

1. 找到「Environment Variables」部分
2. 添加以下變數：
   - **名稱**：`DOOO_API_KEY`
   - **值**：`sk-75fffbc4eadf6f7591c4bfefae884526ce8f6ff026813d7d0f7f81304c3f11ff`
   - **名稱**：`INFIP_API_KEY`
   - **值**：`infip-78da0595`

3. 點擊「Deploy」

### 步驟 4：驗證部署

- [ ] 部署完成（Vercel 顯示「Ready」）
- [ ] 訪問 `https://your-project.vercel.app`
- [ ] 測試故事生成功能
- [ ] 檢查 Vercel 日誌中是否有錯誤

## 部署後檢查

### 功能驗證

- [ ] 主頁面加載正常
- [ ] 故事輸入功能正常
- [ ] 分鏡生成成功
- [ ] 圖像生成成功
- [ ] 錯誤處理正確

### 性能監控

- [ ] 使用 Vercel Analytics 監控性能
- [ ] 檢查 API 響應時間
- [ ] 監控錯誤率

### 日誌檢查

- [ ] 在 Vercel Dashboard 中檢查日誌
- [ ] 確保沒有未捕獲的異常
- [ ] 確保 API 調用成功

## 常見部署問題

### 問題：環境變數未加載

**解決**：
1. 確保在 Vercel Dashboard 中設定了環境變數
2. 重新部署（點擊「Redeploy」）
3. 檢查 `.env.local` 是否在 `.gitignore` 中

### 問題：API 超時

**解決**：
1. 檢查 Vercel Pro 方案是否啟用（支援 60 秒超時）
2. 檢查 API 金鑰是否有效
3. 檢查網路連線

### 問題：圖像無法加載

**解決**：
1. 檢查 infip.pro API 金鑰
2. 檢查 CORS 設定
3. 在瀏覽器開發者工具中查看網路請求

## 優化建議

### 短期（1–2 週）

- [ ] 添加加載動畫
- [ ] 改進錯誤信息
- [ ] 添加使用統計
- [ ] 優化移動端顯示

### 中期（1–2 個月）

- [ ] 添加用戶認證
- [ ] 實現漫畫歷史記錄
- [ ] 添加分享功能
- [ ] 集成支付系統

### 長期（3–6 個月）

- [ ] 實現角色一致性（IP-Adapter）
- [ ] 添加 PDF 輸出
- [ ] 支援多語言
- [ ] 實現高級編輯功能

## 監控和維護

### 定期檢查

- [ ] 每週檢查 Vercel 日誌
- [ ] 每月檢查 API 使用量
- [ ] 每月檢查成本

### 更新計劃

- [ ] 定期更新依賴套件
- [ ] 監控 Next.js 新版本
- [ ] 監控 API 提供商的變更

## 聯絡方式

- **問題報告**：GitHub Issues
- **功能請求**：GitHub Discussions
- **緊急支援**：[your-email@example.com]

---

**部署日期**：_______________

**部署人員**：_______________

**驗證人員**：_______________

**備註**：
