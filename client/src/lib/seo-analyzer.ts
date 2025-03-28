/**
 * SEO Analyzer Utility Functions
 * 
 * This file contains utility functions for analyzing and processing
 * SEO meta tags according to best practices.
 */

// Maximum recommended character lengths for SEO elements
export const MAX_LENGTHS = {
  TITLE: 60,
  DESCRIPTION: 160,
  URL: 75
};

// Minimum recommended character lengths for SEO elements
export const MIN_LENGTHS = {
  TITLE: 30,
  DESCRIPTION: 50,
  URL: 10
};

// Essential meta tags for good SEO
export const ESSENTIAL_TAGS = [
  'title',
  'description',
  'canonical',
  'viewport',
  'robots'
];

// Essential Open Graph tags for good social sharing
export const ESSENTIAL_OG_TAGS = [
  'og:title',
  'og:description',
  'og:image',
  'og:url',
  'og:type'
];

// Essential Twitter Card tags for good Twitter sharing
export const ESSENTIAL_TWITTER_TAGS = [
  'twitter:card',
  'twitter:title',
  'twitter:description',
  'twitter:image'
];

/**
 * Evaluate the quality of a title tag
 * @param title The title string to evaluate
 * @returns An evaluation object with status and message
 */
export function evaluateTitle(title: string | undefined): { status: 'good' | 'warning' | 'missing'; message: string } {
  if (!title) {
    return {
      status: 'missing',
      message: 'Missing title tag. Add a descriptive title to improve SEO.'
    };
  }

  if (title.length < MIN_LENGTHS.TITLE) {
    return {
      status: 'warning',
      message: `Title is too short (${title.length} chars). Aim for ${MIN_LENGTHS.TITLE}-${MAX_LENGTHS.TITLE} characters for better search visibility.`
    };
  }

  if (title.length > MAX_LENGTHS.TITLE) {
    return {
      status: 'warning',
      message: `Title is too long (${title.length} chars). Keep under ${MAX_LENGTHS.TITLE} characters to avoid truncation in search results.`
    };
  }

  return {
    status: 'good',
    message: `Good title length (${title.length} chars).`
  };
}

/**
 * Evaluate the quality of a meta description
 * @param description The description string to evaluate
 * @returns An evaluation object with status and message
 */
export function evaluateDescription(description: string | undefined): { status: 'good' | 'warning' | 'missing'; message: string } {
  if (!description) {
    return {
      status: 'missing',
      message: 'Missing meta description. Add a description to improve click-through rates from search results.'
    };
  }

  if (description.length < MIN_LENGTHS.DESCRIPTION) {
    return {
      status: 'warning',
      message: `Description is too short (${description.length} chars). Aim for ${MIN_LENGTHS.DESCRIPTION}-${MAX_LENGTHS.DESCRIPTION} characters for better search visibility.`
    };
  }

  if (description.length > MAX_LENGTHS.DESCRIPTION) {
    return {
      status: 'warning',
      message: `Description is too long (${description.length} chars). Keep under ${MAX_LENGTHS.DESCRIPTION} characters to avoid truncation in search results.`
    };
  }

  return {
    status: 'good',
    message: `Good description length (${description.length} chars).`
  };
}

/**
 * Evaluate the quality of a canonical URL
 * @param canonical The canonical URL string to evaluate
 * @param currentUrl The current page URL for comparison
 * @returns An evaluation object with status and message
 */
export function evaluateCanonical(canonical: string | undefined, currentUrl: string): { status: 'good' | 'warning' | 'missing'; message: string } {
  if (!canonical) {
    return {
      status: 'missing',
      message: 'Missing canonical URL. Add one to prevent duplicate content issues.'
    };
  }

  // Normalize URLs for comparison by removing trailing slashes
  const normalizedCanonical = canonical.replace(/\/$/, '');
  const normalizedCurrentUrl = currentUrl.replace(/\/$/, '');

  if (normalizedCanonical !== normalizedCurrentUrl && !currentUrl.includes(canonical)) {
    return {
      status: 'warning',
      message: 'Canonical URL does not match the current page URL. This may be intentional, but verify it is correct.'
    };
  }

  return {
    status: 'good',
    message: 'Canonical URL is properly implemented.'
  };
}

/**
 * Evaluate the quality of a viewport meta tag
 * @param viewport The viewport string to evaluate
 * @returns An evaluation object with status and message
 */
export function evaluateViewport(viewport: string | undefined): { status: 'good' | 'warning' | 'missing'; message: string } {
  if (!viewport) {
    return {
      status: 'missing',
      message: 'Missing viewport meta tag. Add one to ensure your page is mobile-friendly.'
    };
  }

  if (!viewport.includes('width=device-width') || !viewport.includes('initial-scale=1')) {
    return {
      status: 'warning',
      message: 'Viewport tag should include width=device-width and initial-scale=1 for proper mobile optimization.'
    };
  }

  return {
    status: 'good',
    message: 'Viewport is properly set for mobile devices.'
  };
}

/**
 * Evaluate the quality of robots meta tag
 * @param robots The robots string to evaluate
 * @returns An evaluation object with status and message
 */
export function evaluateRobots(robots: string | undefined): { status: 'good' | 'warning' | 'missing'; message: string } {
  if (!robots) {
    return {
      status: 'missing',
      message: 'Missing robots meta tag. Add "index, follow" to ensure search engines index your page.'
    };
  }

  if (robots.includes('noindex') || robots.includes('nofollow')) {
    return {
      status: 'warning',
      message: 'Robots tag is blocking search engines from indexing or following links. This may be intentional, but verify it is correct.'
    };
  }

  return {
    status: 'good',
    message: 'Robots tag is properly implemented.'
  };
}

/**
 * Evaluate the quality of HTML lang attribute
 * @param lang The lang string to evaluate
 * @returns An evaluation object with status and message
 */
export function evaluateLang(lang: string | undefined): { status: 'good' | 'warning' | 'missing'; message: string } {
  if (!lang) {
    return {
      status: 'missing',
      message: 'Missing lang attribute. Add one to specify the language of your page for better accessibility and SEO.'
    };
  }

  return {
    status: 'good',
    message: 'Language is properly specified.'
  };
}

/**
 * Evaluate the quality of charset meta tag
 * @param charset The charset string to evaluate
 * @returns An evaluation object with status and message
 */
export function evaluateCharset(charset: string | undefined): { status: 'good' | 'warning' | 'missing'; message: string } {
  if (!charset) {
    return {
      status: 'missing',
      message: 'Missing charset meta tag. Add UTF-8 for better international character support.'
    };
  }

  if (charset.toLowerCase() !== 'utf-8') {
    return {
      status: 'warning',
      message: 'Consider using UTF-8 encoding for better international character support.'
    };
  }

  return {
    status: 'good',
    message: 'Character encoding is properly specified.'
  };
}

/**
 * Check for missing Open Graph tags
 * @param ogTags Object containing Open Graph tag values
 * @returns Array of missing tag names
 */
export function getMissingOgTags(ogTags: Record<string, string | undefined>): string[] {
  const missing: string[] = [];
  
  ESSENTIAL_OG_TAGS.forEach(tag => {
    const tagName = tag.replace('og:', '');
    if (!ogTags[tagName]) {
      missing.push(tag);
    }
  });
  
  return missing;
}

/**
 * Check for missing Twitter Card tags
 * @param twitterTags Object containing Twitter Card tag values
 * @returns Array of missing tag names
 */
export function getMissingTwitterTags(twitterTags: Record<string, string | undefined>): string[] {
  const missing: string[] = [];
  
  ESSENTIAL_TWITTER_TAGS.forEach(tag => {
    const tagName = tag.replace('twitter:', '');
    if (!twitterTags[tagName]) {
      missing.push(tag);
    }
  });
  
  return missing;
}

/**
 * Calculate SEO score based on presence and quality of meta tags
 * @param metaTags Object containing all evaluated meta tags with status
 * @returns Score from 0-100
 */
export function calculateSeoScore(metaTags: Array<{status: string}>): number {
  // Count tags by status
  const goodCount = metaTags.filter(tag => tag.status === 'good').length;
  const warningCount = metaTags.filter(tag => tag.status === 'warning').length;
  const missingCount = metaTags.filter(tag => tag.status === 'missing').length;
  
  const totalTags = metaTags.length;
  
  // Calculate weighted score
  // Good tags = 100% of points
  // Warning tags = 50% of points
  // Missing tags = 0% of points
  const score = ((goodCount * 1) + (warningCount * 0.5)) / totalTags * 100;
  
  return Math.round(score);
}

/**
 * Get a color based on SEO score
 * @param score Score from 0-100
 * @returns Color string (success, warning, danger)
 */
export function getScoreColor(score: number): 'success' | 'warning' | 'danger' {
  if (score >= 80) return 'success';
  if (score >= 50) return 'warning';
  return 'danger';
}

/**
 * Formats a URL for display by removing protocol and trimming length
 * @param url URL to format
 * @returns Formatted URL string
 */
export function formatUrlForDisplay(url: string): string {
  try {
    const parsedUrl = new URL(url);
    let displayUrl = parsedUrl.hostname + parsedUrl.pathname;
    
    // Trim if too long
    if (displayUrl.length > MAX_LENGTHS.URL) {
      displayUrl = displayUrl.substring(0, MAX_LENGTHS.URL - 3) + '...';
    }
    
    return displayUrl;
  } catch (e) {
    // If URL parsing fails, return original with trimming
    return url.length > MAX_LENGTHS.URL 
      ? url.substring(0, MAX_LENGTHS.URL - 3) + '...'
      : url;
  }
}
