# 故障排除指南

## 常見問題和解決方案

### 1. ❌ 分鏡生成失敗

**症狀**：API 呼叫返回錯誤

**可能原因**：
- API 金鑰無效或過期
- 網路連線問題
- API 配額已用完
- 模型名稱錯誤

**解決步驟**：

1. **檢查環境變數**
```bash
# 確保 .env.local 中有正確的金鑰
cat .env.local
```

2. **驗證 API 金鑰**
```bash
# 測試 API 連線
curl -X POST https://ai.dooo.ng/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.4",
    "messages": [{"role": "user", "content": "test"}]
  }'
```

3. **檢查終端機日誌**
```
Starting storyboard generation...
API Key present: true/false
API response received
```

4. **重啟開發伺服器**
```bash
npm run dev
```

---

### 2. ❌ 圖像生成失敗

**症狀**：infip.pro API 返回錯誤

**可能原因**：
- INFIP_API_KEY 無效
- 圖像 prompt 過長或包含不允許的內容
- API 配額已用完

**解決步驟**：

1. **驗證 INFIP_API_KEY**
```bash
# 測試 infip.pro API
curl -X POST https://api.infip.pro/v1/images/generations \
  -H "Authorization: Bearer YOUR_INFIP_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "img4",
    "prompt": "a beautiful landscape",
    "n": 1,
    "size": "1024x1024"
  }'
```

2. **檢查 prompt 長度**
- 確保 prompt 不超過 1000 字符
- 避免使用特殊字符

3. **檢查配額**
- 訪問 infip.pro 儀表板查看使用量

---

### 3. ❌ JSON 解析錯誤

**症狀**：`JSON.parse()` 失敗

**可能原因**：
- API 返回的不是有效 JSON
- 回應被截斷
- 編碼問題

**解決步驟**：

1. **檢查 API 回應**
```typescript
// 在 lib/storyboard.ts 中添加日誌
console.log("Raw response:", completion.choices[0].message.content);
```

2. **驗證 JSON 格式**
```bash
# 使用 jq 驗證 JSON
echo '{"test": "value"}' | jq .
```

3. **增加 max_tokens**
```typescript
// 在 API 呼叫中增加 max_tokens
max_tokens: 8000  // 從 4096 增加到 8000
```

---

### 4. ❌ 超時錯誤

**症狀**：`504 Gateway Timeout` 或 `408 Request Timeout`

**可能原因**：
- API 響應時間過長
- Vercel 免費方案超時限制（10 秒）
- 網路延遲

**解決步驟**：

1. **本地開發**
```bash
# 本地開發沒有超時限制
npm run dev
```

2. **Vercel 部署**
```typescript
// 在 route.ts 中設定超時
export const maxDuration = 60;  // Pro 方案支援 60 秒
```

3. **升級 Vercel 方案**
- 免費方案：10 秒超時
- Pro 方案：60 秒超時

---

### 5. ❌ 環境變數未加載

**症狀**：`process.env.DOOO_API_KEY` 為 undefined

**可能原因**：
- `.env.local` 文件不存在
- 環境變數名稱錯誤
- 開發伺服器未重啟

**解決步驟**：

1. **建立 `.env.local`**
```bash
cat > .env.local << EOF
DOOO_API_KEY=sk-your-key-here
INFIP_API_KEY=infip-your-key-here
EOF
```

2. **驗證文件存在**
```bash
ls -la .env.local
```

3. **重啟開發伺服器**
```bash
npm run dev
```

---

### 6. ❌ 模組導入錯誤

**症狀**：`Cannot find module` 或 `Module not found`

**可能原因**：
- 文件路徑錯誤
- 文件未建立
- TypeScript 編譯錯誤

**解決步驟**：

1. **檢查文件路徑**
```bash
# 確保所有文件都存在
ls -la lib/
ls -la app/api/
```

2. **重新安裝依賴**
```bash
rm -rf node_modules package-lock.json
npm install
```

3. **清除 Next.js 快取**
```bash
rm -rf .next
npm run dev
```

---

### 7. ❌ TypeScript 編譯錯誤

**症狀**：`Type 'X' is not assignable to type 'Y'`

**可能原因**：
- 類型定義不匹配
- 缺少類型導入

**解決步驟**：

1. **檢查類型導入**
```typescript
// 確保導入了正確的類型
import type { Character } from "@/lib/character";
```

2. **驗證類型定義**
```bash
# 檢查 TypeScript 錯誤
npx tsc --noEmit
```

3. **更新類型**
```typescript
// 使用 as any 作為臨時解決方案
const result = JSON.parse(content) as any;
```

---

## 調試技巧

### 1. 啟用詳細日誌
```typescript
// 在 lib/storyboard.ts 中
console.log("Debug info:", {
  apiKey: !!process.env.DOOO_API_KEY,
  model: "gpt-5.4",
  timestamp: new Date().toISOString()
});
```

### 2. 使用 Postman 測試 API
```
POST http://localhost:3000/api/storyboard
Content-Type: application/json

{
  "story": "測試故事",
  "panelCount": 4,
  "style": "manga"
}
```

### 3. 檢查瀏覽器開發者工具
- 打開 DevTools（F12）
- 查看 Network 標籤
- 檢查 API 請求和回應

### 4. 查看終端機日誌
```bash
# 開發伺服器會輸出詳細日誌
npm run dev
```

---

## 性能優化

### 1. 減少 API 呼叫
```typescript
// 快取結果
const cache = new Map();
if (cache.has(key)) {
  return cache.get(key);
}
```

### 2. 並行處理
```typescript
// 使用 Promise.all 並行生成圖像
const results = await Promise.all(
  panels.map(panel => generateImage(panel))
);
```

### 3. 增加超時時間
```typescript
// 在 route.ts 中
export const maxDuration = 60;
```

---

## 聯絡支援

如果問題仍未解決：

1. **檢查 GitHub Issues**
   - https://github.com/kinai9661/ai-comic/issues

2. **查看 API 文檔**
   - ai.dooo.ng：https://ai.dooo.ng/docs
   - infip.pro：https://api.infip.pro/docs

3. **提交 Bug 報告**
   - 包含錯誤信息
   - 包含環境信息（OS、Node 版本）
   - 包含重現步驟

---

## 常用命令

```bash
# 開發
npm run dev

# 構建
npm run build

# 生產運行
npm start

# 清除快取
rm -rf .next node_modules

# 重新安裝
npm install

# 檢查類型
npx tsc --noEmit

# 查看日誌
npm run dev 2>&1 | tee debug.log
```

---

祝你調試順利！🎌
