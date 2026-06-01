在永嘉塗裝設計專案中新增一個作品分類。

本專案資料與程式已分離 — 所有分類集中在 `data/products.ts`，**不需**新建頁面或元件。
首頁卡片（HomeWorks）與 `/products/<slug>` 詳情頁會依資料自動產生。

參數格式：`<中文名稱> <英文slug>`，例如：`保護工程 protection`

請依序執行以下步驟：

1. 從 `$ARGUMENTS` 解析出中文名稱與英文 slug（slug 用 camelCase 英文）。

2. 建立圖片資料夾 `public/imgs/<slug>/`。

3. 在 `data/products.ts` 的 `products` 陣列**最後**加入一筆，符合 `Product` 型別：

```ts
{
  slug: '<slug>',
  name: '<中文名稱>',
  cover: '/imgs/<slug>/cover.jpg', // 封面圖；若為影片改副檔名並加 coverType: 'video'
  // intro: '<選填說明文字>',
  images: [
    // 圖片加入資料夾後再補上路徑，例如 '/imgs/<slug>/xxx.jpg'
  ],
  seo: {
    title: '<中文名稱> - 施工實例 | 永嘉塗裝設計',
    description: '<中文名稱>工程案例展示，專業施工團隊，品質可靠。',
    keywords: '<中文名稱>, 施工, 工程, 永嘉塗裝設計',
    ogImage: '/imgs/<slug>/cover.jpg',
  },
}
```

4. 回報完成，並告知使用者：
   - 圖片資料夾路徑：`public/imgs/<slug>/`
   - 圖片加好後，告訴我圖片已加入，我會幫你補上 `images` 陣列、`cover` 與 `ogImage` 路徑。

注意事項：
- 切勿再建立 `pages/products/<slug>.vue`（舊架構已移除，改用動態路由 `[slug].vue`）。
- 若分類有說明文字，填入 `intro`（選填）。
- 站台層級資訊（服務項目、聯絡方式、關於文案）屬於 `data/site.ts`，不在此處。
