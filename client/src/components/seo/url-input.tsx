import { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
  url: z.string().url('Please enter a valid URL including https://')
});

type UrlInputProps = {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
};

export default function UrlInput({ onAnalyze, isLoading }: UrlInputProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: ''
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onAnalyze(values.url);
  };

  return (
    <div className="sticky top-0 z-10 bg-white rounded-lg shadow-md p-4 mb-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-3">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="flex-grow">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Link className="h-5 w-5 text-slate-400" />
                  </div>
                  <FormControl>
                    <Input
                      placeholder="https://example.com"
                      className="pl-10 pr-4 py-3"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage className="text-xs mt-1" />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            className="bg-primary hover:bg-blue-600 text-white px-6 py-3"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full" />
                Analyzing...
              </span>
            ) : (
              <span className="flex items-center">
                Analyze
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
