<template>
  <div class="products">
    <div class="product-title">仿清水模</div>

    <div class="product-introduction">
      仿清水模是一種模仿
      清水混凝土質感的裝飾材料，保留了混凝土原始的自然紋理與色澤，展現極簡、純粹且富有質感的設計風格。
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
  Array.from({ length: 4 }, (_, i) => ({
    img: `/imgs/ImitationFairFacedConcrete/LINE_ALBUM__250318_${i + 1}.jpg`,
  }))
);

useHead({
  title: '仿清水模 - 極簡純粹的裝飾材料 | GA塗料',
  meta: [
    {
      name: 'description',
      content:
        '仿清水模是一種模仿清水混凝土質感的裝飾材料，保留了混凝土原始的自然紋理與色澤，展現極簡、純粹且富有質感的設計風格。',
    },
    {
      name: 'keywords',
      content: '仿清水模, 清水混凝土, 裝飾材料, 極簡設計, 建築裝飾, GA塗料',
    },
    {
      property: 'og:title',
      content: '仿清水模 - 極簡純粹的裝飾材料 | GA塗料',
    },
    {
      property: 'og:description',
      content:
        '仿清水模是一種模仿清水混凝土質感的裝飾材料，保留了混凝土原始的自然紋理與色澤，展現極簡、純粹且富有質感的設計風格。',
    },
    {
      property: 'og:image',
      content: '/imgs/ImitationFairFacedConcrete/LINE_ALBUM__250318_1.jpg',
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
