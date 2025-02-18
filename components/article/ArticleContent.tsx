import React from 'react';
import { Paper, Image } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { CodeBlock } from './CodeBlock';

interface ArticleContentProps {
  content: string;
}

export function ArticleContent({ content }: ArticleContentProps) {
  return (
    <Paper className="p-8 rounded-xl prose dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          code({className, children, ...props}) {
            // language-* クラスがあればコードブロック、なければインラインコード
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <CodeBlock language={match[1]}>
                {String(children).replace(/\n$/, '')}
              </CodeBlock>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          // 画像を含む段落の処理
          p({children, ...props}) {
            // 子要素にimgタグが含まれているか確認
            const hasImageChild = React.Children.toArray(children).some(
              child => React.isValidElement(child) && child.type === 'img'
            );
            
            // imgが含まれている場合はdivを返し、そうでなければpを返す
            return hasImageChild ? (
              <div {...props}>{children}</div>
            ) : (
              <p {...props}>{children}</p>
            );
          },
          img({src, alt}) {
            return (
              <span className="block my-6">
                <Image
                  src={src || ''}
                  alt={alt || '記事の画像'}
                  radius="md"
                />
              </span>
            );
          },
          // テーブルのスタイル改善
          table(props) {
            return (
              <div className="overflow-x-auto my-6">
                <table className="min-w-full border-collapse" {...props} />
              </div>
            );
          },
          th(props) {
            return (
              <th 
                className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border border-gray-300 dark:border-gray-700" 
                {...props} 
              />
            );
          },
          td(props) {
            return (
              <td 
                className="px-4 py-2 border border-gray-300 dark:border-gray-700" 
                {...props} 
              />
            );
          },
          // 引用のスタイル改善
          blockquote(props) {
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
}