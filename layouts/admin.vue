<script setup lang="ts">
const { user, clear } = useUserSession();

const logout = async () => {
  await $fetch('/api/auth/logout', { method: 'POST' });
  await clear(); // 清掉前端 session 狀態
  await navigateTo('/login');
};
</script>

<template>
  <div class="admin">
    <header class="admin-bar">
      <div class="admin-bar-inner">
        <NuxtLink to="/admin" class="admin-brand">
          <img src="/icons/GD-Photoroom.png" alt="" />
          <span>內容管理</span>
        </NuxtLink>
        <div class="admin-user">
          <span class="admin-name">{{ user?.name }}</span>
          <a href="/" target="_blank" class="admin-link">看網站 ↗</a>
          <button class="admin-logout" @click="logout">登出</button>
        </div>
      </div>
    </header>

    <main class="admin-main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.admin {
  min-height: 100vh;
  background: var(--color-bg);
}

.admin-bar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

.admin-bar-inner {
  max-width: 1080px;
  margin: 0 auto;
  height: 60px;
  padding: 0 clamp(16px, 4vw, 28px);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.admin-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: var(--fs-sm);
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--color-text);
}

.admin-brand img {
  height: 30px;
  width: auto;
}

.admin-user {
  display: flex;
  align-items: center;
  gap: 18px;
}

.admin-name {
  font-size: var(--fs-sm);
  color: var(--color-text-soft);
}

.admin-link {
  font-size: var(--fs-xs);
  color: var(--color-text-muted);
}

.admin-link:hover {
  color: var(--color-text);
}

.admin-logout {
  padding: 7px 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  background: transparent;
  font-size: var(--fs-xs);
  letter-spacing: 0.06em;
  color: var(--color-text-soft);
  cursor: pointer;
  transition: border-color 0.2s var(--ease), color 0.2s var(--ease);
}

.admin-logout:hover {
  border-color: var(--color-accent);
  color: var(--color-text);
}

.admin-main {
  max-width: 1080px;
  margin: 0 auto;
  padding: clamp(24px, 5vw, 44px) clamp(16px, 4vw, 28px);
}
</style>
