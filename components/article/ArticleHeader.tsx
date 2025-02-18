import { Title, Text, Badge, Group, Image } from '@mantine/core';
import { Clock, Calendar } from 'lucide-react';

interface ArticleHeaderProps {
  title: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
}

export function ArticleHeader({ title, category, date, readTime, image }: ArticleHeaderProps) {
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
}
