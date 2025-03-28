import { SeoAnalysis, MetaTag } from '@shared/schema';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Info,
  ArrowRight,
  Lightbulb,
  Shield,
  Smartphone,
  Search,
  Globe,
  BookOpenCheck
} from 'lucide-react';
import CopyCodeBlock from '@/components/ui/copy-code-block';
import TagIndicator from '@/components/ui/tag-indicator';
import { Progress } from '@/components/ui/progress';

type SummaryTabProps = {
  analysis: SeoAnalysis;
};

// Helper function to get the status icon with colors
const StatusIcon = ({ status }: { status: "good" | "warning" | "missing" | "error" }) => {
  switch(status) {
    case 'good':
      return (
        <div className="p-2 rounded-full bg-green-100">
          <CheckCircle className="h-5 w-5 text-green-600" />
        </div>
      );
    case 'warning':
      return (
        <div className="p-2 rounded-full bg-amber-100">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
        </div>
      );
    case 'missing':
    case 'error':
      return (
        <div className="p-2 rounded-full bg-red-100">
          <XCircle className="h-5 w-5 text-red-600" />
        </div>
      );
    default:
      return (
        <div className="p-2 rounded-full bg-blue-100">
          <Info className="h-5 w-5 text-blue-600" />
        </div>
      );
  }
};

// Helper to get background color based on status
const getStatusBgClass = (status: "good" | "warning" | "missing" | "error") => {
  switch(status) {
    case 'good': return 'bg-green-50 border-green-100';
    case 'warning': return 'bg-amber-50 border-amber-100';
    case 'missing':
    case 'error': return 'bg-red-50 border-red-100';
    default: return 'bg-slate-50 border-slate-100';
  }
};

// Helper to get border color based on status
const getStatusBorderColor = (status: "good" | "warning" | "missing" | "error") => {
  switch(status) {
    case 'good': return 'border-green-200';
    case 'warning': return 'border-amber-200';
    case 'missing':
    case 'error': return 'border-red-200';
    default: return 'border-slate-200';
  }
};

// Helper to get progress color based on status
const getProgressColor = (status: "good" | "warning" | "missing" | "error") => {
  switch(status) {
    case 'good': return 'bg-green-500';
    case 'warning': return 'bg-amber-500';
    case 'missing':
    case 'error': return 'bg-red-500';
    default: return 'bg-slate-500';
  }
};

// Helper to get critical tags for summary view
const getCriticalTags = (tags: MetaTag[]): MetaTag[] => {
  const criticalTagTypes = [
    { tagType: 'title', attribute: '', icon: <BookOpenCheck className="h-4 w-4" /> },
    { tagType: 'meta', attribute: 'name="description"', icon: <Search className="h-4 w-4" /> },
    { tagType: 'link', attribute: 'rel="canonical"', icon: <Globe className="h-4 w-4" /> },
    { tagType: 'meta', attribute: 'name="viewport"', icon: <Smartphone className="h-4 w-4" /> },
    { tagType: 'meta', attribute: 'name="robots"', icon: <Shield className="h-4 w-4" /> }
  ];
  
  return criticalTagTypes.map(criticalTag => {
    const tag = tags.find(t => 
      t.tagType === criticalTag.tagType && 
      t.attribute === criticalTag.attribute
    );
    
    return {
      ...(tag || {
        tagType: criticalTag.tagType,
        attribute: criticalTag.attribute,
        value: undefined,
        status: 'missing' as const,
        recommendation: `Add a ${criticalTag.tagType} ${criticalTag.attribute} tag to improve SEO.`
      }),
      icon: criticalTag.icon
    };
  });
};

// Helper to generate HTML code for tag
const getTagHtml = (tag: MetaTag) => {
  switch(tag.tagType) {
    case 'title':
      return `<title>${tag.value || ''}</title>`;
    case 'meta':
      return `<meta ${tag.attribute}${tag.value ? ` content="${tag.value}"` : ''}>`;
    case 'link':
      return `<link ${tag.attribute} href="${tag.value || ''}">`;
    case 'html':
      return `<html ${tag.attribute}="${tag.value || ''}">`;
    default:
      return `<${tag.tagType} ${tag.attribute || ''}>${tag.value || ''}</${tag.tagType}>`;
  }
};

// Helper to get tag display name
const getTagDisplayName = (tag: MetaTag) => {
  if (tag.tagType === 'title') return 'Title';
  if (tag.tagType === 'meta' && tag.attribute?.includes('description')) return 'Description';
  if (tag.tagType === 'link' && tag.attribute?.includes('canonical')) return 'Canonical';
  if (tag.tagType === 'meta' && tag.attribute?.includes('viewport')) return 'Viewport';
  if (tag.tagType === 'meta' && tag.attribute?.includes('robots')) return 'Robots';
  
  return tag.tagType === 'meta' && tag.attribute 
    ? tag.attribute.split('=')[0].replace('name', '').replace('"', '') 
    : tag.tagType;
};

// Helper to get tag description
const getTagDescription = (tag: MetaTag) => {
  if (tag.tagType === 'title') 
    return "The title tag appears in browser tabs and search results. It should be descriptive and contain your main keyword.";
  if (tag.tagType === 'meta' && tag.attribute?.includes('description')) 
    return "The meta description appears in search results below the title and URL. It should entice users to click.";
  if (tag.tagType === 'link' && tag.attribute?.includes('canonical')) 
    return "The canonical tag tells search engines which version of a page is the original to avoid duplicate content issues.";
  if (tag.tagType === 'meta' && tag.attribute?.includes('viewport')) 
    return "The viewport tag ensures your page displays correctly on mobile devices, which affects rankings.";
  if (tag.tagType === 'meta' && tag.attribute?.includes('robots')) 
    return "The robots meta tag controls how search engines crawl and index your page.";
  
  return "This meta tag provides additional information to browsers or search engines.";
};

// Helper to get optimal length information for tags
const getOptimalLength = (tagType: string, attribute?: string) => {
  if (tagType === 'title') 
    return { min: 30, max: 60, unit: 'characters' };
  if (tagType === 'meta' && attribute?.includes('description')) 
    return { min: 50, max: 160, unit: 'characters' };
  
  return null;
};

// Helper to calculate the completion percentage for a tag based on its type and value
const getCompletionPercentage = (tag: MetaTag) => {
  if (tag.status === 'missing') return 0;
  if (tag.status === 'good') return 100;
  
  // For title and description, calculate based on optimal length
  if (tag.tagType === 'title' && tag.value) {
    const length = tag.value.length;
    if (length < 30) return Math.round((length / 30) * 80); // Up to 80% for short titles
    if (length > 60) return 80; // 80% for too long titles
    return 100; // 100% for optimal length
  }
  
  if (tag.tagType === 'meta' && tag.attribute?.includes('description') && tag.value) {
    const length = tag.value.length;
    if (length < 50) return Math.round((length / 50) * 80);
    if (length > 160) return 80;
    return 100;
  }
  
  // Default for other tags with warnings
  return 70;
};

export default function SummaryTab({ analysis }: SummaryTabProps) {
  const criticalTags = getCriticalTags(analysis.tags);
  
  return (
    <div className="p-6">
      {/* SEO Priority Issues */}
      <div className="mb-8">
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-start mb-5">
            <div className="p-2 bg-primary/10 rounded-full mr-3">
              <Lightbulb className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-800">SEO Priority Issues</h3>
              <p className="text-sm text-slate-600 mt-1">
                {analysis.missingCount === 0 ? 
                  "Great job! No critical issues found on your page." : 
                  `We found ${analysis.missingCount} missing tags that need attention.`}
              </p>
            </div>
          </div>
          
          {analysis.missingCount > 0 && (
            <div className="space-y-3">
              {criticalTags.filter(tag => tag.status === 'missing').map((tag, idx) => (
                <div key={idx} className="flex items-start rounded-lg border border-red-200 bg-red-50 p-3">
                  <XCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-red-700">{getTagDisplayName(tag)} tag is missing</h4>
                    <p className="text-sm text-red-700 mt-1">{tag.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {analysis.warningCount > 0 && (
            <div className="space-y-3 mt-3">
              {criticalTags.filter(tag => tag.status === 'warning').map((tag, idx) => (
                <div key={idx} className="flex items-start rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-amber-700">{getTagDisplayName(tag)} tag needs improvement</h4>
                    <p className="text-sm text-amber-700 mt-1">{tag.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {analysis.missingCount === 0 && analysis.warningCount === 0 && (
            <div className="flex items-start rounded-lg border border-green-200 bg-green-50 p-4">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-green-700">All essential SEO tags are present and optimized</h4>
                <p className="text-sm text-green-700 mt-1">
                  Your page has all the recommended SEO tags and they're properly optimized.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Critical SEO Tags */}
      <h2 className="text-xl font-semibold mb-5">Critical SEO Tags</h2>
      
      <div className="grid grid-cols-1 gap-6">
        {criticalTags.map((tag, index) => (
          <div 
            key={index} 
            className={`rounded-lg border ${getStatusBorderColor(tag.status)} bg-white overflow-hidden shadow-sm transition hover:shadow-md`}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              {/* Left column: Tag info */}
              <div className="md:col-span-1 p-5 border-b md:border-b-0 md:border-r border-slate-100">
                <div className="flex items-center mb-3">
                  <StatusIcon status={tag.status} />
                  <div className="ml-3">
                    <h3 className="font-semibold text-slate-800">{getTagDisplayName(tag)}</h3>
                    <TagIndicator status={tag.status} value={
                      tag.tagType === 'title' && tag.value 
                        ? `${tag.value.length} chars`
                        : tag.tagType === 'meta' && tag.attribute?.includes('description') && tag.value
                          ? `${tag.value.length} chars`
                          : undefined
                    } />
                  </div>
                </div>
                
                <p className="text-sm text-slate-600 mb-4">{getTagDescription(tag)}</p>
                
                {/* Completion progress bar */}
                <div className="mb-5">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-slate-500">Completion</span>
                    <span className="text-xs font-medium text-slate-500">
                      {getCompletionPercentage(tag)}%
                    </span>
                  </div>
                  <Progress 
                    value={getCompletionPercentage(tag)} 
                    className={getProgressColor(tag.status)} 
                  />
                </div>
                
                {/* Optimal length indicator if relevant */}
                {getOptimalLength(tag.tagType, tag.attribute) && (
                  <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded">
                    <span className="font-medium">Optimal Length:</span> {getOptimalLength(tag.tagType, tag.attribute)?.min}-
                    {getOptimalLength(tag.tagType, tag.attribute)?.max} {getOptimalLength(tag.tagType, tag.attribute)?.unit}
                  </div>
                )}
              </div>
              
              {/* Right column: Content and recommendation */}
              <div className="md:col-span-2 p-5 bg-slate-50">
                <div className="mb-5">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Current Value</h4>
                  {tag.value ? (
                    <div className="font-mono text-sm bg-white p-3 rounded border border-slate-200 break-words max-h-28 overflow-y-auto">
                      {tag.value}
                    </div>
                  ) : (
                    <div className="text-sm text-slate-500 italic p-3 bg-white rounded border border-slate-200">
                      No value provided
                    </div>
                  )}
                </div>
                
                <div className="mb-5">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">HTML Code</h4>
                  <CopyCodeBlock code={getTagHtml(tag)} />
                </div>
                
                {tag.recommendation && (
                  <div className={`text-sm p-3 rounded ${
                    tag.status === 'warning' ? 'bg-amber-50 text-amber-800 border border-amber-100' : 
                    tag.status === 'missing' || tag.status === 'error' ? 'bg-red-50 text-red-800 border border-red-100' : 'bg-slate-50'
                  }`}>
                    <div className="font-medium mb-1">Recommendation</div>
                    {tag.recommendation}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* SEO Quick Tips */}
      <div className="mt-8 bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
        <div className="flex items-start mb-4">
          <div className="p-2 bg-primary/10 rounded-full mr-3">
            <Info className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">SEO Quick Tips</h3>
            <p className="text-sm text-slate-600 mt-1">Follow these guidelines to improve your search visibility</p>
          </div>
        </div>
        
        <ul className="space-y-3 text-sm">
          <li className="flex items-start p-3 bg-slate-50 rounded-lg">
            <CheckCircle className="h-4 w-4 text-success mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium text-slate-800">Optimize title tags</span>
              <p className="text-slate-600 mt-1">Keep titles between 30-60 characters, include your primary keyword near the beginning, and make them compelling to increase click-through rates.</p>
            </div>
          </li>
          <li className="flex items-start p-3 bg-slate-50 rounded-lg">
            <CheckCircle className="h-4 w-4 text-success mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium text-slate-800">Craft effective meta descriptions</span>
              <p className="text-slate-600 mt-1">Write unique descriptions between 50-160 characters for each page that summarize content and include a call to action to encourage clicks.</p>
            </div>
          </li>
          <li className="flex items-start p-3 bg-slate-50 rounded-lg">
            <CheckCircle className="h-4 w-4 text-success mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium text-slate-800">Use proper canonicalization</span>
              <p className="text-slate-600 mt-1">Include canonical URLs on all pages to prevent duplicate content issues and consolidate ranking signals for similar or identical content.</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
