# Phase 5 完成說明（逐檔詳解）

> 對象：只有前端經驗的你。
> 主題：**部署上線** —— 把 SSR 後台網站部署到 Render，設定環境變數、自動化 migration、接網域。
> 搭配閱讀：`docs/render-deploy-guide.md`（手把手操作）、`docs/admin-backend-notes.md` 第 3.9 節。
> 完成日期：2026-06-03

---

## 1. Phase 5 做了什麼（一句話）

把專案準備成「**push 到 GitHub 就自動部署上線**」的狀態：補上部署設定檔、把正式環境需要的指令（產生 Prisma client、套用 migration、打包、啟動）都接好。
**程式碼/設定的部分我已完成**；剩下「註冊 Render、填金鑰、接網域」是**雲端操作**，照 `docs/render-deploy-guide.md` 做。

---

## 2. 先懂三個觀念

### 2.1 為什麼從 GitHub Pages 換成 Render
- 舊版是**純靜態（SSG）**，放 GitHub Pages 沒問題。
- 但後台需要**伺服器**（跑 `server/api`、連資料庫、處理登入/上傳），GitHub Pages **只能放靜態檔、不能跑 Node**。
- 所以改用 **Render Web Service**（能跑 Node 的雲端主機）。`nuxt.config.ts` 的 `nitro.preset: 'node-server'`（Phase 1 設的）就是為此。
- 🔍 關鍵字：`static hosting vs server hosting`、`Nuxt node-server preset`

### 2.2 build 階段 vs 啟動階段
正式部署分兩步：
- **build（打包）**：`npm install` → `prisma migrate deploy`（套用資料表變更）→ `nuxt build`（產出 `.output/`）。
- **start（啟動）**：`node .output/server/index.mjs`，把伺服器跑起來聽請求。
- 🔍 關鍵字：`build vs runtime`、`Nitro output .output/server`

### 2.3 `migrate dev` vs `migrate deploy`
- 本機開發用 **`migrate dev`**：會比對 schema、**產生**新的 migration 檔，可能會問你問題。
- 正式環境用 **`migrate deploy`**：只**套用** repo 裡已有的 migration 檔，不產生、不發問——適合自動化部署。
- ⚠️ 所以本機 `migrate dev` 產生的 `prisma/migrations/` **一定要 commit 進 git**，Render 才套得到。
- 🔍 關鍵字：`prisma migrate deploy`、`prisma migrations in version control`

---

## 3. 逐檔詳解

### 3.1 `render.yaml` — Render 部署設定（Blueprint）
用一個檔描述「要建什麼服務、怎麼 build/start」，在 Render 用 **Blueprint** 一鍵建立，不必手動填一堆表單。
```yaml
services:
  - type: web
    runtime: node
    plan: free                 # 免費（閒置休眠、冷啟動）
    region: singapore          # 離台灣近
    branch: master             # push 此分支就自動部署
    buildCommand: npm install && npx prisma migrate deploy && npm run build
    startCommand: npm run start
    healthCheckPath: /
    envVars:
      - key: NODE_VERSION
        value: 20.19.0
      - key: DATABASE_URL
        sync: false            # ← 機密：不寫在檔裡，到 Render 後台手動填
      # ...其餘 CLOUDINARY_* / NUXT_SESSION_PASSWORD 同樣 sync: false
```
- **`sync: false`** 是關鍵：標記這個變數「值不放在 git 裡的 yaml」，要在 Render 後台填。金鑰才不會外洩。
- 🔍 關鍵字：`Render blueprint spec`、`render.yaml envVars sync false`

### 3.2 `package.json` — 三處調整
```jsonc
"scripts": {
  "start": "node .output/server/index.mjs",        // ← 新增：正式啟動指令
  "postinstall": "prisma generate && nuxt prepare", // ← 改：裝完套件先產生 Prisma client
}
```
- **`start`**：Render 的 startCommand 用它啟動 Nitro 伺服器。
- **`postinstall` 加 `prisma generate`**：每次 `npm install` 後自動產生型別安全的 Prisma client（本機與 Render 都需要，否則 `@prisma/client` 是空的）。
- **`prisma` 從 devDependencies 移到 dependencies**：因為 build 階段要跑 `prisma generate` / `migrate deploy`，把它放正式相依可避免「正式安裝跳過 devDeps 導致找不到 prisma」的雷。
- **移除 `packageManager: "yarn@..."` 欄位**：這個專案其實用 **npm**（有 `package-lock.json`、沒有 `yarn.lock`）。留著 yarn 宣告會讓 Render（與 corepack）改用 yarn，而 yarn 在此專案會因相依套件 engine 不相容而失敗。移除後 Render 會正確地用 npm。
- 🔍 關鍵字：`npm postinstall prisma generate`、`prisma in dependencies vs devDependencies`、`corepack packageManager field`

### 3.3 沒有改到的東西
- `nuxt.config.ts`：SSR（`node-server`）、`runtimeConfig`（Phase 4 的 Cloudinary 金鑰）、`site.url` 都已就緒，不用再動。
- `.gitignore`：已正確忽略 `.env`（金鑰不進 git），保留 `.env.example` 當範本。
- 保留 `deploy`（gh-pages）script：舊的 GitHub Pages 指令留著無害，但**已不用於這個 SSR 站**。

---

## 4. 你需要做的事（雲端操作）

程式/設定我都備好了，剩下照 **`docs/render-deploy-guide.md`** 操作：
1. 確認本機 `migrate dev` 產生的 `prisma/migrations/` 已 commit、整個專案已 push 到 GitHub。
2. Render → New + → **Blueprint** → 選 repo（自動讀 `render.yaml`）。
3. 在 Render **Environment** 填 5 個金鑰（DATABASE_URL、NUXT_SESSION_PASSWORD、CLOUDINARY_*）。
4. 等部署 **Live** → 開 `.onrender.com` 網址測試（首頁、登入、上傳）。
5. **Settings → Custom Domains** 接上你的網域，照給的 DNS 紀錄設定；HTTPS Render 自動處理。

---

## 5. 這階段新增/修改的檔案一覽

```
新增
  render.yaml                     Render 部署設定（Blueprint）
  docs/render-deploy-guide.md     部署手把手指南
修改
  package.json                    加 start、postinstall 加 prisma generate、prisma 移到 deps、移除 packageManager(yarn)
```

---

## 6. 完成後：整個後台五階段回顧

| 階段 | 內容 | 文件 |
|------|------|------|
| Phase 1 | 資料庫讀取（Prisma + SSR + seed） | `docs/phase1-implementation.md` |
| Phase 2 | 登入 + 保護 /admin | `docs/phase2-implementation.md` |
| Phase 3 | 後台分類 CRUD | `docs/phase3-implementation.md` |
| Phase 4 | 圖片上傳（Cloudinary）+ 相簿管理 | `docs/phase4-implementation.md` |
| Phase 5 | 部署上線（Render + 網域） | 本檔 + `docs/render-deploy-guide.md` |

操作型指南：`docs/tidb-setup-guide.md`（接資料庫）、`docs/render-deploy-guide.md`（部署）。
