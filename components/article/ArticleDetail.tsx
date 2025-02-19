'use client';

import { useEffect, useState } from 'react';
import { Container, Title, Text, Card, Image, Badge, Group, Divider, Skeleton, Button, Box } from '@mantine/core';
import { Clock, Calendar, ArrowLeft, Tag } from 'lucide-react';
import { fetchArticleBySlug } from '@/services/api';
import Link from 'next/link';
import { Article } from '@/types/article';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { markdownRenderers } from '@/lib/markdown/renderer';

interface ArticleDetailComponentProps {
  slug: string;
}

export default function ArticleDetailComponent({ slug }: ArticleDetailComponentProps) {
  const router = useRouter();
  
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const articleData = await fetchArticleBySlug(slug);
        
        if (articleData) {
          setArticle(articleData);
        } else {
          setError('記事が見つかりませんでした');
        }
      } catch (err) {
        setError('記事の読み込み中にエラーが発生しました');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // マークダウンコンテンツをHTMLに変換
  const renderContent = (content: string) => {
    if (!content) return null;
    
    // 段落に分割
    const paragraphs = content.split('\n\n');
    
    return (
      <div className="prose max-w-none">
        {paragraphs.map((paragraph, index) => {
          // 見出し処理
          if (paragraph.startsWith('# ')) {
            return <h1 key={index} className="text-3xl font-serif font-bold mt-10 mb-6">{paragraph.substring(2)}</h1>;
          }
          if (paragraph.startsWith('## ')) {
            return <h2 key={index} className="text-2xl font-serif font-bold mt-8 mb-4">{paragraph.substring(3)}</h2>;
          }
          if (paragraph.startsWith('### ')) {
            return <h3 key={index} className="text-xl font-serif font-bold mt-6 mb-3">{paragraph.substring(4)}</h3>;
          }
          
          // リスト処理
          if (paragraph.includes('\n- ')) {
            const listItems = paragraph.split('\n- ');
            return (
              <ul key={index} className="list-disc pl-6 my-4">
                {listItems.map((item, i) => {
                  if (i === 0 && !item.startsWith('- ')) return null;
                  const listItemText = i === 0 ? item.substring(2) : item;
                  return <li key={i} className="my-1">{listItemText}</li>;
                }).filter(Boolean)}
              </ul>
            );
          }
          
          // コードブロック
          if (paragraph.startsWith('```') && paragraph.endsWith('```')) {
            const code = paragraph.substring(paragraph.indexOf('\n') + 1, paragraph.lastIndexOf('```'));
            return (
              <pre key={index} className="bg-gray-100 p-4 rounded-md overflow-x-auto my-4">
                <code>{code}</code>
              </pre>
            );
          }
          
          // 引用
          if (paragraph.startsWith('> ')) {
            return (
              <blockquote key={index} className="border-l-4 border-gray-300 pl-4 italic my-4">
                {paragraph.substring(2)}
              </blockquote>
            );
          }
          
          // 通常の段落
          return <p key={index} className="my-4 leading-relaxed">{paragraph}</p>;
        })}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Container size="md" className="py-16">
        <Skeleton height={50} width="70%" className="mb-4" />
        <Skeleton height={20} width="30%" className="mb-8" />
        <Skeleton height={400} className="mb-8" />
        {Array.from({ length: 10 }).map((_, index) => (
          <Skeleton key={index} height={20} className="mb-2" />
        ))}
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="md" className="py-16">
        <Card shadow="sm" padding="lg" radius="md" withBorder className="bg-red-50">
          <Text c="red" size="lg" className="mb-4">{error}</Text>
          <Button 
            variant="outline" 
            color="blue" 
            leftSection={<ArrowLeft size={16} />}
            onClick={() => router.push('/')}
          >
            トップページに戻る
          </Button>
        </Card>
      </Container>
    );
  }

  if (!article) {
    return (
      <Container size="md" className="py-16">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text size="lg" className="mb-4">記事情報を取得できませんでした</Text>
          <Button 
            variant="outline" 
            leftSection={<ArrowLeft size={16} />}
            onClick={() => router.push('/')}
          >
            トップページに戻る
          </Button>
        </Card>
      </Container>
    );
  }

  return (
    <Container size="md" className="py-16">
      {/* 戻るボタン */}
      <Link href="/" className="inline-block mb-8">
        <Group gap="xs" className="text-blue-500 hover:text-blue-700">
          <ArrowLeft size={16} />
          <Text>記事一覧に戻る</Text>
        </Group>
      </Link>
      
      {/* 記事ヘッダー */}
      <Title order={1} className="font-serif text-4xl mb-4">
        {article.title}
      </Title>
      
      <Group className="mb-8">
        <Badge color="teal" size="lg">{article.category}</Badge>
        <Group gap="md" className="text-gray-500">
          <Group gap="xs">
            <Clock size={18} />
            <Text size="sm">{article.readTime}</Text>
          </Group>
          <Group gap="xs">
            <Calendar size={18} />
            <Text size="sm">{new Date(article.date).toLocaleDateString()}</Text>
          </Group>
        </Group>
      </Group>
      
      {/* メイン画像 */}
      <Image
        src={article.image}
        alt={article.title}
        radius="md"
        className="mb-10"
      />
      
      {/* 記事本文 */}
      <div className="article-content">
      <ReactMarkdown components={markdownRenderers}>
        {article.content}
      </ReactMarkdown>
      </div>
      
      {/* 関連記事 */}
      {article.relatedArticles && article.relatedArticles.length > 0 && (
        <div className="mt-16">
          <Divider className="mb-8" />
          <Title order={3} className="mb-6 font-serif">関連記事</Title>
          
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            {article.relatedArticles.map((relatedArticle, index) => (
              <Box key={relatedArticle.id}>
                {index > 0 && <Divider my="md" />}
                <Link href={`/article/${relatedArticle.slug || relatedArticle.id}`} className="block py-2 hover:bg-gray-50">
                  <Group>
                    {relatedArticle.image && (
                      <Image 
                        src={relatedArticle.image} 
                        alt={relatedArticle.title}
                        width={80}
                        height={60}
                        radius="md"
                      />
                    )}
                    <div>
                      <Text fw={600} className="mb-1">
                        {relatedArticle.title}
                      </Text>
                      <Badge color="blue" size="sm">{relatedArticle.category}</Badge>
                    </div>
                  </Group>
                </Link>
              </Box>
            ))}
          </Card>
        </div>
      )}
    </Container>
  );
}