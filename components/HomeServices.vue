<script setup lang="ts">
import { services } from '~/data/site';
</script>

<template>
  <section id="services" class="services container">
    <span class="section-eyebrow">Services</span>
    <h2 class="section-title">服務項目</h2>
    <div class="section-rule"></div>
    <ul class="service-tags">
      <li v-for="s in services" :key="s" class="tag">{{ s }}</li>
    </ul>
  </section>
</template>

<style scoped>
.services {
  padding-top: var(--space-section);
  text-align: center;
}

.service-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 32px;
}

.tag {
  font-size: var(--fs-sm);
  padding: 9px 24px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  color: var(--color-text-soft);
  background: var(--color-surface);
  letter-spacing: 0.12em;
  transition: border-color 0.25s var(--ease), color 0.25s var(--ease),
    transform 0.25s var(--ease);
}

.tag:hover {
  border-color: var(--color-accent);
  color: var(--color-text);
  transform: translateY(-2px);
}
</style>
