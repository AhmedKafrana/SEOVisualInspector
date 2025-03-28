import { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link, ArrowRight, Search, Globe, Info, BarChart3 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent } from '@/components/ui/card';

const formSchema = z.object({
  url: z.string().url('Please enter a valid domain name')
});

type UrlInputProps = {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
};

const ExampleCard = ({ url, title, onClick }: { url: string; title: string; onClick: () => void }) => (
  <div 
    className="border border-white/20 hover:border-white/40 rounded-lg p-3 bg-white/5 backdrop-blur-sm transition cursor-pointer"
    onClick={onClick}
  >
    <div className="flex items-center mb-2">
      <Globe className="h-4 w-4 text-white/70 mr-2" />
      <span className="text-sm font-medium text-white/80 truncate">{url}</span>
    </div>
    <div className="text-xs text-white/60">{title}</div>
  </div>
);

export default function UrlInput({ onAnalyze, isLoading }: UrlInputProps) {
  const [showExamples, setShowExamples] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: ''
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onAnalyze(values.url);
  };
  
  const analyzeExample = (url: string) => {
    form.setValue('url', url);
    onAnalyze(url);
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <div className="mb-8 max-w-xl mx-auto">
          <div className="text-center mb-2">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/20 text-white/90 backdrop-blur-sm mb-3">
              <BarChart3 className="h-4 w-4 mr-2" /> 
              <span className="text-sm font-medium">SEO Analyzer Tool</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Analyze Your Website's SEO</h1>
            <p className="text-white/80 text-lg md:text-xl">
              Get detailed insights and recommendations to improve your search rankings
            </p>
          </div>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-3 w-full">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Link className="h-5 w-5 text-white/60" />
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="example.com"
                          value={field.value.replace(/^https?:\/\//i, '')}
                          onChange={(e) => {
                            const value = e.target.value.replace(/^https?:\/\//i, '');
                            field.onChange(`https://${value}`);
                          }}
                          className="pl-24 pr-4 py-3.5 h-auto bg-white/10 border-0 text-white placeholder:text-white/60 backdrop-blur-sm rounded-lg shadow-md focus-visible:ring-white/30 focus-visible:bg-white/20"
                          {...field}
                        />
                        <div className="absolute left-11 top-1/2 -translate-y-1/2 text-white/60 select-none">
                          https://
                        </div>
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="text-xs mt-1 text-white/90 font-medium pl-1" />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="bg-white text-primary hover:bg-white/90 px-7 py-3 rounded-lg transition shadow-md hover:shadow-lg font-medium"
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-primary rounded-full" />
                  Analyzing...
                </span>
              ) : (
                <span className="flex items-center">
                  Analyze
                  <Search className="h-4 w-4 ml-2" />
                </span>
              )}
            </Button>
          </form>
          
          <div className="flex items-center justify-center mt-3">
            <button 
              type="button" 
              onClick={() => setShowExamples(!showExamples)} 
              className="flex items-center text-sm text-white/70 hover:text-white/90 transition"
            >
              <Info className="h-3.5 w-3.5 mr-1.5" />
              {showExamples ? 'Hide examples' : 'Need inspiration? Try an example site'}
            </button>
          </div>
          
          {showExamples && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <ExampleCard 
                url="https://github.com" 
                title="GitHub - Development Platform" 
                onClick={() => analyzeExample('https://github.com')} 
              />
              <ExampleCard 
                url="https://wikipedia.org" 
                title="Wikipedia - Online Encyclopedia" 
                onClick={() => analyzeExample('https://wikipedia.org')} 
              />
              <ExampleCard 
                url="https://nytimes.com" 
                title="New York Times - News Site" 
                onClick={() => analyzeExample('https://nytimes.com')} 
              />
            </div>
          )}
        </div>
      </Form>
      
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-white/10 border-0 shadow-md backdrop-blur-sm text-white">
          <CardContent className="p-5">
            <div className="rounded-full w-10 h-10 bg-primary/20 flex items-center justify-center mb-3">
              <Search className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Analyze Meta Tags</h3>
            <p className="text-white/80 text-sm">Get a comprehensive analysis of your site's title, description, and other meta tags.</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/10 border-0 shadow-md backdrop-blur-sm text-white">
          <CardContent className="p-5">
            <div className="rounded-full w-10 h-10 bg-primary/20 flex items-center justify-center mb-3">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Visual Insights</h3>
            <p className="text-white/80 text-sm">See how your site appears in search results and social media with visual previews.</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/10 border-0 shadow-md backdrop-blur-sm text-white">
          <CardContent className="p-5">
            <div className="rounded-full w-10 h-10 bg-primary/20 flex items-center justify-center mb-3">
              <ArrowRight className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Actionable Tips</h3>
            <p className="text-white/80 text-sm">Get specific recommendations to improve your site's search engine visibility.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
