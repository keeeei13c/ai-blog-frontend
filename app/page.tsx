'use client';

import { Container, Title, Text, SimpleGrid, Card, Image, Badge, Group } from '@mantine/core';
import { Clock, Calendar } from 'lucide-react';
import Link from 'next/link';

const featuredPost = {
  title: "The Future of AI in Content Creation",
  excerpt: "Exploring how artificial intelligence is revolutionizing the way we create and consume content in the digital age.",
  image: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
  category: "Technology",
  readTime: "8 min",
  date: "2024-03-21",
};

const posts = [
  {
    title: "Understanding Neural Networks",
    excerpt: "A deep dive into the fundamentals of neural networks and their applications.",
    image: "https://images.unsplash.com/photo-1676299081847-824916de7e0a",
    category: "AI & ML",
    readTime: "12 min",
    date: "2024-03-20",
  },
  {
    title: "The Ethics of AI Generation",
    excerpt: "Examining the moral implications of AI-generated content in modern media.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
    category: "Ethics",
    readTime: "10 min",
    date: "2024-03-19",
  },
];

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <Container size="xl" className="mt-16 mb-24">
        <Link href="/article/featured" className="block group">
          <Card shadow="sm" padding="xl" radius="md" className="overflow-hidden transition-transform duration-300 group-hover:transform group-hover:scale-[1.02]">
            <div className="relative">
              <Badge className="absolute top-4 left-4 z-10" color="blue" variant="light">
                AI-Generated
              </Badge>
              <Image
                src={featuredPost.image}
                h={500}
                alt={featuredPost.title}
                className="object-cover"
              />
            </div>
            <Title order={1} className="mt-6 mb-2 font-serif text-4xl">
              {featuredPost.title}
            </Title>
            <Text size="xl" c="dimmed" className="mb-4">
              {featuredPost.excerpt}
            </Text>
            <Group>
              <Badge color="teal">{featuredPost.category}</Badge>
              <Group className="text-gray-600">
                <Group gap="xs">
                  <Clock size={16} />
                  <Text size="sm">{featuredPost.readTime}</Text>
                </Group>
                <Group gap="xs">
                  <Calendar size={16} />
                  <Text size="sm">{new Date(featuredPost.date).toLocaleDateString()}</Text>
                </Group>
              </Group>
            </Group>
          </Card>
        </Link>
      </Container>

      {/* Topic Navigation */}
      <Container size="xl" className="mb-16">
        <Group className="overflow-x-auto pb-4">
          {['All', 'Technology', 'AI & ML', 'Ethics', 'Programming', 'Data Science'].map((topic) => (
            <Badge
              key={topic}
              size="lg"
              variant={topic === 'All' ? 'filled' : 'light'}
              className="cursor-pointer hover:opacity-80"
            >
              {topic}
            </Badge>
          ))}
        </Group>
      </Container>

      {/* Article Grid */}
      <Container size="xl" className="mb-24">
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
          {posts.map((post, index) => (
            <Link key={index} href={`/article/${index}`} className="block group">
              <Card shadow="sm" padding="lg" radius="md" className="h-full transition-transform duration-300 group-hover:transform group-hover:scale-[1.02]">
                <Image
                  src={post.image}
                  h={200}
                  alt={post.title}
                  className="object-cover mb-4"
                />
                <Title order={3} className="mt-4 mb-2 font-serif">
                  {post.title}
                </Title>
                <Text size="sm" c="dimmed" className="mb-4">
                  {post.excerpt}
                </Text>
                <Group className="mt-auto">
                  <Badge color="blue">{post.category}</Badge>
                  <Group className="text-gray-600">
                    <Group gap="xs">
                      <Clock size={14} />
                      <Text size="sm">{post.readTime}</Text>
                    </Group>
                    <Group gap="xs">
                      <Calendar size={14} />
                      <Text size="sm">{new Date(post.date).toLocaleDateString()}</Text>
                    </Group>
                  </Group>
                </Group>
              </Card>
            </Link>
          ))}
        </SimpleGrid>
      </Container>
    </main>
  );
}