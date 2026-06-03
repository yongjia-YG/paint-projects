// 共用：Cloudinary 設定與上傳/刪除。Nitro 會自動匯入 server/utils 的具名匯出。
// 為什麼用 Cloudinary：免費主機（Render）的硬碟是暫時的，重新部署就清空，圖片要放外部物件儲存。
// 文件：https://cloudinary.com/documentation/node_integration
import { v2 as cloudinary } from 'cloudinary';
import type { MultiPartData } from 'h3';

const MAX_BYTES = 10 * 1024 * 1024; // 單檔上限 10MB

let configured = false;

// 第一次用到時才依 runtimeConfig 設定金鑰（避免模組載入時就讀環境變數）。
function getCloudinary() {
  if (!configured) {
    const c = useRuntimeConfig();
    if (!c.cloudinaryCloudName || !c.cloudinaryApiKey || !c.cloudinaryApiSecret) {
      throw createError({ statusCode: 500, statusMessage: 'Cloudinary 環境變數未設定（CLOUDINARY_*）' });
    }
    cloudinary.config({
      cloud_name: c.cloudinaryCloudName as string,
      api_key: c.cloudinaryApiKey as string,
      api_secret: c.cloudinaryApiSecret as string,
    });
    configured = true;
  }
  return cloudinary;
}

// 驗證 multipart 收到的單一檔案是合法圖片（後端再驗一次，前端驗證可被繞過）。
export function assertImageFile(file: MultiPartData | undefined): asserts file is MultiPartData {
  if (!file?.filename || !file.data?.length) {
    throw createError({ statusCode: 400, statusMessage: '沒有收到檔案' });
  }
  if (!file.type || !file.type.startsWith('image/')) {
    throw createError({ statusCode: 400, statusMessage: '只接受圖片檔' });
  }
  if (file.data.length > MAX_BYTES) {
    throw createError({ statusCode: 413, statusMessage: '圖片過大（上限 10MB）' });
  }
}

// 上傳一個圖片 buffer 到 Cloudinary，回傳網址與 public_id。
export function uploadImage(buffer: Buffer, folder = 'yongjia'): Promise<{ url: string; publicId: string }> {
  const cld = getCloudinary();
  return new Promise((resolve, reject) => {
    const stream = cld.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (err, result) => {
        if (err || !result) {
          reject(err ?? createError({ statusCode: 502, statusMessage: '圖片上傳失敗' }));
          return;
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      },
    );
    stream.end(buffer);
  });
}

// 從 Cloudinary 刪除一個檔案。刪不掉不應擋住資料庫刪除，故吞掉錯誤。
export async function destroyImage(publicId: string | null | undefined) {
  if (!publicId) return;
  try {
    await getCloudinary().uploader.destroy(publicId);
  } catch {
    // 忽略：雲端刪除失敗（例如檔案已不存在）不影響資料庫資料的正確性
  }
}
