import { SeoAnalysis, MetaTag } from '@shared/schema';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle 
} from 'lucide-react';
import CopyCodeBlock from '@/components/ui/copy-code-block';
import TagIndicator from '@/components/ui/tag-indicator';

type SummaryTabProps = {
  analysis: SeoAnalysis;
};

// Helper function to get the status icon
const StatusIcon = ({ status }: { status: string }) => {
  switch(status) {
    case 'good':
      return <CheckCircle className="h-5 w-5 text-success mr-2" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-warning mr-2" />;
    case 'missing':
    case 'error':
      return <XCircle className="h-5 w-5 text-danger mr-2" />;
    default:
      return null;
  }
};

// Helper to get background color based on status
const getStatusBgClass = (status: string) => {
  switch(status) {
    case 'good': return 'bg-green-50 border-green-100';
    case 'warning': return 'bg-amber-50 border-amber-100';
    case 'missing':
    case 'error': return 'bg-red-50 border-red-100';
    default: return 'bg-slate-50 border-slate-100';
  }
};

// Helper to get critical tags for summary view
const getCriticalTags = (tags: MetaTag[]) => {
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
      status: 'missing',
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

export default function SummaryTab({ analysis }: SummaryTabProps) {
  const criticalTags = getCriticalTags(analysis.tags);
  
  return (
    <>
      {/* Overall Score */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">SEO Score</h2>
          <span className="text-2xl font-bold text-primary">{analysis.score}/100</span>
        </div>
        
        <div className="w-full bg-slate-200 rounded-full h-2.5 mb-4">
          <div 
            className="bg-primary h-2.5 rounded-full" 
            style={{ width: `${analysis.score}%` }}
          ></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center">
              <div className="p-2 bg-success bg-opacity-20 rounded-full mr-3">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <span className="block text-sm font-medium">Good Tags</span>
                <span className="text-lg font-semibold">{analysis.goodCount}</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
            <div className="flex items-center">
              <div className="p-2 bg-warning bg-opacity-20 rounded-full mr-3">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <span className="block text-sm font-medium">Warnings</span>
                <span className="text-lg font-semibold">{analysis.warningCount}</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-red-50 rounded-lg border border-red-100">
            <div className="flex items-center">
              <div className="p-2 bg-danger bg-opacity-20 rounded-full mr-3">
                <XCircle className="h-5 w-5 text-danger" />
              </div>
              <div>
                <span className="block text-sm font-medium">Missing/Issues</span>
                <span className="text-lg font-semibold">{analysis.missingCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Critical SEO Tags */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Critical SEO Tags</h2>
        
        <div className="space-y-4">
          {criticalTags.map((tag, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg border ${getStatusBgClass(tag.status)}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-center">
                  <StatusIcon status={tag.status} />
                  <span className="font-semibold">{tag.tagType === 'meta' ? tag.attribute.split('=')[0].replace('name', '').replace('"', '') : tag.tagType}</span>
                </div>
                <TagIndicator status={tag.status} value={
                  tag.tagType === 'title' && tag.value 
                    ? `${tag.value.length} chars`
                    : tag.tagType === 'meta' && tag.attribute === 'name="description"' && tag.value
                      ? `${tag.value.length} chars`
                      : tag.status
                } />
              </div>
              <div className="mt-2">
                <CopyCodeBlock code={getTagHtml(tag)} />
                
                {tag.recommendation && (
                  <p className={`mt-2 text-sm ${
                    tag.status === 'warning' ? 'text-amber-800' : 
                    tag.status === 'missing' || tag.status === 'error' ? 'text-red-800' : ''
                  }`}>
                    <strong>Recommendation:</strong> {tag.recommendation}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
