import { useState } from 'react';
import { SeoAnalysis } from '@shared/schema';
import SummaryTab from './tabs/summary-tab';
import GoogleTab from './tabs/google-tab';
import SocialTab from './tabs/social-tab';
import AllTagsTab from './tabs/all-tags-tab';
import { FileText, Search, Share2, Code } from 'lucide-react';

type ResultsContainerProps = {
  analysis: SeoAnalysis;
};

type TabType = 'summary' | 'google' | 'social' | 'all-tags';

interface TabInfo {
  id: TabType;
  label: string;
  icon: React.ReactNode;
}

export default function ResultsContainer({ analysis }: ResultsContainerProps) {
  const [activeTab, setActiveTab] = useState<TabType>('summary');

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
      {/* Header with score indicator */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-xl">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Analysis Results
          </h2>
          <p className="text-slate-600">
            URL: <span className="font-semibold">{analysis.url}</span>
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center">
          <div className="relative h-20 w-20">
            <svg className="h-20 w-20 transform -rotate-90" viewBox="0 0 100 100">
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
              <span className="text-2xl font-bold">{analysis.score}</span>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-slate-600">SEO Score</div>
            <div className="text-sm font-medium mt-1">
              <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span> {analysis.goodCount} Good
              <span className="inline-block w-3 h-3 rounded-full bg-amber-500 mx-1 ml-3"></span> {analysis.warningCount} Warnings
              <span className="inline-block w-3 h-3 rounded-full bg-red-500 mx-1 ml-3"></span> {analysis.missingCount} Missing
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-slate-100 rounded-t-lg border-b border-slate-200 mb-0 px-2 pt-2">
        <nav className="flex space-x-1">
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
