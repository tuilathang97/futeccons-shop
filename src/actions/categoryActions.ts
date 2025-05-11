'use server'

import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  getCategoryById
} from "@/lib/queries/categoryQueries";
import { CategorySchema } from "@/components/categories/categorySchema";
import { revalidatePath } from "next/cache";

function generatePath(slug: string, level: number, parentSlug?: string): string {
  if (!slug || !level) {
    return "";
  }
  
  const normalizedSlug = slug.startsWith('/') ? slug : `/${slug}`;
  const normalizedParentSlug = parentSlug ? (parentSlug.startsWith('/') ? parentSlug : `/${parentSlug}`) : "";
  
  switch (level) {
    case 1:
      return normalizedSlug;
    case 2:
    case 3: {
      if (!normalizedParentSlug) {
        throw Error("Parent slug is required for level 2 and 3 categories");
      }
      return `${normalizedParentSlug}${normalizedSlug}`;
    }
    default:
      return "";
  }
}

export async function getCategoriesAction() {
  return await getCategories();
}

interface CategoryActionResult {
  message: string;
  success: boolean;
  data?: unknown;
}

export async function createCategoryAction(formData: FormData): Promise<CategoryActionResult> {
  const rawData = Object.fromEntries(formData);
  
  // Convert level to number before validation
  const data = {
    ...rawData,
    level: rawData.level ? parseInt(rawData.level as string, 10) : 1
  };

  const parsedData = CategorySchema.safeParse(data);
  console.log(data)
  if (!parsedData.success) {
    console.error("Invalid form data", parsedData?.error);
    return {
      success: false,
      message: "Invalid form data"
    };
  }

  try {
    let level = data.level;
    
    const parent = await findParentCategory(parsedData.data.parentId);
    if (parent && parent.level && parent.level !== 3) {
      level = parent.level + 1;
    }

    const { name, parentId, slug, note } = parsedData.data;
    
    const normalizedSlug = slug.startsWith('/') ? slug : `/${slug}`;
    const parentSlug = parent?.path || undefined;
    const editedPath = generatePath(normalizedSlug, level, parentSlug);
    
    const parsedParentId = typeof parentId === 'string' && !isNaN(Number(parentId)) 
      ? Number(parentId)
      : null;
      
    await createCategory(name, parsedParentId, level, normalizedSlug, editedPath, note);
    
    revalidatePath('/admin/category');
    
    const updatedCategories = await getCategories();
    return { 
      success: true,
      message: 'Tạo thành công',
      data: updatedCategories
    };
  } catch(error: unknown) {
    console.error("Failed to create category:", error);
    return { 
      success: false,
      message: 'Tạo thất bại' 
    };
  }
}

export async function createCategoryWithValidationAction(prevState: unknown, formData: FormData): Promise<CategoryActionResult> {
  const rawData = Object.fromEntries(formData);
  
  // Convert level to number before validation
  const data = {
    ...rawData,
    level: rawData.level ? parseInt(rawData.level as string, 10) : 1
  };
  
  const parsedData = CategorySchema.safeParse(data);
  
  if (!parsedData.success) {
    console.error("Invalid form data", parsedData.error);
    return {
      success: false,
      message: "Invalid form data"
    };
  }

  let level = data.level;
  
  const parent = await findParentCategory(parsedData.data.parentId);
  if (parent && parent.level && parent.level !== 3) {
    level = parent.level + 1;
  }

  const { name, parentId, slug, note } = parsedData.data;
  
  const normalizedSlug = slug.startsWith('/') ? slug : `/${slug}`;
  const parentSlug = parent?.path || undefined;
  const editedPath = generatePath(normalizedSlug, level, parentSlug);
  
  try {
    const parsedParentId = typeof parentId === 'string' && !isNaN(Number(parentId)) 
      ? Number(parentId)
      : null;
      
    await createCategory(name, parsedParentId, level, normalizedSlug, editedPath, note);
    
    return { 
      success: true,
      message: 'Tạo thành công'
    };
  } catch(error: unknown) {
    console.error("Failed to create category:", error);
    return { 
      success: false,
      message: 'Tạo thất bại' 
    };
  }
}

export async function updateCategoryAction(formData: FormData) {
  const id = Number(formData.get('id'));
  const name = formData.get('name') as string;
  const note = formData.get('note') as string || '';
  const parentId = formData.get('parentId') ? Number(formData.get('parentId')) : null;

  await updateCategory(id, name, parentId, note);
  
  revalidatePath('/admin/category');
  
  return await getCategories();
}

export async function deleteCategoryAction(id: number) {
  await deleteCategory(id);
  
  revalidatePath('/admin/category');
  
  return await getCategories();
}

export async function findParentCategory(id: string | undefined) {
  if (!id) return null;
  return await getCategoryById(Number(id) || 0);
} 