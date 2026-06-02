// GET /api/products/:slug — 公開：單一分類詳情（詳情頁相簿用）
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: '缺少 slug' });
  }

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: 'asc' }, select: { url: true } },
    },
  });

  if (!product) {
    throw createError({ statusCode: 404, statusMessage: '找不到此分類' });
  }

  // 轉成前端 ProductGallery 需要的形狀（images 為網址字串陣列）
  return {
    slug: product.slug,
    name: product.name,
    intro: product.intro ?? undefined,
    images: product.images.map((img) => img.url),
    seo: {
      title: product.seoTitle ?? product.name,
      description: product.seoDescription ?? '',
      keywords: product.seoKeywords ?? '',
      ogImage: product.ogImage ?? product.cover,
    },
  };
});
