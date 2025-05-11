import { numberEnum } from "@/lib/utils";
import { z } from "zod";

export const CATEGORY_LEVELS = [1,2,3] as const;

export const CategorySchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, {
    message: "Vui lòng nhập tên danh mục",
  }),
  parentId: z.string().optional(),
  level: z.number().superRefine(numberEnum(CATEGORY_LEVELS)).optional(),
  note: z.string().default(""),
  slug:z.string(),
  path: z.string().default(""),
})

export type Category = z.infer<typeof CategorySchema> & {id: string};