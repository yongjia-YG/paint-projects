// GET /api/products — 公開：作品分類列表（首頁卡片用）
export default defineEventHandler(async () => {
  const products = await prisma.product.findMany({
    where: { published: true }, // 只回傳上架的分類
    orderBy: { sortOrder: 'asc' },
    select: {
      slug: true,
      name: true,
      cover: true,
      coverType: true,
    },
  });

  return products;
});
