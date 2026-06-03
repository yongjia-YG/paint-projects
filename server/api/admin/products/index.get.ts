// GET /api/admin/products — 後台：分類列表（含圖片數）。需登入。
export default defineEventHandler(async (event) => {
  await requireUserSession(event); // 未登入 → 401

  return prisma.product.findMany({
    orderBy: { sortOrder: 'asc' },
    select: {
      id: true,
      slug: true,
      name: true,
      cover: true,
      coverType: true,
      published: true,
      sortOrder: true,
      _count: { select: { images: true } },
    },
  });
});
