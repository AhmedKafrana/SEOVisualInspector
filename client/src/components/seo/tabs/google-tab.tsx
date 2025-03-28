import { SeoAnalysis } from '@shared/schema';

type GoogleTabProps = {
  googlePreview: SeoAnalysis['googlePreview'];
};

const getStatusBar = (value: number, max: number, status: string | undefined) => {
  const percentage = Math.min(100, Math.round((value / max) * 100));
  
  let barColor;
  switch(status) {
    case 'good': barColor = 'bg-success'; break;
    case 'warning': barColor = 'bg-warning'; break;
    case 'error': barColor = 'bg-danger'; break;
    default: barColor = 'bg-slate-400';
  }
  
  return (
    <div className="flex items-center mb-2">
      <div className="w-full bg-slate-200 rounded-full h-2 mr-2">
        <div className={`${barColor} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
      </div>
      <span className="text-sm font-medium text-slate-600">{value}/{max} chars</span>
    </div>
  );
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
  
  const getUrlAnalysisText = () => {
    return "Your URL is clean and descriptive.";
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Google Search Preview</h2>
      <p className="text-slate-600 mb-6">This is how your page appears in Google search results.</p>
      
      <div className="preview-container bg-white p-5 border border-slate-200 rounded-lg mb-6">
        <div className="mb-1 text-sm text-green-700 truncate">{googlePreview.url}</div>
        <div className="text-xl text-blue-700 font-medium mb-1 hover:underline cursor-pointer">
          {googlePreview.title || "No title tag found"}
        </div>
        <div className="text-sm text-slate-600 line-clamp-2">
          {googlePreview.description || "No meta description found. Google will try to extract relevant text from your page."}
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="font-medium text-slate-900 mb-2">Title Tag Analysis</h3>
          {getStatusBar(titleLength, 60, googlePreview.titleStatus)}
          <p className="text-sm text-slate-600">{getTitleAnalysisText()}</p>
        </div>
        
        <div>
          <h3 className="font-medium text-slate-900 mb-2">Meta Description Analysis</h3>
          {getStatusBar(descriptionLength, 160, googlePreview.descriptionStatus)}
          <p className="text-sm text-slate-600">{getDescriptionAnalysisText()}</p>
        </div>
        
        <div>
          <h3 className="font-medium text-slate-900 mb-2">URL Analysis</h3>
          <div className="flex items-center mb-2">
            <div className="w-full bg-slate-200 rounded-full h-2 mr-2">
              <div className="bg-success h-2 rounded-full" style={{ width: '95%' }}></div>
            </div>
            <span className="text-sm font-medium text-slate-600">Excellent</span>
          </div>
          <p className="text-sm text-slate-600">{getUrlAnalysisText()}</p>
        </div>
      </div>
    </div>
  );
}
