'use client';

import { Container, Title, Text, Card, Image, Badge, Group, Paper } from '@mantine/core';
import { Clock, Calendar, Share2, Bookmark, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { useState } from 'react';

// 記事データ
const article = {
  title: "The Future of AI in Content Creation",
  content: `
# The Future of AI in Content Creation

## Introduction

Artificial Intelligence is revolutionizing the way we create and consume content. This article explores the implications and possibilities of AI-driven content creation.

### Key Points

1. Natural Language Processing
2. Content Generation
3. Quality Assurance

## Technical Implementation

Here's a simple example of how AI might generate text:

\`\`\`python
from transformers import GPT2LMHeadModel, GPT2Tokenizer

def generate_text(prompt):
    model = GPT2LMHeadModel.from_pretrained('gpt2')
    tokenizer = GPT2Tokenizer.from_pretrained('gpt2')
    
    inputs = tokenizer.encode(prompt, return_tensors='pt')
    outputs = model.generate(inputs)
    
    return tokenizer.decode(outputs[0])
\`\`\`

## Impact on Industries

> AI is not just changing how we write; it's transforming entire industries and creating new possibilities for content creation at scale.

### Benefits

* Increased productivity
* Consistent quality
* 24/7 content generation
* Cost-effective scaling

### Challenges

1. Quality control
2. Ethical considerations
3. Human oversight
4. Training data bias

## Future Implications

| Aspect | Current State | Future Potential |
|--------|--------------|------------------|
| Quality | Good | Excellent |
| Speed | Fast | Lightning Fast |
| Cost | Medium | Low |
| Customization | Limited | Extensive |

![AI Content Creation](https://images.unsplash.com/photo-1677442136019-21780ecad995)

## Conclusion

The future of AI in content creation is bright, but it requires careful consideration of both technical and ethical aspects.
`,
  image: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
  category: "Technology",
  readTime: "8 min",
  date: "2024-03-21",
  relatedArticles: [
    { id: 1, title: "How AI is Changing Content Marketing", category: "Marketing" },
    { id: 2, title: "Ethical Considerations in AI Content", category: "Ethics" }
  ]
};

// 目次項目コンポーネント
const TableOfContentsItem = ({ text, href }: { text: string; href: string }) => {
  return (
    <Text 
      component="a" 
      href={href}
      size="sm" 
      className="text-gray-600 hover:text-blue-500 block py-1 cursor-pointer"
    >
      {text}
    </Text>
  );
};

// コードブロックコンポーネント
const CodeBlock = ({ language, children }: { language: string; children: React.ReactNode }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(String(children));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="relative group mb-6">
      <div className="absolute right-2 top-2">
        <button
          onClick={handleCopy}
          className="p-1 rounded bg-gray-200 dark:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label={copied ? "コピーしました" : "コードをコピー"}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={tomorrow}
      >
        {String(children)}
      </SyntaxHighlighter>
    </div>
  );
};

// 記事ヘッダーコンポーネント
interface ArticleHeaderProps {
  title: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
}

const ArticleHeader = ({ title, category, date, readTime, image }: ArticleHeaderProps) => {
  return (
    <div className="max-w-3xl mx-auto mb-12">
      <div className="flex justify-between items-center mb-4">
        <Badge color="blue" size="lg">
          {category}
        </Badge>
        <Badge color="indigo" variant="light" size="md">
          AI生成コンテンツ
        </Badge>
      </div>
      
      <Title className="font-serif text-4xl md:text-5xl mb-6">
        {title}
      </Title>
      
      <Group className="mb-8">
        <Group gap="xs">
          <Clock size={18} />
          <Text size="md">{readTime}</Text>
        </Group>
        <Group gap="xs">
          <Calendar size={18} />
          <Text size="md">{new Date(date).toLocaleDateString()}</Text>
        </Group>
      </Group>
      
      <Image
        src={image}
        h={500}
        alt={title}
        className="rounded-xl"
      />
    </div>
  );
};

// サイドバーコンポーネント
const ArticleSidebar = () => {
  const headings = [
    { text: "Introduction", href: "#introduction" },
    { text: "Technical Implementation", href: "#technical-implementation" },
    { text: "Impact on Industries", href: "#impact-on-industries" },
    { text: "Future Implications", href: "#future-implications" },
    { text: "Conclusion", href: "#conclusion" }
  ];
  
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2000);
  };
  
  return (
    <aside className="hidden lg:block w-64">
      <div className="sticky top-8">
        <Card shadow="sm" padding="lg" radius="md">
          <Group className="mb-4">
            <button
              onClick={handleShare}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={shareSuccess ? "URLをコピーしました" : "この記事をシェア"}
            >
              <Share2 size={20} className={shareSuccess ? "text-green-500" : ""} />
            </button>
            <button
              onClick={handleBookmark}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={isBookmarked ? "ブックマーク済み" : "ブックマークする"}
            >
              <Bookmark 
                size={20} 
                className={isBookmarked ? "text-blue-500 fill-blue-500" : ""} 
                fill={isBookmarked ? "currentColor" : "none"}
              />
            </button>
          </Group>
          
          <Text size="sm" fw={500} className="mb-2">
            目次
          </Text>
          
          <nav className="space-y-1">
            {headings.map((heading, index) => (
              <TableOfContentsItem 
                key={index}
                text={heading.text} 
                href={heading.href} 
              />
            ))}
          </nav>
        </Card>
      </div>
    </aside>
  );
};

// 関連記事コンポーネント
interface Article {
  id: number;
  title: string;
  category: string;
}

const RelatedArticles = ({ articles }: { articles: Article[] }) => {
  if (!articles || articles.length === 0) return null;
  
  return (
    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
      <Title order={3} className="mb-6">関連記事</Title>
      <div className="space-y-4">
        {articles.map((article: { id: number; title: string; category: string }) => (
          <Card 
            key={article.id}
            shadow="sm"
            p="md"
            radius="md"
            className="hover:shadow-md transition-shadow"
          >
            <Group align="flex-start">
              <div>
                <Badge size="sm" color="blue" className="mb-2">
                  {article.category}
                </Badge>
                <Text fw={500} size="lg" lineClamp={2}>
                  {article.title}
                </Text>
                <Text 
                  component="a"
                  href={`/article/${article.id}`}
                  size="sm"
                  className="text-blue-500 hover:underline mt-2 inline-block"
                >
                  続きを読む
                </Text>
              </div>
            </Group>
          </Card>
        ))}
      </div>
    </div>
  );
};

// メインの記事コンテンツコンポーネント
const ArticleContent = ({ content }: { content: string }) => {
  return (
    <Paper className="p-8 rounded-xl prose dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          code({node, inline, className, children, ...props}: {node?: any, inline?: boolean, className?: string, children?: React.ReactNode}) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <CodeBlock language={match[1]}>
                {String(children).replace(/\n$/, '')}
              </CodeBlock>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          img({src, alt}) {
            return (
              <div className="my-6">
                <Image
                  src={src}
                  alt={alt || '記事の画像'}
                  radius="md"
                />
              </div>
            );
          },
          // テーブルのスタイル改善
          table({node, ...props}) {
            return (
              <div className="overflow-x-auto my-6">
                <table className="min-w-full border-collapse" {...props} />
              </div>
            );
          },
          th({node, ...props}) {
            return (
              <th 
                className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border border-gray-300 dark:border-gray-700" 
                {...props} 
              />
            );
          },
          td({node, ...props}) {
            return (
              <td 
                className="px-4 py-2 border border-gray-300 dark:border-gray-700" 
                {...props} 
              />
            );
          },
          // 引用のスタイル改善
          blockquote({node, ...props}) {
            return (
              <blockquote 
                className="border-l-4 border-blue-500 pl-4 italic my-6 text-gray-700 dark:text-gray-300" 
                {...props} 
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </Paper>
  );
};

// メインコンポーネント
export default function ArticlePage() {
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
            <RelatedArticles articles={article.relatedArticles} />
          </div>

          {/* サイドバー */}
          <ArticleSidebar />
        </div>
      </Container>
    </main>
  );
}