<script setup lang="ts">
import { site } from '~/data/site';
</script>

<template>
  <section class="hero">
    <div class="hero-bg" :style="{ backgroundImage: `url(${site.heroImage})` }" aria-hidden="true"></div>
    <div class="hero-scrim"></div>
    <div class="hero-content container">
      <span class="hero-eyebrow">{{ site.brandEn }} · {{ site.brand }}</span>
      <h1 class="hero-title">{{ site.slogan }}</h1>
      <p class="hero-desc">{{ site.description }}</p>
      <div class="hero-actions">
        <a href="#works" class="btn btn-light">瀏覽完工作品<span class="btn-arrow">↓</span></a>
        <a href="#contact" class="btn btn-ghost">免費諮詢報價</a>
      </div>
    </div>
    <a href="#about" class="hero-scroll" aria-label="向下捲動">
      <span class="hero-scroll-dot"></span>
    </a>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  isolation: isolate;
}

.hero-bg {
  position: absolute;
  inset: 0;
  z-index: -2;
  background-size: cover;
  background-position: center;
  transform: scale(1.06);
  animation: heroZoom 20s ease-in-out infinite alternate;
}

@keyframes heroZoom {
  from {
    transform: scale(1.06);
  }
  to {
    transform: scale(1.16);
  }
}

.hero-scrim {
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(
    180deg,
    rgba(20, 19, 17, 0.34) 0%,
    rgba(20, 19, 17, 0.2) 42%,
    rgba(20, 19, 17, 0.62) 100%
  );
}

.hero-content {
  color: #fff;
  padding-top: var(--header-h);
}

.hero-eyebrow {
  display: block;
  font-size: var(--fs-xs);
  letter-spacing: 0.36em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.82);
  margin-bottom: 24px;
}

.hero-title {
  font-size: var(--fs-hero);
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: 0.04em;
  text-shadow: 0 2px 30px rgba(0, 0, 0, 0.35);
}

.hero-desc {
  margin-top: 22px;
  max-width: 34em;
  font-size: clamp(0.95rem, 2vw, 1.12rem);
  line-height: 1.9;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 300;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 40px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 30px;
  font-size: var(--fs-sm);
  letter-spacing: 0.1em;
  border-radius: var(--radius-pill);
  transition: transform 0.3s var(--ease), box-shadow 0.3s var(--ease),
    background 0.3s var(--ease), color 0.3s var(--ease);
}

.btn-light {
  color: var(--color-text);
  background: #fff;
  box-shadow: var(--shadow-md);
}

.btn-light:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-arrow {
  transition: transform 0.3s var(--ease);
}

.btn-light:hover .btn-arrow {
  transform: translateY(3px);
}

.btn-ghost {
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.55);
}

.btn-ghost:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: #fff;
}

.hero-scroll {
  position: absolute;
  bottom: 26px;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 40px;
  border: 1.5px solid rgba(255, 255, 255, 0.6);
  border-radius: var(--radius-pill);
  display: flex;
  justify-content: center;
  padding-top: 7px;
}

.hero-scroll-dot {
  width: 4px;
  height: 8px;
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.9);
  animation: scrollDot 1.6s var(--ease) infinite;
}

@keyframes scrollDot {
  0% {
    opacity: 0;
    transform: translateY(0);
  }
  40% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(12px);
  }
}
</style>
