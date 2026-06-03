// GET /api/admin/products/:id — 後台：取單一分類完整資料（編輯用）。需登入。
export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const id = Number(getRouterParam(event, 'id'));
  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, statusMessage: '無效的 id' });
  }

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { sortOrder: 'asc' } }, // 相簿圖片（編輯頁的相簿管理用）
      _count: { select: { images: true } },
    },
  });

  if (!product) {
    throw createError({ statusCode: 404, statusMessage: '找不到此分類' });
  }

  return product;
});
