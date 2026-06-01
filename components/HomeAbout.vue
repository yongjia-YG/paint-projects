<script setup lang="ts">
import { about } from '~/data/site';
</script>

<template>
  <section id="about" class="about container">
    <div class="about-head">
      <span class="section-eyebrow">About Us</span>
      <h2 class="section-title">關於永嘉</h2>
      <div class="section-rule"></div>
    </div>

    <p class="about-lead">
      <template v-for="(line, i) in about.lead" :key="i">{{ line }}<br /></template>
    </p>
    <p class="about-tagline">{{ about.tagline }}</p>

    <div class="advantages">
      <article v-for="(adv, i) in about.advantages" :key="i" class="adv-card">
        <span class="adv-no">{{ String(i + 1).padStart(2, '0') }}</span>
        <h3 class="adv-title">{{ adv.title }}</h3>
        <p class="adv-desc">{{ adv.desc }}</p>
      </article>
    </div>

    <div class="about-scope">
      <span v-for="s in about.scope" :key="s" class="scope-tag">{{ s }}</span>
    </div>
    <p class="about-closing">{{ about.closing }}</p>
  </section>
</template>

<style scoped>
.about {
  padding-top: var(--space-section);
}

.about-head {
  text-align: center;
}

.about-lead {
  max-width: 640px;
  margin: 36px auto 0;
  text-align: center;
  font-size: clamp(1rem, 2.2vw, 1.15rem);
  line-height: 2.1;
  color: var(--color-text-soft);
  font-weight: 300;
}

.about-tagline {
  text-align: center;
  margin-top: 20px;
  font-size: var(--fs-body);
  letter-spacing: 0.08em;
  color: var(--color-accent-soft);
  font-weight: 500;
}

.advantages {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-top: 48px;
}

.adv-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 26px 24px;
  box-shadow: var(--shadow-sm);
  transition: transform 0.3s var(--ease), box-shadow 0.3s var(--ease);
}

.adv-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.adv-no {
  display: block;
  font-size: var(--fs-sm);
  letter-spacing: 0.2em;
  color: var(--color-accent-soft);
  margin-bottom: 12px;
}

.adv-title {
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  margin-bottom: 10px;
  color: var(--color-text);
}

.adv-desc {
  font-size: var(--fs-sm);
  line-height: 1.9;
  color: var(--color-text-soft);
}

.about-scope {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 48px;
}

.scope-tag {
  font-size: var(--fs-sm);
  padding: 8px 18px;
  border-radius: var(--radius-pill);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  color: var(--color-text-soft);
  letter-spacing: 0.1em;
}

.about-closing {
  max-width: 560px;
  margin: 24px auto 0;
  text-align: center;
  font-size: var(--fs-sm);
  line-height: 2;
  color: var(--color-text-muted);
}

@media (min-width: 640px) {
  .advantages {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 960px) {
  .advantages {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
