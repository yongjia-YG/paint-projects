// POST /api/admin/products/:id/publish — 後台：設定分類上架/下架。需登入。
// body: { published: boolean }（前端送出想要的狀態）
import { Prisma } from '@prisma/client';

export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const id = Number(getRouterParam(event, 'id'));
  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, statusMessage: '無效的 id' });
  }

  const body = await readBody<{ published?: unknown }>(event);
  if (typeof body?.published !== 'boolean') {
    throw createError({ statusCode: 400, statusMessage: 'published 必須是布林值' });
  }

  try {
    const product = await prisma.product.update({
      where: { id },
      data: { published: body.published },
      select: { id: true, published: true },
    });
    return product;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
      throw createError({ statusCode: 404, statusMessage: '找不到此分類' });
    }
    throw e;
  }
});
