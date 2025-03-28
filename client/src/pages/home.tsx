import { useState } from 'react';
import UrlInput from '@/components/seo/url-input';
import ResultsContainer from '@/components/seo/results-container';
import { useMutation } from '@tanstack/react-query';
import { analyzeUrl } from '@/lib/api';
import { SeoAnalysis } from '@shared/schema';
import { AlertCircle, Search, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [analysis, setAnalysis] = useState<SeoAnalysis | null>(null);
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: analyzeUrl,
    onSuccess: (data) => {
      setAnalysis(data);
    },
    onError: (error) => {
      toast({
        title: 'Error analyzing website',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    }
  });

  const handleAnalyze = (url: string) => {
    analyzeMutation.mutate(url);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-b from-primary/90 to-primary/70 text-white">
        {/* Hero Header */}
        <header className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 p-3 bg-white/20 rounded-full">
              <Globe className="h-10 w-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
              SEO Tag Analyzer
            </h1>
            <p className="text-white/90 max-w-2xl mx-auto text-lg mb-8">
              Analyze your website's SEO meta tags and see how they appear on Google and social media.
            </p>
            
            {/* URL Input - Positioned in the hero section */}
            <div className="w-full max-w-3xl bg-white/10 backdrop-blur-sm p-1 rounded-xl shadow-xl">
              <UrlInput 
                onAnalyze={handleAnalyze} 
                isLoading={analyzeMutation.isPending} 
              />
            </div>
          </div>
        </header>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Loading State */}
        {analyzeMutation.isPending && (
          <Card className="mb-8 border border-slate-200 shadow-md overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center justify-center py-8">
                <div className="relative">
                  <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75"></div>
                  <div className="animate-spin relative rounded-full h-16 w-16 border-4 border-slate-200 border-t-primary"></div>
                </div>
              </div>
              <div className="text-center text-slate-600 mt-6">
                <p className="text-lg font-medium mb-2">Analyzing website metadata...</p>
                <p className="text-slate-500">This may take a few seconds while we fetch and parse the website content</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {analyzeMutation.isError && (
          <Card className="mb-8 border border-red-100 shadow-md overflow-hidden">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                  <AlertCircle className="h-10 w-10 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-800">Unable to fetch website data</h3>
                <p className="text-slate-600 mb-6 max-w-xl mx-auto">
                  This could be due to CORS restrictions, invalid URL, or the website may be down. Please check the URL and try again.
                </p>
                <button 
                  onClick={() => analyzeMutation.reset()}
                  className="bg-primary hover:bg-primary/90 text-white font-medium rounded-lg px-8 py-3 transition shadow-md hover:shadow-lg"
                >
                  Try Again
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Analysis Yet State - only show when there's no analysis and not loading or error */}
        {!analysis && !analyzeMutation.isPending && !analyzeMutation.isError && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
              <Search className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-slate-800">Enter a URL to get started</h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Enter any website URL in the search box above to analyze its SEO meta tags and see how it appears in search results and social media.
            </p>
          </div>
        )}

        {/* Results */}
        {analysis && !analyzeMutation.isPending && (
          <ResultsContainer analysis={analysis} />
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 py-6 bg-slate-100 border-t border-slate-200">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>SEO Tag Analyzer &copy; {new Date().getFullYear()} - A tool to help improve your website's search engine visibility</p>
        </div>
      </footer>
    </div>
  );
}
