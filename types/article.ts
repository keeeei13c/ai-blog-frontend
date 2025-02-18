export interface Article {
  id?: number;
  slug?: string;
  title: string;
  content: string;
  image: string;
  category: string;
  readTime: string;
  date: string;
  relatedArticles?: RelatedArticle[];
}

export interface RelatedArticle {
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
