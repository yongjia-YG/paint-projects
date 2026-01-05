<template>
  <div class="products">
    <div class="product-title">裝潢設計</div>

    <div class="product-container">
      <div v-for="(product, index) in products" :key="index" class="product-item">
        <img :src="product.img" :alt="product.img" class="product-img" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface InteriorDesignItem {
  img: string;
}

const products = ref<InteriorDesignItem[]>([
  { img: '/imgs/interiorDesign/S__32604449_0.jpg' },
  { img: '/imgs/interiorDesign/S__32604450_0.jpg' },
  { img: '/imgs/interiorDesign/S__32604451_0.jpg' },
  { img: '/imgs/interiorDesign/S__32604452_0.jpg' },
  { img: '/imgs/interiorDesign/S__32604453_0.jpg' },
  { img: '/imgs/interiorDesign/S__32604454_0.jpg' },
  { img: '/imgs/interiorDesign/S__32604455_0.jpg' },
  { img: '/imgs/interiorDesign/S__32604456_0.jpg' },
  { img: '/imgs/interiorDesign/S__32604457_0.jpg' },
  { img: '/imgs/interiorDesign/S__32604458_0.jpg' },
  { img: '/imgs/interiorDesign/S__32604460_0.jpg' },
  { img: '/imgs/interiorDesign/S__32604461_0.jpg' },
  { img: '/imgs/interiorDesign/S__32604462_0.jpg' },
  { img: '/imgs/interiorDesign/S__32604463_0.jpg' },
  { img: '/imgs/interiorDesign/S__32604464_0.jpg' },
  { img: '/imgs/interiorDesign/S__32604465_0.jpg' },
]);

useHead({
  title: '裝潢設計 - 施工實例 | GA塗料',
  meta: [
    {
      name: 'description',
      content: '裝潢設計工程案例展示，風格配置與施工品質，專業細緻表現。',
    },
    {
      name: 'keywords',
      content: '裝潢設計, 室內設計, 施工, 工程, GA塗料',
    },
    {
      property: 'og:title',
      content: '裝潢設計 - 施工實例 | GA塗料',
    },
    {
      property: 'og:description',
      content: '裝潢設計工程案例展示，風格配置與施工品質，專業細緻表現。',
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

.product-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
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
  object-fit: cover;
}

@media (max-width: 768px) {
  .product-container {
    grid-template-columns: repeat(1, 1fr);
    gap: 10px;
  }
  .product-img {
    width: 300px;
    height: 150px;
    object-fit: cover;
  }
}
</style>
