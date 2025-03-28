import { useState } from 'react';
import { SeoAnalysis } from '@shared/schema';
import SummaryTab from './tabs/summary-tab';
import GoogleTab from './tabs/google-tab';
import SocialTab from './tabs/social-tab';
import AllTagsTab from './tabs/all-tags-tab';
import CategorySummary from './category-summary';
import { FileText, Search, Share2, Code, BarChart3, ExternalLink, RefreshCcw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatUrlForDisplay } from '@/lib/seo-analyzer';

type ResultsContainerProps = {
  analysis: SeoAnalysis;
};

type TabType = 'summary' | 'google' | 'social' | 'all-tags';

interface TabInfo {
  id: TabType;
  label: string;
  icon: React.ReactNode;
}

// Helper to get status icon with style
const StatusIcon = ({ count, type }: { count: number, type: 'good' | 'warning' | 'missing' }) => {
  const bgColor = type === 'good' ? 'bg-green-100' : type === 'warning' ? 'bg-amber-100' : 'bg-red-100';
  const textColor = type === 'good' ? 'text-green-600' : type === 'warning' ? 'text-amber-600' : 'text-red-600';
  const label = type === 'good' ? 'Good' : type === 'warning' ? 'Warnings' : 'Missing';
  
  return (
    <div className={`flex flex-col items-center justify-center p-4 rounded-lg ${bgColor}`}>
      <span className={`text-2xl font-bold ${textColor}`}>{count}</span>
      <span className={`text-xs font-medium ${textColor}`}>{label}</span>
    </div>
  );
};

// Helper to get score assessment text
const getScoreAssessment = (score: number) => {
  if (score >= 90) return { text: 'Excellent', color: 'text-green-600' };
  if (score >= 80) return { text: 'Very Good', color: 'text-green-600' };
  if (score >= 70) return { text: 'Good', color: 'text-green-500' };
  if (score >= 60) return { text: 'Above Average', color: 'text-amber-500' };
  if (score >= 50) return { text: 'Average', color: 'text-amber-500' };
  if (score >= 40) return { text: 'Below Average', color: 'text-amber-600' };
  if (score >= 30) return { text: 'Poor', color: 'text-red-500' };
  return { text: 'Critical', color: 'text-red-600' };
};

export default function ResultsContainer({ analysis }: ResultsContainerProps) {
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const scoreAssessment = getScoreAssessment(analysis.score);

  const tabs: TabInfo[] = [
    { id: 'summary', label: 'Summary', icon: <FileText className="h-4 w-4 mr-2" /> },
    { id: 'google', label: 'Google Preview', icon: <Search className="h-4 w-4 mr-2" /> },
    { id: 'social', label: 'Social Media', icon: <Share2 className="h-4 w-4 mr-2" /> },
    { id: 'all-tags', label: 'All Meta Tags', icon: <Code className="h-4 w-4 mr-2" /> },
  ];

  const tabButtonClass = (tab: TabType) => 
    `flex items-center px-5 py-3 font-medium text-sm rounded-t-lg transition ${
      activeTab === tab 
        ? 'bg-white text-primary shadow-sm border-t border-l border-r border-slate-200' 
        : 'text-slate-600 hover:bg-white/50 hover:text-primary/90'
    }`;

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header with site info and dashboard */}
      <div className="mb-6 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <div className="font-medium text-sm text-slate-500 mb-1">Analyzed Website</div>
            <h2 className="text-xl font-bold text-slate-800 mb-1 flex items-center">
              {formatUrlForDisplay(analysis.url)}
              <a href={analysis.url} target="_blank" rel="noopener noreferrer" className="ml-2 text-slate-400 hover:text-primary">
                <ExternalLink className="h-4 w-4" />
              </a>
            </h2>
            <div className="text-sm text-slate-500">
              {analysis.tags.length} tags analyzed • {new Date().toLocaleDateString()}
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <Button size="sm" variant="outline" className="text-slate-600 flex items-center gap-1">
              <RefreshCcw className="h-3 w-3" /> Re-analyze
            </Button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-6">
            {/* Score Card */}
            <Card className="col-span-1 md:col-span-1 overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-b from-primary/5 to-primary/0 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-slate-500">Overall Score</h3>
                    <BarChart3 className="h-5 w-5 text-primary opacity-70" />
                  </div>
                  
                  <div className="flex items-center">
                    <div className="relative h-16 w-16">
                      <svg className="h-16 w-16 transform -rotate-90" viewBox="0 0 100 100">
                        <circle 
                          cx="50" cy="50" r="45" 
                          fill="none" 
                          stroke="#e2e8f0" 
                          strokeWidth="10"
                        />
                        <circle 
                          cx="50" cy="50" r="45" 
                          fill="none" 
                          stroke={analysis.score >= 80 ? '#10b981' : analysis.score >= 50 ? '#f59e0b' : '#ef4444'} 
                          strokeWidth="10"
                          strokeDasharray="283"
                          strokeDashoffset={283 - (283 * analysis.score / 100)}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-bold">{analysis.score}</span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className={`text-lg font-semibold ${scoreAssessment.color}`}>
                        {scoreAssessment.text}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">SEO Health</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Status Cards */}
            <div className="col-span-1 md:col-span-3 grid grid-cols-3 gap-4">
              <StatusIcon count={analysis.goodCount} type="good" />
              <StatusIcon count={analysis.warningCount} type="warning" />
              <StatusIcon count={analysis.missingCount} type="missing" />
            </div>
          </div>
          
          {/* Category Summaries */}
          <CategorySummary analysis={analysis} />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-slate-100 rounded-t-lg border-b border-slate-200 mb-0 px-2 pt-2">
        <nav className="flex space-x-1 overflow-x-auto scrollbar-none pb-1">
          {tabs.map((tab) => (
            <button 
              key={tab.id}
              className={tabButtonClass(tab.id)}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content Container */}
      <div className="bg-white border-l border-r border-b border-slate-200 rounded-b-lg shadow-sm">
        {/* Tab Content */}
        {activeTab === 'summary' && <SummaryTab analysis={analysis} />}
        {activeTab === 'google' && <GoogleTab googlePreview={analysis.googlePreview} />}
        {activeTab === 'social' && <SocialTab socialPreviews={analysis.socialPreviews} />}
        {activeTab === 'all-tags' && <AllTagsTab tags={analysis.tags} />}
      </div>
    </div>
  );
}
