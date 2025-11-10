<template>
  <div class="products">
    <div class="product-title">木作裝潢</div>

    <div class="product-introduction">
      專業木作裝潢工程，提供客製化木工設計與施工服務。我們擁有豐富的木工經驗和精湛的工藝技術，
      能夠為您打造獨一無二的木質空間。從傳統到現代風格，從家具製作到整體空間設計，
      我們致力於創造兼具美觀與實用性的木作作品，讓每個空間都充滿溫馨與質感。
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
  { img: '/imgs/carpentry/S__29065227_0.jpg' },
  { img: '/imgs/carpentry/S__29065228_0.jpg' },
  { img: '/imgs/carpentry/S__29065229_0.jpg' },
  { img: '/imgs/carpentry/S__29065230_0.jpg' },
  { img: '/imgs/carpentry/S__29065231_0.jpg' },
  { img: '/imgs/carpentry/S__29065232_0.jpg' },
  { img: '/imgs/carpentry/S__29065233_0.jpg' },
  { img: '/imgs/carpentry/S__29065234_0.jpg' },
  { img: '/imgs/carpentry/S__29065235_0.jpg' },
  // New S__292624 series images
  { img: '/imgs/carpentry/S__29262474_0.jpg' },
  { img: '/imgs/carpentry/S__29262475_0.jpg' },
  { img: '/imgs/carpentry/S__29262476_0.jpg' },
  { img: '/imgs/carpentry/S__29262477_0.jpg' },
  { img: '/imgs/carpentry/S__29262478_0.jpg' },
  { img: '/imgs/carpentry/S__29262479_0.jpg' },
  { img: '/imgs/carpentry/S__29262480_0.jpg' },
  // S__308101 series images
  { img: '/imgs/carpentry/S__30810116_0.jpg' },
  { img: '/imgs/carpentry/S__30810117_0.jpg' },
  { img: '/imgs/carpentry/S__30810118_0.jpg' },
  { img: '/imgs/carpentry/S__30810119_0.jpg' },
  { img: '/imgs/carpentry/S__30810120_0.jpg' },
  { img: '/imgs/carpentry/S__30810121_0.jpg' },
  { img: '/imgs/carpentry/S__30810122_0.jpg' },
  { img: '/imgs/carpentry/S__30810123_0.jpg' },
]);

useHead({
  title: '木作裝潢 - 專業木工工程 | 塗料',
  meta: [
    {
      name: 'description',
      content: '專業木作裝潢工程，提供客製化木工設計與施工服務，包含木質裝潢、家具製作、空間設計等。',
    },
    {
      name: 'keywords',
      content: '木作裝潢, 木工工程, 木質裝潢, 家具製作, 空間設計, 裝潢工程',
    },
    {
      property: 'og:title',
      content: '木作裝潢 - 專業木工工程 | GA塗料',
    },
    {
      property: 'og:description',
      content: '專業木作裝潢工程，提供客製化木工設計與施工服務，包含木質裝潢、家具製作、空間設計等。',
    },
    {
      property: 'og:image',
      content: '/imgs/carpentry/S__29065227_0.jpg',
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
}
</style>
