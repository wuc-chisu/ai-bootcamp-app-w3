import { z } from "zod/v4";

export const CreateTodoSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(5, "Title must be at least 5 characters long")
      .max(100, "Title must be less than 100 characters long"),
    description: z
      .string()
      .trim()
      .max(200, "Description must be less than 200 characters long")
      .transform((val) => val ?? undefined),
  })
  .refine((data) => data.title || data.description, {
    path: ["title", "description"],
    message: "Either title or description must be provided",
  });

export type CreateTodoSchemaType = z.infer<typeof CreateTodoSchema>;

export const UpdateTodoSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters long")
    .max(100, "Title must be less than 100 characters long"),
  description: z
    .string()
    .trim()
    .max(200, "Description must be less than 200 characters long")
    .transform((val) => val ?? undefined)
    .optional(),
  completed: z.boolean().optional(),
});

export type UpdateTodoSchemaType = z.infer<typeof UpdateTodoSchema>;
