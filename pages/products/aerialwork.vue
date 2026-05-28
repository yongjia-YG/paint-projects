<template>
  <div class="products">
    <div class="product-title">高空作業</div>

    <div class="product-container">
      <div v-for="(product, index) in products" :key="index" class="product-item">
        <img :src="product.img" :alt="product.img" class="product-img" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface AerialWorkItem {
  img: string;
}

const products = ref<AerialWorkItem[]>([
  { img: '/imgs/aerialwork/S__36602017_0.jpg' },
  { img: '/imgs/aerialwork/S__36602018_0.jpg' },
  { img: '/imgs/aerialwork/S__36602019_0.jpg' },
  { img: '/imgs/aerialwork/S__36602020_0.jpg' },
  { img: '/imgs/aerialwork/S__36602021_0.jpg' },
  { img: '/imgs/aerialwork/S__36602022_0.jpg' },
]);

useHead({
  title: '高空作業 - 施工實例 | GA塗料',
  meta: [
    {
      name: 'description',
      content: '高空作業工程案例展示，專業團隊與安全施工，品質可靠。',
    },
    {
      name: 'keywords',
      content: '高空作業, 施工, 工程, 安全施工, GA塗料',
    },
    {
      property: 'og:title',
      content: '高空作業 - 施工實例 | GA塗料',
    },
    {
      property: 'og:description',
      content: '高空作業工程案例展示，專業團隊與安全施工，品質可靠。',
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
