import { useState, useEffect } from 'react';
import { TableOfContentsItem } from '@/types/article';

export function useTableOfContents(content: string) {
  const [tocItems, setTocItems] = useState<TableOfContentsItem[]>([]);
  const [activeHeading, setActiveHeading] = useState<string>('');
  
  // マークダウンから見出しを抽出
  useEffect(() => {
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const headings: TableOfContentsItem[] = [];
    let match;
    
    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const slug = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      
      headings.push({ level, text, href: `#${slug}` });
    }
    
    setTocItems(headings);
  }, [content]);
  
  // スクロール位置に基づいて現在のセクションを特定
  useEffect(() => {
    if (tocItems.length === 0) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -66% 0px' }
    );
    
    tocItems.forEach((item) => {
      const headingId = item.href.substring(1);
      const element = document.getElementById(headingId);
      if (element) observer.observe(element);
    });
    
    return () => observer.disconnect();
  }, [tocItems]);
  
  return { tocItems, activeHeading };
}
