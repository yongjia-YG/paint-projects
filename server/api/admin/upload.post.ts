// POST /api/admin/upload — 後台：通用單檔圖片上傳（封面用）。需登入。
// 收 multipart/form-data 的 file 欄位 → 上傳 Cloudinary → 回 { url, publicId }。
// 注意：這支只負責上傳，不寫資料庫。封面網址由表單存進 product.cover。
export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const parts = await readMultipartFormData(event);
  const file = parts?.find((p) => p.name === 'file');
  assertImageFile(file);

  const { url, publicId } = await uploadImage(file.data, 'yongjia/covers');
  return { url, publicId };
});
