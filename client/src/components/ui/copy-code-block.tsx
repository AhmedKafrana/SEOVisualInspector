import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CopyCodeBlockProps {
  code: string;
  className?: string;
}

export default function CopyCodeBlock({ code, className = '' }: CopyCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="code-block relative bg-slate-50 p-3 rounded font-mono text-sm text-slate-700">
      <code className={className}>{code}</code>
      <button
        className="copy-button p-1 bg-white rounded shadow-sm hover:bg-slate-100 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleCopy}
        aria-label="Copy to clipboard"
      >
        {copied ? (
          <Check className="h-4 w-4 text-success" />
        ) : (
          <Copy className="h-4 w-4 text-slate-600" />
        )}
      </button>
    </div>
  );
}
