// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    baseURL: '/',
    head: {
      title: '永嘉塗裝設計',
      htmlAttrs: {
        lang: 'zh-Hant',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            '永嘉塗裝設計 - 有專業的施工團隊，高品質、精緻細膩、專業獨家技術，為客戶創造獨特風格，打造舒適、煥然一新的空間。',
        },
        {
          name: 'keywords',
          content: '塗裝設計, 室內設計, 微水泥, 高品質裝潢, 永嘉, 永嘉塗裝設計, 英國曼涂, 雪菲爾, 石灰基, 仿清水模',
        },
        { name: 'author', content: '永嘉塗裝設計' },
        { name: 'robots', content: 'index, follow' },

        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: '永嘉塗裝設計' },
        {
          property: 'og:description',
          content: '專業團隊，精緻塗裝，打造您的夢想空間。',
        },
        { property: 'og:image', content: 'https://nokil1141.com/imgs/microcement/LINE_ALBUM__250408_1.jpg' }, // 請放真實圖
        { property: 'og:url', content: 'https://nokil1141.com' },
        { property: 'og:site_name', content: '永嘉塗裝設計' },

        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: '永嘉塗裝設計' },
        {
          name: 'twitter:description',
          content: '專業團隊，精緻塗裝，打造您的夢想空間。',
        },
        { name: 'twitter:image', content: 'https://nokil1141.com/imgs/microcement/LINE_ALBUM__250408_1.jpg' },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: '/favicon.png',
        },
        {
          rel: 'apple-touch-icon',
          sizes: '16x16',
          href: '/apple-touch-icon.png',
        },
      ],
    },
  },

  css: ['~/assets/css/reset.css', '~/assets/css/main.css', 'swiper/css', 'swiper/css/navigation'],
  devtools: { enabled: true },

  build: {
    transpile: ['swiper'],
  },

  site: {
    url: 'https://nokil1141.com',
  },

  modules: [
    // 登入/Session 工具：加密 Cookie session、密碼雜湊（需 NUXT_SESSION_PASSWORD 環境變數）
    'nuxt-auth-utils',
    [
      '@nuxtjs/sitemap',

      {
        siteUrl: 'https://nokil1141.com',
        trailingSlash: false, // 是否在路由後加 `/`，依據 SEO 慣例
        xslUrl: '/sitemap.xsl',
        credits: false,
        autoLastmod: true,
      },
    ],
  ],

  // 伺服器端機密（僅後端可讀，不會送到瀏覽器）。
  // 對應 .env 的同名變數；線上於 Render 後台「Environment」設定。
  runtimeConfig: {
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  },

  // SSR（Node 伺服器）：後台改了內容公開頁即時反映，並可由 server/api 讀資料庫。
  // 部署到 Render 以 `node .output/server/index.mjs` 啟動。
  nitro: {
    preset: 'node-server',
  },

  compatibilityDate: '2026-05-28',
});