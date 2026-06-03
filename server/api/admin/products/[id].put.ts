// PUT /api/admin/products/:id — 後台：更新分類。需登入。
import { Prisma } from '@prisma/client';

export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const id = Number(getRouterParam(event, 'id'));
  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, statusMessage: '無效的 id' });
  }

  const input = await readProductInput(event);

  try {
    const product = await prisma.product.update({
      where: { id },
      data: input, // sortOrder 不在這裡改（由 reorder 端點處理）
    });
    return product;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        throw createError({ statusCode: 409, statusMessage: `slug「${input.slug}」已存在` });
      }
      if (e.code === 'P2025') {
        throw createError({ statusCode: 404, statusMessage: '找不到此分類' });
      }
    }
    throw e;
  }
});
