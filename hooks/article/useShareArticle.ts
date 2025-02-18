import { useState } from 'react';

export function useShareArticle() {
  const [shareSuccess, setShareSuccess] = useState(false);
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        text: 'この記事をチェックしてください',
        url: window.location.href,
      }).catch((error) => console.error('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    }
  };
  
  return { shareSuccess, handleShare };
}
