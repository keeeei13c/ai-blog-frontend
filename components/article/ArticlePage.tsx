'use client';

import { Container } from '@mantine/core';
import { Article } from '@/types/article';
import { ArticleHeader } from './ArticleHeader';
import { ArticleContent } from './ArticleContent';
import { ArticleSidebar } from './ArticleSidebar';
import { RelatedArticles } from './RelatedArticles';
import { useTableOfContents } from '@/hooks/article/useTableOfContents';

interface ArticlePageProps {
  article: Article;
}

export function ArticlePage({ article }: ArticlePageProps) {
  const { tocItems, activeHeading } = useTableOfContents(article.content);

  return (
    <main className="py-16">
      <Container size="xl">
        {/* 記事ヘッダー */}
        <ArticleHeader article={article} />

        {/* 記事コンテンツエリア */}
        <div className="flex gap-8">
          {/* メインコンテンツ */}
          <div className="flex-grow max-w-3xl mx-auto">
            <ArticleContent content={article.content} />
            <RelatedArticles articles={article.relatedArticles || []} />
          </div>

          {/* サイドバー */}
          <ArticleSidebar tocItems={tocItems} activeHeading={activeHeading} />
        </div>
      </Container>
    </main>
  );
}
