<template>
  <div class="products">
    <div class="product-title">英國曼涂雪菲爾</div>

    <div class="product-introduction">
      Sheffield(原芙雪菲爾)原型來自英國的謝菲爾德這座被稱為 「鋼鐵之城」的城市。受到工業革命的極大推進,1912年間誕生
      了舉世聞名的不鏽鋼,英國的收藏家們更青睞於這些泛著微微光 澤的藝術衍生品。
      原芙雪菲爾受到啟發,隱於表面的金屬光澤是這款材料最大的亮 點在濃厚的「金屬光環」籠罩下,賦予了牆面更多的金屬光澤
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
  // Original LINE_ALBUM images
  ...Array.from({ length: 13 }, (_, i) => ({
    img: `/imgs/sheffield/LINE_ALBUM__250318_${i + 1}.jpg`,
  })),
  // New S__ images
  { img: '/imgs/sheffield/S__27918455_0.jpg' },
  { img: '/imgs/sheffield/S__27918456_0.jpg' },
  { img: '/imgs/sheffield/S__27918457_0.jpg' },
  { img: '/imgs/sheffield/S__27918458_0.jpg' },
  { img: '/imgs/sheffield/S__27918459_0.jpg' },
  { img: '/imgs/sheffield/S__27918460_0.jpg' },
  { img: '/imgs/sheffield/S__27918461_0.jpg' },
  { img: '/imgs/sheffield/S__27918462_0.jpg' },
  { img: '/imgs/sheffield/S__27918463_0.jpg' },
  // Additional new S__ images
  { img: '/imgs/sheffield/S__18030623_0.jpg' },
  { img: '/imgs/sheffield/S__18030624_0.jpg' },
  { img: '/imgs/sheffield/S__18030625_0.jpg' },
  { img: '/imgs/sheffield/S__18030626_0.jpg' },
  { img: '/imgs/sheffield/S__18030627_0.jpg' },
  { img: '/imgs/sheffield/S__18030628_0.jpg' },
]);

useHead({
  title: '英國曼涂雪菲爾 - 金屬光澤藝術塗料 | GA塗料',
  meta: [
    {
      name: 'description',
      content:
        '英國曼涂雪菲爾(原芙雪菲爾)原型來自英國的謝菲爾德，這款材料最大的亮點在於隱於表面的金屬光澤，在濃厚的「金屬光環」籠罩下，賦予了牆面更多的金屬光澤。',
    },
    {
      name: 'keywords',
      content: '英國曼涂雪菲爾, 金屬光澤塗料, 藝術塗料, 英國進口塗料, 裝飾塗料, GA塗料',
    },
    {
      property: 'og:title',
      content: '英國曼涂雪菲爾 - 金屬光澤藝術塗料 | GA塗料',
    },
    {
      property: 'og:description',
      content:
        '英國曼涂雪菲爾(原芙雪菲爾)原型來自英國的謝菲爾德，這款材料最大的亮點在於隱於表面的金屬光澤，在濃厚的「金屬光環」籠罩下，賦予了牆面更多的金屬光澤。',
    },
    {
      property: 'og:image',
      content: '/imgs/sheffield/LINE_ALBUM__250318_1.jpg',
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
