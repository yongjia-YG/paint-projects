# Phase 4 完成說明（逐檔詳解）

> 對象：只有前端經驗的你。
> 主題：**相簿圖片上傳與管理** —— 上傳到 Cloudinary、相簿圖片增刪與排序、封面也可直接上傳。
> 搭配閱讀：`docs/phase3-implementation.md`（分類 CRUD）、`docs/admin-backend-notes.md` 第 3.8 / 3.10 節。
> 完成日期：2026-06-03

---

## 1. Phase 4 做了什麼（一句話）

讓後台可以**直接從電腦選圖上傳**，不用再手填網址：封面一鍵上傳，分類詳情頁的相簿可以**上傳多張、刪除、調整順序**。圖片實體存在 **Cloudinary**，資料庫只存網址。

### 為什麼圖片要放 Cloudinary，不存主機？
免費主機（Render）的硬碟是**暫時的**，每次重新部署就清空 → 存在本機的圖片會消失。
解法：上傳到**物件儲存 / 圖片 CDN**（Cloudinary），資料庫只存**網址**。Cloudinary 還會自動用全球節點加速圖片載入。
🔍 關鍵字：`ephemeral filesystem`、`object storage`、`CDN`、`Cloudinary Node SDK upload`

---

## 2. 先懂三個觀念

### 2.1 multipart/form-data（怎麼把檔案送上去）
一般 API 送的是 JSON（純文字）。但「檔案」不是文字，要用 **multipart/form-data** 這種格式打包送出。
- 前端：用瀏覽器內建的 `FormData`，`fd.append('file', file)`，再 `$fetch(url, { method: 'POST', body: fd })`。
  - 注意：body 放 `FormData` 時**不要**自己設 `Content-Type`，瀏覽器會自動加（含 boundary）。
- 後端（Nitro）：用 `readMultipartFormData(event)` 解析，拿到每個欄位的 `{ name, filename, type, data(Buffer) }`。
- 🔍 關鍵字：`multipart form-data`、`FormData append`、`h3 readMultipartFormData`

### 2.2 Buffer / Stream（後端怎麼接這包二進位）
`readMultipartFormData` 給你的 `data` 是 **Buffer**（一段位元組）。我們把它丟給 Cloudinary 的 `upload_stream`，上傳完拿回網址。
- 🔍 關鍵字：`Node Buffer`、`Cloudinary upload_stream`

### 2.3 為什麼要存 publicId
Cloudinary 上每個檔案有個唯一名字 `public_id`。**刪圖時要靠它**去叫 Cloudinary 刪掉雲端那份，否則會留下「孤兒檔案」一直佔免費額度。
所以 `product_images` 表多加了一欄 `publicId`。
- 🔍 關鍵字：`Cloudinary public_id`、`cloudinary uploader.destroy`

---

## 3. 逐檔詳解

### 3.1 `prisma/schema.prisma` — 相簿圖片加 `publicId`
```prisma
model ProductImage {
  ...
  url       String
  publicId  String?   // ← 新增：Cloudinary public_id，刪圖時連帶刪雲端檔
  ...
}
```
- 設為可空（`String?`），因為舊資料（seed 來的網址）沒有 publicId。
- **改了 schema 一定要 migrate**：`npx prisma migrate dev --name add_image_publicid`（要先接好 DATABASE_URL）。

### 3.2 `nuxt.config.ts` — runtimeConfig 放金鑰
```ts
runtimeConfig: {
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
},
```
- `runtimeConfig`（沒放在 `public` 底下）＝**只有伺服器讀得到**，不會送進瀏覽器。金鑰就該這樣放。
- 對應 `.env` 的同名變數；線上在 Render 後台「Environment」設定。
- 🔍 關鍵字：`Nuxt runtimeConfig`、`server-only secrets`

### 3.3 `server/utils/cloudinary.ts` — Cloudinary 設定 + 上傳/刪除（共用）
- `getCloudinary()`：第一次用到時才依 `runtimeConfig` 設定金鑰（lazy）。沒設金鑰直接回 500。
- `assertImageFile(file)`：**後端再驗一次**——必須有檔案、type 是 `image/*`、大小 ≤ 10MB。
- `uploadImage(buffer, folder)`：用 `upload_stream` 把 Buffer 上傳，回 `{ url, publicId }`。
- `destroyImage(publicId)`：刪雲端檔；**刪失敗時吞掉錯誤**（不該因為雲端刪不掉就擋住資料庫刪除）。
- 🔍 關鍵字：`cloudinary.config`、`upload_stream`、`uploader.destroy`、`server-side validation`

### 3.4 `server/api/admin/upload.post.ts` — 通用單檔上傳（封面用）
```ts
await requireUserSession(event);
const parts = await readMultipartFormData(event);
const file = parts?.find((p) => p.name === 'file');
assertImageFile(file);
return await uploadImage(file.data, 'yongjia/covers'); // { url, publicId }
```
- **只負責上傳，不寫資料庫**。封面網址由表單存進 `product.cover`（走原本的新增/編輯 API）。
- 一樣 `requireUserSession` 把關——沒登入不能上傳。

### 3.5 `server/api/admin/products/[id]/images/` — 相簿圖片 API
Nitro 用資料夾表達巢狀路由，`[id]` 是分類 id。
| 方法 | 路徑 | 動作 | 檔案 |
|------|------|------|------|
| POST | `/api/admin/products/:id/images` | 上傳多張、建立紀錄 | `index.post.ts` |
| DELETE | `/api/admin/products/:id/images/:imageId` | 刪一張（連帶刪雲端） | `[imageId].delete.ts` |
| POST | `/api/admin/products/:id/images/reorder` | 重排序 | `reorder.post.ts` |

- **index.post.ts**：欄位名 `files`（可多檔）。先確認分類存在 → 逐張上傳 Cloudinary → 建立 `ProductImage`（sortOrder 接在現有最後面）→ 回傳建立好的清單。
- **[imageId].delete.ts**：先查到該圖 → `destroyImage(publicId)` 刪雲端 → 刪資料庫紀錄。找不到回 404。
- **reorder.post.ts**：收 `{ ids }`，用 `$transaction` 把每張的 `sortOrder` 設成新順序的索引。`updateMany` 的 where 同時限定 `productId`，**避免動到別分類**的圖片。
- 🔍 關鍵字：`Nitro nested route params`、`Prisma $transaction`、`updateMany where`

### 3.6 `server/api/admin/products/[id].get.ts` — 編輯頁多帶回 images
原本只回 `_count`（圖片數），現在多 `include: { images: { orderBy: sortOrder } }`，讓編輯頁的相簿管理元件有資料可顯示。

### 3.7 `components/AdminProductForm.vue` — 封面一鍵上傳
- 封面欄位旁加「⬆ 上傳圖片」：選檔 → POST `/api/admin/upload` → 回填 `form.cover`、`coverType` 設 image。
- 影片封面仍以網址手填（上傳只處理圖片）。
- 移除了原本「圖片管理將於 Phase 4 開放」的提示。

### 3.8 `components/AdminImageManager.vue` — 相簿管理（新元件）
- 接 `productId` 與初始 `images`，自己呼叫上面三支 API，操作後**即時更新本地清單**（不必整頁重抓）。
- 功能：多選上傳、單張刪除（二次確認）、◀ ▶ 相鄰交換調整順序。
- `busy` 狀態避免連點重複送出。
- **為什麼相簿管理放編輯頁、不放新增頁**：相簿圖片屬於「某個已存在的分類」，要先有分類 id 才能上傳。所以新增頁先建分類，建完進編輯頁再上傳圖片。

### 3.9 `pages/admin/products/[id].vue` — 編輯頁接入相簿管理
表單下方放 `<AdminImageManager :product-id="product.id" :initial="product.images" />`。

---

## 4. 完整操作流程（測試腳本）

> 前提：已接好資料庫、**已申請 Cloudinary 並填好 `.env` 的 `CLOUDINARY_*`**、`npm run dev` 中、已登入。
> 改了 schema，記得先跑 `npx prisma migrate dev --name add_image_publicid`。

1. **封面上傳**：新增或編輯分類 → 封面欄位按「⬆ 上傳圖片」→ 選一張圖 → 網址自動填入、下方出現預覽 → 儲存。
2. **相簿上傳**：進某分類「編輯」→ 下方「相簿圖片」按「⬆ 上傳圖片」→ 可一次選多張 → 上傳後縮圖出現。
3. **排序**：對某張按 ◀ / ▶ → 順序改變並存檔 → 開公開的 `/products/<slug>` 確認相簿順序也跟著變。
4. **刪除**：對某張按「刪除」→ 確認 → 消失（雲端檔也一併刪）。
5. **後端鎖測試（選做）**：登出後直接 POST `/api/admin/upload` → 應回 **401**。
6. **驗證錯誤**：上傳非圖片檔（如 .txt）→ 應回「只接受圖片檔」；超過 10MB → 「圖片過大」。

---

## 5. 這階段改了資料庫結構

`product_images` 加了 `publicId` 欄。**務必 migrate** 後再使用：
```bash
npx prisma migrate dev --name add_image_publicid
```

---

## 6. 這階段新增/修改的檔案一覽

```
新增（後端）
  server/utils/cloudinary.ts                              Cloudinary 設定 + 上傳/刪除 + 驗證（共用）
  server/api/admin/upload.post.ts                         通用單檔上傳（封面用）
  server/api/admin/products/[id]/images/index.post.ts     上傳多張相簿圖 + 建立紀錄
  server/api/admin/products/[id]/images/[imageId].delete.ts  刪一張（連帶刪雲端）
  server/api/admin/products/[id]/images/reorder.post.ts   相簿排序
新增（前端）
  components/AdminImageManager.vue                         相簿管理元件
修改
  prisma/schema.prisma                                    ProductImage 加 publicId
  nuxt.config.ts                                          runtimeConfig 放 Cloudinary 金鑰
  server/api/admin/products/[id].get.ts                   多 include images
  components/AdminProductForm.vue                          封面一鍵上傳、移除 Phase 4 提示
  pages/admin/products/[id].vue                            接入 AdminImageManager
```

---

## 7. 你需要做的事（環境準備）

1. 到 https://cloudinary.com 註冊（免費），在 Dashboard 拿到 **cloud name、api key、api secret**。
2. 在專案根目錄 `.env` 補上：
   ```bash
   CLOUDINARY_CLOUD_NAME="你的 cloud name"
   CLOUDINARY_API_KEY="你的 api key"
   CLOUDINARY_API_SECRET="你的 api secret"
   ```
3. 跑 `npx prisma migrate dev --name add_image_publicid` 套用 schema 變更。
4. `npm run dev`，照第 4 節測試腳本驗證。

---

## 8. 下一步：Phase 5

**部署**：把專案上到 Render，設好環境變數（DATABASE_URL、NUXT_SESSION_PASSWORD、CLOUDINARY_*），接上你的網域。
