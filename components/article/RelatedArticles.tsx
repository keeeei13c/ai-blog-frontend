import { Title, Text, Card, Badge, Group } from '@mantine/core';
import { RelatedArticle } from '@/types/article';

interface RelatedArticlesProps {
  articles: RelatedArticle[];
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (!articles || articles.length === 0) return null;
  
  return (
    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
      <Title order={3} className="mb-6">関連記事</Title>
      <div className="space-y-4">
        {articles.map((article) => (
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
}
