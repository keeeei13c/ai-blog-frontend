'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, Calendar, RefreshCcw, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchArticles } from '../services/api';
import { Article } from '../types/article';
import Image from 'next/image';

const categoryColors: Record<string, { bg: string; text: string; hover: string }> = {
  'All': { bg: 'bg-blue-600', text: 'text-white', hover: 'hover:bg-blue-700' },
  'Technology': { bg: 'bg-blue-600', text: 'text-white', hover: 'hover:bg-blue-700' },
  'Design': { bg: 'bg-blue-600', text: 'text-white', hover: 'hover:bg-blue-700' },
  'Business': { bg: 'bg-blue-600', text: 'text-white', hover: 'hover:bg-blue-700' },
  'Lifestyle': { bg: 'bg-blue-600', text: 'text-white', hover: 'hover:bg-blue-700' },
  'Health': { bg: 'bg-blue-600', text: 'text-white', hover: 'hover:bg-blue-700' },
};

const defaultColor = { bg: 'bg-blue-600', text: 'text-white', hover: 'hover:bg-blue-700' };

export default function Home() {
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
      setError('Failed to load articles. Please try again later.');
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
              Retry
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
                No articles found for this category
              </p>
              {activeCategory !== 'All' && (
                <Button 
                  onClick={() => setActiveCategory('All')}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  View all articles
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}