<template>
  <div class="app-wrapper">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: '永嘉塗裝設計',
  meta: [
    {
      name: '永嘉塗裝設計 - 有專業的施工團隊,高品質 精緻細膩 專業獨家技術,為客戶創造獨特風格,打造舒適 煥然一新的空間。 ',
      content:
        '永嘉塗裝設計 - 有專業的施工團隊,高品質 精緻細膩 專業獨家技術,為客戶創造獨特風格,打造舒適 煥然一新的空間。 ',
    },
  ],
  bodyAttrs: {
    class: 'test',
  },
  script: [{ innerHTML: "console.log('Hello world')" }],
});
</script>

<style>
.app-wrapper {
  min-width: 360px;
  background-image: url('/imgs/microcement--bg.jpg'); /* 使用微水泥紋理圖片 */
  background-size: cover; /* 確保背景圖片覆蓋整個容器 */
  background-repeat: no-repeat; /* 不重複背景圖片 */
  background-attachment: fixed; /* 固定背景 */
}
</style>
