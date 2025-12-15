<template>
  <div class="products">
    <div class="product-title">一般案場</div>

    <!-- <div class="product-introduction">
      曼島石灰基(全球包裝) 英國本土DIY市場最暢銷單品; 歐標環保,24個月沈澱精華石灰膏,不含防腐劑,零化合物排放;
      採用英國鵝卵石製作,製作過程環保可再生; 1級遮蓋力,顯著增加塗刷面積,完美的漆膜表現,全系色彩;
      超强耐水洗功能耐擦洗性能良好,硬度高達2H,有效應對牆面裂痕
    </div> -->

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
  // Original S__266158 series images (13-39)
  ...Array.from({ length: 27 }, (_, i) => ({
    img: `/imgs/general/S__266158${13 + i}_0.jpg`,
  })),
  // S__180306 series images
  { img: '/imgs/general/S__18030619_0.jpg' },
  { img: '/imgs/general/S__18030620_0.jpg' },
  { img: '/imgs/general/S__18030621_0.jpg' },
  { img: '/imgs/general/S__18030622_0.jpg' },
  { img: '/imgs/general/S__18030630_0.jpg' },
  { img: '/imgs/general/S__18030631_0.jpg' },
  { img: '/imgs/general/S__18030632_0.jpg' },
  { img: '/imgs/general/S__18030633_0.jpg' },
  { img: '/imgs/general/S__18030634_0.jpg' },
  { img: '/imgs/general/S__18030635_0.jpg' },
  { img: '/imgs/general/S__18030636_0.jpg' },
  { img: '/imgs/general/S__18030637_0.jpg' },
  // New S__289178 series images
  { img: '/imgs/general/S__28917831_0.jpg' },
  { img: '/imgs/general/S__28917832_0.jpg' },
  { img: '/imgs/general/S__28917833_0.jpg' },
  { img: '/imgs/general/S__28917834_0.jpg' },
  { img: '/imgs/general/S__28917835_0.jpg' },
  { img: '/imgs/general/S__28917836_0.jpg' },
  { img: '/imgs/general/S__28917837_0.jpg' },
  { img: '/imgs/general/S__28917838_0.jpg' },
  { img: '/imgs/general/S__28917839_0.jpg' },
  { img: '/imgs/general/S__28917840_0.jpg' },
  { img: '/imgs/general/S__28917842_0.jpg' },
  { img: '/imgs/general/S__28917843_0.jpg' },
  // S__406364 series images (newly added)
  { img: '/imgs/general/S__406364164_0.jpg' },
  { img: '/imgs/general/S__406364165_0.jpg' },
  { img: '/imgs/general/S__406364166_0.jpg' },
  { img: '/imgs/general/S__406364167_0.jpg' },
  { img: '/imgs/general/S__406364168_0.jpg' },
  { img: '/imgs/general/S__406364169_0.jpg' },
  { img: '/imgs/general/S__406364170_0.jpg' },
  { img: '/imgs/general/S__406364171_0.jpg' },
  { img: '/imgs/general/S__406364172_0.jpg' },
  { img: '/imgs/general/S__406364173_0.jpg' },
  { img: '/imgs/general/S__406364180_0.jpg' },
  { img: '/imgs/general/S__406364181_0.jpg' },
  { img: '/imgs/general/S__406364182_0.jpg' },
  { img: '/imgs/general/S__406364183_0.jpg' },
  { img: '/imgs/general/S__406364184_0.jpg' },
  { img: '/imgs/general/S__406364185_0.jpg' },
  { img: '/imgs/general/S__406364186_0.jpg' },
  { img: '/imgs/general/S__406364187_0.jpg' },
  { img: '/imgs/general/S__406364188_0.jpg' },
  // S__197100 series images
  { img: '/imgs/general/S__19710040_0.jpg' },
  { img: '/imgs/general/S__19710041_0.jpg' },
  { img: '/imgs/general/S__19710042_0.jpg' },
  { img: '/imgs/general/S__19710043_0.jpg' },
  { img: '/imgs/general/S__19710044_0.jpg' },
  { img: '/imgs/general/S__19710045_0.jpg' },
  { img: '/imgs/general/S__19710046_0.jpg' },
  { img: '/imgs/general/S__19710047_0.jpg' },
  // S__308101 series images
  { img: '/imgs/general/S__30810116_0.jpg' },
  { img: '/imgs/general/S__30810117_0.jpg' },
  { img: '/imgs/general/S__30810118_0.jpg' },
  { img: '/imgs/general/S__30810119_0.jpg' },
  { img: '/imgs/general/S__30810120_0.jpg' },
  { img: '/imgs/general/S__30810121_0.jpg' },
  { img: '/imgs/general/S__30810122_0.jpg' },
  { img: '/imgs/general/S__30810123_0.jpg' },
  // S__411648 series images
  { img: '/imgs/general/S__411648005_0.jpg' },
  { img: '/imgs/general/S__411648006_0.jpg' },
  { img: '/imgs/general/S__411648007_0.jpg' },
  { img: '/imgs/general/S__411648008_0.jpg' },
  { img: '/imgs/general/S__411648009_0.jpg' },
  { img: '/imgs/general/S__411648010_0.jpg' },
  { img: '/imgs/general/S__411648011_0.jpg' },
  { img: '/imgs/general/S__411648012_0.jpg' },
  { img: '/imgs/general/S__411648013_0.jpg' },
  { img: '/imgs/general/S__411648014_0.jpg' },
  { img: '/imgs/general/S__411648016_0.jpg' },
  { img: '/imgs/general/S__411648017_0.jpg' },
  { img: '/imgs/general/S__411648018_0.jpg' },
  // S__272384 series images
  { img: '/imgs/general/S__27238445_0.jpg' },
  { img: '/imgs/general/S__27238446_0.jpg' },
  { img: '/imgs/general/S__27238447_0.jpg' },
  { img: '/imgs/general/S__27238448_0.jpg' },
  { img: '/imgs/general/S__27238449_0.jpg' },
  { img: '/imgs/general/S__27238450_0.jpg' },
  { img: '/imgs/general/S__27238451_0.jpg' },
  { img: '/imgs/general/S__27238452_0.jpg' },
  { img: '/imgs/general/S__27238453_0.jpg' },
  { img: '/imgs/general/S__27238454_0.jpg' },
]);

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
