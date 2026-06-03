<script setup lang="ts">
import type { ProductFormData } from '~/components/AdminProductForm.vue';

definePageMeta({ layout: 'admin', middleware: 'auth' });
useHead({ title: '新增分類 | 永嘉塗裝設計' });

const submitting = ref(false);
const error = ref('');

const onSubmit = async (data: ProductFormData) => {
  submitting.value = true;
  error.value = '';
  try {
    await $fetch('/api/admin/products', { method: 'POST', body: data });
    await navigateTo('/admin/products');
  } catch (e: any) {
    error.value = e?.statusMessage || e?.data?.statusMessage || '新增失敗';
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <div>
    <NuxtLink to="/admin/products" class="back">← 返回列表</NuxtLink>
    <h1 class="page-title">新增分類</h1>
    <AdminProductForm
      :submitting="submitting"
      :error="error"
      submit-label="建立分類"
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
