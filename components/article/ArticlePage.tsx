'use client';

import { Container } from '@mantine/core';
import { useState, useEffect } from 'react';
import { ArticleHeader } from './ArticleHeader';
import { ArticleContent } from './ArticleContent';
import { ArticleSidebar } from './ArticleSidebar';
import { RelatedArticles } from './RelatedArticles';
import { Article, TableOfContentsItem } from '@/types/article';

interface ArticlePageProps {
  article: Article;
}

export function ArticlePage({ article }: ArticlePageProps) {
  const [headings, setHeadings] = useState<TableOfContentsItem[]>([]);
  
  // 記事内容から見出しを抽出
  useEffect(() => {
    const extractHeadings = () => {
      // マークダウンから見出しを抽出する簡易的な実装
      const lines = article.content.split('\n');
      const headingPattern = /^##?\s+(.+)$/;
      const result: TableOfContentsItem[] = [];
      
      lines.forEach(line => {
        const match = line.match(headingPattern);
        if (match) {
          const text = match[1];
          const href = `#${text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}`;
          result.push({ text, href });
        }
      });
      
      return result;
    };
    
    setHeadings(extractHeadings());
  }, [article.content]);

  return (
    <main className="py-16">
      <Container size="xl">
        {/* 記事ヘッダー */}
        <ArticleHeader 
          title={article.title}
          category={article.category}
          date={article.date}
          readTime={article.readTime}
          image={article.image}
        />

        {/* 記事コンテンツエリア */}
        <div className="flex gap-8">
          {/* メインコンテンツ */}
          <div className="flex-grow max-w-3xl mx-auto">
            <ArticleContent content={article.content} />
            <RelatedArticles articles={article.relatedArticles || []} />
          </div>

          {/* サイドバー */}
          <ArticleSidebar headings={headings} />
        </div>
      </Container>
    </main>
  );
}
