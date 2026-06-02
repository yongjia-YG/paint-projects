// 具名路由中介層：在需要保護的頁面用 definePageMeta({ middleware: 'auth' }) 套用。
// 未登入就導去 /login（並帶上原本要去的路徑，登入後可導回）。
export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession();
  if (!loggedIn.value) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
  }
});
