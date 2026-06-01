<script setup lang="ts">
import { site } from '~/data/site';

useHead({
  title: site.brand,
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
