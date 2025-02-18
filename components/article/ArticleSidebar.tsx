import { Card, Text, Group } from '@mantine/core';
import { Share2, Bookmark } from 'lucide-react';
import { TableOfContents } from './TableOfContents';
import { TableOfContentsItem } from '@/types/article';
import { useBookmark } from '@/hooks/article/useBookmark';
import { useShareArticle } from '@/hooks/article/useShareArticle';

interface ArticleSidebarProps {
  tocItems: TableOfContentsItem[];
  activeHeading?: string;
}

export function ArticleSidebar({ tocItems, activeHeading }: ArticleSidebarProps) {
  const { isBookmarked, toggleBookmark } = useBookmark();
  const { shareSuccess, handleShare } = useShareArticle();
  
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
              onClick={toggleBookmark}
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
          
          <TableOfContents items={tocItems} activeId={activeHeading} />
        </Card>
      </div>
    </aside>
  );
}
