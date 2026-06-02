# Phase 1 完成說明（逐檔詳解）

> 對象：只有前端經驗的你。
> 目標：看完能理解 Phase 1 每個檔案在做什麼、為什麼、彼此怎麼串起來。
> 搭配閱讀：`docs/admin-backend-notes.md`（觀念總表）。
> 完成日期：2026-06-02

---

## 1. Phase 1 到底做了什麼（一句話）

把網站從「**讀死在程式碼裡的 `data/products.ts`**」改成「**從 MySQL 資料庫讀取**」，並在同一個 Nuxt 專案裡用 **Nitro server routes** 寫了讀取資料的後端 API。

### 改造前 vs 改造後

```
【改造前】SSG 靜態
  頁面 ──直接 import──▶ data/products.ts（寫死的陣列）
  build 時把 12 頁產好 → 丟 GitHub Pages

【改造後】SSR + 資料庫
  頁面 ──useFetch──▶ /api/products ──Prisma──▶ MySQL
  伺服器即時算頁面（之後後台改了內容，前台立刻反映）
```

> ⚠️ 因此**現在沒有資料庫連線，公開頁會讀不到東西**。要先 `migrate`（建表）+ `seed`（匯入）後才看得到畫面。這是預期行為。

---

## 2. 資料怎麼流動（最重要的一張圖）

以「訪客打開 `/products/microcement`」為例：

```
瀏覽器
  │  GET /products/microcement
  ▼
pages/products/[slug].vue
  │  useFetch('/api/products/microcement')   ← 前端呼叫後端
  ▼
server/api/products/[slug].get.ts            ← 後端（Nitro）
  │  prisma.product.findUnique({ where:{slug} })
  ▼
server/utils/prisma.ts （Prisma Client）
  │  翻譯成 SQL：SELECT ... FROM Product WHERE slug=?
  ▼
MySQL 資料庫
  │  回傳資料列
  ▲
  │  整理成 { name, intro, images:[...url], seo:{...} }
pages/products/[slug].vue  → 把資料傳給 <ProductGallery>
  ▼
畫面渲染（SSR：伺服器先算好 HTML 再送瀏覽器）
```

關鍵觀念：**前端不直接碰資料庫**。前端只呼叫 API，API（後端）才碰資料庫。這是安全與分層的基本原則。
🔍 關鍵字：`client-server architecture`、`why frontend should not access database directly`

---

## 3. 安裝了哪些套件、為什麼

| 套件 | 類型 | 做什麼 |
|------|------|------|
| `@prisma/client` | dependency | 程式執行時用來查資料庫的 client |
| `prisma` | devDependency | 指令工具（建表 migrate、產生 client、開 Studio） |
| `tsx` | devDependency | 直接用 Node 跑 TypeScript 檔（seed 腳本要用） |

> 安裝時改用 **npm**（不是 yarn）：因為專案實際有 `package-lock.json`（npm 的鎖檔），且 yarn 對某個傳遞相依的 Node 版本要求過嚴會直接報錯。同一專案只用一種套件管理器，避免鎖檔打架。
> 🔍 關鍵字：`package-lock.json vs yarn.lock`、`npm vs yarn`

---

## 4. 逐檔詳解

### 4.1 `prisma/schema.prisma` — 資料庫的「藍圖」

這是整個資料庫結構的單一定義來源。Prisma 看這個檔來「建表」和「產生型別」。

```prisma
datasource db {
  provider = "mysql"            // 用 MySQL
  url      = env("DATABASE_URL") // 連線字串從環境變數讀（不寫死）
}

generator client {
  provider = "prisma-client-js" // 產生 JS/TS 用的 client
}
```

**三個 model（= 三張資料表）**：

```prisma
model Product {
  id        Int      @id @default(autoincrement()) // 主鍵，自動遞增
  slug      String   @unique                        // 網址用，不可重複
  name      String
  intro     String?  @db.Text                       // ? = 可為空；@db.Text = 長文字
  cover     String
  coverType String   @default("image")
  sortOrder Int      @default(0)                     // 排序用
  seoTitle       String?
  seoDescription String?  @db.Text
  seoKeywords    String?
  ogImage        String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt                      // 每次更新自動記時間
  images    ProductImage[]                           // 關聯：一個分類有多張圖
}

model ProductImage {
  id        Int    @id @default(autoincrement())
  productId Int                                       // 外鍵：屬於哪個 Product
  url       String
  sortOrder Int    @default(0)
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  //                          ↑ 關聯定義      ↑ 對應 Product.id   ↑ 分類被刪，圖也跟著刪
}

model User {                                          // 後台帳號（Phase 2 登入用）
  id           Int    @id @default(autoincrement())
  email        String @unique
  passwordHash String                                 // 只存「雜湊後」的密碼，永不存明碼
  name         String
}
```

**要懂的觀念**：
- `@id` 主鍵、`@unique` 唯一、`@default` 預設值、`?` 可為空
- **一對多關聯**：`Product.images`（一）對 `ProductImage`（多），靠 `productId` 外鍵連起來
- `onDelete: Cascade`：刪分類時，它的圖片自動一起刪（不會留孤兒資料）
- 🔍 關鍵字：`Prisma schema`、`Prisma relations one-to-many`、`foreign key onDelete cascade`

### 4.2 `.env` 與 `.env.example` — 機密設定

```bash
DATABASE_URL="mysql://使用者:密碼@主機:port/資料庫?sslaccept=strict"
NUXT_SESSION_PASSWORD="至少32字元隨機字串"   # Phase 2 登入用
CLOUDINARY_...                                # Phase 4 圖片用
```

- `.env`：**實際**的值，已被 `.gitignore` 忽略 → **不會進 git、不會外洩**
- `.env.example`：**範本**（不含真值），會進 git，讓別人知道要設哪些變數
- 目前 `.env` 裡是**佔位假值**，等你拿到 TiDB 連線字串再替換
- 🔍 關鍵字：`環境變數 .env`、`gitignore secrets`、`why not commit secrets`

### 4.3 `server/utils/prisma.ts` — 資料庫連線單例

```ts
import { PrismaClient } from '@prisma/client';
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

- `PrismaClient` 是真正去連資料庫、下查詢的物件。
- **為什麼用「單例」**：開發時 Nuxt 會熱重載，若每次都 `new PrismaClient()` 會開一堆連線把資料庫塞爆。把它掛在 `globalThis` 上重複使用就只有一個。
- **放在 `server/utils/`**：Nitro 會**自動匯入**這裡的具名匯出，所以其他 `server/` 檔可以直接用 `prisma`，不必每次 import。
- 🔍 關鍵字：`PrismaClient singleton`、`Nuxt server utils auto import`、`connection pool exhausted`

### 4.4 `server/api/products/index.get.ts` — 列表 API

```ts
export default defineEventHandler(async () => {
  return await prisma.product.findMany({
    orderBy: { sortOrder: 'asc' },
    select: { slug: true, name: true, cover: true, coverType: true },
  });
});
```

- 檔名 `index.get.ts` 在 `server/api/products/` → 自動對應 **`GET /api/products`**。
  - 資料夾/檔名就是路由；`.get` 表示只接 GET 請求。
- `defineEventHandler`：Nitro 定義一支 API 的標準寫法。
- `findMany`：查多筆；`select` 只挑首頁卡片需要的欄位（少傳資料、較快）。
- 🔍 關鍵字：`Nuxt server routes file naming`、`Nitro defineEventHandler`、`Prisma findMany select`

### 4.5 `server/api/products/[slug].get.ts` — 詳情 API

```ts
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');           // 取網址上的 :slug
  if (!slug) throw createError({ statusCode: 400, ... });

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { images: { orderBy: { sortOrder: 'asc' }, select: { url: true } } },
  });                                                    // 連同相簿圖片一起查

  if (!product) throw createError({ statusCode: 404, statusMessage: '找不到此分類' });

  return {                                               // 整理成前端要的形狀
    slug: product.slug,
    name: product.name,
    intro: product.intro ?? undefined,
    images: product.images.map((img) => img.url),        // 物件陣列 → 純網址陣列
    seo: { title: product.seoTitle ?? product.name, ... },
  };
});
```

- `[slug]` 中括號 = **動態參數**，對應 `GET /api/products/:slug`。
- `findUnique` + `include`：查單筆，並把關聯的 `images` 一起撈出來（一次查詢拿齊）。
- `createError(... 404)`：查不到就回標準 404，前端據此顯示找不到頁面。
- **回傳前先「整形」**：資料庫的 `images` 是物件陣列 `[{url}]`，但前端 `ProductGallery` 只要 `string[]`，所以 `.map(img => img.url)` 轉一下。後端負責把資料整理成前端好用的格式，是常見做法。
- 🔍 關鍵字：`dynamic route param`、`Prisma findUnique include`、`HTTP 404 createError`、`API response shaping / DTO`

### 4.6 `prisma/seed.ts` — 把現有 12 分類灌進資料庫

```ts
import { products } from '../data/products';   // 沿用舊資料當來源
for (const [index, p] of products.entries()) {
  const product = await prisma.product.upsert({
    where: { slug: p.slug },
    update: { ...p 的欄位, sortOrder: index },  // 已存在 → 更新
    create: { ...p 的欄位, sortOrder: index },  // 不存在 → 新建
  });
  await prisma.productImage.deleteMany({ where: { productId: product.id } });
  await prisma.productImage.createMany({
    data: p.images.map((url, i) => ({ productId: product.id, url, sortOrder: i })),
  });
}
```

- **Seed = 灌入初始資料**。這支腳本把 `data/products.ts` 的 12 筆讀出來寫進 DB。
- `upsert`：**update + insert** 的合體 —— 同 `slug` 已存在就更新、不存在就新建。所以這支腳本**可重複執行**，不會產生重複資料。
- 圖片用「先 `deleteMany` 刪光、再 `createMany` 重建」確保和 `data` 檔完全一致。
- 透過 `package.json` 的 `"prisma": { "seed": "tsx prisma/seed.ts" }` 設定，執行 `npx prisma db seed` 就會用 `tsx` 跑這支 TS。
- 🔍 關鍵字：`database seeding`、`Prisma upsert`、`Prisma createMany`、`prisma db seed`

### 4.7 公開頁改成讀 API

**`components/HomeWorks.vue`**（首頁作品卡片）
```ts
// 改前：import { products } from '~/data/products'
// 改後：
const { data: products } = await useFetch('/api/products', { default: () => [] });
```
- `useFetch` 是 Nuxt 的取資料工具，**SSR 時在伺服器端就先抓好**（對 SEO 友善）。
- `default: () => []`：資料還沒回來時先給空陣列，避免 `v-for` 出錯。

**`pages/products/[slug].vue`**（分類詳情頁）
```ts
const { data: product, error } = await useFetch(`/api/products/${slug}`);
if (error.value || !product.value) throw createError({ statusCode: 404, fatal: true });
useHead({ title: product.value.seo.title, ... }); // SEO 改用 DB 來的資料
```
- API 回 404 → 這裡轉成頁面層級的 404。

- 🔍 關鍵字：`Nuxt useFetch`、`useFetch SSR`、`useHead SEO`

### 4.8 `types/product.ts` — 前端共用型別

```ts
export interface ProductDetail { slug; name; intro?; images: string[]; seo: {...}; }
export interface ProductListItem { slug; name; cover; coverType?; }
```
- 因為資料來源從 `data/products.ts` 換成 API，型別也獨立出來放這裡，給 `ProductGallery` 等元件用，避免到處 import 舊資料檔。
- 🔍 關鍵字：`TypeScript interface`、`shared types`

### 4.9 `nuxt.config.ts` — 從靜態改 SSR

```ts
// 改前： nitro: { preset: 'static' }
// 改後：
nitro: { preset: 'node-server' }
```
- `static`：build 時把所有頁面產成靜態 HTML（無伺服器）。
- `node-server`：build 成一個 **Node 伺服器**（`.output/server/index.mjs`），可即時算頁面、可跑 `server/api`。
- 部署到 Render 時，啟動指令就是 `node .output/server/index.mjs`。
- 🔍 關鍵字：`Nitro presets`、`Nuxt node-server`、`SSR deployment`

### 4.10 `data/products.ts` 的角色轉變
- **以前**：網站的資料來源（頁面直接讀）。
- **現在**：只當 **seed 的來源**（被 `prisma/seed.ts` 讀一次灌進 DB）。
- 之後要改內容，請走後台（Phase 3），不要再直接改這個檔。

---

## 5. 重要指令各做什麼

| 指令 | 做什麼 | 何時用 |
|------|------|------|
| `npx prisma generate` | 依 schema 產生 Prisma Client（型別 + 查詢方法） | 改完 schema、或剛安裝 |
| `npx prisma migrate dev --name xxx` | 依 schema **在資料庫建表/改表**，並留下 migration 紀錄 | 改 schema 後 |
| `npx prisma db seed` | 執行 `prisma/seed.ts` 灌入初始資料 | 建完表後 |
| `npx prisma studio` | 開瀏覽器 GUI 看/改資料庫內容 | 想檢查資料時 |
| `npm run dev` | 本機開發伺服器 | 開發時 |
| `npm run build` | 打包成正式版（Node 伺服器） | 部署前 |

🔍 關鍵字：`prisma migrate vs db push`、`prisma generate`、`prisma studio`

---

## 6. 目前狀態與限制

- ✅ 程式碼完成、`npm run build` 通過，產出 Node 伺服器，API 路由 `/api/products`、`/api/products/:slug` 已註冊。
- ⏳ **尚未連真實資料庫**，所以：
  - 公開頁在 seed 之前打開會讀不到資料（正常）。
  - 需要你提供 `DATABASE_URL` 後跑 `migrate` + `seed`。
- 🔜 還沒有後台、還沒有登入、圖片還沒接 Cloudinary（那是 Phase 2~4）。

---

## 7. 你的下一步（拿到 DB 連線字串後）

```bash
# 1. 把真實連線字串填進 .env 的 DATABASE_URL
# 2. 建表
npx prisma migrate dev --name init
# 3. 匯入現有 12 分類
npx prisma db seed
# 4. 啟動確認畫面從 DB 讀出
npm run dev
# 5.（選用）檢查資料
npx prisma studio
```

確認沒問題後，即可進入 **Phase 2：登入 + 保護 `/admin`**。

---

## 8. 這階段新增/修改的檔案一覽

```
新增
  prisma/schema.prisma            資料表藍圖
  prisma/seed.ts                  匯入現有 12 分類
  server/utils/prisma.ts          DB 連線單例
  server/api/products/index.get.ts        GET /api/products
  server/api/products/[slug].get.ts        GET /api/products/:slug
  types/product.ts                前端共用型別
  .env / .env.example             環境變數
修改
  package.json                    加套件 + prisma.seed 設定
  nuxt.config.ts                  static → node-server（SSR）
  components/HomeWorks.vue         改用 useFetch
  pages/products/[slug].vue        改用 useFetch
  components/ProductGallery.vue    型別改用 types/product
角色轉變
  data/products.ts                資料來源 → seed 來源
```
