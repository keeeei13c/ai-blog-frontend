// services/api.ts
import { Article, RelatedArticle } from '@/types/article';

export const API_BASE_URL = 'https://edge-scribe.hajime-kei2000.workers.dev';

// 記事一覧を取得する関数
export async function fetchArticles(): Promise<Article[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/articles`);
    
    if (!response.ok) {
      throw new Error(`Error fetching articles: ${response.status}`);
    }
    
    const data = await response.json();
    
    // APIのレスポンスを既存の型定義に合わせる
    return (data.data?.results).map((item: any) => ({
      id: item.id,
      slug: item.slug || `article-${item.id}`,
      title: item.title,
      content: item.content,
      image: item.image,
      category: item.category,
      readTime: `${item.read_time} min read`,
      date: item.date
    }));
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    return [];
  }
}

// スラッグから記事を取得する関数
export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/articles/${slug}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching article: ${response.status}`);
    }
    
    const data = await response.json();
    if (!data.data) return null;
    
    // 関連記事も取得
    let relatedArticles: RelatedArticle[] = [];
    if (data.data.id) {
      try {
        relatedArticles = await fetchRelatedArticles(data.data.id);
      } catch (err) {
        console.error('Failed to fetch related articles:', err);
      }
    }
    
    // APIのレスポンスを既存の型定義に合わせる
    return {
      id: data.data.id,
      slug: data.data.slug,
      title: data.data.title,
      content: data.data.content,
      image: data.data.image,
      category: data.data.category,
      readTime: `${data.data.read_time} min read`,
      date: data.data.date,
      relatedArticles
    };
  } catch (error) {
    console.error(`Failed to fetch article with slug ${slug}:`, error);
    return null;
  }
}

// 関連記事を取得する関数
export async function fetchRelatedArticles(articleId: number): Promise<RelatedArticle[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/articles/related/${articleId}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching related articles: ${response.status}`);
    }
    
    const data = await response.json();
    
    // APIのレスポンスを既存の型定義に合わせる
    return (data.data || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      slug: item.slug || item.id.toString()
    }));
  } catch (error) {
    console.error('Failed to fetch related articles:', error);
    return [];
  }
}

// type CreateArticleRequest = {
//   title: string;
//   content: string;
//   category: string;
//   image: string;
//   metaDescription: string;
// };

type CreateArticleRequest = {
  topic?: string;
};

export const createArticle = async (articleData: CreateArticleRequest) => {
  const response = await fetch('/api/articles', {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(articleData),
  });
  return response.json();
};
