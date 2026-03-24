# Learn Vocabulary

一個基於 Vue 3 + Vuetify 的單字學習應用程式，支援測驗模式和進度追蹤。

---

## 🚀 功能特色

- 📚 **單字卡片管理** - 新增、編輯、刪除單字卡片
- 🎯 **測驗模式** - 隨機抽題進行單字測驗
- 📊 **進度追蹤** - 統計學習進度和正確率
- 🔄 **資料匯入** - 支援從 JSON 種子資料匯入單字
- 💾 **本地儲存** - 使用 LocalStorage 儲存學習進度
- 📱 **響應式設計** - 支援桌面和行動裝置

---

## 🛠️ 技術棧

- **前端框架**: Vue 3 (Composition API)
- **UI 元件庫**: Vuetify 4
- **狀態管理**: Pinia
- **路由**: Vue Router 5
- **建構工具**: Vite 8
- **開發語言**: TypeScript

---

## 📦 安裝與執行

```bash
# 安裝依賴
npm install

# 開發模式
npm run dev

# 建構生產版本
npm run build

# 預覽生產版本
npm run preview
```

---

## 📁 專案結構

```
learn-vocabulary/
├── src/
│   ├── components/          # Vue 元件
│   │   ├── AddVocabDialog.vue   # 新增單字對話框
│   │   ├── QuizMode.vue         # 測驗模式
│   │   ├── StatsPanel.vue       # 統計面板
│   │   ├── VocabCard.vue        # 單字卡片
│   │   ├── VocabList.vue        # 單字列表
│   │   └── SeedDataLoader.vue   # 種子資料載入器
│   ├── composables/         # Composable 函數
│   │   └── useSeedData.ts       # 種子資料處理
│   ├── services/            # 服務層
│   │   └── seedDataGenerator.ts # 種子資料生成器
│   ├── stores/              # Pinia Stores
│   │   └── vocabStore.ts        # 單字狀態管理
│   ├── types/               # TypeScript 型別定義
│   │   └── index.ts             # 單字相關型別
│   ├── App.vue              # 根元件
│   └── main.ts              # 程式進入點
├── dist/                    # 建構輸出
├── docs/                    # 文件
├── index.html               # HTML 模板
├── package.json             # 專案設定
├── tsconfig.json            # TypeScript 設定
└── vite.config.ts           # Vite 設定
```

---

## 🎮 使用方式

### 1. 新增單字
點擊「新增單字」按鈕，輸入單字、詞性、定義和例句。

### 2. 測驗模式
點擊「開始測驗」進入測驗模式，系統會隨機抽取單字進行測驗。

### 3. 匯入種子資料
點擊「載入種子資料」可從 JSON 檔案批量匯入單字。

### 4. 查看統計
統計面板會顯示總單字數、已掌握單字數和整體正確率。

---

## 📝 資料格式

### 單字卡片格式

```typescript
interface Vocab {
  id: string;           // 唯一識別碼
  word: string;         // 單字
  partOfSpeech: string; // 詞性 (n., v., adj., adv.)
  definition: string;     // 定義
  example: string;        // 例句
}
```

### 種子資料格式

```json
{
  "words": [
    {
      "word": "example",
      "partOfSpeech": "n.",
      "definition": "範例",
      "example": "This is an example."
    }
  ]
}
```

---

## 🔧 開發說明

### 資料儲存

- 單字資料儲存在 LocalStorage 的 `vocab-data` 鍵中
- 種子資料為靜態 JSON 檔案，放置於 `src/data/` 目錄

### 狀態管理

使用 Pinia 管理單字狀態，包含：
- `vocabList`: 單字列表
- `loading`: 載入狀態
- `addVocab()`: 新增單字
- `removeVocab()`: 刪除單字
- `loadSeedData()`: 載入種子資料

---

## 📄 授權

MIT License

---

*最後更新: 2026-03-24*
