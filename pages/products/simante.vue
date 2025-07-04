<template>
  <div class="products">
    <div class="product-title">司曼特特殊漆</div>

    <div class="product-introduction">
      司曼特特殊漆是一種高性能的裝飾性塗料，具有優異的耐候性和耐久性。它能夠為建築物提供持久的保護和美麗的外觀，同時保持優良的環保性能。
    </div>

    <div class="product-container">
      <div v-for="(product, index) in products" :key="index" class="product-item">
        <img :src="product.img" :alt="product.img" class="product-img" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const products = ref([
  { img: '/imgs/simante/S__352337925_0.jpg' },
  { img: '/imgs/simante/S__352337926_0.jpg' },
  { img: '/imgs/simante/S__352337927_0.jpg' },
  { img: '/imgs/simante/S__352337928_0.jpg' },
  { img: '/imgs/simante/S__352337929_0.jpg' },
  { img: '/imgs/simante/S__352337930_0.jpg' },
  { img: '/imgs/simante/S__352337931_0.jpg' },
  { img: '/imgs/simante/S__352337932_0.jpg' },
  { img: '/imgs/simante/S__352337933_0.jpg' },
]);

useHead({
  title: '司曼特特殊漆 - 高性能裝飾性塗料 | GA塗料',
  meta: [
    {
      name: 'description',
      content:
        '司曼特特殊漆是一種高性能的裝飾性塗料，具有優異的耐候性和耐久性。為建築物提供持久的保護和美麗的外觀，同時保持優良的環保性能。',
    },
    {
      name: 'keywords',
      content: '司曼特特殊漆, 裝飾性塗料, 耐候性塗料, 建築保護, 環保塗料, GA塗料',
    },
    {
      property: 'og:title',
      content: '司曼特特殊漆 - 高性能裝飾性塗料 | GA塗料',
    },
    {
      property: 'og:description',
      content:
        '司曼特特殊漆是一種高性能的裝飾性塗料，具有優異的耐候性和耐久性。為建築物提供持久的保護和美麗的外觀，同時保持優良的環保性能。',
    },
    {
      property: 'og:image',
      content: '/public/imgs/simante/S__352337933_0.jpg',
    },
  ],
});
</script>

<style scoped>
.products {
  max-width: 1024px;
  margin: 0 auto;
  margin-bottom: 45px;
  padding: 10px 20px;
  padding-top: 90px;
}
.product-title {
  font-size: 32px;
  text-align: center;
  margin-bottom: 20px;
}

.product-introduction {
  background-color: #f8f8f8; /* 淺灰背景 */
  padding: 20px;
  border-radius: 10px; /* 圓角 */
  font-size: 16px;
  color: #555; /* 柔和字色 */
  line-height: 1.8; /* 行距 */
  text-indent: 1.5em; /* 首行縮進 */
  margin-bottom: 20px;
}

.product-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 兩欄 */
  gap: 20px; /* 間距 */
}

.product-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.product-img {
  width: 350px;
  height: 200px;
  object-fit: cover; /* 確保圖片不變形 */
}

.product-name {
  margin-top: 8px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

@media (max-width: 768px) {
  .product-introduction {
    padding: 15px;
    font-size: 14px;
  }
  .product-container {
    grid-template-columns: repeat(1, 1fr); /* 手機顯示 1 欄 */
    gap: 10px;
  }
  .product-img {
    width: 300px;
    height: 150px;
    object-fit: cover; /* 確保圖片不變形 */
  }
  .product-name {
    font-size: 16px;
  }
}
</style>
