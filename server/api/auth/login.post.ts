// POST /api/auth/login — 驗證帳密，成功就建立登入 session
export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string; password?: string }>(event);
  const email = body?.email?.trim().toLowerCase();
  const password = body?.password ?? '';

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: '請輸入 email 與密碼' });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // 找不到使用者，或密碼不符 —— 都回相同錯誤，避免洩漏「帳號是否存在」
  if (!user || !(await verifyPassword(user.passwordHash, password))) {
    throw createError({ statusCode: 401, statusMessage: 'email 或密碼錯誤' });
  }

  // 寫入加密 Cookie session（只放非機密、需要的欄位；絕不放 passwordHash）
  await setUserSession(event, {
    user: { id: user.id, email: user.email, name: user.name },
  });

  return { ok: true };
});
