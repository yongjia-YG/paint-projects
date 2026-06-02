# 永嘉塗裝設計 — 後台系統規劃筆記

> 給「只有前端經驗」的你的學習地圖。
> 記錄**大方向 + 決策**，並把每個你需要補的觀念拆成細項，附上**該查的關鍵字**與**官方文件**。
> 建立日期：2026-06-01

---

## 0. 這份筆記怎麼用

- 「大方向」「架構圖」先看懂整體長什麼樣。
- 「要補的觀念」是核心 —— 每節最後的 🔍 **關鍵字** 就是你 Google / 問 AI 的詞。
- 不用一次學完。照「建置階段」邊做邊查最有效率。

你已有的（前端）：Vue / Nuxt 頁面、元件、CSS、呼叫 API 顯示資料。
要補的（後端 / 全端）：API 怎麼寫、資料庫、登入、檔案上傳、部署。

---

## 1. 大方向（已拍板的決策）

**目標**：做一個後台，讓你和同事可以「新增作品分類、輸入簡介、上傳圖片」，公開網站自動顯示。

**已決定**：
| 項目 | 選擇 | 一句話理由 |
|------|------|------|
| 後端寫法 | **Nuxt Nitro server routes**（`server/api/`） | 跟前端同一個專案，少設定 |
| 算繪模式 | 從 SSG（純靜態）改 **SSR**（伺服器算繪） | 後台改了內容，前台要即時反映 |
| 資料庫 | **MySQL**（雲端免費：TiDB Serverless / Aiven） | 你指定 MySQL |
| ORM | **Prisma** | 學得到 schema / migration，文件多 |
| 登入 | **nuxt-auth-utils**（Cookie session） | 官方、最省事，適合少數人用 |
| 圖片儲存 | **Cloudinary**（免費版） | 免費 Node 主機硬碟會被清空，圖片要放外部 |
| 部署主機 | **Render** Web Service 免費版 | 免費、能跑 Node、接 GitHub 自動部署 |
| 網域 | 你已購買，DNS 指向 Render | 不另花錢 |

**月費：NT$0**（代價：免費主機閒置會休眠，首次開啟冷啟動約 30–60 秒）。

> ⚠️ 重要前提：Phase 1 之後，`data/products.ts` 會從「資料來源」變成「一次性匯入 seed」。
> 之後改內容要透過**後台**，不再直接改那個檔。

---

## 2. 整體架構

```
                         ┌─────────────────────────────┐
   訪客瀏覽器  ──────────▶│  Nuxt 應用（部署在 Render）   │
                         │                             │
   你/同事的後台 ────────▶│  pages/        公開頁、後台頁  │
        （登入後）        │  server/api/   ← Node 後端    │
                         └───────┬──────────────┬────────┘
                                 │              │
                        SQL 查詢 │              │ 上傳圖片
                                 ▼              ▼
                         ┌──────────────┐  ┌──────────────┐
                         │ MySQL (TiDB) │  │  Cloudinary  │
                         │ 文字、圖片網址 │  │ 實體圖片 + CDN │
                         └──────────────┘  └──────────────┘
```

**資料流（新增一個作品分類時）**：
1. 後台表單填名稱/簡介、選圖片 → 瀏覽器送請求到 `server/api/...`
2. 後端先驗證你已登入 →
3. 圖片上傳到 Cloudinary，拿回網址 →
4. 把文字 + 圖片網址寫進 MySQL →
5. 公開頁下次載入時，從 MySQL 讀出來顯示。

---

## 3. 你需要補的觀念（前端 → 全端）

### 3.1 前後端怎麼溝通
你前端做過 `fetch()` / `$fetch()`，後端就是「另一端」接收這些請求並回應。
- 請求方法：GET（讀）、POST（新增）、PUT/PATCH（更新）、DELETE（刪除）
- 狀態碼：200 成功、201 已建立、400 參數錯、401 未登入、403 沒權限、404 找不到、500 伺服器錯
- 資料格式：JSON
- 🔍 關鍵字：`HTTP methods`、`HTTP status codes`、`REST API`、`JSON`
- 📖 MDN：https://developer.mozilla.org/zh-TW/docs/Web/HTTP

### 3.2 SSG vs SSR vs CSR（算繪模式）
- **CSR**：瀏覽器才抓資料算畫面（一般 SPA）
- **SSG**：build 時就把頁面產好（你現在的網站）→ 改內容要重新 build
- **SSR**：每次請求由伺服器即時算頁面 → 適合內容會變動的後台網站
- 我們要從 SSG 改成 **SSR**（或 hybrid + 快取）。
- 🔍 關鍵字：`SSR vs SSG vs CSR`、`Nuxt rendering modes`、`Nuxt route rules`、`ISR / SWR cache`
- 📖 Nuxt：https://nuxt.com/docs/guide/concepts/rendering

### 3.3 Nitro 與 server routes（你的「後端」）
Nuxt 內建的伺服器引擎叫 **Nitro**。在 `server/api/xxx.ts` 放檔案，就自動變成一支 API。
- `server/api/products.get.ts` → 對應 `GET /api/products`
- 用 `defineEventHandler`、`readBody`、`getQuery`、`createError` 等
- 🔍 關鍵字：`Nuxt server directory`、`Nitro defineEventHandler`、`h3 readBody`
- 📖 Nuxt server：https://nuxt.com/docs/guide/directory-structure/server
- 📖 Nitro：https://nitro.build

### 3.4 資料庫與 SQL 基礎
MySQL 是**關聯式資料庫**：資料放在「表（table）」，每列是一筆資料、每欄是一個欄位。
- 主鍵（Primary Key）：每筆唯一識別（如 id）
- 外鍵（Foreign Key）：一張表參照另一張表（如「圖片」屬於哪個「分類」）
- 基本操作 CRUD：`SELECT`/`INSERT`/`UPDATE`/`DELETE`
- 🔍 關鍵字：`relational database`、`SQL CRUD`、`primary key foreign key`、`one-to-many relation`
- 📖 互動練習：https://sqlbolt.com ／ https://www.w3schools.com/sql/

### 3.5 ORM：Prisma（不用手寫 SQL）
ORM 讓你用 JavaScript 物件操作資料庫，不必手寫 SQL 字串。
- `schema.prisma`：用程式碼定義有哪些表、欄位、關聯
- **migration**：把 schema 的變更套用到實際資料庫（產生「版本」）
- `prisma generate`：產生型別安全的 client；`prisma.product.findMany()` 這樣用
- **Prisma Studio**：視覺化看資料庫內容（`npx prisma studio`）
- 🔍 關鍵字：`Prisma getting started`、`Prisma schema`、`prisma migrate dev`、`Prisma mysql`、`Prisma Studio`
- 📖 Prisma：https://www.prisma.io/docs
- 📖 Prisma + MySQL：https://www.prisma.io/docs/orm/overview/databases/mysql

### 3.6 環境變數與機密管理
連線字串、API 金鑰**不能寫死在程式碼**，也**不能進 git**。放在 `.env`。
- 本機：`.env`（加進 `.gitignore`）
- 線上：在 Render 後台的「Environment」設定同名變數
- Nuxt 用 `runtimeConfig` 讀取
- 🔍 關鍵字：`.env 環境變數`、`Nuxt runtimeConfig`、`gitignore secrets`
- 📖 Nuxt config：https://nuxt.com/docs/guide/going-further/runtime-config

### 3.7 認證 / 授權（登入）
- **認證 Authentication**：你是誰（登入）
- **授權 Authorization**：你能做什麼（只有登入者能進 /admin）
- **密碼**：絕不存明碼，要用 **bcrypt** 雜湊
- **Session vs JWT**：兩種維持登入狀態的方式；我們用 nuxt-auth-utils 的**加密 Cookie session**（最簡單安全）
- 🔍 關鍵字：`authentication vs authorization`、`bcrypt password hashing`、`session vs JWT`、`httpOnly cookie`、`nuxt-auth-utils`
- 📖 nuxt-auth-utils：https://github.com/atinux/nuxt-auth-utils

### 3.8 檔案/圖片上傳
- 表單上傳走 **multipart/form-data**
- **為什麼不存在伺服器本機？** 免費主機（Render）的硬碟是「暫時的」，重新部署就清空 → 圖片消失
- 解法：上傳到**物件儲存 / 圖片服務**（Cloudinary），資料庫只存**網址**
- **CDN**：Cloudinary 自動用全球節點加速圖片、可即時縮圖
- 🔍 關鍵字：`multipart form-data upload`、`ephemeral filesystem`、`object storage`、`CDN`、`Cloudinary Node SDK upload`
- 📖 Cloudinary：https://cloudinary.com/documentation/node_integration

### 3.9 部署（上線）
- **Build**：把專案打包成可執行的東西
- Render 連你的 GitHub repo，**push 就自動部署**
- 在 Render 設定環境變數（DB、Cloudinary 金鑰）
- **冷啟動**：免費方案閒置會休眠，首個請求要等喚醒
- **DNS**：把你的網域指向 Render（加 CNAME/A 記錄）；HTTPS 憑證 Render 免費自動處理
- 🔍 關鍵字：`Render deploy node`、`Render environment variables`、`Render custom domain`、`DNS CNAME 設定`、`cold start free tier`
- 📖 Render：https://render.com/docs

### 3.10 安全基本功（最低限度要知道）
- **SQL injection**：用 Prisma（參數化查詢）基本就免疫，別手拼 SQL 字串
- **密碼雜湊**：bcrypt，永不存明碼
- **輸入驗證**：後端要再驗一次（前端驗證可被繞過）；可用 `zod`
- **HTTPS**：平台自動處理
- **別把金鑰進 git**
- 🔍 關鍵字：`OWASP Top 10`、`SQL injection`、`input validation zod`、`why hash passwords`

---

## 4. 要註冊的服務 & 怎麼拿金鑰

| 服務 | 用途 | 註冊後要拿到 | 連結 |
|------|------|------|------|
| **TiDB Cloud Serverless**（或 Aiven） | MySQL 資料庫 | `DATABASE_URL` 連線字串 | https://tidbcloud.com |
| **Cloudinary** | 圖片儲存 + CDN | cloud name、api key、api secret | https://cloudinary.com |
| **Render** | 部署主機 | 連 GitHub repo 即可 | https://render.com |

**`.env` 範本（本機；不會進 git）**：
```bash
DATABASE_URL="mysql://使用者:密碼@主機:port/資料庫名?sslaccept=strict"
NUXT_SESSION_PASSWORD="至少32字元的隨機字串"   # 加密 cookie 用
CLOUDINARY_CLOUD_NAME="xxx"
CLOUDINARY_API_KEY="xxx"
CLOUDINARY_API_SECRET="xxx"
```
> `NUXT_SESSION_PASSWORD` 可用指令產生：`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

---

## 5. 資料表設計（把現有 data/products.ts 搬進 DB）

```
users（後台帳號）
├─ id            主鍵
├─ email         登入帳號（唯一）
├─ passwordHash  bcrypt 雜湊後的密碼
├─ name          顯示名稱
└─ createdAt

products（作品分類）
├─ id            主鍵
├─ slug          網址用（唯一，如 microcement）
├─ name          中文名稱
├─ intro         簡介（可空）
├─ cover         封面網址
├─ coverType     'image' | 'video'
├─ sortOrder     排序
├─ seoTitle / seoDescription / seoKeywords / ogImage
└─ createdAt / updatedAt

product_images（相簿圖片）
├─ id            主鍵
├─ productId     外鍵 → products.id（屬於哪個分類）
├─ url           圖片網址（Cloudinary）
├─ sortOrder     排序
└─ createdAt
```
關係：一個 `product` 有多張 `product_images`（one-to-many）。

---

## 6. 建置階段（邊做邊學）

| 階段 | 內容 | 這階段順便學 |
|------|------|------|
| **1. 基礎** | 加套件、Prisma schema、改 SSR、寫 seed 匯入現有 12 分類、公開頁改讀 DB | 3.2 / 3.3 / 3.4 / 3.5 / 3.6 |
| **2. 登入** | 登入頁、保護 `/admin`、session | 3.7 |
| **3. 後台 CRUD** | 分類列表、新增/編輯（名稱/slug/簡介）、排序、刪除 | 3.1 / 3.3 / 3.10 |
| **4. 圖片** | 上傳到 Cloudinary、相簿圖片增刪排序 | 3.8 |
| **5. 部署** | Render 上線、設環境變數、接網域 | 3.9 |

每階段我會做完並說明，你可對照上面關鍵字深入。

---

## 7. 本機開發要準備的工具

- **Node.js**（你應該已有，跑 Nuxt 用）
- **資料庫連線**：用雲端 TiDB 的 `DATABASE_URL` 最省事（不必本機裝 MySQL）
- **看資料庫的工具**（擇一）：
  - `npx prisma studio`（最簡單，瀏覽器開）
  - DBeaver / TablePlus（桌面 GUI）
- **測 API 的工具**（擇一）：
  - VS Code 擴充 **Thunder Client** 或 **REST Client**
  - Postman
- 🔍 關鍵字：`Prisma Studio`、`Thunder Client`、`DBeaver`

---

## 8. 推薦學習資源（依重要性）

1. **Nuxt 官方文件** — server routes、rendering、runtimeConfig：https://nuxt.com/docs
2. **Prisma 官方 Quickstart**（MySQL）：https://www.prisma.io/docs/getting-started
3. **SQLBolt**（互動學 SQL，1–2 小時）：https://sqlbolt.com
4. **MDN HTTP**（請求/回應/狀態碼）：https://developer.mozilla.org/zh-TW/docs/Web/HTTP
5. **nuxt-auth-utils**（登入）：https://github.com/atinux/nuxt-auth-utils
6. **Cloudinary Node 文件**（上傳）：https://cloudinary.com/documentation/node_integration
7. **Render 文件**（部署）：https://render.com/docs/deploy-nodejs

---

## 9. 名詞快速對照

| 名詞 | 白話 |
|------|------|
| API | 後端提供給前端呼叫的「窗口」 |
| Endpoint / 路由 | 一個 API 的網址（如 `/api/products`） |
| SSR | 伺服器即時算好頁面再送出 |
| ORM | 用程式物件操作資料庫，不手寫 SQL |
| Schema | 資料庫的「結構定義」（有哪些表/欄位） |
| Migration | 把 schema 變更套用到資料庫的「版本紀錄」 |
| Seed | 灌入初始資料 |
| Session | 伺服器記住「你已登入」的機制 |
| bcrypt | 把密碼變成不可逆雜湊值來儲存 |
| 環境變數 / .env | 放機密設定的地方，不進程式碼、不進 git |
| 物件儲存 | 專門放檔案（圖片）的雲端服務 |
| CDN | 全球節點加速靜態資源（圖片）載入 |
| 冷啟動 | 免費主機休眠後，第一個請求要等喚醒 |

---

## 10. 進度與下一步

- ✅ **Phase 1 已完成**（程式碼 + build 通過）。逐檔詳解見 **`docs/phase1-implementation.md`**。
- ⏳ 待辦：註冊 **TiDB Serverless** 拿 `DATABASE_URL` → 填進 `.env` → 跑 `npx prisma migrate dev` + `npx prisma db seed` → `npm run dev` 確認。
- 🔜 之後：Phase 2 登入 → Phase 3 後台 CRUD → Phase 4 圖片上傳 → Phase 5 部署。
- 有任何名詞看不懂，直接拿這兩份文件的關鍵字問我。
