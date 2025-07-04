<template>
  <div class="products">
    <div class="product-title">廚具安裝</div>

    <div class="product-introduction">
      專業廚具安裝服務，提供完整的廚房規劃與安裝解決方案。從櫥櫃、檯面到廚具配件，我們擁有豐富的安裝經驗，
      確保每個細節都完美呈現。採用高品質材料，注重實用性與美觀性的完美結合，為您打造理想的廚房空間。
    </div>

    <div class="product-container">
      <div v-for="(product, index) in products" :key="index" class="product-item">
        <img :src="product.img" :alt="product.img" class="product-img" />
        <!-- <p class="product-name">{{ product.name }}</p> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const products = ref([
  { img: '/imgs/kitchen/S__27557923.jpg' },
  { img: '/imgs/kitchen/S__27557921_0.jpg' },
  { img: '/imgs/kitchen/S__27557920_0.jpg' },
  { img: '/imgs/kitchen/S__27557919_0.jpg' },
]);

useHead({
  title: '廚具安裝服務 - 專業廚房規劃與安裝 | GA塗料',
  meta: [
    {
      name: 'description',
      content:
        '專業廚具安裝服務，提供完整的廚房規劃與安裝解決方案。從櫥櫃、檯面到廚具配件，我們擁有豐富的安裝經驗，確保每個細節都完美呈現。',
    },
    {
      name: 'keywords',
      content: '廚具安裝, 廚房規劃, 櫥櫃安裝, 廚具配件, 廚房設計, GA塗料',
    },
    {
      property: 'og:title',
      content: '廚具安裝服務 - 專業廚房規劃與安裝 | GA塗料',
    },
    {
      property: 'og:description',
      content:
        '專業廚具安裝服務，提供完整的廚房規劃與安裝解決方案。從櫥櫃、檯面到廚具配件，我們擁有豐富的安裝經驗，確保每個細節都完美呈現。',
    },
    {
      property: 'og:image',
      content: '/imgs/kitchen/S__27557923.jpg',
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
