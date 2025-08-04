import { z } from "zod";

// Post validators
export const createPostValidator = z.object({
  caption: z
    .string()
    .min(1, "Caption is required")
    .max(2200, "Caption too long"),
  hashtags: z.string().max(280, "Hashtags too long").optional(),
  platform: z
    .enum(["all", "instagram", "twitter", "facebook", "linkedin"])
    .default("all"),
  folderId: z.string().uuid("Invalid folder ID format").optional(),
  imagePrompt: z.string().max(500, "Image prompt too long").optional(),
  scheduledAt: z.string().datetime("Invalid date format").optional(),
});

export const updatePostValidator = z.object({
  caption: z
    .string()
    .min(1, "Caption is required")
    .max(2200, "Caption too long")
    .optional(),
  hashtags: z.string().max(280, "Hashtags too long").optional(),
  platform: z
    .enum(["all", "instagram", "twitter", "facebook", "linkedin"])
    .optional(),
  folderId: z.string().uuid("Invalid folder ID format").nullable().optional(),
  imagePrompt: z.string().max(500, "Image prompt too long").optional(),
  scheduledAt: z.string().datetime("Invalid date format").optional(),
  status: z.enum(["draft", "scheduled", "published", "failed"]).optional(),
});

export const generateContentValidator = z.object({
  prompt: z.string().min(1, "Prompt is required").max(500, "Prompt too long"),
  platform: z
    .enum(["all", "instagram", "twitter", "facebook", "linkedin"])
    .default("all"),
  tone: z
    .enum(["professional", "casual", "friendly", "formal", "creative"])
    .default("professional"),
  includeHashtags: z.boolean().default(true),
  maxLength: z.number().min(50).max(2200).default(280),
});

// Type exports
export type TCreatePostValidator = z.infer<typeof createPostValidator>;
export type TUpdatePostValidator = z.infer<typeof updatePostValidator>;
export type TGenerateContentValidator = z.infer<
  typeof generateContentValidator
>;
