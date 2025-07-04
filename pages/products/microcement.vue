<template>
  <!-- <div class="products">
    <div class="product-title">微水泥</div>
    <Swiper
      :modules="[Autoplay]"
      :navigation="false"
      :loop="true"
      :autoplay="{
        delay: 3000,
        disableOnInteraction: false,
      }"
    >
      <SwiperSlide class="swiper-slide">
        <img src="/imgs/product1.jpg" alt="" width="350px" height="200px" />
        <p>跳色系設計風格</p>
      </SwiperSlide>
      <SwiperSlide class="swiper-slide">
        <img src="/imgs/product2.jpg" alt="" width="350px" height="200px" />
        <p>藝術塗料 「雪菲爾」</p>
      </SwiperSlide>
      <SwiperSlide class="swiper-slide">
        <img src="/imgs/product3.jpg" alt="" width="350px" height="200px" />
        <p>石塑地板安裝</p>
      </SwiperSlide>
    </Swiper>
  </div> -->
  <div class="products">
    <div class="product-title">微水泥</div>

    <div class="product-introduction">
      微水泥,是由硅酸鹽水泥、添加劑和礦物顏料組成的裝飾性 塗料。 它以水泥基為主要粘結物的無機原生態產品,符合現代建築
      的簡約,樸素的設計美感。世界上越來越多的建築師採用這 種仿古的工藝他們認為,這是一種高貴的補素,看似簡單,
      其實比金碧輝煌更具藝術效果。
    </div>
    <!-- 微水泥 MICRO CEMENT 微水泥,是由硅酸鹽水泥、添加劑和礦物顏料組成的裝飾性 塗料。
    它以水泥基為主要粘結物的無機原生態產品,符合現代建築 的簡約,樸素的設計美感。世界上越來越多的建築師採用這
    種仿古的工藝他們認為,這是一種高貴的補素,看似簡單, 其實比金碧輝煌更具藝術效果。 產品特點
    1.優秀的柔韌性:雙組份微水泥有著較高的柔韌性,只 要基層不出現開裂情況微水泥產品本身不會開裂
    2.高強度粘附性:雙組份微水泥對各種基底的粘附性 更好。可以直接施工於大理石瓷磚,模板,水泥板等 基材表面
    3.高抗壓強度:微水泥的抗壓強度達到607N,遠高於 其他常规地坪材料 4.滿足各類空間應用
    5.絕佳的耐水性:微水泥擁有絕佳的耐水性應用在 衛生間可以長期承受冷熱水的沖刷,為狹小的衛浴 空間創造更多的可能
    6.良好的抗污性:可樂、咖啡、醬油等各種 強酸弱的汙漬不會對其表面造成傷害,容易打理
    7.豐富的色彩:礦物顏料的進行調色微水泥主打 牆面地面一體化,視覺效果目前只有此產品能創造出來
    8.應用範圍廣:桌子、凳子等工藝品皆可塗刷 -->

    <div class="product-container">
      <div class="product-item">
        <img src="/public/imgs/microcement/LINE_ALBUM__250408_1.jpg" alt="product.img" class="product-img" />
      </div>
      <div v-for="(product, index) in products" :key="index" class="product-item">
        <img :src="product.img" :alt="product.img" class="product-img" />
        <!-- <p class="product-name">{{ product.name }}</p> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { Swiper, SwiperSlide } from 'swiper/vue';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import { Autoplay } from 'swiper/modules';
const products = ref(
  Array.from({ length: 17 }, (_, i) => ({
    img: `/imgs/microcement/LINE_ALBUM__250318_${i + 1}.jpg`,
  }))
);

useHead({
  title: '微水泥 - 現代建築裝飾材料 | GA塗料',
  meta: [
    {
      name: 'description',
      content:
        '微水泥是由硅酸鹽水泥、添加劑和礦物顏料組成的裝飾性塗料。它以水泥基為主要粘結物的無機原生態產品，符合現代建築的簡約、樸素的設計美感。',
    },
    {
      name: 'keywords',
      content: '微水泥, 裝飾性塗料, 水泥基塗料, 現代建築材料, 無機塗料, GA塗料',
    },
    {
      property: 'og:title',
      content: '微水泥 - 現代建築裝飾材料 | GA塗料',
    },
    {
      property: 'og:description',
      content:
        '微水泥是由硅酸鹽水泥、添加劑和礦物顏料組成的裝飾性塗料。它以水泥基為主要粘結物的無機原生態產品，符合現代建築的簡約、樸素的設計美感。',
    },
    {
      property: 'og:image',
      content: '/imgs/microcement/LINE_ALBUM__250318_1.jpg',
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
/* .swiper-slide {
  text-align: center;
  margin: 0 auto;
} */
</style>
