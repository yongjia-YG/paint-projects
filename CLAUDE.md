# 永嘉塗裝設計

Nuxt 3 靜態網站，展示塗裝與裝潢工程的作品分類相簿。
首頁為單頁 landing，各分類為動態詳情頁。

## 技術架構

- **Nuxt 3** (SSG static preset，部署至 GitHub Pages)
- **Vue 3** Composition API (`<script setup>`)
- **TypeScript**
- 簡約質感設計系統，CSS 變數定義於 `assets/css/main.css`

## 專案結構

```
data/
  products.ts             # 全站唯一資料來源：12 分類的 slug/名稱/封面/說明/圖片/SEO
  site.ts                 # 品牌、slogan、服務項目、聯絡資訊、關於文案
pages/
  index.vue               # 單頁 landing（組合 Home* 區塊）
  products/[slug].vue     # 動態分類詳情頁，依 slug 從 data/products.ts 讀取
layouts/
  default.vue             # TheHeader + main + TheFooter
components/
  TheHeader.vue           # sticky 導覽（錨點 #about/#services/#works/#contact）
  TheFooter.vue           # 深色頁尾：品牌 / 服務 / 聯絡
  HomeHero.vue            # 首頁 hero
  HomeAbout.vue           # 關於 + 優勢卡 + 服務範圍
  HomeServices.vue        # 服務標籤
  HomeWorks.vue           # 作品分類卡片 grid（封面支援影片）
  ProductGallery.vue      # 詳情頁相簿 + 燈箱（鍵盤/觸控），由 [slug].vue 使用
public/imgs/<folder>/     # 圖片資源，依分類分資料夾
assets/css/               # reset.css + main.css（設計系統 tokens）
```

## 新增 / 修改作品分類

**資料與程式已分離** — 內容集中在 `data/products.ts`，無需新建頁面或元件。

使用 `/add-product` 指令，或手動執行：

1. 建立圖片資料夾 `public/imgs/<slug>/`，放入圖片
2. 在 `data/products.ts` 的 `products` 陣列加入一筆 `Product`
3. 完成 — 首頁卡片（HomeWorks）與 `/products/<slug>` 詳情頁會自動產生並預渲染

修改既有分類（圖片、說明、SEO）同樣只改 `data/products.ts` 該筆即可。
站台資訊（服務項目、聯絡方式、關於文案）改 `data/site.ts`。

## Product 資料型別（data/products.ts）

```ts
interface Product {
  slug: string;              // 路由 /products/<slug>，camelCase 英文
  name: string;              // 顯示名稱（中文）
  cover: string;             // 首頁卡片封面（圖片或影片路徑）
  coverType?: 'image' | 'video'; // 封面為影片時設 'video'
  intro?: string;            // 選填：詳情頁說明文字
  images: string[];          // 相簿圖片路徑陣列
  seo: {
    title: string;           // {中文名} - {描述} | 永嘉塗裝設計
    description: string;
    keywords: string;
    ogImage: string;
  };
}
```

## 命名慣例

| 項目 | 格式 | 範例 |
|------|------|------|
| slug / 路由 | camelCase 英文 | `aerialwork`, `interiorDesign` |
| 圖片資料夾 | 小寫英文（對應 slug） | `protection`, `general` |
| SEO title | `{中文名} - {描述} \| 永嘉塗裝設計` | `保護工程 - 施工實例 \| 永嘉塗裝設計` |
