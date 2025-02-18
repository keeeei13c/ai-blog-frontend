import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  language: string;
  children: string;
}

export function CodeBlock({ language, children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(String(children));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="relative group mb-6">
      <div className="absolute right-2 top-2">
        <button
          onClick={handleCopy}
          className="p-1 rounded bg-gray-200 dark:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label={copied ? "コピーしました" : "コードをコピー"}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={tomorrow}
      >
        {String(children)}
      </SyntaxHighlighter>
    </div>
  );
}
