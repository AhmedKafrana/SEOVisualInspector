import { useState, useRef, useEffect } from 'react';
import { Check, Copy, Clipboard } from 'lucide-react';

interface CopyCodeBlockProps {
  code: string;
  className?: string;
}

export default function CopyCodeBlock({ code, className = '' }: CopyCodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [hovering, setHovering] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);

  // Format the code by adding line breaks and indentation for HTML
  const formattedCode = code
    .replace(/><\/([a-z]+)>/g, '>\n</$1>') // Add line break before closing tags
    .replace(/><([a-z]+)/g, '>\n<$1'); // Add line break between tags

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
    <div 
      className="code-block relative group bg-slate-50 rounded-md border border-slate-200 font-mono text-sm overflow-hidden"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="flex items-center justify-between px-4 py-2 bg-slate-100 border-b border-slate-200">
        <div className="text-xs text-slate-500 font-sans">HTML</div>
        <button
          className="copy-button p-1 flex items-center text-xs font-sans text-slate-600 hover:text-slate-900 transition-colors"
          onClick={handleCopy}
          aria-label="Copy to clipboard"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 mr-1 text-green-500" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Clipboard className="h-3 w-3 mr-1" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      
      <pre 
        ref={codeRef}
        className="p-4 overflow-x-auto max-h-44 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent"
      >
        <code className={`${className} whitespace-pre text-slate-700`}>{formattedCode}</code>
      </pre>
      
      {!copied && hovering && (
        <div 
          className="absolute right-3 bottom-3 bg-primary text-white rounded-full p-2 shadow-lg cursor-pointer opacity-90 hover:opacity-100 transition-opacity"
          onClick={handleCopy}
        >
          <Copy className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}
