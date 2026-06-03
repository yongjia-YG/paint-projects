# Phase 3 完成說明（逐檔詳解）

> 對象：只有前端經驗的你。
> 主題：**後台分類管理（CRUD）** —— 列表、新增、編輯、排序、刪除。
> 搭配閱讀：`docs/phase2-implementation.md`（登入）、`docs/admin-backend-notes.md` 第 3.1 / 3.10 節。
> 完成日期：2026-06-02

---

## 1. Phase 3 做了什麼（一句話）

在 `/admin` 接上「作品分類」的完整管理：可以在後台**新增、編輯（名稱/slug/簡介/封面/SEO）、調整排序、刪除**分類，改完公開網站立即反映。
所有「寫入」動作的後端 API 都用 `requireUserSession` 把關。

### 這階段的範圍
- ✅ 分類本身（文字欄位 + 封面網址 + 排序 + 刪除）
- ⏳ **相簿圖片的上傳/管理留到 Phase 4**（接 Cloudinary）。現在封面與圖片先用「網址」方式；編輯頁會顯示目前圖片數。

---

## 2. 先懂兩個觀念

### 2.1 REST：用「HTTP 方法」表達動作
同一個資源 `/api/admin/products`，用不同方法做不同事：
| 方法 | 路徑 | 動作 |
|------|------|------|
| GET | `/api/admin/products` | 取列表 |
| POST | `/api/admin/products` | 新增一筆 |
| GET | `/api/admin/products/:id` | 取單筆（編輯用） |
| PUT | `/api/admin/products/:id` | 更新單筆 |
| DELETE | `/api/admin/products/:id` | 刪除單筆 |
| POST | `/api/admin/products/reorder` | 重新排序 |

在 Nitro，檔名的副檔名就決定接哪個方法：`index.get.ts`、`index.post.ts`、`[id].put.ts`、`[id].delete.ts`。
🔍 關鍵字：`REST API`、`HTTP methods`、`Nitro method suffix routing`

### 2.2 雙重保護（縱深防禦）
- **前端**：`middleware/auth.ts` 讓沒登入的人開 `/admin/*` 會被導去 `/login`（這是 Phase 2 做的，體驗用）。
- **後端**：每支寫入 API 第一行就 `await requireUserSession(event)` —— 沒有有效 session 直接回 401。
- 為什麼兩層都要？因為有人可以**不開網頁、直接打 API**。光靠前端擋不住，**後端才是真正的鎖**。
- 🔍 關鍵字：`defense in depth`、`requireUserSession`、`why client-side auth is not enough`

---

## 3. 逐檔詳解

### 3.1 `server/utils/productInput.ts` — 共用的輸入驗證/整形
新增和編輯都要驗證同一組欄位，抽成一個函式避免重複。
```ts
export async function readProductInput(event) {
  const body = await readBody(event);
  if (!name) throw createError({ statusCode: 400, statusMessage: '請輸入名稱' });
  if (!/^[A-Za-z0-9_-]+$/.test(slug))  // slug 只允許英數 - _
    throw createError({ statusCode: 400, statusMessage: 'slug 只能用英數字、- 或 _' });
  // 空字串轉成 null（資料庫用 null 表示「沒填」）
  return { slug, name, intro: orNull(...), cover, coverType, seo... };
}
```
- **後端再驗一次**（前端驗證可被繞過）。
- 把空字串轉 `null`，對應 schema 裡可為空的欄位。
- 🔍 關鍵字：`server-side validation`、`h3 readBody`、`regex slug`

### 3.2 `index.get.ts` — 列表
```ts
await requireUserSession(event);
return prisma.product.findMany({
  orderBy: { sortOrder: 'asc' },
  select: { id, slug, name, cover, coverType, sortOrder,
            _count: { select: { images: true } } }, // 順便算每個分類有幾張圖
});
```
- `_count` 是 Prisma 算關聯數量的語法。

### 3.3 `index.post.ts` — 新增
```ts
await requireUserSession(event);
const input = await readProductInput(event);
const last = await prisma.product.findFirst({ orderBy: { sortOrder: 'desc' } });
const sortOrder = (last?.sortOrder ?? -1) + 1;   // 新分類排到最後
try {
  return await prisma.product.create({ data: { ...input, sortOrder } });
} catch (e) {
  if (e.code === 'P2002')                          // slug 重複（唯一鍵衝突）
    throw createError({ statusCode: 409, statusMessage: `slug「${input.slug}」已存在` });
  throw e;
}
```
- **Prisma 錯誤碼**：`P2002` = 唯一鍵衝突。轉成 409（衝突）回前端，讓使用者知道 slug 撞名。
- 🔍 關鍵字：`Prisma error codes P2002`、`HTTP 409 conflict`、`unique constraint`

### 3.4 `[id].get.ts` / `[id].put.ts` / `[id].delete.ts`
- `[id]` 是動態參數，`Number(getRouterParam(event,'id'))` 取出並驗證是整數。
- **put**：更新欄位（`sortOrder` 不在這裡改，交給 reorder）。同樣處理 `P2002`（slug 撞名）與 `P2025`（找不到該筆 → 404）。
- **delete**：`prisma.product.delete`。因為 schema 設了 `onDelete: Cascade`，**相簿圖片會自動一起刪**，不留孤兒資料。
- 🔍 關鍵字：`Prisma update/delete`、`P2025 record not found`、`onDelete cascade`

### 3.5 `reorder.post.ts` — 排序
```ts
await requireUserSession(event);
const { ids } = await readBody(event);            // 前端送新的 id 順序
await prisma.$transaction(
  ids.map((id, index) => prisma.product.update({ where: { id }, data: { sortOrder: index } })),
);
```
- 前端把整列的 id 依新順序送來，後端把每筆的 `sortOrder` 設成它的索引。
- **`$transaction`**：把多筆更新包成「一個交易」——全部成功，或全部不動。避免更新到一半失敗造成順序錯亂。
- 🔍 關鍵字：`database transaction`、`Prisma $transaction`、`atomicity`

### 3.6 `components/AdminProductForm.vue` — 共用表單
- 新增頁、編輯頁共用同一個表單元件（少寫一份）。
- `props.initial` 帶入既有值（編輯時）；`emit('submit', data)` 把資料交回頁面處理。
- 內含封面即時預覽、SEO 欄位區、編輯時顯示目前圖片數。
- **為什麼元件負責畫面、頁面負責送 API**：關注點分離 —— 元件可重用，API 呼叫與導頁邏輯放在頁面。
- 🔍 關鍵字：`Vue props/emits`、`reactive`、`component separation of concerns`

### 3.7 `pages/admin/products/index.vue` — 列表頁
- `useFetch('/api/admin/products')` 取資料；`refresh()` 在刪除/排序後重抓。
- **排序**：上/下移按鈕交換相鄰兩筆，把新順序 POST 到 `reorder`，再 `refresh`。
- **刪除**：`confirm()` 二次確認後 DELETE，再 `refresh`。
- `busy` 狀態避免連點時重複送出。
- 🔍 關鍵字：`useFetch refresh`、`$fetch method DELETE/POST`、`optimistic vs refetch`

### 3.8 `pages/admin/products/new.vue` 與 `[id].vue`
- 都 `definePageMeta({ layout: 'admin', middleware: 'auth' })`。
- **new**：submit → `POST /api/admin/products` → 成功導回列表。
- **[id]**：先 `useFetch('/api/admin/products/:id')` 載入既有資料當表單初始值；submit → `PUT` → 導回列表；找不到該 id → 404。
- 把 DB 的 `null` 轉成空字串再餵表單（input 不吃 null）。

### 3.9 `pages/admin/index.vue` — 儀表板入口啟用
- 原本 disabled 的「作品分類管理」卡片，改成可點，連到 `/admin/products`。

---

## 4. 完整操作流程（測試腳本）

> 前提：已照 `docs/tidb-setup-guide.md` 接好資料庫、`npm run dev` 中、且已登入。

1. `/admin` → 點「作品分類管理」→ 看到 12 筆（seed 來的），含封面縮圖與圖片數。
2. **排序**：對某列按 ▲/▼ → 順序改變並存檔 → 開公開首頁確認卡片順序也跟著變。
3. **新增**：右上「+ 新增分類」→ 填名稱、slug（如 `testcat`）、簡介、封面網址 → 建立 → 回列表看到新項目（排在最後）→ 開 `/products/testcat` 看得到（相簿空的，正常，圖片是 Phase 4）。
4. **編輯**：點某列「編輯」→ 改簡介 → 儲存 → 開該分類詳情頁確認簡介變了。
5. **slug 撞名**：新增時用已存在的 slug → 會跳「slug 已存在」（409）。
6. **刪除**：對剛剛的 `testcat` 按「刪除」→ 確認 → 消失。
7. **後端鎖測試（選做）**：登出後，用工具直接 POST `/api/admin/products` → 應回 **401**（證明後端真的有擋）。

---

## 5. 重點：這階段沒有改資料庫結構

用的都是 Phase 1 就建好的 `products` / `product_images` 表，**不需要再 migrate**。

---

## 6. 這階段新增/修改的檔案一覽

```
新增（後端 API）
  server/utils/productInput.ts              輸入驗證/整形（共用）
  server/api/admin/products/index.get.ts    列表
  server/api/admin/products/index.post.ts   新增
  server/api/admin/products/[id].get.ts     取單筆
  server/api/admin/products/[id].put.ts     更新
  server/api/admin/products/[id].delete.ts  刪除
  server/api/admin/products/reorder.post.ts 排序
新增（前端）
  components/AdminProductForm.vue           共用表單
  pages/admin/products/index.vue            列表頁
  pages/admin/products/new.vue              新增頁
  pages/admin/products/[id].vue             編輯頁
修改
  pages/admin/index.vue                     啟用「作品分類管理」入口
```

---

## 7. 下一步：Phase 4

**圖片上傳**：接 Cloudinary，讓後台可以上傳封面與相簿圖片（拖拉、排序、刪除），
取代目前「手填網址」的方式。屆時會再加 `server/api/admin/upload` 與相簿管理 UI。
