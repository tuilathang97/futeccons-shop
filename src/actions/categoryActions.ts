'use server'

import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  getCategoryById
} from "@/lib/queries/categoryQueries";
import { CategorySchema } from "@/components/categories/categorySchema";
import { Category } from "@/db/schema";
import { requireAdmin } from "@/lib/auth-utils";
import { revalidateTag } from "next/cache";

// Authentication check for admin role
async function checkAdminAccess(): Promise<boolean> {
  await requireAdmin();
  return true;
}

function generatePath(slug: string, level: number, parentSlug?: string): string {
  if (!slug) {
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

interface CategoryActionResult {
  message: string;
  success: boolean;
  data?: Category[];
}

function revalidateCategoryCache(categoryId?: number, slug?: string, parentId?: number | null) {
  revalidateTag('categories');
  revalidateTag('all-categories');
  revalidateTag('categories:top-level');
  revalidateTag('categories:sitemap');
  revalidateTag('categories:public:counts');
  revalidateTag('categories:all:counts');
  
  if (categoryId) {
    revalidateTag('category-by-id');
  }
  
  if (slug) {
    revalidateTag('category-by-slug');
  }
  
  if (parentId !== undefined) {
    revalidateTag('categories-by-parent-id');
    revalidateTag('category-breadcrumbs');
  }
  
  revalidateTag('articles');
}

export async function createCategoryAction(formData: FormData): Promise<CategoryActionResult> {
  try {
    await checkAdminAccess();
    
    const rawData = Object.fromEntries(formData);
    
    const data = {
      ...rawData,
      level: rawData.level ? parseInt(rawData.level as string, 10) : 1
    };

    const parsedData = CategorySchema.safeParse(data);
    if (!parsedData.success) {
      console.error("Tạo thất bại: ", parsedData?.error);
      return {
        success: false,
        message: "Tạo danh mục thất bại"
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
    const editedPath = generatePath(normalizedSlug, level as 1 | 2 | 3, parentSlug);
    
    const parsedParentId = typeof parentId === 'string' && !isNaN(Number(parentId)) 
      ? Number(parentId)
      : null;
      
    await createCategory(name, parsedParentId, level as 1 | 2 | 3, normalizedSlug, editedPath, note);
    
    // Revalidate cache after creating a category
    revalidateCategoryCache(undefined, normalizedSlug, parsedParentId);
    
    const updatedCategories = await getCategories();
    return { 
      success: true,
      message: 'Tạo thành công',
      data: updatedCategories
    };
  } catch(error: unknown) {
    return { 
      success: false,
      message: error instanceof Error ? error.message : 'Tạo thất bại' 
    };
  }
}

export async function updateCategoryAction(formData: FormData): Promise<CategoryActionResult> {
  try {
    await checkAdminAccess();
    
    const rawData = Object.fromEntries(formData);
    const data = {
      ...rawData,
      id: parseInt(rawData.id as string, 10),
      parentId: rawData.parentId,
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

    const { id, name, parentId, note, slug } = parsedData.data;

    let level = parsedData.data.level;

    // Get the original category data to detect changes
    const originalCategory = id ? await getCategoryById(id) : null;
    
    const parent = await findParentCategory(parsedData.data.parentId);
    if (parent && parent.level && parent.level !== 3) {
      level = parent.level + 1;
    }

    const normalizedSlug = slug.startsWith('/') ? slug : `/${slug}`;
    const parentSlug = parent?.path || undefined;
    const editedPath = generatePath(normalizedSlug, level as 1 | 2 | 3, parentSlug);

    const parsedParentId = typeof parentId === 'string' && !isNaN(Number(parentId)) 
      ? Number(parentId)
      : null;

    if (!id) {
      return { 
        success: false,
        message: 'Cập nhật thất bại: ID không hợp lệ',
      };
    }

    await updateCategory(id, name, parsedParentId, note || '', normalizedSlug, editedPath);
    
    // Revalidate cache after updating a category
    revalidateCategoryCache(id, normalizedSlug, parsedParentId);
    
    // If slug changed, also revalidate the old slug
    if (originalCategory && originalCategory.slug !== normalizedSlug) {
      revalidateTag('category-by-slug');
      revalidateTag('category-by-path');
    }
    
    // If parent changed, revalidate both old and new parent's children
    if (originalCategory && originalCategory.parentId !== parsedParentId) {
      revalidateTag('categories-by-parent-id');
      revalidateTag('category-breadcrumbs');
    }
    
    const updatedCategories = await getCategories();
    return { 
      success: true,
      message: 'Cập nhật thành công',
      data: updatedCategories
    };
  } catch(error: unknown) {
    return { 
      success: false,
      message: error instanceof Error ? error.message : 'Cập nhật thất bại: ' + error
    };
  }
}

export async function deleteCategoryAction(id: number): Promise<CategoryActionResult> {
  try {
    await checkAdminAccess();
    
    // Get the category before deleting it to know what to revalidate
    const categoryToDelete = await getCategoryById(id);
    
    await deleteCategory(id);
    
    // Revalidate cache after deleting a category
    if (categoryToDelete) {
      revalidateCategoryCache(
        id, 
        categoryToDelete.slug || undefined, // Convert null to undefined
        categoryToDelete.parentId
      );
    } else {
      revalidateCategoryCache();
    }
    
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
      message: error instanceof Error ? error.message : 'Xóa thất bại'
    };
  }
}

export async function findParentCategory(id: string | undefined) {
  if (!id) return null;
  return await getCategoryById(Number(id) || 0);
} 