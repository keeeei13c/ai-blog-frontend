import { Paper, Image } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { CodeBlock } from './CodeBlock';
import { markdownRenderers } from '@/lib/markdown/renderer';

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
          ...markdownRenderers,
          code({node, inline, className, children, ...props}) {
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
        }}
      >
        {content}
      </ReactMarkdown>
    </Paper>
  );
}
