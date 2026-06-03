<script setup lang="ts">
// 套用後台版面 + 要求登入（未登入由 middleware 導去 /login）
definePageMeta({ layout: 'admin', middleware: 'auth' });

const { user } = useUserSession();

useHead({ title: '內容管理 | 永嘉塗裝設計' });
</script>

<template>
  <div>
    <h1 class="page-title">儀表板</h1>
    <p class="page-sub">歡迎，{{ user?.name }}。</p>

    <div class="cards">
      <NuxtLink to="/admin/products" class="card">
        <span class="card-h">作品分類管理 →</span>
        <span class="card-d">新增 / 編輯分類、簡介、排序、刪除</span>
      </NuxtLink>
    </div>

    <p class="note">
      分類的新增、編輯、排序、刪除已可使用（Phase 3）。圖片上傳將於 Phase 4 開放。
    </p>
  </div>
</template>

<style scoped>
.page-title {
  font-size: 1.6rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--color-text);
}

.page-sub {
  margin-top: 6px;
  color: var(--color-text-soft);
  font-size: var(--fs-sm);
}

.cards {
  margin-top: 28px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 22px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.card {
  transition: transform 0.25s var(--ease), box-shadow 0.25s var(--ease);
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.card-h {
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--color-text);
}

.card-d {
  font-size: var(--fs-sm);
  color: var(--color-text-muted);
}

.note {
  margin-top: 28px;
  font-size: var(--fs-sm);
  color: var(--color-text-muted);
  line-height: 1.8;
}

@media (min-width: 640px) {
  .cards {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
