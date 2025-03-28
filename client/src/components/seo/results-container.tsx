import { useState } from 'react';
import { SeoAnalysis } from '@shared/schema';
import SummaryTab from './tabs/summary-tab';
import GoogleTab from './tabs/google-tab';
import SocialTab from './tabs/social-tab';
import AllTagsTab from './tabs/all-tags-tab';

type ResultsContainerProps = {
  analysis: SeoAnalysis;
};

type TabType = 'summary' | 'google' | 'social' | 'all-tags';

export default function ResultsContainer({ analysis }: ResultsContainerProps) {
  const [activeTab, setActiveTab] = useState<TabType>('summary');

  const tabButtonClass = (tab: TabType) => 
    `px-4 py-2 font-medium text-sm border-b-2 ${
      activeTab === tab 
        ? 'border-primary text-primary' 
        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
    }`;

  return (
    <div>
      {/* Tab Navigation */}
      <div className="border-b border-slate-200 mb-6">
        <nav className="flex -mb-px">
          <button 
            className={tabButtonClass('summary')}
            onClick={() => setActiveTab('summary')}
          >
            Summary
          </button>
          <button 
            className={tabButtonClass('google')}
            onClick={() => setActiveTab('google')}
          >
            Google Preview
          </button>
          <button 
            className={tabButtonClass('social')}
            onClick={() => setActiveTab('social')}
          >
            Social Media
          </button>
          <button 
            className={tabButtonClass('all-tags')}
            onClick={() => setActiveTab('all-tags')}
          >
            All Meta Tags
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'summary' && <SummaryTab analysis={analysis} />}
      {activeTab === 'google' && <GoogleTab googlePreview={analysis.googlePreview} />}
      {activeTab === 'social' && <SocialTab socialPreviews={analysis.socialPreviews} />}
      {activeTab === 'all-tags' && <AllTagsTab tags={analysis.tags} />}
    </div>
  );
}
