<script setup lang="ts">
import { site, contact, services } from '~/data/site';
</script>

<template>
  <footer id="contact" class="footer">
    <div class="footer-inner container">
      <div class="footer-brand">
        <img src="/icons/GD-Photoroom.png" alt="" class="footer-logo" />
        <p class="footer-name">{{ site.brand }}</p>
        <p class="footer-slogan">{{ site.slogan }}</p>
      </div>

      <div class="footer-col">
        <h3 class="footer-h">服務項目</h3>
        <ul class="footer-list">
          <li v-for="s in services" :key="s">{{ s }}</li>
        </ul>
      </div>

      <div class="footer-col">
        <h3 class="footer-h">聯絡我們</h3>
        <div class="footer-contacts">
          <a :href="contact.phoneHref" class="footer-contact">
            <img src="/icons/phone.png" alt="" />
            <span>{{ contact.person }}．{{ contact.phone }}</span>
          </a>
          <a :href="contact.line" class="footer-contact" target="_blank" rel="noopener">
            <img src="/icons/line.png" alt="" />
            <span>LINE 線上諮詢</span>
          </a>
          <a :href="contact.facebook" class="footer-contact" target="_blank" rel="noopener">
            <img src="/icons/facebook.png" alt="" />
            <span>Facebook 粉絲專頁</span>
          </a>
          <p class="footer-address">{{ contact.address }}</p>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <span>© {{ site.brand }}．保留一切權利</span>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--color-accent);
  color: rgba(255, 255, 255, 0.78);
  margin-top: var(--space-section);
}

.footer-inner {
  display: grid;
  grid-template-columns: 1fr;
  gap: 36px;
  padding-top: clamp(40px, 7vw, 72px);
  padding-bottom: 40px;
}

.footer-logo {
  height: 44px;
  width: auto;
  filter: brightness(0) invert(1);
  opacity: 0.92;
  margin-bottom: 14px;
}

.footer-name {
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  color: #fff;
  margin-bottom: 8px;
}

.footer-slogan {
  font-size: var(--fs-sm);
  letter-spacing: 0.06em;
  line-height: 1.8;
}

.footer-h {
  font-size: var(--fs-sm);
  font-weight: 600;
  letter-spacing: 0.18em;
  color: #fff;
  margin-bottom: 16px;
}

.footer-list {
  display: grid;
  grid-template-columns: repeat(2, max-content);
  gap: 10px 28px;
  font-size: var(--fs-sm);
  letter-spacing: 0.06em;
}

.footer-contacts {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.footer-contact {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: var(--fs-sm);
  letter-spacing: 0.06em;
  transition: color 0.2s var(--ease);
}

.footer-contact img {
  width: 20px;
  height: 20px;
  filter: brightness(0) invert(1);
  opacity: 0.85;
}

.footer-contact:hover {
  color: #fff;
}

.footer-address {
  margin-top: 4px;
  font-size: var(--fs-xs);
  letter-spacing: 0.06em;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.6);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  padding: 22px 0;
  text-align: center;
  font-size: var(--fs-xs);
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.55);
}

@media (min-width: 720px) {
  .footer-inner {
    grid-template-columns: 1.4fr 1fr 1fr;
    gap: 48px;
  }
}
</style>
