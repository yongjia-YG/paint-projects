<template>
  <div class="products">
    <div class="product-title">地板工程</div>

    <div class="product-introduction">
      專業地板工程服務，涵蓋木地板、磁磚、塑膠地板等多種材質的安裝與施工。我們擁有豐富的地板施工經驗，
      從基層處理到表面完工，每個環節都嚴格把關。提供客製化設計方案，結合美觀與耐用性，為您打造舒適優質的居住環境。
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
  { img: '/imgs/flooring/6F84605F-5EB1-46D7-AA8C-2A69992A1BBD.jpg' },
  { img: '/imgs/flooring/EB1FF8F9-A0C7-448F-A53C-028037694881.jpg' },
  { img: '/imgs/flooring/2BBE2E56-8AEB-4DFE-B963-EF9A5C000ADD.jpg' },
  { img: '/imgs/flooring/B285011E-4299-49F9-9E56-114F57F9E5EC.jpg' },
  { img: '/imgs/flooring/57555FD2-1CBD-4771-9835-6A275AFD0A9F.jpg' },
  { img: '/imgs/flooring/C22B9678-C21E-4587-BEB0-BF79F5BD2863.jpg' },
  { img: '/imgs/flooring/C90EACF9-63F8-4A45-9C38-82F1F4CC0288.jpg' },
  { img: '/imgs/flooring/D3D002E5-5198-4C96-AD19-9DAA69FA83FA.jpg' },
  { img: '/imgs/flooring/AFB90516-DAB9-474F-9CCC-96F1B28EBD3E.jpg' },
  { img: '/imgs/flooring/82DBF9FD-9C49-46E1-B502-F76D0F5CDDF0.jpg' },
  { img: '/imgs/flooring/20226A50-BA45-4061-BA16-C71B75305174.jpg' },
  { img: '/imgs/flooring/2E7BAF0A-AF2E-4790-A60B-5C281EC48259.jpg' },
  { img: '/imgs/flooring/E2B41A40-F54D-4862-BDD7-7C429D0AFE5D.jpg' },
  { img: '/imgs/flooring/4DA3378D-8878-45F7-AFCC-B783FC1B0D29.jpg' },
  { img: '/imgs/flooring/44253147-C018-4D72-8EED-494E347A43CC.jpg' },
  { img: '/imgs/flooring/6465A50E-FEF3-493D-BFE0-119B58010A23.jpg' },
  { img: '/imgs/flooring/8AFE6691-5588-4949-8883-528ED8FA6622.jpg' },
  { img: '/imgs/flooring/CE6029E9-1A0A-4E7F-AA3D-38F560F13AC0.jpg' },
  { img: '/imgs/flooring/F9DA6803-2718-40EE-9475-55F75A0413A6.jpg' },
  { img: '/imgs/flooring/741799BD-E17E-4FBF-A57B-F42CC42CB9A0.jpg' },
  { img: '/imgs/flooring/F7B15ED6-8CF5-4103-8565-37F8DCE0143B.jpg' },
  { img: '/imgs/flooring/S__27557947.jpg' },
  { img: '/imgs/flooring/S__27557946.jpg' },
  { img: '/imgs/flooring/S__27557945.jpg' },
  { img: '/imgs/flooring/S__27557944.jpg' },
  { img: '/imgs/flooring/S__27557943.jpg' },
  { img: '/imgs/flooring/S__27557942.jpg' },
  { img: '/imgs/flooring/S__27557941.jpg' },
  { img: '/imgs/flooring/S__27557932_0.jpg' },
  { img: '/imgs/flooring/S__27557934_0.jpg' },
  { img: '/imgs/flooring/S__27557935_0.jpg' },
  { img: '/imgs/flooring/S__27557933_0.jpg' },
  { img: '/imgs/flooring/S__27557930_0.jpg' },
  { img: '/imgs/flooring/S__30670908_0.jpg' },
  { img: '/imgs/flooring/S__30670909_0.jpg' },
  { img: '/imgs/flooring/S__30670910_0.jpg' },
  { img: '/imgs/flooring/S__30670911_0.jpg' },
  { img: '/imgs/flooring/S__30670912_0.jpg' },
]);

useHead({
  title: '地板工程服務 - 專業地板安裝與施工 | GA塗料',
  meta: [
    {
      name: 'description',
      content:
        '專業地板工程服務，涵蓋木地板、磁磚、塑膠地板等多種材質的安裝與施工。我們擁有豐富的地板施工經驗，從基層處理到表面完工，每個環節都嚴格把關。',
    },
    {
      name: 'keywords',
      content: '地板工程, 木地板安裝, 磁磚施工, 塑膠地板, 地板設計, GA塗料',
    },
    {
      property: 'og:title',
      content: '地板工程服務 - 專業地板安裝與施工 | GA塗料',
    },
    {
      property: 'og:description',
      content:
        '專業地板工程服務，涵蓋木地板、磁磚、塑膠地板等多種材質的安裝與施工。我們擁有豐富的地板施工經驗，從基層處理到表面完工，每個環節都嚴格把關。',
    },
    {
      property: 'og:image',
      content: '/imgs/flooring/6F84605F-5EB1-46D7-AA8C-2A69992A1BBD.jpg',
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
