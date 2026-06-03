<script setup lang="ts">
import type { ProductFormData } from '~/components/AdminProductForm.vue';

definePageMeta({ layout: 'admin', middleware: 'auth' });

const route = useRoute();
const id = route.params.id as string;

// 載入要編輯的分類
const { data: product, error: loadError } = await useFetch(`/api/admin/products/${id}`);
if (loadError.value || !product.value) {
  throw createError({ statusCode: 404, statusMessage: '找不到此分類', fatal: true });
}

useHead({ title: `編輯：${product.value.name} | 永嘉塗裝設計` });

// 把 DB 的 null 轉成空字串，餵給表單
const initial = computed<Partial<ProductFormData>>(() => ({
  name: product.value!.name,
  slug: product.value!.slug,
  intro: product.value!.intro ?? '',
  cover: product.value!.cover,
  coverType: product.value!.coverType,
  seoTitle: product.value!.seoTitle ?? '',
  seoDescription: product.value!.seoDescription ?? '',
  seoKeywords: product.value!.seoKeywords ?? '',
  ogImage: product.value!.ogImage ?? '',
}));

const submitting = ref(false);
const error = ref('');

const onSubmit = async (data: ProductFormData) => {
  submitting.value = true;
  error.value = '';
  try {
    await $fetch(`/api/admin/products/${id}`, { method: 'PUT', body: data });
    await navigateTo('/admin/products');
  } catch (e: any) {
    error.value = e?.statusMessage || e?.data?.statusMessage || '儲存失敗';
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <div>
    <NuxtLink to="/admin/products" class="back">← 返回列表</NuxtLink>
    <h1 class="page-title">編輯分類</h1>
    <AdminProductForm
      :initial="initial"
      :submitting="submitting"
      :error="error"
      :is-edit="true"
      :image-count="product?._count.images"
      submit-label="儲存變更"
      @submit="onSubmit"
    />
  </div>
</template>

<style scoped>
.back {
  display: inline-block;
  font-size: var(--fs-xs);
  color: var(--color-text-muted);
  margin-bottom: 12px;
}
.back:hover {
  color: var(--color-text);
}
.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--color-text);
  margin-bottom: 22px;
}
</style>
