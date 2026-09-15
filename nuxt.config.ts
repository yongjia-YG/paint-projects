// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    baseURL: '/',
    head: {
      title: '永嘉塗裝設計有限公司 - 微水泥・藝術塗料・統包工程｜基隆塗裝設計',
      htmlAttrs: {
        lang: 'zh-Hant',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            '永嘉塗裝設計有限公司 - 專業施工團隊，提供微水泥、藝術塗料、室內油漆、防水與統包工程，高品質、精緻細膩、獨家技術，為客戶打造舒適、煥然一新的空間。',
        },
        {
          name: 'keywords',
          content:
            '永嘉, 永嘉塗裝, 永嘉設計, 永嘉塗裝設計, 永嘉塗裝設計有限公司, 塗裝設計, 室內設計, 微水泥, 藝術塗料, 統包工程, 基隆塗裝, 基隆室內設計, 高品質裝潢, 英國曼涂, 雪菲爾, 石灰基, 仿清水模',
        },
        { name: 'author', content: '永嘉塗裝設計有限公司' },
        { name: 'robots', content: 'index, follow' },

        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: '永嘉塗裝設計有限公司 - 微水泥・藝術塗料・統包工程' },
        {
          property: 'og:description',
          content: '專業團隊，精緻塗裝，打造您的夢想空間。',
        },
        { property: 'og:image', content: 'https://nokil1141.com/imgs/microcement/LINE_ALBUM__250408_1.jpg' }, // 請放真實圖
        { property: 'og:url', content: 'https://nokil1141.com' },
        { property: 'og:site_name', content: '永嘉塗裝設計有限公司' },

        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: '永嘉塗裝設計有限公司 - 微水泥・藝術塗料・統包工程' },
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
        { rel: 'canonical', href: 'https://nokil1141.com' },
      ],

      // 結構化資料（LocalBusiness）— 讓 Google 認識公司名稱、地址、電話，利於在地搜尋
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            '@id': 'https://nokil1141.com',
            name: '永嘉塗裝設計有限公司',
            alternateName: '永嘉塗裝設計',
            url: 'https://nokil1141.com',
            image: 'https://nokil1141.com/imgs/microcement/LINE_ALBUM__250408_1.jpg',
            logo: 'https://nokil1141.com/favicon.png',
            description:
              '永嘉塗裝設計有限公司 - 專業施工團隊，提供微水泥、藝術塗料、室內油漆、防水與統包工程，為客戶打造煥然一新的空間。',
            telephone: '+886-912-002-098',
            founder: { '@type': 'Person', name: '陳永承' },
            address: {
              '@type': 'PostalAddress',
              streetAddress: '觀海街76號8樓',
              addressLocality: '中正區',
              addressRegion: '基隆市',
              postalCode: '202',
              addressCountry: 'TW',
            },
            areaServed: 'TW',
            sameAs: [
              'https://www.facebook.com/share/1A5wbMQmc5/?mibextid=wwXIfr',
              'https://line.me/ti/p/~nokil1141',
            ],
          }),
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

  nitro: {
    preset: 'static',
  },

  compatibilityDate: '2026-05-28',
});