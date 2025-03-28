import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Keep the users table since it's already set up
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Define the schema for a website analysis request
export const urlAnalysisSchema = z.object({
  url: z.string().url("Please enter a valid URL including https://"),
});

export type UrlAnalysisRequest = z.infer<typeof urlAnalysisSchema>;

// Define the schema for meta tag entry
export const metaTagSchema = z.object({
  tagType: z.string(),
  attribute: z.string().optional(),
  value: z.string().optional(),
  status: z.enum(["good", "warning", "missing", "error"]),
  recommendation: z.string().optional(),
});

export type MetaTag = z.infer<typeof metaTagSchema>;

// Define the schema for full SEO analysis results
export const seoAnalysisSchema = z.object({
  url: z.string().url(),
  title: z.string().optional(),
  description: z.string().optional(),
  score: z.number().min(0).max(100),
  tags: z.array(metaTagSchema),
  goodCount: z.number(),
  warningCount: z.number(),
  missingCount: z.number(),
  googlePreview: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    url: z.string().optional(),
    titleLength: z.number().optional(),
    descriptionLength: z.number().optional(),
    titleStatus: z.enum(["good", "warning", "error"]).optional(),
    descriptionStatus: z.enum(["good", "warning", "error"]).optional(),
    urlStatus: z.enum(["good", "warning", "error"]).optional(),
  }),
  socialPreviews: z.object({
    openGraph: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      image: z.string().optional(),
      url: z.string().optional(),
      type: z.string().optional(),
      issues: z.array(z.string()).optional(),
    }),
    twitter: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      image: z.string().optional(),
      card: z.string().optional(),
      issues: z.array(z.string()).optional(),
    }),
  }),
});

export type SeoAnalysis = z.infer<typeof seoAnalysisSchema>;
