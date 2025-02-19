import { Metadata } from 'next';
import { fetchArticles, fetchArticleBySlug } from '@/services/api';
import ArticleDetailComponent from '@/components/article/ArticleDetail';

// 静的に生成するパスを定義
export async function generateStaticParams() {
  try {
    // APIから全記事を取得
    const articles = await fetchArticles();
    
    // 記事のスラッグをパラメータとして返す
    return articles
      .filter((article) => Boolean(article.slug)) // slugがある記事だけフィルター
      .map((article) => ({
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