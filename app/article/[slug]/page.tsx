import { Metadata } from 'next';
import { fetchArticles, fetchArticleBySlug } from '@/services/api';
import ArticleDetailComponent from '@/components/article/ArticleDetail';

async function fetchWithRetry(fn: () => Promise<any>, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      console.log('Retrying fetch...', i);
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

// 静的に生成するパスを定義
export async function generateStaticParams() {
  try {
    // APIから全記事を取得
    const articles = await fetchWithRetry(() => fetchArticles());
    console.log(articles);
    
    // 記事のスラッグをパラメータとして返す
    return articles
      .filter((article: { slug?: string }) => Boolean(article.slug)) // slugがある記事だけフィルター
      .map((article: { slug: string }) => ({
        slug: article.slug as string,
      }));
  } catch (error) {
    console.error('Failed to generate static params:', error);
    // エラーが発生した場合はデフォルトのパスを返す
    return [
      { slug: 'default-article' },
    ];
  }
}

// 動的メタデータの生成
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const article = await fetchArticleBySlug(params.slug);
    
    if (!article) {
      return {
        title: '記事が見つかりませんでした',
        description: '指定された記事は存在しないか、削除された可能性があります。'
      };
    }
    
    return {
      title: article.title,
      description: article.content.substring(0, 160), // contentから抜粋を生成
      openGraph: {
        title: article.title,
        description: article.content.substring(0, 160),
        images: [{ url: article.image }],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: '記事の読み込みエラー',
      description: '記事の読み込み中にエラーが発生しました。'
    };
  }
}

// 記事詳細ページ
export default function ArticlePage({ params }: { params: { slug: string } }) {
  return <ArticleDetailComponent slug={params.slug} />;
}