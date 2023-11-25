import { z } from "zod";

export const addSchema = z
  .object({
    folderId: z.string(),
    href: z.string().url(),
    image: z.string().url("Must be a valid URL"),
    title: z.string({ required_error: "Title is required" }).min(1),
    description: z.string(),
    servings: z.number(),
    cookTime: z.number(),
    ingredients: z.array(z.string()),
    directions: z.array(z.string()),
  })
  .partial()
  .refine(
    (data) => !!data.title || !!data.href,
    "Either Title or Link should be filled in."
  );

export const folderSchema = z
  .object({
    name: z.string(),
  })
  .required({
    name: true,
  });
