# 接上資料庫：TiDB 註冊 → 連線 → 匯入資料（手把手）

> 對象：只有前端經驗的你。
> 目標：申請免費的 TiDB 雲端 MySQL，拿到連線字串，填進專案，把現有 12 個分類匯入資料庫，
> 讓 Phase 1（公開頁讀 DB）+ Phase 2（登入）在本機真的跑起來。
> 全程免費、不需要信用卡。

---

## 總覽：五個步驟

```
① 註冊 TiDB，建立免費資料庫
② 在 Connect 視窗拿到「連線字串」
③ 把連線字串貼進專案的 .env
④ 跑 migrate（建表）+ seed（匯入 12 分類）
⑤ npm run dev → 開網站 + 開 /login 建立管理員
```

預計 15–20 分鐘。

---

## ① 註冊 TiDB，建立免費資料庫

1. 打開 **https://tidbcloud.com**，點 **Sign Up**。
   - 可用 Google / GitHub 帳號直接登入，最快。
2. 第一次登入後，它通常會**自動幫你建立一個免費叢集**（方案名稱是 **Serverless**，有的介面叫 **Starter**）。
   - 若沒有自動建立，點 **Create Cluster** → 選 **Serverless / 免費** 那個方案。
3. **選區域（Region）**：挑離台灣近的，例如 **Singapore（新加坡）** 或 **Tokyo（東京）**，連線比較快。
4. 按建立，等十幾秒，叢集狀態變成 **Available / Active** 就完成了。

> 💡「叢集（Cluster）」你就理解成「一台幫你開好的資料庫主機」。

---

## ② 拿到「連線字串」

1. 進到你的叢集頁面，點右上角的 **Connect** 按鈕。
2. 會跳出一個連線視窗。重點設定：
   - **Connect With（用什麼連）**：選 **Prisma**（我們用的就是 Prisma）。
     - 如果沒有 Prisma 選項，選 **General** 也可以，自己照下面格式拼。
   - **Branch**：用預設的 `main` 即可。
   - **Database**：預設是 `test`，先用它就好。
3. **設定密碼**：第一次會要你按 **Generate Password（產生密碼）**。
   - ⚠️ 按下去後**密碼只會完整顯示這一次**，請先複製存起來。
4. 視窗會給你一段 **連線字串**，長得像這樣：

   ```
   mysql://2xAbcd123.root:你的密碼@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?sslaccept=strict
   ```

   各段意思：
   | 段落 | 意思 |
   |------|------|
   | `2xAbcd123.root` | 使用者名稱（TiDB 會在前面加一段前綴，正常） |
   | `你的密碼` | 剛剛產生的密碼 |
   | `gateway01...tidbcloud.com` | 資料庫主機位址 |
   | `4000` | 連接埠（TiDB 固定用 4000，不是 MySQL 預設的 3306） |
   | `test` | 資料庫名稱 |
   | `?sslaccept=strict` | 要求加密連線（TiDB 強制，**一定要保留**） |

5. **整段複製起來**。

> 如果視窗只給你「分開的欄位」（host、user、password…），就照上面格式自己拼成一條 `mysql://...` 字串。

---

## ③ 把連線字串貼進 `.env`

1. 打開專案根目錄的 **`.env`** 檔（已存在，是 Phase 1 建的）。
2. 把 `DATABASE_URL` 那行換成你剛剛複製的：

   ```bash
   DATABASE_URL="mysql://2xAbcd123.root:你的密碼@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?sslaccept=strict"
   ```
   - ⚠️ 整串用**雙引號**包起來（密碼若有特殊符號才不會出錯）。
3. 順便把 **`NUXT_SESSION_PASSWORD`**（Phase 2 登入加密用）換成隨機字串。在終端機執行：
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   把印出來的字貼進 `.env`：
   ```bash
   NUXT_SESSION_PASSWORD="貼上剛剛產生的64字元字串"
   ```

> 🔒 `.env` 已被 `.gitignore` 忽略，**不會進 git、不會外洩**，放心填真值。
> Cloudinary 那三行 Phase 4 才會用到，現在留空沒關係。

---

## ④ 建表 + 匯入現有 12 分類

在專案資料夾打開終端機，依序執行：

### 4-1. 建表（migrate）
```bash
npx prisma migrate dev --name init
```
- 它會依 `prisma/schema.prisma` 在 TiDB 裡建立 `users`、`products`、`product_images` 三張表。
- 成功會看到類似：`Your database is now in sync with your schema.`，並在 `prisma/migrations/` 產生一個資料夾。

### 4-2. 匯入資料（seed）
```bash
npx prisma db seed
```
- 它會把 `data/products.ts` 的 12 個分類 + 所有圖片網址寫進資料庫。
- 成功會逐行印出：`✓ 微水泥（18 張圖）`…最後 `匯入完成。`

### 4-3.（選用）打開資料庫看一眼
```bash
npx prisma studio
```
- 瀏覽器會開一個介面，點 `Product` 表應該看到 12 筆資料。看完關掉即可。

---

## ⑤ 啟動網站，建立管理員

```bash
npm run dev
```

開瀏覽器：

1. **公開網站** `http://localhost:3000`
   - 首頁「完工作品」應該正常顯示 12 個分類（這次是**從資料庫讀出來的**）。
   - 點任一分類，相簿與圖片也都正常 → 代表 Phase 1 成功。

2. **後台** `http://localhost:3000/admin`
   - 會被導去 `/login`（保護生效）。
   - 第一次顯示「**首次設定 · 建立管理員**」→ 填 email、密碼（≥8 碼）、名稱 → 按「建立並登入」。
   - 自動進入 `/admin` 儀表板 → 代表 Phase 2 成功。
   - 按「登出」再用同帳密登入試試。

全部正常的話，Phase 1+2 就在本機跑通了 🎉

---

## 疑難排解（遇到錯誤對照這裡）

| 錯誤訊息（關鍵字） | 可能原因 / 解法 |
|------|------|
| `Can't reach database server` / 連不上 | 主機位址或埠錯（要 **4000**）；或網路擋住；確認字串完整 |
| `Access denied for user` | 密碼錯或沒貼對；回 TiDB 重新 **Generate Password** 再換上 |
| `Unknown database 'xxx'` | 連線字串最後的資料庫名稱不存在；用預設 `test`，或在 TiDB 的 SQL 編輯器 `CREATE DATABASE 名稱;` 後再改字串 |
| 出現 SSL/TLS 相關錯誤 | 確認字串結尾有 `?sslaccept=strict` |
| migrate 出現 **foreign key** 相關錯誤 | TiDB 對外鍵的處理偶有差異。把這個錯誤訊息貼給我，我會在 `schema.prisma` 加 `relationMode = "prisma"` 調整後你再重跑 |
| `Environment variable not found: DATABASE_URL` | `.env` 沒存到、或不在專案根目錄 |
| 改了 `.env` 沒生效 | 把 `npm run dev` 停掉（Ctrl+C）重開，環境變數只在啟動時讀 |

> 卡住就把**完整錯誤訊息**貼給我，我幫你看。

---

## 之後若要重來 / 清空資料

```bash
# 重新把資料灌一次（同 slug 會覆蓋，不會重複）
npx prisma db seed

# 砍掉所有表重建（會清空資料，謹慎使用）
npx prisma migrate reset
```

---

## 名詞回顧

| 名詞 | 白話 |
|------|------|
| 叢集 Cluster | 幫你開好的一台資料庫主機 |
| 連線字串 DATABASE_URL | 連到資料庫的「地址＋帳密」一整串 |
| migrate | 依 schema 在資料庫建表/改表 |
| seed | 灌入初始資料 |
| Prisma Studio | 視覺化看資料庫內容的工具 |

更多觀念見 `docs/admin-backend-notes.md`；程式細節見 `docs/phase1-implementation.md`、`docs/phase2-implementation.md`。
