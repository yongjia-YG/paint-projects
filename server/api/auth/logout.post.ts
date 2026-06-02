// POST /api/auth/logout — 清除登入 session
export default defineEventHandler(async (event) => {
  await clearUserSession(event);
  return { ok: true };
});
