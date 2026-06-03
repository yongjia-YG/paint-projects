// POST /api/admin/products — 後台：新增分類。需登入。
import { Prisma } from '@prisma/client';

export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const input = await readProductInput(event);

  // 新分類排到最後：取目前最大 sortOrder + 1
  const last = await prisma.product.findFirst({
    orderBy: { sortOrder: 'desc' },
    select: { sortOrder: true },
  });
  const sortOrder = (last?.sortOrder ?? -1) + 1;

  try {
    const product = await prisma.product.create({
      data: { ...input, sortOrder },
    });
    return product;
  } catch (e) {
    // P2002 = 唯一鍵衝突（slug 重複）
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      throw createError({ statusCode: 409, statusMessage: `slug「${input.slug}」已存在` });
    }
    throw e;
  }
});
