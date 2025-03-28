import { SeoAnalysis } from '@shared/schema';
import { ImageIcon } from 'lucide-react';
import CopyCodeBlock from '@/components/ui/copy-code-block';

type SocialTabProps = {
  socialPreviews: SeoAnalysis['socialPreviews'];
};

export default function SocialTab({ socialPreviews }: SocialTabProps) {
  const { openGraph, twitter } = socialPreviews;
  
  // Generate recommended OpenGraph tags
  const generateOpenGraphTags = () => {
    return `<meta property="og:title" content="${openGraph.title || 'Your Page Title'}">\n<meta property="og:description" content="${openGraph.description || 'Your page description'}">\n<meta property="og:image" content="${openGraph.image || 'https://example.com/image.jpg'}">\n<meta property="og:url" content="${openGraph.url || 'https://example.com/'}">\n<meta property="og:type" content="${openGraph.type || 'website'}">`;
  };
  
  // Generate recommended Twitter Card tags
  const generateTwitterTags = () => {
    return `<meta name="twitter:card" content="${twitter.card || 'summary_large_image'}">\n<meta name="twitter:title" content="${twitter.title || 'Your Page Title'}">\n<meta name="twitter:description" content="${twitter.description || 'Your page description'}">\n<meta name="twitter:image" content="${twitter.image || 'https://example.com/image.jpg'}">`;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Social Media Previews</h2>
      <p className="text-slate-600 mb-6">How your content appears when shared on social platforms.</p>
      
      {/* Twitter Card Preview */}
      <div className="mb-8">
        <h3 className="font-medium text-slate-900 mb-3">Twitter Card</h3>
        <div className="preview-container bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="bg-slate-100 aspect-video flex items-center justify-center border-b border-slate-200">
            {twitter.image ? (
              <img 
                src={twitter.image} 
                alt="Twitter card preview" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';
                }}
              />
            ) : (
              <ImageIcon className="h-16 w-16 text-slate-400" />
            )}
          </div>
          <div className="p-3">
            <div className="text-sm text-slate-500 mb-1">{twitter.url || openGraph.url || 'example.com'}</div>
            <div className="font-bold mb-1">{twitter.title || 'No Twitter Title'}</div>
            <div className="text-sm text-slate-600 mb-3">{twitter.description || 'No Twitter Description'}</div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className={`p-4 rounded-lg border ${twitter.issues && twitter.issues.length > 0 ? 'bg-amber-50 border-amber-100' : 'bg-green-50 border-green-100'}`}>
            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
              <div className="flex items-center">
                {twitter.issues && twitter.issues.length > 0 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-warning mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="font-semibold">
                  {twitter.issues && twitter.issues.length > 0 ? 
                    'Twitter Card Issues' : 
                    'Twitter Card Looks Good'}
                </span>
              </div>
            </div>
            
            {twitter.issues && twitter.issues.length > 0 && (
              <ul className="list-disc list-inside text-sm text-amber-800 space-y-2 mb-3">
                {twitter.issues.map((issue, index) => (
                  <li key={index}>
                    {issue.includes('twitter:') ? (
                      <>
                        Missing <code className="bg-amber-100 px-1 rounded">
                          {issue.replace('Missing ', '')}
                        </code> meta tag
                      </>
                    ) : (
                      issue
                    )}
                  </li>
                ))}
              </ul>
            )}
            
            <div className="mt-3">
              <CopyCodeBlock code={generateTwitterTags()} className="text-xs" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Open Graph Preview */}
      <div>
        <h3 className="font-medium text-slate-900 mb-3">Facebook/Open Graph</h3>
        <div className="preview-container bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="bg-slate-100 aspect-video flex items-center justify-center border-b border-slate-200">
            {openGraph.image ? (
              <img 
                src={openGraph.image} 
                alt="Open Graph preview" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';
                }}
              />
            ) : (
              <ImageIcon className="h-16 w-16 text-slate-400" />
            )}
          </div>
          <div className="p-3">
            <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">{openGraph.url || 'example.com'}</div>
            <div className="font-bold mb-1">{openGraph.title || 'No Open Graph Title'}</div>
            <div className="text-sm text-slate-600">{openGraph.description || 'No Open Graph Description'}</div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className={`p-4 rounded-lg border ${openGraph.issues && openGraph.issues.length > 0 ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
              <div className="flex items-center">
                {openGraph.issues && openGraph.issues.length > 0 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-danger mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="font-semibold">
                  {openGraph.issues && openGraph.issues.length > 0 ? 
                    'Open Graph Issues' : 
                    'Open Graph Looks Good'}
                </span>
              </div>
            </div>
            
            {openGraph.issues && openGraph.issues.length > 0 && (
              <ul className="list-disc list-inside text-sm text-red-800 space-y-2 mb-3">
                {openGraph.issues.map((issue, index) => (
                  <li key={index}>
                    {issue.includes('og:') ? (
                      <>
                        Missing <code className="bg-red-100 px-1 rounded">
                          {issue.replace('Missing ', '')}
                        </code> meta tag
                      </>
                    ) : (
                      issue
                    )}
                  </li>
                ))}
              </ul>
            )}
            
            <div className="mt-3">
              <CopyCodeBlock code={generateOpenGraphTags()} className="text-xs" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
