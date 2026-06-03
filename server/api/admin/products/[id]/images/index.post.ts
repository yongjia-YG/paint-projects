// POST /api/admin/products/:id/images — 後台：上傳一或多張相簿圖片到某分類。需登入。
// 收 multipart/form-data（欄位名 files，可多檔）→ 逐張上傳 Cloudinary → 建立 ProductImage 紀錄。
export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const id = Number(getRouterParam(event, 'id'));
  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, statusMessage: '無效的 id' });
  }

  // 確認分類存在（避免上傳到不存在的分類）
  const product = await prisma.product.findUnique({ where: { id }, select: { id: true } });
  if (!product) {
    throw createError({ statusCode: 404, statusMessage: '找不到此分類' });
  }

  const parts = await readMultipartFormData(event);
  const files = parts?.filter((p) => p.name === 'files' && p.filename) ?? [];
  if (!files.length) {
    throw createError({ statusCode: 400, statusMessage: '沒有收到檔案' });
  }
  files.forEach(assertImageFile);

  // 新圖片接在現有最大 sortOrder 之後
  const last = await prisma.productImage.findFirst({
    where: { productId: id },
    orderBy: { sortOrder: 'desc' },
    select: { sortOrder: true },
  });
  let order = (last?.sortOrder ?? -1) + 1;

  // 逐張上傳（依序處理以維持送來的順序），再寫入資料庫
  const created = [];
  for (const file of files) {
    const { url, publicId } = await uploadImage(file.data, `yongjia/${id}`);
    const img = await prisma.productImage.create({
      data: { productId: id, url, publicId, sortOrder: order++ },
    });
    created.push(img);
  }

  return created;
});
