<script setup lang="ts">
import type { ProductDetail } from '~/types/product';

const props = defineProps<{ product: ProductDetail }>();

const images = computed(() => props.product.images);

const lightboxIndex = ref<number | null>(null);
const isOpen = computed(() => lightboxIndex.value !== null);
const currentImg = computed(() =>
  lightboxIndex.value !== null ? (images.value[lightboxIndex.value] ?? '') : '',
);
const counter = computed(() =>
  lightboxIndex.value !== null ? `${lightboxIndex.value + 1} / ${images.value.length}` : '',
);

const open = (i: number) => {
  lightboxIndex.value = i;
};
const close = () => {
  lightboxIndex.value = null;
};
const prev = () => {
  if (lightboxIndex.value === null) return;
  lightboxIndex.value = (lightboxIndex.value - 1 + images.value.length) % images.value.length;
};
const next = () => {
  if (lightboxIndex.value === null) return;
  lightboxIndex.value = (lightboxIndex.value + 1) % images.value.length;
};

// 鍵盤導覽
const onKey = (e: KeyboardEvent) => {
  if (lightboxIndex.value === null) return;
  if (e.key === 'Escape') close();
  if (e.key === 'ArrowLeft') prev();
  if (e.key === 'ArrowRight') next();
};

// 觸控滑動
let touchStartX = 0;
const onTouchStart = (e: TouchEvent) => {
  touchStartX = e.touches[0].clientX;
};
const onTouchEnd = (e: TouchEvent) => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) (diff > 0 ? next : prev)();
};

onMounted(() => window.addEventListener('keydown', onKey));
onUnmounted(() => window.removeEventListener('keydown', onKey));
</script>

<template>
  <section class="gallery container">
    <nav class="breadcrumb">
      <nuxt-link to="/" class="crumb-link">首頁</nuxt-link>
      <span class="crumb-sep">/</span>
      <nuxt-link to="/#works" class="crumb-link">完工作品</nuxt-link>
      <span class="crumb-sep">/</span>
      <span class="crumb-current">{{ product.name }}</span>
    </nav>

    <header class="gallery-head">
      <span class="section-eyebrow">Portfolio</span>
      <h1 class="section-title">{{ product.name }}</h1>
      <div class="section-rule"></div>
    </header>

    <p v-if="product.intro" class="intro">{{ product.intro }}</p>

    <div class="grid">
      <button
        v-for="(img, i) in images"
        :key="i"
        class="item"
        @click="open(i)"
        :aria-label="`放大檢視 ${product.name} 第 ${i + 1} 張`"
      >
        <img :src="img" :alt="`${product.name} ${i + 1}`" loading="lazy" />
      </button>
    </div>

    <div class="back-row">
      <nuxt-link to="/#works" class="back-btn">← 返回所有作品</nuxt-link>
    </div>

    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="isOpen"
          class="lightbox"
          @click.self="close"
          @touchstart="onTouchStart"
          @touchend="onTouchEnd"
        >
          <button class="lb-close" @click="close" aria-label="關閉">✕</button>
          <button class="lb-nav lb-prev" @click.stop="prev" aria-label="上一張">‹</button>
          <img :src="currentImg" class="lb-img" alt="" />
          <button class="lb-nav lb-next" @click.stop="next" aria-label="下一張">›</button>
          <div class="lb-counter">{{ counter }}</div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped>
.gallery {
  padding-top: calc(var(--header-h) + 28px);
}

.breadcrumb {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: var(--fs-xs);
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
  margin-bottom: 28px;
}

.crumb-link {
  color: var(--color-text-soft);
  transition: color 0.2s var(--ease);
}
.crumb-link:hover {
  color: var(--color-text);
}
.crumb-sep {
  color: var(--color-border);
}
.crumb-current {
  color: var(--color-text);
}

.gallery-head {
  text-align: center;
}

.intro {
  max-width: 760px;
  margin: 28px auto 0;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: 24px 28px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  font-size: var(--fs-sm);
  color: var(--color-text-soft);
  line-height: 2;
  text-indent: 2em;
  /* 讓超長且無空白的字串（如連續英文/數字）也能斷行，避免撐破版面 */
  overflow-wrap: break-word;
  word-break: break-word;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 40px;
}

.item {
  padding: 0;
  border: none;
  background: var(--color-surface);
  overflow: hidden;
  border-radius: var(--radius-sm);
  cursor: zoom-in;
  box-shadow: var(--shadow-sm);
  transition: transform 0.35s var(--ease), box-shadow 0.35s var(--ease);
}

.item:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.item img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  display: block;
  transition: transform 0.5s var(--ease);
}

.item:hover img {
  transform: scale(1.05);
}

.back-row {
  text-align: center;
  margin-top: 48px;
}

.back-btn {
  display: inline-block;
  padding: 12px 28px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  font-size: var(--fs-sm);
  letter-spacing: 0.08em;
  color: var(--color-text-soft);
  background: var(--color-surface);
  transition: border-color 0.25s var(--ease), color 0.25s var(--ease),
    transform 0.25s var(--ease);
}

.back-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-text);
  transform: translateY(-2px);
}

/* 燈箱 */
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(18, 17, 16, 0.94);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  touch-action: pan-y;
}

.lb-img {
  max-width: 94vw;
  max-height: 82vh;
  object-fit: contain;
  border-radius: var(--radius-sm);
  user-select: none;
  pointer-events: none;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
}

.lb-close {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  border-radius: var(--radius-pill);
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s var(--ease);
}
.lb-close:hover {
  background: rgba(255, 255, 255, 0.18);
}

.lb-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.08);
  border: none;
  color: #fff;
  font-size: 34px;
  line-height: 1;
  cursor: pointer;
  min-width: 52px;
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  transition: background 0.2s var(--ease);
}
.lb-nav:hover {
  background: rgba(255, 255, 255, 0.18);
}
.lb-prev {
  left: 6px;
}
.lb-next {
  right: 6px;
}

.lb-counter {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.6);
  font-size: var(--fs-xs);
  letter-spacing: 0.18em;
}

@media (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  .lb-nav {
    font-size: 44px;
    min-width: 60px;
  }
  .lb-prev {
    left: 18px;
  }
  .lb-next {
    right: 18px;
  }
  .lb-close {
    top: 18px;
    right: 18px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.22s var(--ease);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
