// 共用：驗證並整理「分類」表單送來的資料（給新增/編輯 API 用）
import type { H3Event } from 'h3';

export interface ProductInput {
  slug: string;
  name: string;
  intro: string | null;
  cover: string;
  coverType: string;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  ogImage: string | null;
}

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
const orNull = (v: unknown) => {
  const s = str(v);
  return s === '' ? null : s;
};

export async function readProductInput(event: H3Event): Promise<ProductInput> {
  const body = await readBody<Record<string, unknown>>(event);

  const name = str(body?.name);
  const slug = str(body?.slug);
  const cover = str(body?.cover);
  const coverType = str(body?.coverType) || 'image';

  if (!name) throw createError({ statusCode: 400, statusMessage: '請輸入名稱' });
  if (!slug) throw createError({ statusCode: 400, statusMessage: '請輸入 slug（路由名稱）' });
  // slug 只允許英數、底線、連字號（camelCase 也通過）
  if (!/^[A-Za-z0-9_-]+$/.test(slug)) {
    throw createError({ statusCode: 400, statusMessage: 'slug 只能用英數字、- 或 _' });
  }
  if (coverType !== 'image' && coverType !== 'video') {
    throw createError({ statusCode: 400, statusMessage: 'coverType 必須是 image 或 video' });
  }

  return {
    slug,
    name,
    intro: orNull(body?.intro),
    cover,
    coverType,
    seoTitle: orNull(body?.seoTitle),
    seoDescription: orNull(body?.seoDescription),
    seoKeywords: orNull(body?.seoKeywords),
    ogImage: orNull(body?.ogImage),
  };
}
