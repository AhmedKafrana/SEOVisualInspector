import { useState } from 'react';
import UrlInput from '@/components/seo/url-input';
import ResultsContainer from '@/components/seo/results-container';
import { useMutation } from '@tanstack/react-query';
import { analyzeUrl } from '@/lib/api';
import { SeoAnalysis } from '@shared/schema';
import { AlertCircle } from 'lucide-react';
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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">SEO Tag Analyzer</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Analyze your website's SEO meta tags and see how they appear on Google and social media.
        </p>
      </header>

      {/* URL Input */}
      <UrlInput 
        onAnalyze={handleAnalyze} 
        isLoading={analyzeMutation.isPending} 
      />

      {/* Loading State */}
      {analyzeMutation.isPending && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
          <div className="text-center text-slate-600">
            <p className="mb-1">Analyzing website metadata...</p>
            <p className="text-sm">This may take a few seconds</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {analyzeMutation.isError && (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              <AlertCircle className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Unable to fetch website data</h3>
              <p className="text-slate-600 mb-4">
                This could be due to CORS restrictions, invalid URL, or the website may be down.
              </p>
              <button 
                onClick={() => analyzeMutation.reset()}
                className="bg-primary hover:bg-blue-600 text-white font-medium rounded-lg px-6 py-2 transition"
              >
                Try Again
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {analysis && !analyzeMutation.isPending && (
        <ResultsContainer analysis={analysis} />
      )}
    </div>
  );
}
