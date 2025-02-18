import { Card, Text, Group } from '@mantine/core';
import { Share2, Bookmark } from 'lucide-react';
import { useState } from 'react';
import { TableOfContentsItem } from './TableOfContentsItem';
import { TableOfContentsItem as TocItem } from '@/types/article';

interface ArticleSidebarProps {
  headings: TocItem[];
}

export function ArticleSidebar({ headings }: ArticleSidebarProps) {
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
}
