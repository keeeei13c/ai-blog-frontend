'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Calendar, RefreshCcw, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CreateBlogModal } from '@/components/ui/create-blog-modal-ai';
import { fetchArticles } from '@/services/api';
import { Article } from '@/types/article';

const categoryColors: Record<string, { bg: string; text: string; hover: string }> = {
  'All': { bg: 'bg-blue-600', text: 'text-white', hover: 'hover:bg-blue-700' },
  'Technology': { bg: 'bg-blue-600', text: 'text-white', hover: 'hover:bg-blue-700' },
  'Design': { bg: 'bg-blue-600', text: 'text-white', hover: 'hover:bg-blue-700' },
  'Business': { bg: 'bg-blue-600', text: 'text-white', hover: 'hover:bg-blue-700' },
  'Lifestyle': { bg: 'bg-blue-600', text: 'text-white', hover: 'hover:bg-blue-700' },
  'Health': { bg: 'bg-blue-600', text: 'text-white', hover: 'hover:bg-blue-700' },
};

const defaultColor = { bg: 'bg-blue-600', text: 'text-white', hover: 'hover:bg-blue-700' };

export default function Page() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const fetchArticleData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchArticles();
      setArticles(data);
    } catch (err) {
      setError('記事の読み込みに失敗しました。後でもう一度お試しください。');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticleData();
  }, []);

  const filteredArticles = activeCategory === 'All'
    ? articles
    : articles.filter(article => article.category === activeCategory);

  const categories = ['All', ...Array.from(new Set(articles.map(article => article.category)))];
  const featuredPost = articles.length > 0 ? articles[0] : null;

  const getCategoryColor = (category: string) => categoryColors[category] || defaultColor;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-center justify-between p-6">
            <p className="text-red-600">{error}</p>
            <Button 
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={fetchArticleData}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              再試行
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 space-y-8">
        <Skeleton className="h-[600px] w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[400px] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Featured Article */}
      {featuredPost && (
        <div className="relative py-20 bg-gradient-to-b from-blue-50 to-white">
          <div className="absolute top-4 right-4 z-10">
            <CreateBlogModal onSuccess={fetchArticleData} />
          </div>
          <div className="container mx-auto px-4">
            <Link href={`/article/${featuredPost.slug}`} className="group block">
              <Card className="overflow-hidden border-none bg-white shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="relative aspect-[21/9] overflow-hidden">
                  <div className="absolute left-4 top-4 z-10">
                    <Badge className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-1 text-sm">
                      おすすめ記事
                    </Badge>
                  </div>
                  <Image
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    width={1200}
                    height={600}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <CardHeader className="space-y-4">
                  <h1 className="font-serif text-4xl font-bold tracking-tight lg:text-5xl text-gray-900">
                    {featuredPost.title}
                  </h1>
                  <p className="text-lg text-gray-600">
                    {featuredPost.metaDescription}
                  </p>
                </CardHeader>
                <CardFooter className="flex flex-wrap items-center gap-4">
                  <Badge className="bg-blue-600 text-white">
                    {featuredPost.category}
                  </Badge>
                  <div className="flex items-center gap-6 text-gray-500">
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {featuredPost.readTime}
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(featuredPost.date).toLocaleDateString()}
                    </span>
                  </div>
                  <Button className="ml-auto bg-blue-600 text-white hover:bg-blue-700 group-hover:translate-x-1 transition-all">
                    続きを読む <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`
                px-6 py-2 rounded-full font-medium transition-all duration-300
                ${category === activeCategory ? 'bg-blue-600 text-white' : 'bg-white border-2 border-gray-200 hover:border-blue-200'}
                ${category === activeCategory ? 'shadow-lg' : 'hover:shadow'}
              `}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Article Grid */}
      <div className="container mx-auto px-4 pb-20">
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <Link key={article.id} href={`/article/${article.slug}`} className="group">
                <Card className="h-full overflow-hidden border border-gray-100 hover:border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="aspect-[16/9] overflow-hidden">
                    <Image
                      src={article.image}
                      alt={article.title}
                      width={800}
                      height={450}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <h2 className="font-serif text-xl font-bold tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h2>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {article.metaDescription}
                    </p>
                  </CardHeader>
                  <CardFooter className="flex flex-wrap items-center gap-4">
                    <Badge className="bg-blue-600 text-white">
                      {article.category}
                    </Badge>
                    <div className="flex items-center gap-4 text-gray-500 text-sm">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {article.readTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(article.date).toLocaleDateString()}
                      </span>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="py-16 text-center border-2 border-dashed border-gray-200">
            <CardContent>
              <p className="mb-4 text-lg text-gray-600">
                このカテゴリーの記事は見つかりませんでした
              </p>
              {activeCategory !== 'All' && (
                <Button 
                  onClick={() => setActiveCategory('All')}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  すべての記事を表示
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}