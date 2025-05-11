'use server'

import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  getCategoryById
} from "@/lib/queries/categoryQueries";
import { Category, CategorySchema } from "@/components/categories/categorySchema";

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
  data?: Category[];
}

export async function createCategoryAction(formData: FormData): Promise<CategoryActionResult> {
  const rawData = Object.fromEntries(formData);
  
  const data = {
    ...rawData,
    level: rawData.level ? parseInt(rawData.level as string, 10) : 1
  };

  const parsedData = CategorySchema.safeParse(data);
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

export async function updateCategoryAction(formData: FormData): Promise<CategoryActionResult> {
  try {
    const rawData = Object.fromEntries(formData);
    const data = {
      ...rawData,
      id: parseInt(rawData.id as string, 10),
      parentId: rawData.parentId ? parseInt(rawData.parentId as string, 10) : null
    };

    const parsedData = CategorySchema.safeParse(data);
    if (!parsedData.success) {
      console.error("Invalid form data", parsedData.error);
      return {
        success: false,
        message: "Invalid form data"
      };
    }

    const { id, name, parentId, note } = parsedData.data;
    await updateCategory(id, name, parentId, note || '');
    
    const updatedCategories = await getCategories();
    return { 
      success: true,
      message: 'Cập nhật thành công',
      data: updatedCategories
    };
  } catch(error: unknown) {
    console.error("Failed to update category:", error);
    return { 
      success: false,
      message: 'Cập nhật thất bại' 
    };
  }
}

export async function deleteCategoryAction(id: number): Promise<CategoryActionResult> {
  try {
    await deleteCategory(id);
    
    const updatedCategories = await getCategories();
    return { 
      success: true,
      message: 'Xóa thành công',
      data: updatedCategories
    };
  } catch(error: unknown) {
    console.error("Failed to delete category:", error);
    return { 
      success: false,
      message: 'Xóa thất bại' 
    };
  }
}

export async function findParentCategory(id: string | undefined) {
  if (!id) return null;
  return await getCategoryById(Number(id) || 0);
} 