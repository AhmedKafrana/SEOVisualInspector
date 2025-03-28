import { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link, ArrowRight, Search } from 'lucide-react';
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
    <Form {...form}>
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
                  <Input
                    placeholder="https://example.com"
                    className="pl-11 pr-4 py-3.5 h-auto bg-white/10 border-0 text-white placeholder:text-white/60 backdrop-blur-sm rounded-lg shadow-inner focus-visible:ring-white/30 focus-visible:bg-white/20"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage className="text-xs mt-1 text-white/90 font-medium pl-1" />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="bg-white text-primary hover:bg-white/90 px-6 py-3 rounded-lg transition shadow-md hover:shadow-lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <span className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-primary rounded-full" />
              Analyzing...
            </span>
          ) : (
            <span className="flex items-center font-medium">
              Analyze
              <Search className="h-4 w-4 ml-2" />
            </span>
          )}
        </Button>
      </form>
    </Form>
  );
}
