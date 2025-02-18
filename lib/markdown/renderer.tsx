import React from 'react';

interface RendererProps {
  node?: any;
  children?: React.ReactNode;
  [key: string]: any;
}

// マークダウンのカスタムレンダラー
export const markdownRenderers = {
  // テーブルのスタイル改善
  table({node, ...props}: RendererProps) {
    return (
      <div className="overflow-x-auto my-6">
        <table className="min-w-full border-collapse" {...props} />
      </div>
    );
  },
  
  th({node, ...props}: RendererProps) {
    return (
      <th 
        className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border border-gray-300 dark:border-gray-700" 
        {...props} 
      />
    );
  },
  
  td({node, ...props}: RendererProps) {
    return (
      <td 
        className="px-4 py-2 border border-gray-300 dark:border-gray-700" 
        {...props} 
      />
    );
  },
  
  // 引用のスタイル改善
  blockquote({node, ...props}: RendererProps) {
    return (
      <blockquote 
        className="border-l-4 border-blue-500 pl-4 italic my-6 text-gray-700 dark:text-gray-300" 
        {...props} 
      />
    );
  },
  
  // リストのスタイル改善
  ol({node, ...props}: RendererProps) {
    return (
      <ol className="list-decimal pl-6 my-4 space-y-2" {...props} />
    );
  },
  
  ul({node, ...props}: RendererProps) {
    return (
      <ul className="list-disc pl-6 my-4 space-y-2" {...props} />
    );
  },
  
  // 見出しにIDを追加してアンカーリンクを可能に
  h1({node, children, ...props}: RendererProps) {
    const text = React.Children.toArray(children).join('');
    const slug = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    return <h1 id={slug} className="mt-8 mb-4 text-3xl font-bold" {...props}>{children}</h1>;
  },
  
  h2({node, children, ...props}: RendererProps) {
    const text = React.Children.toArray(children).join('');
    const slug = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    return <h2 id={slug} className="mt-6 mb-3 text-2xl font-bold" {...props}>{children}</h2>;
  },
  
  h3({node, children, ...props}: RendererProps) {
    const text = React.Children.toArray(children).join('');
    const slug = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    return <h3 id={slug} className="mt-5 mb-2 text-xl font-semibold" {...props}>{children}</h3>;
  },
};
