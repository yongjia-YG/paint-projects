<template>
  <div class="products">
    <div class="product-title">完工圖</div>

    <div class="product-container">
      <router-link
        v-for="(product, index) in products"
        :key="index"
        :to="`/products/${product.path}`"
        class="product-item"
      >
        <template v-if="product.type === 'video'">
          <video :src="product.img" class="product-img" autoplay loop muted playsinline></video>
        </template>
        <template v-else>
          <img :src="product.img" :alt="product.name" class="product-img" />
        </template>
        <p class="product-name">{{ product.name }}</p>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
const products = ref([
  { path: 'microcement', img: '/imgs/microcement/LINE_ALBUM__250408_1.jpg', name: '微水泥' },
  { path: 'sheffield', img: '/imgs/sheffield/LINE_ALBUM__250318_4.jpg', name: '英國曼涂雪菲爾' },
  { path: 'limebased', img: '/imgs/limebased/LINE_ALBUM__250318_8.jpg', name: '英國曼涂石灰基' },
  {
    path: 'lmitatonFairFacedConcrete',
    img: '/imgs/ImitationFairFacedConcrete/LINE_ALBUM__250318_1.jpg',
    name: '仿清水模',
  },
  {
    path: 'simante',
    img: '/imgs/simante/767255543.860772.mp4',
    name: '司曼特特殊漆',
    type: 'video',
  },
  { path: 'general', img: '/imgs/general/S__26615819_0.jpg', name: '一般案場' },
  { path: 'kitchen', img: '/imgs/kitchen/S__27557923.jpg', name: '廚具安裝' },
  { path: 'flooring', img: '/imgs/flooring/6F84605F-5EB1-46D7-AA8C-2A69992A1BBD.jpg', name: '地板工程' },
  { path: 'carpentry', img: '/imgs/carpentry/S__29065235_0.jpg', name: '木作裝潢' },
  { path: 'aerialwork', img: '/imgs/aerialwork/S__31457317_0.jpg', name: '高空作業' },
  { path: 'protection', img: '/imgs/protection/S__37388303_0.jpg', name: '保護工程' },
  {
    path: 'interiorDesign',
    img: '/imgs/interiorDesign/788866226.904485.mp4',
    name: '裝潢設計',
    type: 'video',
  },
]);
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
  text-decoration: none;
}

@media (max-width: 768px) {
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
