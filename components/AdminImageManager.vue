<script setup lang="ts">
// 相簿圖片管理：上傳（多檔）、刪除、上/下移排序。自行呼叫 API 並維護本地清單。
interface AlbumImage {
  id: number;
  url: string;
  sortOrder: number;
}

const props = defineProps<{
  productId: number;
  initial: AlbumImage[];
}>();

// 本地清單（操作後即時更新畫面，不必整頁重抓）
const images = ref<AlbumImage[]>([...props.initial]);

const fileInput = ref<HTMLInputElement>();
const uploading = ref(false);
const busy = ref(false);
const error = ref('');

const base = computed(() => `/api/admin/products/${props.productId}/images`);

// 上傳：可一次選多張，全部塞進 files 欄位，後端逐張傳 Cloudinary 並建立紀錄
const onPick = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  const files = input.files;
  if (!files?.length) return;

  uploading.value = true;
  error.value = '';
  try {
    const fd = new FormData();
    for (const f of Array.from(files)) fd.append('files', f);
    const created = await $fetch<AlbumImage[]>(base.value, { method: 'POST', body: fd });
    images.value.push(...created);
  } catch (err: any) {
    error.value = err?.statusMessage || err?.data?.statusMessage || '上傳失敗';
  } finally {
    uploading.value = false;
    input.value = '';
  }
};

const remove = async (img: AlbumImage) => {
  if (!confirm('確定刪除這張圖片？此動作無法復原。')) return;
  busy.value = true;
  error.value = '';
  try {
    await $fetch(`${base.value}/${img.id}`, { method: 'DELETE' });
    images.value = images.value.filter((i) => i.id !== img.id);
  } catch (err: any) {
    error.value = err?.statusMessage || err?.data?.statusMessage || '刪除失敗';
  } finally {
    busy.value = false;
  }
};

// 上/下移：交換相鄰兩筆，把新順序送後端
const move = async (index: number, dir: -1 | 1) => {
  const target = index + dir;
  if (target < 0 || target >= images.value.length) return;
  const list = [...images.value];
  [list[index], list[target]] = [list[target], list[index]];
  images.value = list;

  busy.value = true;
  error.value = '';
  try {
    await $fetch(`${base.value}/reorder`, {
      method: 'POST',
      body: { ids: list.map((i) => i.id) },
    });
  } catch (err: any) {
    error.value = err?.statusMessage || err?.data?.statusMessage || '排序失敗';
  } finally {
    busy.value = false;
  }
};
</script>

<template>
  <section class="album">
    <div class="head">
      <h2 class="title">相簿圖片</h2>
      <div class="upload">
        <input ref="fileInput" type="file" accept="image/*" multiple hidden @change="onPick" />
        <button type="button" class="btn-upload" :disabled="uploading" @click="fileInput?.click()">
          {{ uploading ? '上傳中…' : '⬆ 上傳圖片' }}
        </button>
      </div>
    </div>
    <p class="sub">共 {{ images.length }} 張。可多選一次上傳，用 ◀ ▶ 調整顯示順序。</p>

    <p v-if="error" class="error">{{ error }}</p>

    <div v-if="!images.length" class="empty">尚無相簿圖片，點右上「上傳圖片」開始。</div>

    <ul v-else class="grid" :class="{ 'is-busy': busy }">
      <li v-for="(img, i) in images" :key="img.id" class="item">
        <img :src="img.url" alt="" class="pic" />
        <div class="bar">
          <button title="左移" :disabled="i === 0 || busy" @click="move(i, -1)">◀</button>
          <button class="del" title="刪除" :disabled="busy" @click="remove(img)">刪除</button>
          <button title="右移" :disabled="i === images.length - 1 || busy" @click="move(i, 1)">▶</button>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.album {
  margin-top: 28px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: clamp(20px, 4vw, 28px);
  box-shadow: var(--shadow-sm);
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.title {
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--color-text);
}
.sub {
  margin-top: 6px;
  font-size: var(--fs-sm);
  color: var(--color-text-muted);
}

.btn-upload {
  flex-shrink: 0;
  padding: 9px 18px;
  border: none;
  border-radius: var(--radius-pill);
  background: var(--color-accent);
  color: #fff;
  font-size: var(--fs-sm);
  letter-spacing: 0.05em;
  cursor: pointer;
}
.btn-upload:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  margin-top: 12px;
  color: #b4493b;
  font-size: var(--fs-sm);
}

.empty {
  margin-top: 16px;
  padding: 40px 20px;
  text-align: center;
  color: var(--color-text-muted);
  background: var(--color-surface-2);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-sm);
}

.grid {
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 14px;
  transition: opacity 0.2s var(--ease);
}
.grid.is-busy {
  opacity: 0.6;
  pointer-events: none;
}

.item {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--color-surface-2);
}
.pic {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  gap: 6px;
}
.bar button {
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  border-radius: 5px;
  padding: 4px 8px;
  font-size: var(--fs-xs);
  color: var(--color-text-soft);
  cursor: pointer;
  line-height: 1;
}
.bar button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.bar .del {
  color: #b4493b;
  border-color: transparent;
}
.bar .del:hover:not(:disabled) {
  border-color: #b4493b;
}
</style>
