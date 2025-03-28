import { apiRequest } from '@/lib/queryClient';
import { SeoAnalysis } from '@shared/schema';

export async function analyzeUrl(url: string): Promise<SeoAnalysis> {
  const response = await apiRequest('POST', '/api/analyze', { url });
  return response.json();
}
