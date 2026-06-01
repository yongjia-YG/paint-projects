<script setup lang="ts">
import { site } from '~/data/site';

const nav = [
  { label: '關於', to: '/#about' },
  { label: '服務', to: '/#services' },
  { label: '作品', to: '/#works' },
  { label: '聯絡', to: '/#contact' },
];

const scrolled = ref(false);
const onScroll = () => {
  scrolled.value = window.scrollY > 12;
};
onMounted(() => {
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
});
onUnmounted(() => window.removeEventListener('scroll', onScroll));
</script>

<template>
  <header class="header" :class="{ 'is-scrolled': scrolled }">
    <div class="header-inner container">
      <nuxt-link to="/" class="brand" aria-label="回首頁">
        <img src="/icons/GD-Photoroom.png" alt="" class="brand-logo" />
        <span class="brand-name">{{ site.brand }}</span>
      </nuxt-link>

      <nav class="nav">
        <nuxt-link v-for="item in nav" :key="item.to" :to="item.to" class="nav-link">
          {{ item.label }}
        </nuxt-link>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: var(--header-h);
  z-index: 100;
  display: flex;
  align-items: center;
  transition: background 0.3s var(--ease), border-color 0.3s var(--ease),
    box-shadow 0.3s var(--ease);
  background: transparent;
  border-bottom: 1px solid transparent;
}

.header.is-scrolled {
  background: rgba(245, 243, 240, 0.8);
  backdrop-filter: saturate(180%) blur(14px);
  -webkit-backdrop-filter: saturate(180%) blur(14px);
  border-bottom-color: var(--color-border);
  box-shadow: var(--shadow-sm);
}

.header-inner {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-logo {
  height: 38px;
  width: auto;
  display: block;
}

.brand-name {
  font-size: var(--fs-sm);
  font-weight: 600;
  letter-spacing: 0.12em;
  color: var(--color-text);
}

.nav {
  display: flex;
  align-items: center;
  gap: clamp(14px, 4vw, 34px);
}

.nav-link {
  position: relative;
  font-size: var(--fs-sm);
  letter-spacing: 0.1em;
  color: var(--color-text-soft);
  padding: 6px 0;
  transition: color 0.25s var(--ease);
}

.nav-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1.5px;
  background: var(--color-accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s var(--ease);
}

.nav-link:hover {
  color: var(--color-text);
}

.nav-link:hover::after {
  transform: scaleX(1);
}

@media (max-width: 480px) {
  .brand-name {
    display: none;
  }
}
</style>
