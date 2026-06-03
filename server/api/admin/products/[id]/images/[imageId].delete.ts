// DELETE /api/admin/products/:id/images/:imageId — 後台：刪除一張相簿圖片（連帶刪 Cloudinary 檔）。需登入。
import { Prisma } from '@prisma/client';

export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const imageId = Number(getRouterParam(event, 'imageId'));
  if (!Number.isInteger(imageId)) {
    throw createError({ statusCode: 400, statusMessage: '無效的圖片 id' });
  }

  const image = await prisma.productImage.findUnique({ where: { id: imageId } });
  if (!image) {
    throw createError({ statusCode: 404, statusMessage: '找不到此圖片' });
  }

  // 先刪雲端檔（失敗不擋），再刪資料庫紀錄
  await destroyImage(image.publicId);

  try {
    await prisma.productImage.delete({ where: { id: imageId } });
    return { ok: true };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
      throw createError({ statusCode: 404, statusMessage: '找不到此圖片' });
    }
    throw e;
  }
});
