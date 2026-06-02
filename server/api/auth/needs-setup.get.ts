// GET /api/auth/needs-setup — 是否還沒有任何管理員（決定登入頁顯示「登入」或「首次建立帳號」）
export default defineEventHandler(async () => {
  const count = await prisma.user.count();
  return { needsSetup: count === 0 };
});
