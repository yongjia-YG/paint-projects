// POST /api/admin/products/reorder — 後台：依傳入的 id 順序重設 sortOrder。需登入。
// body: { ids: number[] }（前端送出新的排列順序）
export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const body = await readBody<{ ids?: unknown }>(event);
  const ids = Array.isArray(body?.ids) ? body.ids : null;

  if (!ids || !ids.every((x) => Number.isInteger(x))) {
    throw createError({ statusCode: 400, statusMessage: 'ids 必須是整數陣列' });
  }

  // 用 transaction 一次更新，確保全部成功或全部不變
  await prisma.$transaction(
    (ids as number[]).map((id, index) =>
      prisma.product.update({ where: { id }, data: { sortOrder: index } }),
    ),
  );

  return { ok: true };
});
