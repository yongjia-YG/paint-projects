// POST /api/auth/register — 僅在「尚無任何管理員」時可用，建立第一個管理員帳號。
// 解決雞生蛋問題：第一個帳號沒人能幫你建，所以開放一次性 bootstrap。
// 之後要新增同事帳號，走後台（Phase 3）受保護的 API。
export default defineEventHandler(async (event) => {
  const existing = await prisma.user.count();
  if (existing > 0) {
    // 已有管理員 → 不能再用這支端點公開註冊
    throw createError({ statusCode: 403, statusMessage: '已存在管理員，無法再次初始化' });
  }

  const body = await readBody<{ email?: string; password?: string; name?: string }>(event);
  const email = body?.email?.trim().toLowerCase();
  const password = body?.password ?? '';
  const name = body?.name?.trim() || '管理員';

  if (!email || !email.includes('@')) {
    throw createError({ statusCode: 400, statusMessage: '請輸入有效的 email' });
  }
  if (password.length < 8) {
    throw createError({ statusCode: 400, statusMessage: '密碼至少需 8 碼' });
  }

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash: await hashPassword(password), // 用 scrypt 雜湊，永不存明碼
    },
  });

  // 建立後直接登入
  await setUserSession(event, {
    user: { id: user.id, email: user.email, name: user.name },
  });

  return { ok: true };
});
