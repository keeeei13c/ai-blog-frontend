export type Article = {
  id: number;
  slug: string;
  title: string;
  content: string;
  image: string;
  category: string;
  readTime: string; // "X min read" 形式に変換
  date: string;
  metaDescription?: string;
  keywords?: string[];
  relatedArticles?: RelatedArticle[];
}

export type RelatedArticle = {
  id: number;
  title: string;
  category: string;
  image?: string;
  slug?: string;
}

export interface TableOfContentsItem {
  text: string;
  href: string;
  level?: number;
}
