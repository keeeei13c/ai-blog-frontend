import { useState, useEffect } from 'react';

export function useBookmark(articleId?: string | number) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // ページ読み込み時にブックマーク状態を復元
  useEffect(() => {
    if (!articleId) return;
    
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    setIsBookmarked(bookmarks.includes(articleId));
  }, [articleId]);
  
  const toggleBookmark = () => {
    if (!articleId) return;
    
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    let newBookmarks;
    
    if (isBookmarked) {
      newBookmarks = bookmarks.filter((id: string | number) => id !== articleId);
    } else {
      newBookmarks = [...bookmarks, articleId];
    }
    
    localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
    setIsBookmarked(!isBookmarked);
  };
  
  return { isBookmarked, toggleBookmark };
}
