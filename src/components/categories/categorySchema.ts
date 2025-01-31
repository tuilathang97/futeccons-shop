import { numberEnum } from "@/lib/utils";
import { z } from "zod";

const LEVELS = [1,2,3] as const;

export const CategorySchema = z.object({
  name: z.string().min(1, {
    message: "Vui lòng nhập tên danh mục",
  }),
  parent_id: z.string().optional(),
  level: z.number().superRefine(numberEnum(LEVELS)).optional(),
  note: z.string().optional().optional()
})

export type Category = z.infer<typeof CategorySchema> & {id: string};