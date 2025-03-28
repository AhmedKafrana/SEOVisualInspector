import { SeoAnalysis, MetaTag } from '@shared/schema';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Info
} from 'lucide-react';
import CopyCodeBlock from '@/components/ui/copy-code-block';
import TagIndicator from '@/components/ui/tag-indicator';

type SummaryTabProps = {
  analysis: SeoAnalysis;
};

// Helper function to get the status icon
const StatusIcon = ({ status }: { status: "good" | "warning" | "missing" | "error" }) => {
  switch(status) {
    case 'good':
      return <CheckCircle className="h-5 w-5 text-success mr-2" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-warning mr-2" />;
    case 'missing':
    case 'error':
      return <XCircle className="h-5 w-5 text-danger mr-2" />;
    default:
      return <Info className="h-5 w-5 text-primary mr-2" />;
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

// Helper to get critical tags for summary view
const getCriticalTags = (tags: MetaTag[]): MetaTag[] => {
  const criticalTagTypes = [
    { tagType: 'title', attribute: '' },
    { tagType: 'meta', attribute: 'name="description"' },
    { tagType: 'link', attribute: 'rel="canonical"' },
    { tagType: 'meta', attribute: 'name="viewport"' },
    { tagType: 'meta', attribute: 'name="robots"' }
  ];
  
  return criticalTagTypes.map(criticalTag => {
    const tag = tags.find(t => 
      t.tagType === criticalTag.tagType && 
      t.attribute === criticalTag.attribute
    );
    
    return tag || {
      tagType: criticalTag.tagType,
      attribute: criticalTag.attribute,
      value: undefined,
      status: 'missing' as const,
      recommendation: `Add a ${criticalTag.tagType} ${criticalTag.attribute} tag to improve SEO.`
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

export default function SummaryTab({ analysis }: SummaryTabProps) {
  const criticalTags = getCriticalTags(analysis.tags);
  
  return (
    <div className="p-6">
      {/* SEO Quick Tips */}
      <div className="mb-8 bg-primary/5 border border-primary/10 rounded-lg p-5">
        <div className="flex items-start mb-4">
          <div className="p-2 bg-primary/10 rounded-full mr-3">
            <Info className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">SEO Quick Tips</h3>
            <p className="text-sm text-slate-600 mt-1">These critical tags have the biggest impact on your SEO performance.</p>
          </div>
        </div>
        
        <ul className="space-y-2 text-sm">
          <li className="flex items-start">
            <CheckCircle className="h-4 w-4 text-success mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-slate-700">Make sure your title is between 30-60 characters and includes your primary keyword.</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-4 w-4 text-success mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-slate-700">Write a compelling meta description between 50-160 characters that encourages clicks.</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-4 w-4 text-success mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-slate-700">Include a canonical URL to prevent duplicate content issues.</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-4 w-4 text-success mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-slate-700">Set proper viewport meta tag for responsive design and better mobile rankings.</span>
          </li>
        </ul>
      </div>

      {/* Critical SEO Tags */}
      <h2 className="text-xl font-semibold mb-4">Critical SEO Tags</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {criticalTags.map((tag, index) => (
          <div 
            key={index} 
            className={`rounded-lg border ${getStatusBorderColor(tag.status)} bg-white overflow-hidden shadow-sm transition hover:shadow-md`}
          >
            <div className={`flex items-center justify-between px-4 py-3 ${getStatusBgClass(tag.status)}`}>
              <div className="flex items-center">
                <StatusIcon status={tag.status} />
                <span className="font-semibold">{getTagDisplayName(tag)}</span>
              </div>
              <TagIndicator status={tag.status} value={
                tag.tagType === 'title' && tag.value 
                  ? `${tag.value.length} chars`
                  : tag.tagType === 'meta' && tag.attribute === 'name="description"' && tag.value
                    ? `${tag.value.length} chars`
                    : tag.status
              } />
            </div>
            
            <div className="p-4">
              <div className="mb-3">
                {tag.value ? (
                  <div className="font-mono text-sm bg-slate-50 p-2 rounded border border-slate-100 break-words max-h-20 overflow-y-auto">
                    {tag.value}
                  </div>
                ) : (
                  <div className="text-sm text-slate-500 italic p-2">No value provided</div>
                )}
              </div>
              
              <CopyCodeBlock code={getTagHtml(tag)} />
              
              {tag.recommendation && (
                <div className={`mt-3 text-sm p-2 rounded ${
                  tag.status === 'warning' ? 'bg-amber-50 text-amber-800' : 
                  tag.status === 'missing' || tag.status === 'error' ? 'bg-red-50 text-red-800' : 'bg-slate-50'
                }`}>
                  <strong>Recommendation:</strong> {tag.recommendation}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
