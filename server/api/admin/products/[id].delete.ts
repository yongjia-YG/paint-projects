// DELETE /api/admin/products/:id — 後台：刪除分類（相簿圖片會因 onDelete: Cascade 一併刪除）。需登入。
import { Prisma } from '@prisma/client';

export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const id = Number(getRouterParam(event, 'id'));
  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, statusMessage: '無效的 id' });
  }

  try {
    await prisma.product.delete({ where: { id } });
    return { ok: true };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
      throw createError({ statusCode: 404, statusMessage: '找不到此分類' });
    }
    throw e;
  }
});
