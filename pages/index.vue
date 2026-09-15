<script setup lang="ts">
import { site } from '~/data/site';

useHead({
  title: '永嘉塗裝設計有限公司 - 微水泥・藝術塗料・統包工程｜基隆塗裝設計',
  meta: [{ name: 'description', content: site.description }],
});
</script>

<template>
  <div>
    <HomeHero />
    <HomeAbout />
    <HomeServices />
    <HomeWorks />
  </div>
</template>
