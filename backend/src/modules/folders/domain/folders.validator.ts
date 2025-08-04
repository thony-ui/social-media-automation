import { z } from "zod";
export const createFolderValidator = z.object({
  name: z.string().min(1, "Folder name is required").max(100, "Name too long"),
  description: z.string().max(500, "Description too long").optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Invalid color format")
    .optional(),
});

export const updateFolderValidator = z.object({
  name: z
    .string()
    .min(1, "Folder name is required")
    .max(100, "Name too long")
    .optional(),
  description: z.string().max(500, "Description too long").optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Invalid color format")
    .optional(),
});
export type TCreateFolderValidator = z.infer<typeof createFolderValidator>;
export type TUpdateFolderValidator = z.infer<typeof updateFolderValidator>;
