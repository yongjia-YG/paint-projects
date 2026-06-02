// Seed：把現有 data/products.ts 的 12 個分類匯入資料庫。
// 執行：npx prisma db seed
// （需要 .env 的 DATABASE_URL 指向可連線的資料庫）
//
// 此腳本可重複執行（upsert）：同 slug 會更新而非重複建立。

import { PrismaClient } from '@prisma/client';
import { products } from '../data/products';

const prisma = new PrismaClient();

async function main() {
  console.log(`開始匯入 ${products.length} 個分類…`);

  for (const [index, p] of products.entries()) {
    // 先 upsert 分類本身
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        intro: p.intro ?? null,
        cover: p.cover,
        coverType: p.coverType ?? 'image',
        sortOrder: index,
        seoTitle: p.seo.title,
        seoDescription: p.seo.description,
        seoKeywords: p.seo.keywords,
        ogImage: p.seo.ogImage,
      },
      create: {
        slug: p.slug,
        name: p.name,
        intro: p.intro ?? null,
        cover: p.cover,
        coverType: p.coverType ?? 'image',
        sortOrder: index,
        seoTitle: p.seo.title,
        seoDescription: p.seo.description,
        seoKeywords: p.seo.keywords,
        ogImage: p.seo.ogImage,
      },
    });

    // 重設該分類的相簿圖片（先刪後建，確保與 data 檔一致）
    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productImage.createMany({
      data: p.images.map((url, i) => ({
        productId: product.id,
        url,
        sortOrder: i,
      })),
    });

    console.log(`  ✓ ${p.name}（${p.images.length} 張圖）`);
  }

  console.log('匯入完成。');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
