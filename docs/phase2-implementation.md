# Phase 2 完成說明（逐檔詳解）

> 對象：只有前端經驗的你。
> 主題：**登入機制 + 保護後台 `/admin`**。
> 搭配閱讀：`docs/admin-backend-notes.md` 第 3.7 節（認證觀念）、`docs/phase1-implementation.md`。
> 完成日期：2026-06-02

---

## 1. Phase 2 做了什麼（一句話）

加上「登入」：只有持有帳號的人能進 `/admin`。用官方套件 **`nuxt-auth-utils`** 管理登入狀態（加密 Cookie session），密碼用 **scrypt 雜湊**儲存，永不存明碼。

---

## 2. 先懂三個觀念

### 2.1 Session（伺服器怎麼記得「你已登入」）
HTTP 是「無狀態」的——每個請求伺服器都當你是陌生人。為了記得你登入了，登入成功後伺服器發一個**加密的 Cookie**存在你瀏覽器；之後每次請求瀏覽器自動帶上它，伺服器解密後就知道「這是 X」。
- 這個 Cookie 是 **httpOnly**（JavaScript 讀不到，防 XSS 竊取）且**加密簽章**（你改不了內容）。
- 加密用的鑰匙就是 `.env` 的 `NUXT_SESSION_PASSWORD`（≥32 字元）。**換掉它＝所有人被登出**。
- 🔍 關鍵字：`stateless HTTP`、`session cookie`、`httpOnly cookie`、`sealed/encrypted cookie session`

### 2.2 密碼雜湊（為什麼資料庫不存真密碼）
資料庫只存密碼經過 **scrypt** 單向運算後的「雜湊值」。
- 單向＝無法從雜湊反推原密碼；就算資料庫外洩也拿不到明碼。
- 登入時不是「比對明碼」，而是把你輸入的密碼用同樣方式雜湊，再比對是否一致（`verifyPassword`）。
- 🔍 關鍵字：`password hashing`、`scrypt`、`why never store plaintext password`

### 2.3 雞生蛋問題（第一個管理員誰來建？）
後台帳號要登入才能建，但一開始一個帳號都沒有。解法：開一支**一次性 bootstrap** 端點，**只在「資料庫沒有任何使用者」時**允許建立第一個管理員；之後就鎖住。
- 🔍 關鍵字：`bootstrap first admin`、`seed admin user`

---

## 3. 三條主要流程

```
【首次設定】
  打開 /login → 前端問 /api/auth/needs-setup → 回 true（還沒有人）
  → 表單變「建立管理員」 → 送 /api/auth/register
  → 後端確認真的還沒有人 → hashPassword → 寫入 users → setUserSession（直接登入）
  → 導向 /admin

【一般登入】
  /login 表單 → /api/auth/login
  → 找 user → verifyPassword 比對 → 成功 setUserSession → 導向 /admin（或原本想去的頁）

【保護 /admin】
  進入 /admin/* → middleware/auth.ts 檢查 loggedIn
  → 未登入：導去 /login?redirect=...　已登入：放行

【登出】
  後台「登出」鈕 → /api/auth/logout（clearUserSession）→ 前端 clear() → 回 /login
```

---

## 4. 逐檔詳解

### 4.1 安裝與設定 `nuxt-auth-utils`
- `package.json` 多了 `nuxt-auth-utils`。
- `nuxt.config.ts` 的 `modules` 加入 `'nuxt-auth-utils'`。
- 這個模組會**自動提供**一批工具（不用 import）：
  - 後端（server）：`setUserSession`、`clearUserSession`、`getUserSession`、`requireUserSession`、`hashPassword`、`verifyPassword`
  - 前端（composable）：`useUserSession()`
  - 還自動加了一支 `/api/_auth/session` 給前端查目前登入狀態。
- 需要 `.env` 的 `NUXT_SESSION_PASSWORD`（Phase 1 已放占位值，正式請換成隨機 32+ 字元）。
- 🔍 關鍵字：`nuxt-auth-utils`、`Nuxt module auto-imports`

### 4.2 `types/auth.d.ts` — 宣告 session 裡 user 的型別
```ts
declare module '#auth-utils' {
  interface User { id: number; email: string; name: string; }
}
```
- 讓 `useUserSession().user` 和後端取到的 `user` 都有正確型別（自動補完、型別檢查）。
- 🔍 關鍵字：`TypeScript module augmentation`

### 4.3 `server/api/auth/login.post.ts` — 登入
重點片段與說明：
```ts
const user = await prisma.user.findUnique({ where: { email } });
if (!user || !(await verifyPassword(user.passwordHash, password))) {
  throw createError({ statusCode: 401, statusMessage: 'email 或密碼錯誤' });
}
await setUserSession(event, { user: { id, email, name } });
```
- **找不到帳號**和**密碼錯**回**相同**錯誤訊息 → 不洩漏「這個 email 是否註冊過」。
- `setUserSession` 只放 `id/email/name`，**絕不放 `passwordHash`**（session 內容雖加密，但仍以最小必要為原則）。
- 🔍 關鍵字：`user enumeration attack`、`verifyPassword`、`setUserSession`

### 4.4 `server/api/auth/logout.post.ts` — 登出
```ts
await clearUserSession(event); // 清掉那個加密 cookie
```

### 4.5 `server/api/auth/needs-setup.get.ts` — 是否首次設定
```ts
const count = await prisma.user.count();
return { needsSetup: count === 0 };
```
- 給登入頁判斷要顯示「登入」還是「建立管理員」。

### 4.6 `server/api/auth/register.post.ts` — 建立第一個管理員（一次性）
```ts
if (await prisma.user.count() > 0)
  throw createError({ statusCode: 403, ... }); // 已有人 → 鎖住
if (password.length < 8) throw createError({ statusCode: 400, ... }); // 基本驗證
await prisma.user.create({ data: { email, name, passwordHash: await hashPassword(password) } });
await setUserSession(event, { user: {...} }); // 建完直接登入
```
- 「先檢查沒有人，才允許建立」是這支安全的關鍵。
- 後端**再次驗證**輸入（前端驗證會被繞過，後端一定要再驗）。
- 🔍 關鍵字：`hashPassword scrypt`、`server-side validation`

### 4.7 `middleware/auth.ts` — 保護後台頁面
```ts
export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession();
  if (!loggedIn.value)
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
});
```
- **具名**中介層：頁面用 `definePageMeta({ middleware: 'auth' })` 才會套用（所以 `/login` 本身不受影響）。
- 帶 `redirect` 參數 → 登入後可導回原本想去的頁。
- 注意：這是**前端**的保護（體驗用）。真正的安全在**後端 API** 要各自用 `requireUserSession(event)` 把關（Phase 3 的寫入 API 會用到）——因為有人可以不開頁面、直接打 API。
- 🔍 關鍵字：`Nuxt route middleware`、`definePageMeta`、`requireUserSession`、`defense in depth`

### 4.8 `pages/login.vue` — 登入 / 首次設定頁
- `definePageMeta({ layout: false })`：不套公開網站的 header/footer，顯示乾淨置中卡片。
- 用 `useFetch('/api/auth/needs-setup')` 決定表單模式（登入 vs 建立管理員）。
- 送出後呼叫 `refreshSession()`（即 `useUserSession().fetch`）讓前端登入狀態更新，再 `navigateTo` 導向。
- 錯誤訊息顯示後端回的 `statusMessage`。
- 🔍 關鍵字：`useUserSession`、`$fetch POST`、`navigateTo`

### 4.9 `layouts/admin.vue` — 後台專用版面
- 不同於公開網站版面：只有「品牌 + 使用者名 + 看網站 + 登出」的簡潔頂欄。
- 登出鈕呼叫 `/api/auth/logout` 後再 `clear()` 前端狀態。

### 4.10 `pages/admin/index.vue` — 受保護的儀表板（占位）
- `definePageMeta({ layout: 'admin', middleware: 'auth' })`：套後台版面 + 要求登入。
- 目前是占位畫面（顯示登入者名稱、Phase 3 的入口卡）。證明「登入保護」確實運作。

---

## 5. 安全重點整理（這階段已做 / 待加強）

✅ 已做：
- 密碼 scrypt 雜湊、不存明碼
- 登入錯誤不洩漏帳號是否存在
- session 用加密 httpOnly cookie
- bootstrap 端點只在無使用者時可用
- 後端再次驗證輸入

🔜 之後可加強（非必要、視需求）：
- 後台寫入 API 一律 `requireUserSession`（Phase 3 會做）
- 登入失敗次數限制 / rate limit（防暴力破解）
- 新增/刪除同事帳號的管理介面
- 密碼重設流程
- 🔍 關鍵字：`rate limiting`、`brute force protection`、`OWASP authentication cheat sheet`

---

## 6. 重要：這階段沒有改資料庫結構

`User` 表在 **Phase 1 的 schema 就已經定義好**了，Phase 2 沒有改 schema。
- 若你 Phase 1 已跑過 `npx prisma migrate dev`，`users` 表已存在 → **不需要再 migrate**。
- 若還沒跑過（還沒接 DB），之後跑一次 `migrate` 就會一起建好。

---

## 7. 怎麼測（需要先接上資料庫）

```bash
# 確認 .env 的 DATABASE_URL 已是真實連線、且已 migrate
npm run dev
```
1. 開 `http://localhost:3000/admin` → 應被導到 `/login`（保護生效）。
2. 第一次：登入頁顯示「建立管理員」→ 填 email/密碼(≥8碼)/名稱 → 建立並自動進 `/admin`。
3. 點「登出」→ 回 `/login`，這次顯示「後台登入」。
4. 用剛建立的帳密登入 → 再次進入 `/admin`。
5. （選用）`npx prisma studio` 看 `users` 表，密碼欄是長串雜湊值而非明碼。

---

## 8. 這階段新增/修改的檔案一覽

```
新增
  server/api/auth/login.post.ts        登入
  server/api/auth/logout.post.ts       登出
  server/api/auth/register.post.ts     建立第一個管理員（一次性）
  server/api/auth/needs-setup.get.ts   是否首次設定
  middleware/auth.ts                   保護需登入頁面
  pages/login.vue                      登入 / 首次設定頁
  pages/admin/index.vue                受保護的儀表板（占位）
  layouts/admin.vue                    後台版面
  types/auth.d.ts                      session user 型別
修改
  package.json                         加入 nuxt-auth-utils
  nuxt.config.ts                       modules 加入 nuxt-auth-utils
```

---

## 9. 下一步：Phase 3

在 `/admin` 接上**作品分類的 CRUD**（列表、新增、編輯名稱/slug/簡介、排序、刪除），
所有寫入 API 都會用 `requireUserSession` 保護。
