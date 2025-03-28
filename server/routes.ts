import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { urlAnalysisSchema } from "@shared/schema";
import fetch from "node-fetch";
import * as cheerio from 'cheerio';
import { ZodError } from "zod";
import { fromZodError } from 'zod-validation-error';

export async function registerRoutes(app: Express): Promise<Server> {
  // Route to analyze SEO tags for a URL
  app.post("/api/analyze", async (req, res) => {
    try {
      // Validate the URL
      const { url } = urlAnalysisSchema.parse(req.body);
      
      try {
        // Fetch the website content
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; SEOTagAnalyzer/1.0; +https://seoanalyzer.example.com)'
          }
        });
        
        if (!response.ok) {
          return res.status(400).json({ 
            message: `Failed to fetch website: ${response.status} ${response.statusText}` 
          });
        }
        
        const html = await response.text();
        
        // Parse and analyze the website content
        const analysis = analyzeHtml(html, url);
        
        // Return the analysis results
        return res.json(analysis);
      } catch (fetchError) {
        return res.status(500).json({ 
          message: `Error fetching website: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}` 
        });
      }
    } catch (validationError) {
      // Handle validation errors
      if (validationError instanceof ZodError) {
        const readableError = fromZodError(validationError);
        return res.status(400).json({ message: readableError.message });
      }
      
      return res.status(400).json({ 
        message: validationError instanceof Error ? validationError.message : 'Invalid request' 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function analyzeHtml(html: string, url: string) {
  const $ = cheerio.load(html);
  
  // Extract meta tags
  const tags: any[] = [];
  let goodCount = 0;
  let warningCount = 0;
  let missingCount = 0;
  
  // Extract title
  const titleTag = $('title').first().text();
  const titleStatus = getTitleStatus(titleTag);
  tags.push({
    tagType: 'title',
    attribute: '',
    value: titleTag,
    status: titleStatus.status,
    recommendation: titleStatus.recommendation
  });
  
  if (titleStatus.status === 'good') goodCount++;
  else if (titleStatus.status === 'warning') warningCount++;
  else if (titleStatus.status === 'missing') missingCount++;
  
  // Extract meta description
  const descriptionTag = $('meta[name="description"]').attr('content');
  const descriptionStatus = getDescriptionStatus(descriptionTag);
  tags.push({
    tagType: 'meta',
    attribute: 'name="description"',
    value: descriptionTag,
    status: descriptionStatus.status,
    recommendation: descriptionStatus.recommendation
  });
  
  if (descriptionStatus.status === 'good') goodCount++;
  else if (descriptionStatus.status === 'warning') warningCount++;
  else if (descriptionStatus.status === 'missing') missingCount++;
  
  // Extract canonical URL
  const canonicalTag = $('link[rel="canonical"]').attr('href');
  const canonicalStatus = getCanonicalStatus(canonicalTag, url);
  tags.push({
    tagType: 'link',
    attribute: 'rel="canonical"',
    value: canonicalTag,
    status: canonicalStatus.status,
    recommendation: canonicalStatus.recommendation
  });
  
  if (canonicalStatus.status === 'good') goodCount++;
  else if (canonicalStatus.status === 'warning') warningCount++;
  else if (canonicalStatus.status === 'missing') missingCount++;
  
  // Extract viewport
  const viewportTag = $('meta[name="viewport"]').attr('content');
  const viewportStatus = getViewportStatus(viewportTag);
  tags.push({
    tagType: 'meta',
    attribute: 'name="viewport"',
    value: viewportTag,
    status: viewportStatus.status,
    recommendation: viewportStatus.recommendation
  });
  
  if (viewportStatus.status === 'good') goodCount++;
  else if (viewportStatus.status === 'warning') warningCount++;
  else if (viewportStatus.status === 'missing') missingCount++;
  
  // Extract robots
  const robotsTag = $('meta[name="robots"]').attr('content');
  const robotsStatus = getRobotsStatus(robotsTag);
  tags.push({
    tagType: 'meta',
    attribute: 'name="robots"',
    value: robotsTag,
    status: robotsStatus.status,
    recommendation: robotsStatus.recommendation
  });
  
  if (robotsStatus.status === 'good') goodCount++;
  else if (robotsStatus.status === 'warning') warningCount++;
  else if (robotsStatus.status === 'missing') missingCount++;
  
  // Extract language
  const langTag = $('html').attr('lang');
  const langStatus = getLangStatus(langTag);
  tags.push({
    tagType: 'html',
    attribute: 'lang',
    value: langTag,
    status: langStatus.status,
    recommendation: langStatus.recommendation
  });
  
  if (langStatus.status === 'good') goodCount++;
  else if (langStatus.status === 'warning') warningCount++;
  else if (langStatus.status === 'missing') missingCount++;
  
  // Extract charset
  const charsetTag = $('meta[charset]').attr('charset');
  const charsetStatus = getCharsetStatus(charsetTag);
  tags.push({
    tagType: 'meta',
    attribute: 'charset',
    value: charsetTag,
    status: charsetStatus.status,
    recommendation: charsetStatus.recommendation
  });
  
  if (charsetStatus.status === 'good') goodCount++;
  else if (charsetStatus.status === 'warning') warningCount++;
  else if (charsetStatus.status === 'missing') missingCount++;
  
  // Extract Open Graph tags
  const ogTitle = $('meta[property="og:title"]').attr('content');
  const ogDescription = $('meta[property="og:description"]').attr('content');
  const ogImage = $('meta[property="og:image"]').attr('content');
  const ogUrl = $('meta[property="og:url"]').attr('content');
  const ogType = $('meta[property="og:type"]').attr('content');
  
  // Push Open Graph tags to the tags array
  tags.push({
    tagType: 'meta',
    attribute: 'property="og:title"',
    value: ogTitle,
    status: ogTitle ? 'good' : 'missing',
    recommendation: !ogTitle ? 'Add og:title tag for better social media sharing' : undefined
  });
  
  if (ogTitle) goodCount++; else missingCount++;
  
  tags.push({
    tagType: 'meta',
    attribute: 'property="og:description"',
    value: ogDescription,
    status: ogDescription ? 'good' : 'missing',
    recommendation: !ogDescription ? 'Add og:description tag for better social media sharing' : undefined
  });
  
  if (ogDescription) goodCount++; else missingCount++;
  
  tags.push({
    tagType: 'meta',
    attribute: 'property="og:image"',
    value: ogImage,
    status: ogImage ? 'good' : 'missing',
    recommendation: !ogImage ? 'Add og:image tag for better social media sharing' : undefined
  });
  
  if (ogImage) goodCount++; else missingCount++;
  
  tags.push({
    tagType: 'meta',
    attribute: 'property="og:url"',
    value: ogUrl,
    status: ogUrl ? 'good' : 'missing',
    recommendation: !ogUrl ? 'Add og:url tag for better social media sharing' : undefined
  });
  
  if (ogUrl) goodCount++; else missingCount++;
  
  tags.push({
    tagType: 'meta',
    attribute: 'property="og:type"',
    value: ogType,
    status: ogType ? 'good' : 'missing',
    recommendation: !ogType ? 'Add og:type tag for better social media sharing' : undefined
  });
  
  if (ogType) goodCount++; else missingCount++;
  
  // Extract Twitter Card tags
  const twitterCard = $('meta[name="twitter:card"]').attr('content');
  const twitterTitle = $('meta[name="twitter:title"]').attr('content');
  const twitterDescription = $('meta[name="twitter:description"]').attr('content');
  const twitterImage = $('meta[name="twitter:image"]').attr('content');
  
  // Push Twitter Card tags to the tags array
  tags.push({
    tagType: 'meta',
    attribute: 'name="twitter:card"',
    value: twitterCard,
    status: twitterCard ? 'good' : 'missing',
    recommendation: !twitterCard ? 'Add twitter:card tag for better Twitter sharing' : undefined
  });
  
  if (twitterCard) goodCount++; else missingCount++;
  
  tags.push({
    tagType: 'meta',
    attribute: 'name="twitter:title"',
    value: twitterTitle,
    status: twitterTitle ? 'good' : 'missing',
    recommendation: !twitterTitle ? 'Add twitter:title tag for better Twitter sharing' : undefined
  });
  
  if (twitterTitle) goodCount++; else missingCount++;
  
  tags.push({
    tagType: 'meta',
    attribute: 'name="twitter:description"',
    value: twitterDescription,
    status: twitterDescription ? 'good' : 'missing',
    recommendation: !twitterDescription ? 'Add twitter:description tag for better Twitter sharing' : undefined
  });
  
  if (twitterDescription) goodCount++; else missingCount++;
  
  tags.push({
    tagType: 'meta',
    attribute: 'name="twitter:image"',
    value: twitterImage,
    status: twitterImage ? 'good' : 'missing',
    recommendation: !twitterImage ? 'Add twitter:image tag for better Twitter sharing' : undefined
  });
  
  if (twitterImage) goodCount++; else missingCount++;
  
  // Calculate overall score (simplified formula)
  // Weight critical tags higher than others
  const criticalTags = 5; // title, description, canonical, viewport, robots
  const socialTags = 9; // og: and twitter: tags
  
  const maxScore = (criticalTags * 3) + socialTags; // 3 points for each critical tag, 1 for social
  let score = 0;
  
  // Add points for critical tags
  if (titleStatus.status === 'good') score += 3;
  else if (titleStatus.status === 'warning') score += 1.5;
  
  if (descriptionStatus.status === 'good') score += 3;
  else if (descriptionStatus.status === 'warning') score += 1.5;
  
  if (canonicalStatus.status === 'good') score += 3;
  else if (canonicalStatus.status === 'warning') score += 1.5;
  
  if (viewportStatus.status === 'good') score += 3;
  else if (viewportStatus.status === 'warning') score += 1.5;
  
  if (robotsStatus.status === 'good') score += 3;
  else if (robotsStatus.status === 'warning') score += 1.5;
  
  // Add points for social tags
  if (ogTitle) score += 1;
  if (ogDescription) score += 1;
  if (ogImage) score += 1;
  if (ogUrl) score += 1;
  if (ogType) score += 1;
  if (twitterCard) score += 1;
  if (twitterTitle) score += 1;
  if (twitterDescription) score += 1;
  if (twitterImage) score += 1;
  
  // Calculate percentage score (0-100)
  const finalScore = Math.round((score / maxScore) * 100);
  
  // List of Open Graph issues
  const ogIssues = [];
  if (!ogTitle) ogIssues.push("Missing og:title meta tag");
  if (!ogDescription) ogIssues.push("Missing og:description meta tag");
  if (!ogImage) ogIssues.push("Missing og:image meta tag");
  if (!ogUrl) ogIssues.push("Missing og:url meta tag");
  if (!ogType) ogIssues.push("Missing og:type meta tag");
  
  // List of Twitter Card issues
  const twitterIssues = [];
  if (!twitterCard) twitterIssues.push("Missing twitter:card meta tag");
  if (!twitterTitle) twitterIssues.push("Missing twitter:title meta tag");
  if (!twitterDescription) twitterIssues.push("Missing twitter:description meta tag");
  if (!twitterImage) twitterIssues.push("Missing twitter:image meta tag");
  
  // Build the analysis result
  return {
    url,
    title: titleTag,
    description: descriptionTag,
    score: finalScore,
    tags,
    goodCount,
    warningCount,
    missingCount,
    googlePreview: {
      title: titleTag,
      description: descriptionTag,
      url,
      titleLength: titleTag ? titleTag.length : 0,
      descriptionLength: descriptionTag ? descriptionTag.length : 0,
      titleStatus: titleStatus.status,
      descriptionStatus: descriptionStatus.status,
      urlStatus: 'good' // Simplified, in a real application we would analyze the URL structure
    },
    socialPreviews: {
      openGraph: {
        title: ogTitle || titleTag,
        description: ogDescription || descriptionTag,
        image: ogImage,
        url: ogUrl || url,
        type: ogType,
        issues: ogIssues
      },
      twitter: {
        title: twitterTitle || ogTitle || titleTag,
        description: twitterDescription || ogDescription || descriptionTag,
        image: twitterImage || ogImage,
        card: twitterCard,
        issues: twitterIssues
      }
    }
  };
}

// Helper functions to analyze specific tags
function getTitleStatus(title: string | undefined) {
  if (!title) {
    return {
      status: 'missing' as const,
      recommendation: 'Add a title tag to improve SEO.'
    };
  }
  
  if (title.length < 10) {
    return {
      status: 'warning' as const,
      recommendation: 'Your title is too short. Aim for 50-60 characters.'
    };
  }
  
  if (title.length > 60) {
    return {
      status: 'warning' as const,
      recommendation: 'Your title is too long. Keep it under 60 characters to avoid truncation in search results.'
    };
  }
  
  return {
    status: 'good' as const,
    recommendation: undefined
  };
}

function getDescriptionStatus(description: string | undefined) {
  if (!description) {
    return {
      status: 'missing' as const,
      recommendation: 'Add a meta description to improve CTR in search results.'
    };
  }
  
  if (description.length < 50) {
    return {
      status: 'warning' as const,
      recommendation: 'Your description is too short. Aim for 120-160 characters.'
    };
  }
  
  if (description.length > 160) {
    return {
      status: 'warning' as const,
      recommendation: 'Your description is too long. Keep it under 160 characters to avoid truncation in search results.'
    };
  }
  
  return {
    status: 'good' as const,
    recommendation: undefined
  };
}

function getCanonicalStatus(canonical: string | undefined, pageUrl: string) {
  if (!canonical) {
    return {
      status: 'missing' as const,
      recommendation: 'Add a canonical URL to prevent duplicate content issues.'
    };
  }
  
  // Simple URL normalization for comparison - in a real app, normalize both URLs properly
  const normalizedCanonical = canonical.replace(/\/$/, '');
  const normalizedPageUrl = pageUrl.replace(/\/$/, '');
  
  if (normalizedCanonical !== normalizedPageUrl && !pageUrl.includes(canonical)) {
    return {
      status: 'warning' as const,
      recommendation: 'Canonical URL does not match the current page URL. This may be intentional, but verify it is correct.'
    };
  }
  
  return {
    status: 'good' as const,
    recommendation: undefined
  };
}

function getViewportStatus(viewport: string | undefined) {
  if (!viewport) {
    return {
      status: 'missing' as const,
      recommendation: 'Add a viewport meta tag to optimize for mobile devices.'
    };
  }
  
  if (!viewport.includes('width=device-width') || !viewport.includes('initial-scale=1')) {
    return {
      status: 'warning' as const,
      recommendation: 'Your viewport tag should include width=device-width and initial-scale=1 for proper mobile optimization.'
    };
  }
  
  return {
    status: 'good' as const,
    recommendation: undefined
  };
}

function getRobotsStatus(robots: string | undefined) {
  if (!robots) {
    return {
      status: 'missing' as const,
      recommendation: 'Add a robots meta tag to control how search engines index your page.'
    };
  }
  
  if (robots.includes('noindex') || robots.includes('nofollow')) {
    return {
      status: 'warning' as const,
      recommendation: 'Your robots tag is blocking search engines from indexing or following links on this page. This may be intentional, but verify it is correct.'
    };
  }
  
  return {
    status: 'good' as const,
    recommendation: undefined
  };
}

function getLangStatus(lang: string | undefined) {
  if (!lang) {
    return {
      status: 'missing' as const,
      recommendation: 'Add a lang attribute to the html tag to specify the language of your page.'
    };
  }
  
  return {
    status: 'good' as const,
    recommendation: undefined
  };
}

function getCharsetStatus(charset: string | undefined) {
  if (!charset) {
    return {
      status: 'missing' as const,
      recommendation: 'Add a charset meta tag to specify the character encoding of your page.'
    };
  }
  
  if (charset.toLowerCase() !== 'utf-8') {
    return {
      status: 'warning' as const,
      recommendation: 'Consider using UTF-8 encoding for better international character support.'
    };
  }
  
  return {
    status: 'good' as const,
    recommendation: undefined
  };
}
