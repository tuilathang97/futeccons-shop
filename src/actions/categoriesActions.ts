'use server'
import { Category, CategorySchema } from "@/components/categories/categorySchema";
import { createCategory, getCategoryById } from "@/lib/queries/categoryQueries";
import { revalidatePath } from "next/cache";

function generatePath(slug: string, level: number, parentSlug?: string) {
  // 1 la parent path ko ton tai => path van bang path
  if(!slug || !level){
    return ""
  }
  slug = slug.charAt(0) !== "/" ? `/${slug}` : `${slug}`
  parentSlug = parentSlug?.charAt(0) !== "/" ? `/${parentSlug}` : `${parentSlug}`
  switch (level) {
    case 1:
      return slug
    case 2:
    case 3: {
      if (!parentSlug) {
        throw Error("khong co parent slug")
      }
      return `${parentSlug}${slug}`
    }
    default:
      return ""
  }
}


export async function createCategoryAction(prevState: any, formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsedData = CategorySchema.safeParse(data);
  if (parsedData.error || !parsedData.success) {
    console.error("invalid form data", formData);
    return {
      message: "Invalid form data"
    }
  }

  let level = 1
  
  const parent = await findParentCategory(parsedData.data.parentId);
  if (parent && parent.level && parent.level !== 3) {
    console.log("has parent!!!");
    level = parent.level + 1;
  }

  const { name, parentId,slug,path,note } = parsedData.data;
  const editedPath = parent ? generatePath(slug,level,parent.slug) : generatePath(slug,level)
  try {
    console.info("Creating new category");
    const parsedParentId = typeof parentId === 'string' && !isNaN(Number(parentId)) 
      ? Number(parentId)
      : null;
    await createCategory(name, parsedParentId, level, editedPath, path, note);
    return { message: 'Tạo thành công' }
  } catch(e: any) {
    return { message: 'Tạo thất bại'};
  }
  revalidatePath('/categories');
}

export async function findParentCategory(id: string | undefined) {
  return await getCategoryById(Number(id) || 0) as Category;
}