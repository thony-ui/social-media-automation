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
  brandName: z.string(),
  productDescription: z.string(),
  targetAudience: z.string(),
  numberOfPosts: z
    .number()
    .min(1, "At least one post is required")
    .max(10, "Too many posts requested"),
});

// Type exports
export type TCreatePostValidator = z.infer<typeof createPostValidator>;
export type TUpdatePostValidator = z.infer<typeof updatePostValidator>;
export type TGenerateContentValidator = z.infer<
  typeof generateContentValidator
>;
