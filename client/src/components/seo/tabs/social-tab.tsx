import { SeoAnalysis } from '@shared/schema';
import { ImageIcon, AlertTriangle, CheckCircle, Info, Share, Facebook, Twitter } from 'lucide-react';
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
    <div className="p-6">
      <div className="mb-6 bg-primary/5 border border-primary/10 rounded-lg p-5">
        <div className="flex items-start mb-4">
          <div className="p-2 bg-primary/10 rounded-full mr-3">
            <Share className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Social Media Optimization</h3>
            <p className="text-sm text-slate-600 mt-1">
              Good social media tags increase click-through rates and engagement when your content is shared online.
            </p>
          </div>
        </div>
        
        <ul className="space-y-2 text-sm">
          <li className="flex items-start">
            <CheckCircle className="h-4 w-4 text-success mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-slate-700">Use high-quality, relevant images that are at least 1200x630 pixels for optimal display.</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-4 w-4 text-success mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-slate-700">Write clear, compelling titles and descriptions specific to each platform.</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-4 w-4 text-success mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-slate-700">Include all essential meta tags to ensure your content displays correctly on all platforms.</span>
          </li>
        </ul>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Twitter Card Preview */}
        <div>
          <div className="flex items-center mb-4">
            <Twitter className="h-5 w-5 text-[#1DA1F2] mr-2" />
            <h3 className="font-medium text-slate-900">Twitter Card Preview</h3>
          </div>
          
          <div className="preview-container rounded-xl overflow-hidden border border-slate-200 shadow-sm mb-4 bg-white hover:shadow-md transition">
            <div className="bg-slate-50 aspect-video flex items-center justify-center border-b border-slate-200 relative">
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
                <div className="flex flex-col items-center justify-center p-4 bg-slate-100 w-full h-full">
                  <ImageIcon className="h-12 w-12 text-slate-400 mb-2" />
                  <p className="text-sm text-slate-500 text-center">No image specified</p>
                </div>
              )}
              {!twitter.image && twitter.issues && twitter.issues.some(issue => issue.includes('twitter:image')) && (
                <div className="absolute bottom-2 right-2 bg-amber-100 rounded-full p-1">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
              )}
            </div>
            
            <div className="p-4">
              <div className="flex items-center mb-2">
                <div className="h-8 w-8 rounded-full bg-slate-200 mr-2"></div>
                <div>
                  <div className="h-3 w-24 bg-slate-200 rounded mb-1"></div>
                  <div className="h-2 w-16 bg-slate-100 rounded"></div>
                </div>
              </div>
              
              <div className="font-bold text-[#292f33] mb-1">
                {twitter.title || 'No Twitter Title'}
                {!twitter.title && (
                  <span className="ml-2 inline-flex items-center text-amber-500 text-xs font-normal">
                    <AlertTriangle className="h-3 w-3 mr-1"/> Missing
                  </span>
                )}
              </div>
              
              <div className="text-sm text-[#66757f] mb-2 line-clamp-2">
                {twitter.description || 'No description available'}
                {!twitter.description && (
                  <span className="ml-2 inline-flex items-center text-amber-500 text-xs">
                    <AlertTriangle className="h-3 w-3 mr-1"/> Missing
                  </span>
                )}
              </div>
              
              <div className="text-xs text-[#8899a6]">
                {openGraph.url || 'example.com'}
              </div>
            </div>
          </div>
          
          <div className={`rounded-lg shadow-sm overflow-hidden ${twitter.issues && twitter.issues.length > 0 ? 'border border-amber-200' : 'border border-green-200'}`}>
            <div className={`flex items-center gap-2 p-3 ${twitter.issues && twitter.issues.length > 0 ? 'bg-amber-50' : 'bg-green-50'}`}>
              <div className={`p-1 rounded-full ${twitter.issues && twitter.issues.length > 0 ? 'bg-amber-100' : 'bg-green-100'}`}>
                {twitter.issues && twitter.issues.length > 0 ? (
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                )}
              </div>
              <span className="font-medium text-sm">
                {twitter.issues && twitter.issues.length > 0 ? 
                  `${twitter.issues.length} Issue${twitter.issues.length > 1 ? 's' : ''} Found` : 
                  'Twitter Card Ready'}
              </span>
            </div>
            
            <div className="p-4 bg-white">
              {twitter.issues && twitter.issues.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Required Tags</h4>
                  <ul className="space-y-1 text-sm text-amber-800">
                    {twitter.issues.map((issue, index) => (
                      <li key={index} className="flex items-start">
                        <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                        {issue.includes('twitter:') ? (
                          <span>
                            Missing <code className="bg-amber-100 px-1 rounded">
                              {issue.replace('Missing ', '')}
                            </code> meta tag
                          </span>
                        ) : (
                          issue
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">Recommended Twitter Card Tags</h4>
                <CopyCodeBlock code={generateTwitterTags()} className="text-xs" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Open Graph Preview */}
        <div>
          <div className="flex items-center mb-4">
            <Facebook className="h-5 w-5 text-[#1877F2] mr-2" />
            <h3 className="font-medium text-slate-900">Facebook/Open Graph Preview</h3>
          </div>
          
          <div className="preview-container rounded-xl overflow-hidden border border-slate-200 shadow-sm mb-4 bg-white hover:shadow-md transition">
            <div className="bg-slate-50 aspect-[1.91/1] flex items-center justify-center border-b border-slate-200 relative">
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
                <div className="flex flex-col items-center justify-center p-4 bg-slate-100 w-full h-full">
                  <ImageIcon className="h-12 w-12 text-slate-400 mb-2" />
                  <p className="text-sm text-slate-500 text-center">No image specified</p>
                </div>
              )}
              {!openGraph.image && openGraph.issues && openGraph.issues.some(issue => issue.includes('og:image')) && (
                <div className="absolute bottom-2 right-2 bg-red-100 rounded-full p-1">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
              )}
            </div>
            
            <div className="p-4">
              <div className="text-xs uppercase tracking-wide text-[#606770] mb-1">
                {openGraph.url || 'example.com'}
              </div>
              
              <div className="font-bold text-[#1d2129] text-lg mb-1">
                {openGraph.title || 'No Open Graph Title'}
                {!openGraph.title && (
                  <span className="ml-2 inline-flex items-center text-red-500 text-xs font-normal">
                    <AlertTriangle className="h-3 w-3 mr-1"/> Missing
                  </span>
                )}
              </div>
              
              <div className="text-sm text-[#606770] mb-2 line-clamp-3">
                {openGraph.description || 'No Open Graph Description'}
                {!openGraph.description && (
                  <span className="ml-2 inline-flex items-center text-red-500 text-xs">
                    <AlertTriangle className="h-3 w-3 mr-1"/> Missing
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className={`rounded-lg shadow-sm overflow-hidden ${openGraph.issues && openGraph.issues.length > 0 ? 'border border-red-200' : 'border border-green-200'}`}>
            <div className={`flex items-center gap-2 p-3 ${openGraph.issues && openGraph.issues.length > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
              <div className={`p-1 rounded-full ${openGraph.issues && openGraph.issues.length > 0 ? 'bg-red-100' : 'bg-green-100'}`}>
                {openGraph.issues && openGraph.issues.length > 0 ? (
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                )}
              </div>
              <span className="font-medium text-sm">
                {openGraph.issues && openGraph.issues.length > 0 ? 
                  `${openGraph.issues.length} Issue${openGraph.issues.length > 1 ? 's' : ''} Found` : 
                  'Open Graph Ready'}
              </span>
            </div>
            
            <div className="p-4 bg-white">
              {openGraph.issues && openGraph.issues.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Required Tags</h4>
                  <ul className="space-y-1 text-sm text-red-800">
                    {openGraph.issues.map((issue, index) => (
                      <li key={index} className="flex items-start">
                        <AlertTriangle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                        {issue.includes('og:') ? (
                          <span>
                            Missing <code className="bg-red-100 px-1 rounded">
                              {issue.replace('Missing ', '')}
                            </code> meta tag
                          </span>
                        ) : (
                          issue
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">Recommended Open Graph Tags</h4>
                <CopyCodeBlock code={generateOpenGraphTags()} className="text-xs" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <div className="flex items-start">
          <div className="p-1 bg-primary/10 rounded-full mr-3">
            <Info className="h-4 w-4 text-primary" />
          </div>
          <div className="text-sm text-slate-700">
            <p className="font-medium mb-1">Optimizing Social Previews</p>
            <p>Facebook uses Open Graph tags while Twitter uses Twitter Card tags. Include both sets of tags to ensure optimal sharing experience across all platforms. Images should be high quality, ideally with aspect ratios of 1.91:1 for Open Graph and 2:1 for Twitter.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
