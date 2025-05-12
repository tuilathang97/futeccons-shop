import { z } from 'zod';

export const ArticleSchema = z.object({
  title: z.string().min(1, { message: "Tiêu đề không được để trống" }),
  slug: z.string().min(1, { message: "Slug không được để trống" })
    .regex(/^\/?([-a-z0-9]+)(\/[-a-z0-9]+)*$/, { 
      message: "Slug chỉ được chứa chữ thường, số, dấu gạch ngang và dấu gạch chéo" 
    }),
  content: z.string().min(1, { message: "Nội dung không được để trống" }),
  level1CategoryId: z.string()
    .transform((val) => val ? parseInt(val, 10) : null)
    .nullable()
    .optional(),
  level2CategoryId: z.string()
    .transform((val) => val ? parseInt(val, 10) : null)
    .nullable()
    .optional(),
  level3CategoryId: z.string()
    .transform((val) => val ? parseInt(val, 10) : null)
    .nullable()
    .optional(),
  targetState: z.string().nullable().optional(),
  targetCity: z.string().nullable().optional(),
  metaDescription: z.string().nullable().optional(),
  metaKeywords: z.string().nullable().optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  publishedAt: z.string().nullable().optional()
    .transform((val) => val ? new Date(val) : null),
});

export type ArticleFormData = z.infer<typeof ArticleSchema>; 