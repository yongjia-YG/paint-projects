<script setup lang="ts">
// 從資料庫讀取分類列表（SSR 時於伺服器端取得）
const { data: products } = await useFetch('/api/products', {
  default: () => [],
});
</script>

<template>
  <section id="works" class="works container">
    <span class="section-eyebrow">Portfolio</span>
    <h2 class="section-title">完工作品</h2>
    <div class="section-rule"></div>

    <div class="grid">
      <nuxt-link
        v-for="product in products"
        :key="product.slug"
        :to="`/products/${product.slug}`"
        class="card"
      >
        <div class="card-media">
          <video
            v-if="product.coverType === 'video'"
            :src="product.cover"
            class="card-img"
            autoplay
            loop
            muted
            playsinline
          ></video>
          <img v-else :src="product.cover" :alt="product.name" class="card-img" loading="lazy" />
        </div>
        <div class="card-body">
          <span class="card-name">{{ product.name }}</span>
          <span class="card-cta">查看作品 →</span>
        </div>
      </nuxt-link>
    </div>
  </section>
</template>

<style scoped>
.works {
  padding-top: var(--space-section);
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-top: 40px;
}

.card {
  display: flex;
  flex-direction: column;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: transform 0.35s var(--ease), box-shadow 0.35s var(--ease);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.card-media {
  overflow: hidden;
}

.card-img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  display: block;
  transition: transform 0.5s var(--ease);
}

.card:hover .card-img {
  transform: scale(1.05);
}

/* 手機：直向堆疊，避免名稱與 CTA 擠在同一行 */
.card-body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3px;
  padding: 11px 13px;
}

.card-name {
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: var(--color-text);
  line-height: 1.4;
}

.card-cta {
  font-size: var(--fs-xs);
  letter-spacing: 0.04em;
  color: var(--color-accent-soft);
  white-space: nowrap;
}

@media (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 22px;
  }

  /* 桌機：回到單行左右排列 + hover 滑出 CTA */
  .card-body {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 15px 16px;
  }

  .card-name {
    font-size: var(--fs-body);
    font-weight: 500;
  }

  .card-cta {
    color: var(--color-text-muted);
    opacity: 0;
    transform: translateX(-4px);
    transition: opacity 0.3s var(--ease), transform 0.3s var(--ease);
  }

  .card:hover .card-cta {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
