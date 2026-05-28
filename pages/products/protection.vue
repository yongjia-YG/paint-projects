<template>
  <div class="products">
    <div class="product-title">保護工程</div>

    <div class="product-container">
      <div v-for="(product, index) in products" :key="index" class="product-item">
        <img :src="product.img" :alt="product.img" class="product-img" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ProtectionItem {
  img: string;
}

const products = ref<ProtectionItem[]>([
  { img: '/imgs/protection/S__37388303_0.jpg' },
  { img: '/imgs/protection/S__37388304_0.jpg' },
  { img: '/imgs/protection/S__37388305_0.jpg' },
  { img: '/imgs/protection/S__37388306_0.jpg' },
  { img: '/imgs/protection/S__37388307_0.jpg' },
  { img: '/imgs/protection/S__37388317_0.jpg' },
  { img: '/imgs/protection/S__37388318_0.jpg' },
  { img: '/imgs/protection/S__37388319_0.jpg' },
  { img: '/imgs/protection/S__37388320_0.jpg' },
  { img: '/imgs/protection/S__37388321_0.jpg' },
  { img: '/imgs/protection/S__37388322_0.jpg' },
]);

useHead({
  title: '保護工程 - 施工實例 | GA塗料',
  meta: [
    {
      name: 'description',
      content: '保護工程案例展示，專業施工團隊，品質可靠。',
    },
    {
      name: 'keywords',
      content: '保護工程, 施工, 工程, 防護, GA塗料',
    },
    {
      property: 'og:title',
      content: '保護工程 - 施工實例 | GA塗料',
    },
    {
      property: 'og:description',
      content: '保護工程案例展示，專業施工團隊，品質可靠。',
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
