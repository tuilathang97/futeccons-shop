'use server'

import { Category, CategorySchema } from "@/components/categories/categorySchema";
import { createCategory, getCategoryById } from "@/lib/queries/categoryQueries";
import { revalidatePath } from "next/cache";

export async function createCategoryAction(prevState: any, formData: FormData) {
  console.log("parsing data", {formData}, formData.get('parent_id'), formData.get('name'));
  const data = Object.fromEntries(formData);
  const parsedData = CategorySchema.safeParse(data);

  console.log("parsing done: ", parsedData);
  if (parsedData.error || !parsedData.success) {
    console.error("invalid form data", formData);
    return {
      message: "Invalid form data"
    }
  }

  let level = 1;
  console.log("looking for parent id: ", parsedData.data.parent_id);
  const parent = await findParentCategory(parsedData.data.parent_id);
  console.log("parent: ", parent);

  if (parent && parent.level !== 3) {
    console.log("has parent!!!")
    level++;
  }

  const { name, parent_id, note } = parsedData.data;

  try {
    console.info("Creating new category");
    const parentId = typeof parent_id === 'string' && !isNaN(Number(parent_id)) 
      ? Number(parent_id) 
      : null;
    await createCategory(name, parentId, level, note);
    return { message: 'Tạo thành công' }
  } catch(e: any) {
    return { message: 'Tạo thất bại'};
  }
  revalidatePath('/categories');
}

export async function findParentCategory(id: string | undefined) {
  return await getCategoryById(Number(id) || 0) as Category;
}