# 部署上線：Render 部署 + 接網域（手把手）

> 對象：只有前端經驗的你。
> 目標：把這個 Nuxt 後台網站部署到 **Render**（免費），設好環境變數，最後接上你買的網域。
> 搭配：`docs/admin-backend-notes.md` 第 3.9 節、`render.yaml`（已幫你寫好的部署設定）。
> 全程免費（代價：免費方案閒置會休眠，第一個訪客要等 30–60 秒「冷啟動」）。

---

## 開始前的前提（一定要先完成）

1. ✅ **資料庫已接好**：照 `docs/tidb-setup-guide.md` 做完，`.env` 有可用的 `DATABASE_URL`，本機 `npm run dev` 能跑。
2. ✅ **Cloudinary 已接好**：`.env` 有 `CLOUDINARY_*`，本機能上傳圖片。
3. ✅ **migration 檔已進 git**：本機跑過 `npx prisma migrate dev` 後，`prisma/migrations/` 會多出資料夾，**這些檔案要 commit 進 git**。
   - 為什麼？Render 上線時會跑 `prisma migrate deploy`，它**只套用 repo 裡已有的 migration 檔**，不會自己產生。
   - 確認一下：`git status` 看 `prisma/migrations/` 有沒有被追蹤；沒有就 `git add prisma/migrations && git commit`。
4. ✅ 程式碼**已 push 到 GitHub**（Render 從 GitHub 拉程式）。

> ⚠️ 重點觀念：這個專案用的 TiDB 是**雲端**資料庫，本機和線上**連的是同一個 DB**。
> 所以你在本機跑過的 `migrate` + `seed`（建表 + 匯入 12 分類），線上**直接就有資料**，不必再灌一次。

---

## 總覽：五個步驟

```
① 註冊 Render，連上你的 GitHub repo
② 用 Blueprint（render.yaml）建立服務
③ 在 Render 填 5 個環境變數（金鑰）
④ 等部署完成，開 .onrender.com 網址測試
⑤ 接上你自己的網域
```

預計 20–30 分鐘（不含等部署的時間）。

---

## ① 註冊 Render，連上 GitHub

1. 打開 **https://render.com** → **Get Started** → 用 **GitHub 帳號**登入最方便。
2. 第一次會請你**授權 Render 存取你的 GitHub**。
   - 可選「只授權這一個 repo」（永嘉專案那個），比較安全。

---

## ② 用 Blueprint 建立服務（推薦，最省事）

專案根目錄已經有一份 **`render.yaml`**，Render 會自動讀它幫你把服務設定好。

1. Render 主控台 → 點 **New +** → 選 **Blueprint**。
2. 選你的 **永嘉 repo** → Render 偵測到 `render.yaml` → 顯示要建立的服務 **yongjia**。
3. 按 **Apply / Create**。
   - 它會依 `render.yaml` 設定好：免費方案、Singapore 區域、build 與 start 指令、追蹤 `master` 分支。
4. 這時**還不會成功跑起來**——因為金鑰還沒填。接著做 ③。

> 沒看到 Blueprint 選項？改用手動：New + → **Web Service** → 選 repo →
> Build Command 填 `npm install && npx prisma migrate deploy && npm run build`、
> Start Command 填 `npm run start`、Plan 選 **Free**。其餘照 ③ 設環境變數。

---

## ③ 填環境變數（5 個金鑰）

到該服務的 **Environment** 分頁，**Add Environment Variable**，把 `.env` 裡的值**原樣搬上去**：

| Key | Value（用你 `.env` 的真實值） |
|-----|------|
| `DATABASE_URL` | TiDB 那串 `mysql://...?sslaccept=strict` |
| `NUXT_SESSION_PASSWORD` | 你的 32+ 字元隨機字串 |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary api key |
| `CLOUDINARY_API_SECRET` | Cloudinary api secret |

- `NODE_VERSION` 已寫在 `render.yaml`（20.19.0），不用自己加。
- 填完按 **Save Changes** → Render 會自動觸發一次重新部署。

> 🔒 為什麼不寫進 `render.yaml`？因為那個檔會進 git。金鑰只放 Render 後台（`render.yaml` 裡已標 `sync: false` 代表「這裡不放、手動填」）。

---

## ④ 等部署完成，測試

1. 看 **Logs / Events** 分頁，會依序看到：`npm install` → `prisma migrate deploy` → `nuxt build` → 啟動。
   - 出現類似 `Listening on ...` 且狀態變 **Live** 就成功了。
2. 點服務頁上方那個 **`https://yongjia-xxxx.onrender.com`** 網址：
   - 首頁 12 個分類正常顯示 → 公開站 OK。
   - 開 `/admin` → 導去 `/login` → 用你建立的管理員帳號登入 → 進後台 OK。
   - 進某分類編輯 → 上傳一張相簿圖 → 成功 → 整條（DB + 登入 + Cloudinary）都通了 🎉

> 第一次打開很慢（30–60 秒）是正常的「冷啟動」——免費方案閒置會休眠，被戳醒要時間。醒著時就很快。

---

## ⑤ 接上你自己的網域

1. 服務頁 → **Settings** → **Custom Domains** → **Add Custom Domain**。
2. 輸入你的網域（例如 `nokil1141.com` 和 `www.nokil1141.com` 各加一次）。
3. Render 會給你要設定的 **DNS 紀錄**：
   - 根網域（`nokil1141.com`）：通常給一筆 **A 紀錄**（指向 Render 的 IP）或 ALIAS。
   - `www`：給一筆 **CNAME**（指向 `yongjia-xxxx.onrender.com`）。
4. 到你**買網域的地方**（GoDaddy / Cloudflare / Gandi…）的 DNS 設定，照 Render 給的值新增這些紀錄。
5. 回 Render，等它驗證（DNS 生效可能要幾分鐘到幾小時）。驗證過後：
   - **HTTPS 憑證 Render 會免費自動申請、自動續期**，你不用管。

> `nuxt.config.ts` 的 `site.url` 與 SEO 已設成 `https://nokil1141.com`，網域接好後 SEO/sitemap 就對了。

---

## 疑難排解

| 症狀 | 可能原因 / 解法 |
|------|------|
| build 卡在或失敗，log 出現 **yarn** 字樣 | 應該用 npm。確認 `package.json` 沒有 `packageManager: yarn` 欄位（已移除），且 repo 有 `package-lock.json` |
| `prisma migrate deploy` 失敗、找不到 migration | `prisma/migrations/` 沒進 git。本機 `git add prisma/migrations && commit && push` 再重部署 |
| 啟動後開網站 500、log 提到 `DATABASE_URL` / `Environment variable not found` | 環境變數沒填或拼錯，回 ③ 檢查；改完按 Save 會自動重部署 |
| 登入後一直被登出 / session 錯誤 | `NUXT_SESSION_PASSWORD` 沒設或太短（要 ≥32 字元） |
| 圖片上傳失敗、log 提到 Cloudinary | `CLOUDINARY_*` 三個沒填齊 |
| 第一個請求很慢 | 免費方案冷啟動，正常。要免休眠需付費方案，或用外部排程定時戳醒（進階） |
| 改 schema 後線上資料表沒更新 | 本機 `migrate dev` 產生 migration → commit/push → Render 重部署時 `migrate deploy` 才會套用 |

> 卡住就把 **Render 的 Logs 完整錯誤**貼給我，我幫你看。

---

## 名詞回顧

| 名詞 | 白話 |
|------|------|
| Render Web Service | 幫你跑 Node 伺服器的雲端主機 |
| Blueprint / render.yaml | 用一個檔描述「要建什麼服務、怎麼 build」，一鍵建立 |
| 環境變數 | 放金鑰/設定的地方，不寫進程式碼 |
| migrate deploy | 把 repo 裡已有的 migration 套用到正式資料庫（不問問題、不亂改） |
| 冷啟動 | 免費主機休眠後，第一個請求要等喚醒 |
| CNAME / A 紀錄 | DNS 設定：把你的網域指到 Render |

部署相關的程式/設定細節見 `docs/phase5-implementation.md`。
