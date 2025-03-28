import { SeoAnalysis } from '@shared/schema';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';

type GoogleTabProps = {
  googlePreview: SeoAnalysis['googlePreview'];
};

const getStatusBar = (value: number, max: number, status: string | undefined) => {
  const percentage = Math.min(100, Math.round((value / max) * 100));
  
  let barColor;
  let textColor;
  switch(status) {
    case 'good': 
      barColor = 'bg-green-500'; 
      textColor = 'text-green-700';
      break;
    case 'warning': 
      barColor = 'bg-amber-500'; 
      textColor = 'text-amber-700';
      break;
    case 'error': 
    case 'missing': 
      barColor = 'bg-red-500'; 
      textColor = 'text-red-700';
      break;
    default: 
      barColor = 'bg-slate-400';
      textColor = 'text-slate-700';
  }
  
  return (
    <div className="relative pt-1 mb-4">
      <div className="flex items-center justify-between mb-1">
        <div>
          <span className={`text-xs font-semibold inline-block ${textColor}`}>
            {value} characters
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold inline-block text-slate-600">
            {status === 'good' ? 'Optimal' : status === 'warning' ? 'Needs Improvement' : 'Issue'}
          </span>
        </div>
      </div>
      <div className="flex h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          style={{ width: `${percentage}%` }}
          className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${barColor} transition-all duration-500`}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-slate-500 mt-1">
        <span>0</span>
        <span className={value > max ? 'text-red-500 font-semibold' : 'text-slate-600'}>Max: {max}</span>
      </div>
    </div>
  );
};

// Helper to get status icon with colored background
const StatusIndicator = ({ status }: { status: string | undefined }) => {
  switch(status) {
    case 'good':
      return (
        <div className="p-2 bg-green-100 rounded-full">
          <CheckCircle className="h-5 w-5 text-green-600" />
        </div>
      );
    case 'warning':
      return (
        <div className="p-2 bg-amber-100 rounded-full">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
        </div>
      );
    case 'missing':
    case 'error':
      return (
        <div className="p-2 bg-red-100 rounded-full">
          <AlertTriangle className="h-5 w-5 text-red-600" />
        </div>
      );
    default:
      return (
        <div className="p-2 bg-blue-100 rounded-full">
          <Info className="h-5 w-5 text-blue-600" />
        </div>
      );
  }
};

export default function GoogleTab({ googlePreview }: GoogleTabProps) {
  // Calculate dynamic values
  const titleLength = googlePreview.titleLength || 0;
  const descriptionLength = googlePreview.descriptionLength || 0;
  
  // Get analysis status
  const getTitleAnalysisText = () => {
    if (!googlePreview.title) return "Your page is missing a title tag.";
    if (googlePreview.titleStatus === 'warning') {
      return titleLength < 30 
        ? "Your title tag is too short. Aim for 50-60 characters."
        : "Your title tag is too long. Keep it under 60 characters to avoid truncation in search results.";
    }
    return "Your title tag is optimized for search results. It's concise and descriptive.";
  };
  
  const getDescriptionAnalysisText = () => {
    if (!googlePreview.description) return "Your page is missing a meta description.";
    if (googlePreview.descriptionStatus === 'warning') {
      return descriptionLength < 50 
        ? "Your description is too short. Consider expanding it to provide more context about your page."
        : "Your description is too long. Keep it under 160 characters to avoid truncation in search results.";
    }
    return "Your meta description is well-optimized for search results.";
  };
  
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-2">Google Search Preview</h2>
        <p className="text-slate-600 mb-6">This is how your page appears in Google search results.</p>
        
        {/* Google Preview Box */}
        <div className="preview-container mb-8">
          {/* Desktop Preview */}
          <div className="hidden md:block">
            <div className="p-5 border border-slate-200 rounded-lg mb-2 shadow-sm bg-white">
              <div className="mb-1 flex items-center space-x-2">
                <div className="w-4 h-4 bg-slate-200 rounded-full"></div>
                <div className="w-20 h-3 bg-slate-200 rounded"></div>
              </div>
              
              {/* Search Input Bar */}
              <div className="w-full p-2 bg-white rounded-full border border-slate-200 flex items-center mb-4">
                <div className="w-4 h-4 bg-slate-200 rounded-full mr-3"></div>
                <div className="flex-grow h-3 bg-slate-100 rounded"></div>
                <div className="w-4 h-4 bg-slate-200 rounded-full ml-3"></div>
              </div>
              
              {/* Result Preview */}
              <div className="border-b border-slate-100 pb-4 mb-3">
                <div className="mb-1 text-sm text-green-700 truncate">{googlePreview.url}</div>
                <div className="text-xl text-blue-700 font-medium mb-1 hover:underline cursor-pointer">
                  {googlePreview.title || "No title tag found"}
                </div>
                <div className="text-sm text-slate-600 line-clamp-2">
                  {googlePreview.description || "No meta description found. Google will try to extract relevant text from your page."}
                </div>
              </div>
              
              <div className="text-xs text-slate-400">The preview may not be 100% accurate to how Google will display your page</div>
            </div>
          </div>
          
          {/* Mobile Preview */}
          <div className="md:hidden">
            <div className="max-w-xs mx-auto p-4 border border-slate-200 rounded-lg bg-white shadow-sm">
              <div className="mb-3 flex items-center space-x-2">
                <div className="w-3 h-3 bg-slate-200 rounded-full"></div>
                <div className="w-16 h-2 bg-slate-200 rounded"></div>
              </div>
              
              {/* Search Input Bar */}
              <div className="w-full p-1.5 bg-white rounded-full border border-slate-200 flex items-center mb-3">
                <div className="w-3 h-3 bg-slate-200 rounded-full mr-2"></div>
                <div className="flex-grow h-2 bg-slate-100 rounded"></div>
              </div>
              
              {/* Result Preview */}
              <div className="border-b border-slate-100 pb-3 mb-2">
                <div className="mb-1 text-xs text-green-700 truncate">{googlePreview.url}</div>
                <div className="text-base text-blue-700 font-medium mb-1 hover:underline cursor-pointer">
                  {googlePreview.title || "No title tag found"}
                </div>
                <div className="text-xs text-slate-600 line-clamp-2">
                  {googlePreview.description || "No meta description found. Google will extract text from your page."}
                </div>
              </div>
              
              <div className="text-xs text-slate-400">Mobile preview</div>
            </div>
          </div>
        </div>
        
        {/* Analysis Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Title Analysis */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5 transition hover:shadow-md">
            <div className="flex items-start mb-4">
              <StatusIndicator status={googlePreview.titleStatus} />
              <div className="ml-3">
                <h3 className="font-medium text-slate-900">Title Tag</h3>
                <p className="text-sm text-slate-500">{titleLength} characters</p>
              </div>
            </div>
            
            {getStatusBar(titleLength, 60, googlePreview.titleStatus)}
            
            <p className="text-sm text-slate-700 mb-3">{getTitleAnalysisText()}</p>
            
            <div className="text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="font-semibold text-slate-800 mb-1">Best Practice:</div>
              <p className="text-slate-700">Keep your title between 50-60 characters. Include your primary keyword near the beginning of the title for better SEO.</p>
            </div>
          </div>
          
          {/* Description Analysis */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5 transition hover:shadow-md">
            <div className="flex items-start mb-4">
              <StatusIndicator status={googlePreview.descriptionStatus} />
              <div className="ml-3">
                <h3 className="font-medium text-slate-900">Meta Description</h3>
                <p className="text-sm text-slate-500">{descriptionLength} characters</p>
              </div>
            </div>
            
            {getStatusBar(descriptionLength, 160, googlePreview.descriptionStatus)}
            
            <p className="text-sm text-slate-700 mb-3">{getDescriptionAnalysisText()}</p>
            
            <div className="text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="font-semibold text-slate-800 mb-1">Best Practice:</div>
              <p className="text-slate-700">Write a compelling description between 120-158 characters that includes keywords and encourages users to click through.</p>
            </div>
          </div>
          
          {/* URL Analysis */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5 transition hover:shadow-md">
            <div className="flex items-start mb-4">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-slate-900">URL Structure</h3>
                <p className="text-sm text-slate-500">Clean URL structure</p>
              </div>
            </div>
            
            <div className="relative pt-1 mb-4">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <span className="text-xs font-semibold inline-block text-green-700">
                    Good URL structure
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-slate-600">
                    Optimal
                  </span>
                </div>
              </div>
              <div className="flex h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  style={{ width: '95%' }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-500"
                ></div>
              </div>
            </div>
            
            <p className="text-sm text-slate-700 mb-3">Your URL is clean and descriptive, which helps search engines understand your content.</p>
            
            <div className="text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="font-semibold text-slate-800 mb-1">Best Practice:</div>
              <p className="text-slate-700">Use descriptive URLs with keywords separated by hyphens. Avoid parameter-heavy URLs with special characters.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
