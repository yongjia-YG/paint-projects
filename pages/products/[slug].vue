<script setup lang="ts">
import { getProduct } from '~/data/products';

const route = useRoute();
const product = getProduct(route.params.slug as string);

if (!product) {
  throw createError({ statusCode: 404, statusMessage: '找不到此分類', fatal: true });
}

useHead({
  title: product.seo.title,
  meta: [
    { name: 'description', content: product.seo.description },
    { name: 'keywords', content: product.seo.keywords },
    { property: 'og:title', content: product.seo.title },
    { property: 'og:description', content: product.seo.description },
    { property: 'og:image', content: product.seo.ogImage },
  ],
});
</script>

<template>
  <ProductGallery v-if="product" :product="product" />
</template>
