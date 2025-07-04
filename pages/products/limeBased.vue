<template>
  <div class="products">
    <div class="product-title">英國GB曼涂石灰基</div>

    <div class="product-introduction">
      曼島石灰基(全球包裝) 英國本土DIY市場最暢銷單品; 歐標環保,24個月沈澱精華石灰膏,不含防腐劑,零化合物排放;
      採用英國鵝卵石製作,製作過程環保可再生; 1級遮蓋力,顯著增加塗刷面積,完美的漆膜表現,全系色彩;
      超强耐水洗功能耐擦洗性能良好,硬度高達2H,有效應對牆面裂痕
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
const products = ref(
  Array.from({ length: 8 }, (_, i) => ({
    img: `/imgs/limebased/LINE_ALBUM__250318_${i + 1}.jpg`,
  }))
);

useHead({
  title: '英國GB曼涂石灰基 - 環保石灰塗料 | 塗料',
  meta: [
    {
      name: 'description',
      content:
        '英國GB曼涂石灰基是英國本土DIY市場最暢銷單品，歐標環保，24個月沈澱精華石灰膏，不含防腐劑，零化合物排放。採用英國鵝卵石製作，製作過程環保可再生。',
    },
    {
      name: 'keywords',
      content: '英國GB曼涂石灰基, 石灰塗料, 環保塗料, 英國進口塗料, 裝飾塗料, GA塗料',
    },
    {
      property: 'og:title',
      content: '英國GB曼涂石灰基 - 環保石灰塗料 | GA塗料',
    },
    {
      property: 'og:description',
      content:
        '英國GB曼涂石灰基是英國本土DIY市場最暢銷單品，歐標環保，24個月沈澱精華石灰膏，不含防腐劑，零化合物排放。採用英國鵝卵石製作，製作過程環保可再生。',
    },
    {
      property: 'og:image',
      content: '/imgs/limebased/LINE_ALBUM__250318_1.jpg',
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
