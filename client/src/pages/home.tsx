import { useState, useEffect } from 'react';
import UrlInput from '@/components/seo/url-input';
import ResultsContainer from '@/components/seo/results-container';
import { useMutation } from '@tanstack/react-query';
import { analyzeUrl } from '@/lib/api';
import { SeoAnalysis } from '@shared/schema';
import { AlertCircle, Search, Globe, ArrowDown, BarChart3, CheckCircle, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [analysis, setAnalysis] = useState<SeoAnalysis | null>(null);
  const [resultsVisible, setResultsVisible] = useState(false);
  const { toast } = useToast();

  // Reset scroll position when a new analysis is made
  useEffect(() => {
    if (analysis) {
      setTimeout(() => {
        setResultsVisible(true);
        // Add a small delay for animation to kick in before scrolling
        setTimeout(() => {
          const resultsSection = document.getElementById('results-section');
          if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }, 500);
    } else {
      setResultsVisible(false);
    }
  }, [analysis]);

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
    // If we're analyzing a new URL, hide previous results during loading
    if (analysis) {
      setResultsVisible(false);
    }
    analyzeMutation.mutate(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-gradient-to-br from-primary to-primary/80 text-white">
        {/* Hero Header */}
        <header className="container mx-auto px-4 py-12 md:py-16 max-w-6xl">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 p-3 bg-white/20 rounded-full shadow-lg">
              <Globe className="h-10 w-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
              SEO Tag Analyzer
            </h1>
            <p className="text-white/90 max-w-2xl mx-auto text-lg mb-8">
              Get detailed visual insights into your website's SEO performance and optimization recommendations
            </p>
            
            {/* URL Input - Positioned in the hero section */}
            <div className="w-full max-w-4xl">
              <UrlInput 
                onAnalyze={handleAnalyze} 
                isLoading={analyzeMutation.isPending} 
              />
            </div>
            
            {/* Scroll indicator - shown only when there's no analysis or loading */}
            {!analysis && !analyzeMutation.isPending && !analyzeMutation.isError && (
              <div className="mt-12 flex flex-col items-center text-white/80 animate-bounce">
                <span className="text-sm mb-2">Learn more about our tool</span>
                <ArrowDown className="h-5 w-5" />
              </div>
            )}
          </div>
        </header>
      </div>

      {/* Features Section - Only show when not displaying results */}
      {!analysis && !analyzeMutation.isPending && !analyzeMutation.isError && (
        <div className="py-20 container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Comprehensive SEO Analysis</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Our tool provides in-depth analysis and visual insights to help you understand and improve your website's SEO performance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Visual Dashboards</h3>
                <p className="text-slate-600">
                  Get easy-to-understand visual summaries of your SEO performance with our interactive dashboards.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Actionable Insights</h3>
                <p className="text-slate-600">
                  Receive specific recommendations to improve your SEO tags and boost your search engine rankings.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mb-4">
                  <ExternalLink className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Preview Across Platforms</h3>
                <p className="text-slate-600">
                  See how your website appears in Google search results and on social media platforms.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-slate-700 text-lg mb-4">Ready to analyze your website?</p>
            <Button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-lg text-lg shadow-md hover:shadow-lg transition-all"
            >
              Get Started Now
              <ArrowDown className="h-5 w-5 ml-2 rotate-180" />
            </Button>
          </div>
        </div>
      )}

      {/* Results Section */}
      <div id="results-section" className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Loading State */}
        {analyzeMutation.isPending && (
          <Card className="mb-8 border border-slate-200 shadow-md overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center justify-center py-12">
                <div className="relative">
                  <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75"></div>
                  <div className="animate-spin relative rounded-full h-20 w-20 border-4 border-slate-200 border-t-primary"></div>
                </div>
              </div>
              <div className="text-center text-slate-600 mt-8">
                <p className="text-xl font-medium mb-2">Analyzing website metadata...</p>
                <p className="text-slate-500 max-w-md mx-auto">
                  We're fetching and analyzing your website's SEO meta tags, search preview, and social media appearance.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {analyzeMutation.isError && (
          <Card className="mb-8 border border-red-100 shadow-md overflow-hidden">
            <CardContent className="p-8">
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                  <AlertCircle className="h-10 w-10 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-800">Unable to fetch website data</h3>
                <p className="text-slate-600 mb-6 max-w-xl mx-auto">
                  This could be due to CORS restrictions, invalid URL, or the website may be down. Please check the URL and try again.
                </p>
                <Button
                  onClick={() => analyzeMutation.reset()}
                  className="bg-primary hover:bg-primary/90 text-white font-medium rounded-lg px-8 py-3 transition shadow-md hover:shadow-lg"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        <div className={`transition-all duration-500 ${resultsVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4'}`}>
          {analysis && !analyzeMutation.isPending && (
            <ResultsContainer analysis={analysis} />
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 py-8 bg-slate-800 text-white/90">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <Globe className="h-6 w-6 mr-2 text-primary" />
                <span className="font-bold text-lg">SEO Tag Analyzer</span>
              </div>
              <p className="text-sm text-white/70 mt-1">
                A powerful tool for optimizing your website's search visibility
              </p>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-sm text-white/70">
                &copy; {new Date().getFullYear()} SEO Tag Analyzer. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
