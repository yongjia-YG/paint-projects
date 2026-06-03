<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' });
useHead({ title: '作品分類管理 | 永嘉塗裝設計' });

const { data: products, refresh, pending } = await useFetch('/api/admin/products', {
  default: () => [],
});

const busy = ref(false);
const error = ref('');

// 上/下移：交換相鄰兩筆，送出新順序給後端
const move = async (index: number, dir: -1 | 1) => {
  const list = [...(products.value ?? [])];
  const target = index + dir;
  if (target < 0 || target >= list.length) return;
  [list[index], list[target]] = [list[target], list[index]];

  busy.value = true;
  error.value = '';
  try {
    await $fetch('/api/admin/products/reorder', {
      method: 'POST',
      body: { ids: list.map((p) => p.id) },
    });
    await refresh();
  } catch (e: any) {
    error.value = e?.statusMessage || '排序失敗';
  } finally {
    busy.value = false;
  }
};

const remove = async (id: number, name: string) => {
  if (!confirm(`確定刪除「${name}」？此分類的相簿圖片也會一併刪除，無法復原。`)) return;
  busy.value = true;
  error.value = '';
  try {
    await $fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    await refresh();
  } catch (e: any) {
    error.value = e?.statusMessage || '刪除失敗';
  } finally {
    busy.value = false;
  }
};
</script>

<template>
  <div>
    <div class="head">
      <div>
        <h1 class="page-title">作品分類</h1>
        <p class="page-sub">共 {{ products?.length ?? 0 }} 個分類</p>
      </div>
      <NuxtLink to="/admin/products/new" class="btn-primary">+ 新增分類</NuxtLink>
    </div>

    <p v-if="error" class="error">{{ error }}</p>

    <div v-if="pending" class="empty">載入中…</div>
    <div v-else-if="!products?.length" class="empty">
      還沒有任何分類，點右上角「新增分類」開始。
    </div>

    <table v-else class="table" :class="{ 'is-busy': busy }">
      <thead>
        <tr>
          <th class="col-sort">排序</th>
          <th class="col-cover">封面</th>
          <th>名稱</th>
          <th class="col-slug">slug</th>
          <th class="col-imgs">圖片</th>
          <th class="col-actions">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(p, i) in products" :key="p.id">
          <td class="col-sort">
            <div class="sort-btns">
              <button :disabled="i === 0 || busy" title="上移" @click="move(i, -1)">▲</button>
              <button :disabled="i === products.length - 1 || busy" title="下移" @click="move(i, 1)">▼</button>
            </div>
          </td>
          <td class="col-cover">
            <video v-if="p.coverType === 'video'" :src="p.cover" class="thumb" muted />
            <img v-else :src="p.cover" :alt="p.name" class="thumb" />
          </td>
          <td class="cell-name">{{ p.name }}</td>
          <td class="col-slug"><code>{{ p.slug }}</code></td>
          <td class="col-imgs">{{ p._count.images }}</td>
          <td class="col-actions">
            <NuxtLink :to="`/admin/products/${p.id}`" class="link-edit">編輯</NuxtLink>
            <button class="link-del" :disabled="busy" @click="remove(p.id, p.name)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.page-title {
  font-size: 1.6rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--color-text);
}

.page-sub {
  margin-top: 6px;
  color: var(--color-text-muted);
  font-size: var(--fs-sm);
}

.btn-primary {
  flex-shrink: 0;
  padding: 11px 22px;
  background: var(--color-accent);
  color: #fff;
  border-radius: var(--radius-pill);
  font-size: var(--fs-sm);
  letter-spacing: 0.06em;
  transition: transform 0.2s var(--ease);
}
.btn-primary:hover {
  transform: translateY(-1px);
}

.error {
  color: #b4493b;
  font-size: var(--fs-sm);
  margin-bottom: 14px;
}

.empty {
  padding: 60px 20px;
  text-align: center;
  color: var(--color-text-muted);
  background: var(--color-surface);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-md);
}

.table {
  width: 100%;
  border-collapse: collapse;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: opacity 0.2s var(--ease);
}
.table.is-busy {
  opacity: 0.6;
  pointer-events: none;
}

.table th,
.table td {
  padding: 12px 14px;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
  font-size: var(--fs-sm);
  vertical-align: middle;
}

.table th {
  background: var(--color-surface-2);
  font-weight: 600;
  color: var(--color-text-soft);
  letter-spacing: 0.04em;
}

.table tbody tr:last-child td {
  border-bottom: none;
}

.cell-name {
  font-weight: 500;
  color: var(--color-text);
}

.col-slug code {
  font-size: var(--fs-xs);
  color: var(--color-text-muted);
  background: var(--color-surface-2);
  padding: 2px 7px;
  border-radius: 5px;
}

.col-imgs {
  text-align: center;
  color: var(--color-text-soft);
}

.thumb {
  width: 64px;
  height: 48px;
  object-fit: cover;
  border-radius: 6px;
  display: block;
  background: var(--color-surface-2);
}

.sort-btns {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.sort-btns button {
  width: 26px;
  height: 20px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  border-radius: 5px;
  cursor: pointer;
  font-size: 10px;
  color: var(--color-text-soft);
  line-height: 1;
}
.sort-btns button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.col-actions {
  white-space: nowrap;
}

.link-edit {
  color: var(--color-text);
  border-bottom: 1px solid var(--color-border);
  margin-right: 14px;
}
.link-edit:hover {
  border-color: var(--color-accent);
}

.link-del {
  border: none;
  background: none;
  color: #b4493b;
  cursor: pointer;
  font-size: var(--fs-sm);
  padding: 0;
}
.link-del:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
