import { Text } from '@mantine/core';
import { TableOfContentsItem } from '@/types/article';

interface TableOfContentsProps {
  items: TableOfContentsItem[];
  activeId?: string;
}

export function TableOfContents({ items, activeId }: TableOfContentsProps) {
  return (
    <nav className="space-y-1">
      {items.map((item, index) => (
        <Text 
          key={index}
          component="a" 
          href={item.href}
          size="sm" 
          className={`block py-1 hover:text-blue-500 transition-colors ${
            activeId === item.href.substring(1) 
              ? 'text-blue-500 font-medium' 
              : 'text-gray-600 dark:text-gray-400'
          } ${item.level && item.level > 1 ? `pl-${(item.level - 1) * 3}` : ''}`}
        >
          {item.text}
        </Text>
      ))}
    </nav>
  );
}
