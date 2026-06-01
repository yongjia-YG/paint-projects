<template>
  <div class="site">
    <TheHeader />
    <main class="site-main">
      <slot />
    </main>
    <TheFooter />
  </div>
</template>

<style scoped>
.site {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.site-main {
  flex: 1;
}
</style>
