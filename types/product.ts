// 前端共用的產品型別（API 回傳形狀）

export interface ProductListItem {
  slug: string;
  name: string;
  cover: string;
  coverType?: string;
}

export interface ProductSeo {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
}

export interface ProductDetail {
  slug: string;
  name: string;
  intro?: string;
  images: string[];
  seo: ProductSeo;
}
