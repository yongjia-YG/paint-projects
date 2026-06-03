<script setup lang="ts">
export interface ProductFormData {
  name: string;
  slug: string;
  intro: string;
  cover: string;
  coverType: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  ogImage: string;
}

const props = defineProps<{
  initial?: Partial<ProductFormData>;
  submitting?: boolean;
  error?: string;
  submitLabel?: string;
  isEdit?: boolean;
  imageCount?: number;
}>();

const emit = defineEmits<{ submit: [data: ProductFormData] }>();

const form = reactive<ProductFormData>({
  name: props.initial?.name ?? '',
  slug: props.initial?.slug ?? '',
  intro: props.initial?.intro ?? '',
  cover: props.initial?.cover ?? '',
  coverType: props.initial?.coverType ?? 'image',
  seoTitle: props.initial?.seoTitle ?? '',
  seoDescription: props.initial?.seoDescription ?? '',
  seoKeywords: props.initial?.seoKeywords ?? '',
  ogImage: props.initial?.ogImage ?? '',
});

const onSubmit = () => emit('submit', { ...form });
</script>

<template>
  <form class="form" @submit.prevent="onSubmit">
    <div class="grid">
      <label class="field">
        <span class="lbl">名稱 <em>*</em></span>
        <input v-model="form.name" type="text" placeholder="例：微水泥" required />
      </label>

      <label class="field">
        <span class="lbl">slug（網址）<em>*</em></span>
        <input v-model="form.slug" type="text" placeholder="例：microcement" required />
        <span class="hint">只能用英數字、- 或 _；對應網址 /products/{{ form.slug || 'slug' }}</span>
      </label>
    </div>

    <label class="field">
      <span class="lbl">簡介</span>
      <textarea v-model="form.intro" rows="4" placeholder="選填，顯示在分類詳情頁頂部"></textarea>
    </label>

    <div class="grid">
      <label class="field">
        <span class="lbl">封面網址</span>
        <input v-model="form.cover" type="text" placeholder="/imgs/... 或 https://..." />
      </label>

      <label class="field">
        <span class="lbl">封面類型</span>
        <select v-model="form.coverType">
          <option value="image">圖片</option>
          <option value="video">影片</option>
        </select>
      </label>
    </div>

    <div v-if="form.cover" class="preview">
      <span class="lbl">封面預覽</span>
      <video v-if="form.coverType === 'video'" :src="form.cover" class="preview-media" muted autoplay loop />
      <img v-else :src="form.cover" alt="" class="preview-media" />
    </div>

    <fieldset class="seo">
      <legend>SEO（選填）</legend>
      <label class="field">
        <span class="lbl">SEO 標題</span>
        <input v-model="form.seoTitle" type="text" placeholder="例：微水泥 - 現代建築裝飾材料 | 永嘉塗裝設計" />
      </label>
      <label class="field">
        <span class="lbl">SEO 描述</span>
        <textarea v-model="form.seoDescription" rows="2"></textarea>
      </label>
      <div class="grid">
        <label class="field">
          <span class="lbl">SEO 關鍵字</span>
          <input v-model="form.seoKeywords" type="text" placeholder="逗號分隔" />
        </label>
        <label class="field">
          <span class="lbl">OG 圖片網址</span>
          <input v-model="form.ogImage" type="text" placeholder="留空則用封面" />
        </label>
      </div>
    </fieldset>

    <p v-if="isEdit" class="imgs-note">
      相簿圖片：目前 {{ imageCount ?? 0 }} 張。圖片上傳與管理將於 <strong>Phase 4</strong> 開放。
    </p>

    <p v-if="error" class="form-error">{{ error }}</p>

    <div class="actions">
      <NuxtLink to="/admin/products" class="btn-cancel">取消</NuxtLink>
      <button type="submit" class="btn-save" :disabled="submitting">
        {{ submitting ? '儲存中…' : submitLabel || '儲存' }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.form {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: clamp(20px, 4vw, 32px);
  box-shadow: var(--shadow-sm);
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 18px;
}

.lbl {
  font-size: var(--fs-xs);
  letter-spacing: 0.08em;
  color: var(--color-text-soft);
}
.lbl em {
  color: #b4493b;
  font-style: normal;
}

.hint {
  font-size: var(--fs-xs);
  color: var(--color-text-muted);
}

input,
textarea,
select {
  width: 100%;
  padding: 10px 13px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--fs-sm);
  color: var(--color-text);
  background: var(--color-surface-2);
  font-family: inherit;
  transition: border-color 0.2s var(--ease);
}
input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: var(--color-accent);
}
textarea {
  resize: vertical;
}

.preview {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 18px;
}
.preview-media {
  width: 200px;
  height: 150px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
}

.seo {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 18px 16px 2px;
  margin: 6px 0 18px;
}
.seo legend {
  padding: 0 8px;
  font-size: var(--fs-xs);
  letter-spacing: 0.1em;
  color: var(--color-text-muted);
}

.imgs-note {
  font-size: var(--fs-sm);
  color: var(--color-text-muted);
  background: var(--color-surface-2);
  border-radius: var(--radius-sm);
  padding: 12px 14px;
  margin-bottom: 18px;
}

.form-error {
  color: #b4493b;
  font-size: var(--fs-sm);
  margin-bottom: 14px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-cancel {
  padding: 11px 22px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  font-size: var(--fs-sm);
  color: var(--color-text-soft);
}
.btn-cancel:hover {
  border-color: var(--color-accent);
  color: var(--color-text);
}

.btn-save {
  padding: 11px 26px;
  border: none;
  border-radius: var(--radius-pill);
  background: var(--color-accent);
  color: #fff;
  font-size: var(--fs-sm);
  letter-spacing: 0.06em;
  cursor: pointer;
}
.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (min-width: 640px) {
  .grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
