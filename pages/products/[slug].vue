<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug as string;

// 從資料庫讀取單一分類（SSR）；找不到時 API 回 404，這裡轉成頁面 404
const { data: product, error } = await useFetch(`/api/products/${slug}`);

if (error.value || !product.value) {
  throw createError({ statusCode: 404, statusMessage: '找不到此分類', fatal: true });
}

useHead({
  title: product.value.seo.title,
  meta: [
    { name: 'description', content: product.value.seo.description },
    { name: 'keywords', content: product.value.seo.keywords },
    { property: 'og:title', content: product.value.seo.title },
    { property: 'og:description', content: product.value.seo.description },
    { property: 'og:image', content: product.value.seo.ogImage },
  ],
});
</script>

<template>
  <ProductGallery v-if="product" :product="product" />
</template>
