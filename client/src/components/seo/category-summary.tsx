import { SeoAnalysis, MetaTag } from '@shared/schema';
import { CheckCircle, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface CategorySummaryProps {
  analysis: SeoAnalysis;
  onViewDetails?: (categoryType: string) => void;
}

// Helper to classify tags into categories
const categorizeMetaTags = (tags: MetaTag[]) => {
  // Define categories
  const categories = {
    essentials: {
      name: 'Essential Tags',
      description: 'Core tags that every page should have',
      tags: [] as MetaTag[],
      score: 0,
      total: 0,
      good: 0,
      warning: 0,
      missing: 0,
      types: ['title', 'meta@name="description"', 'link@rel="canonical"', 'meta@name="robots"', 'meta@name="viewport"']
    },
    social: {
      name: 'Social Media',
      description: 'Tags for social media sharing',
      tags: [] as MetaTag[],
      score: 0,
      total: 0,
      good: 0,
      warning: 0,
      missing: 0,
      types: ['meta@property="og:title"', 'meta@property="og:description"', 'meta@property="og:image"', 
              'meta@name="twitter:title"', 'meta@name="twitter:description"', 'meta@name="twitter:image"']
    },
    technical: {
      name: 'Technical SEO',
      description: 'Tags affecting indexing and rendering',
      tags: [] as MetaTag[],
      score: 0,
      total: 0,
      good: 0,
      warning: 0,
      missing: 0,
      types: ['meta@charset', 'html@lang', 'meta@name="author"', 'meta@http-equiv', 'link@rel="alternate"']
    },
    other: {
      name: 'Other Tags',
      description: 'Additional meta tags',
      tags: [] as MetaTag[],
      score: 0,
      total: 0,
      good: 0,
      warning: 0,
      missing: 0,
      types: []
    }
  };

  // Helper to match tag to category type patterns
  const matchesType = (tag: MetaTag, pattern: string) => {
    const [tagType, attr = ''] = pattern.split('@');
    if (tag.tagType !== tagType) return false;
    if (!attr) return true;
    return tag.attribute?.includes(attr.substring(0, attr.length - 1)) || false;
  };

  // Categorize each tag
  tags.forEach(tag => {
    if (categories.essentials.types.some(type => matchesType(tag, type))) {
      categories.essentials.tags.push(tag);
      categories.essentials.total++;
      if (tag.status === 'good') categories.essentials.good++;
      else if (tag.status === 'warning') categories.essentials.warning++;
      else categories.essentials.missing++;
    } 
    else if (categories.social.types.some(type => matchesType(tag, type))) {
      categories.social.tags.push(tag);
      categories.social.total++;
      if (tag.status === 'good') categories.social.good++;
      else if (tag.status === 'warning') categories.social.warning++;
      else categories.social.missing++;
    }
    else if (categories.technical.types.some(type => matchesType(tag, type))) {
      categories.technical.tags.push(tag);
      categories.technical.total++;
      if (tag.status === 'good') categories.technical.good++;
      else if (tag.status === 'warning') categories.technical.warning++;
      else categories.technical.missing++;
    }
    else {
      categories.other.tags.push(tag);
      categories.other.total++;
      if (tag.status === 'good') categories.other.good++;
      else if (tag.status === 'warning') categories.other.warning++;
      else categories.other.missing++;
    }
  });

  // Calculate scores for each category
  Object.keys(categories).forEach(key => {
    const category = categories[key as keyof typeof categories];
    if (category.total === 0) {
      category.score = 0;
    } else {
      // Weighted score: Good = 1 point, Warning = 0.5 points, Missing = 0 points
      category.score = Math.round(((category.good * 1) + (category.warning * 0.5)) / category.total * 100);
    }
  });

  return categories;
};

// Helper to get color based on score
const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 50) return 'text-amber-600';
  return 'text-red-600';
};

// Helper to get progress bar color based on score
const getProgressColor = (score: number) => {
  if (score >= 80) return 'bg-green-500';
  if (score >= 50) return 'bg-amber-500';
  return 'bg-red-500';
};

// Helper for status pill
const StatusPill = ({ count, type }: { count: number, type: 'good' | 'warning' | 'missing' }) => {
  if (count === 0) return null;
  
  const getBgColor = () => {
    switch (type) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-amber-100 text-amber-800';
      case 'missing': return 'bg-red-100 text-red-800';
    }
  };
  
  const getIcon = () => {
    switch (type) {
      case 'good': return <CheckCircle className="h-3 w-3 mr-1" />;
      case 'warning': return <AlertTriangle className="h-3 w-3 mr-1" />;
      case 'missing': return <XCircle className="h-3 w-3 mr-1" />;
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getBgColor()} ml-2`}>
      {getIcon()}
      {count}
    </span>
  );
};

export default function CategorySummary({ analysis, onViewDetails }: CategorySummaryProps) {
  const categories = categorizeMetaTags(analysis.tags);

  // Map category keys to tab selections
  const getCategoryTabMapping = (key: string) => {
    switch(key) {
      case 'essentials': return 'summary';
      case 'social': return 'social';
      case 'technical': return 'all-tags';
      case 'other': return 'all-tags';
      default: return 'summary';
    }
  };

  const handleViewDetails = (categoryKey: string) => {
    if (onViewDetails) {
      onViewDetails(getCategoryTabMapping(categoryKey));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {Object.entries(categories).map(([key, category]) => (
        <div key={key} className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="p-5 border-b border-slate-100">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-slate-800">{category.name}</h3>
              <div className={`text-xl font-bold ${getScoreColor(category.score)}`}>{category.score}%</div>
            </div>
            <p className="text-sm text-slate-600 mb-3">{category.description}</p>
            <Progress value={category.score} className={`h-2 ${getProgressColor(category.score)}`} />
            
            <div className="flex items-center mt-3 text-sm">
              <StatusPill count={category.good} type="good" />
              <StatusPill count={category.warning} type="warning" />
              <StatusPill count={category.missing} type="missing" />
            </div>
          </div>
          
          <div className="p-4 bg-slate-50">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">
                {category.total} {category.total === 1 ? 'tag' : 'tags'} analyzed
              </span>
              <button 
                onClick={() => handleViewDetails(key)}
                className="inline-flex items-center text-xs font-medium text-primary hover:text-primary/80 transition-colors hover:underline cursor-pointer"
              >
                View Details <ArrowRight className="h-3 w-3 ml-1" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}