import { z } from "zod";

export const addSchema = z.object({
  folderId: z.string().optional(),
  href: z.string().url().optional(),
  image: z.string().url("Must be a valid URL").optional(),
  title: z.string({ required_error: "Title is required" }).min(1),
  description: z.string().optional(),
  servings: z.number().optional(),
  cookTime: z.number().optional(),
  ingredients: z.array(z.string()).optional(),
  directions: z.array(z.string()).optional(),
});
