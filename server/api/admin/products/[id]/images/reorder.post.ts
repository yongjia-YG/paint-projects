// POST /api/admin/products/:id/images/reorder — 後台：重設某分類相簿圖片的排序。需登入。
// body: { ids: number[] }（前端送出新的排列順序）
export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const id = Number(getRouterParam(event, 'id'));
  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, statusMessage: '無效的 id' });
  }

  const body = await readBody<{ ids?: unknown }>(event);
  const ids = Array.isArray(body?.ids) ? body.ids : null;
  if (!ids || !ids.every((x) => Number.isInteger(x))) {
    throw createError({ statusCode: 400, statusMessage: 'ids 必須是整數陣列' });
  }

  // 只更新屬於本分類的圖片（where 同時限定 productId，避免動到別的分類）
  await prisma.$transaction(
    (ids as number[]).map((imageId, index) =>
      prisma.productImage.updateMany({
        where: { id: imageId, productId: id },
        data: { sortOrder: index },
      }),
    ),
  );

  return { ok: true };
});
