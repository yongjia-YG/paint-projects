<script setup lang="ts">
// 不套用公開網站的 header/footer，呈現乾淨的登入卡片
definePageMeta({ layout: false });

const route = useRoute();
const { fetch: refreshSession, loggedIn } = useUserSession();

// 是否為「首次設定」（資料庫還沒有任何管理員）
const { data: setup } = await useFetch('/api/auth/needs-setup');
const needsSetup = computed(() => setup.value?.needsSetup ?? false);

const email = ref('');
const password = ref('');
const name = ref('');
const error = ref('');
const loading = ref(false);

// 已登入就直接進後台
watchEffect(() => {
  if (loggedIn.value) navigateTo('/admin');
});

const submit = async () => {
  error.value = '';
  loading.value = true;
  try {
    const endpoint = needsSetup.value ? '/api/auth/register' : '/api/auth/login';
    await $fetch(endpoint, {
      method: 'POST',
      body: needsSetup.value
        ? { email: email.value, password: password.value, name: name.value }
        : { email: email.value, password: password.value },
    });
    await refreshSession(); // 重新抓 session，loggedIn 變 true
    const redirect = (route.query.redirect as string) || '/admin';
    await navigateTo(redirect);
  } catch (e: any) {
    error.value = e?.statusMessage || e?.data?.statusMessage || '操作失敗，請再試一次';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <img src="/icons/GD-Photoroom.png" alt="" class="login-logo" />
      <h1 class="login-title">
        {{ needsSetup ? '首次設定 · 建立管理員' : '後台登入' }}
      </h1>
      <p class="login-sub">
        {{ needsSetup ? '尚無管理員帳號，請建立第一個帳號' : '永嘉塗裝設計 · 內容管理' }}
      </p>

      <form class="login-form" @submit.prevent="submit">
        <label v-if="needsSetup" class="field">
          <span>名稱</span>
          <input v-model="name" type="text" placeholder="你的名字" autocomplete="name" />
        </label>

        <label class="field">
          <span>Email</span>
          <input v-model="email" type="email" required autocomplete="username" placeholder="you@example.com" />
        </label>

        <label class="field">
          <span>密碼</span>
          <input
            v-model="password"
            type="password"
            required
            :autocomplete="needsSetup ? 'new-password' : 'current-password'"
            :placeholder="needsSetup ? '至少 8 碼' : '密碼'"
          />
        </label>

        <p v-if="error" class="login-error">{{ error }}</p>

        <button type="submit" class="login-btn" :disabled="loading">
          {{ loading ? '處理中…' : needsSetup ? '建立並登入' : '登入' }}
        </button>
      </form>

      <NuxtLink to="/" class="login-back">← 回到網站</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  padding: 24px;
}

.login-card {
  width: 100%;
  max-width: 380px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: 40px 32px;
  text-align: center;
}

.login-logo {
  height: 48px;
  width: auto;
  margin-bottom: 18px;
}

.login-title {
  font-size: 1.4rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--color-text);
}

.login-sub {
  margin-top: 8px;
  font-size: var(--fs-sm);
  color: var(--color-text-muted);
}

.login-form {
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field span {
  font-size: var(--fs-xs);
  letter-spacing: 0.08em;
  color: var(--color-text-soft);
}

.field input {
  width: 100%;
  padding: 11px 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--fs-sm);
  color: var(--color-text);
  background: var(--color-surface-2);
  transition: border-color 0.2s var(--ease);
}

.field input:focus {
  outline: none;
  border-color: var(--color-accent);
}

.login-error {
  color: #b4493b;
  font-size: var(--fs-sm);
  letter-spacing: 0.02em;
}

.login-btn {
  margin-top: 4px;
  padding: 13px;
  border: none;
  border-radius: var(--radius-pill);
  background: var(--color-accent);
  color: #fff;
  font-size: var(--fs-sm);
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: opacity 0.2s var(--ease), transform 0.2s var(--ease);
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-1px);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-back {
  display: inline-block;
  margin-top: 22px;
  font-size: var(--fs-xs);
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
}

.login-back:hover {
  color: var(--color-text);
}
</style>
