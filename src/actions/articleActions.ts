'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { 
  createArticle,
  getArticleById,
  updateArticle as updateArticleInDb,
  deleteArticle as deleteArticleInDb,
  getArticles,
  getCategoriesWithArticleStatus
} from '@/lib/queries/articleQueries';
import { getCategories } from '@/lib/queries/categoryQueries';
import { getServerSession } from '@/lib/auth-utils';

const ArticleSchema = z.object({
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

export type ActionResult = {
  success: boolean;
  message: string;
  data?: any;
};

export async function createArticleAction(formData: FormData): Promise<ActionResult> {
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return {
        success: false,
        message: "Không có quyền truy cập",
      };
    }

    const rawData = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      content: formData.get('content') as string,
      level1CategoryId: formData.get('level1CategoryId') as string,
      level2CategoryId: formData.get('level2CategoryId') as string,
      level3CategoryId: formData.get('level3CategoryId') as string,
      targetState: formData.get('targetState') as string,
      targetCity: formData.get('targetCity') as string, 
      metaDescription: formData.get('metaDescription') as string,
      metaKeywords: formData.get('metaKeywords') as string,
      status: formData.get('status') as string,
      publishedAt: formData.get('publishedAt') as string,
    };

    const validationResult = ArticleSchema.safeParse(rawData);
    if (!validationResult.success) {
      return {
        success: false,
        message: "Dữ liệu không hợp lệ: " + validationResult?.error?.message,
      };
    }


    const articleData = {
      ...validationResult.data,
      authorId: session.user.id,
    };


    await createArticle(articleData);


    revalidatePath('/admin/articles');
    revalidatePath('/');


    const categoriesWithStatus = await getCategoriesWithArticleStatus();
    return {
      success: true,
      message: "Bài viết đã được tạo thành công",
      data: categoriesWithStatus,
    };
  } catch (error) {
    console.error('Error creating article:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Đã xảy ra lỗi khi tạo bài viết",
    };
  }
}

export async function updateArticleAction(formData: FormData): Promise<ActionResult> {
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return {
        success: false,
        message: "Không có quyền truy cập",
      };
    }

    const id = formData.get('id') as string;
    if (!id) {
      return {
        success: false,
        message: "ID bài viết không hợp lệ",
      };
    }


    const rawData = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      content: formData.get('content') as string,
      level1CategoryId: formData.get('level1CategoryId') as string,
      level2CategoryId: formData.get('level2CategoryId') as string,
      level3CategoryId: formData.get('level3CategoryId') as string,
      targetState: formData.get('targetState') as string,
      targetCity: formData.get('targetCity') as string, 
      metaDescription: formData.get('metaDescription') as string,
      metaKeywords: formData.get('metaKeywords') as string,
      status: formData.get('status') as string,
      publishedAt: formData.get('publishedAt') as string,
    };


    const validationResult = ArticleSchema.safeParse(rawData);
    if (!validationResult.success) {
      return {
        success: false,
        message: "Dữ liệu không hợp lệ",
      };
    }


    await updateArticleInDb(parseInt(id, 10), validationResult.data);


    revalidatePath('/admin/articles');
    revalidatePath('/');


    const categoriesWithStatus = await getCategoriesWithArticleStatus();
    return {
      success: true,
      message: "Bài viết đã được cập nhật thành công",
      data: categoriesWithStatus,
    };
  } catch (error) {
    console.error('Error updating article:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Đã xảy ra lỗi khi cập nhật bài viết",
    };
  }
}

export async function deleteArticleAction(id: number): Promise<ActionResult> {
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return {
        success: false,
        message: "Không có quyền truy cập",
      };
    }


    const article = await getArticleById(id);
    if (!article) {
      return {
        success: false,
        message: "Bài viết không tồn tại",
      };
    }

    await deleteArticleInDb(id);

    // Revalidate paths
    revalidatePath('/admin/articles');
    revalidatePath('/');


    const categoriesWithStatus = await getCategoriesWithArticleStatus();
    return {
      success: true,
      message: "Bài viết đã được xóa thành công",
      data: categoriesWithStatus,
    };
  } catch (error) {
    console.error('Error deleting article:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Đã xảy ra lỗi khi xóa bài viết",
    };
  }
}

export async function getArticleForEditAction(id: number): Promise<ActionResult> {
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return {
        success: false,
        message: "Không có quyền truy cập",
      };
    }


    const article = await getArticleById(id);
    if (!article) {
      return {
        success: false,
        message: "Bài viết không tồn tại",
      };
    }

    const categories = await getCategories();

    return {
      success: true,
      message: "Lấy dữ liệu bài viết thành công",
      data: {
        article,
        categories
      },
    };
  } catch (error) {
    console.error('Error fetching article:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Đã xảy ra lỗi khi lấy dữ liệu bài viết",
    };
  }
}

export async function getCategoriesWithArticleStatusAction(): Promise<ActionResult> {
  try {
    const categoriesWithStatus = await getCategoriesWithArticleStatus();
    return {
      success: true,
      message: "Lấy dữ liệu danh mục thành công",
      data: categoriesWithStatus,
    };
  } catch (error) {
    console.error('Error fetching categories with article status:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Đã xảy ra lỗi khi lấy dữ liệu danh mục",
    };
  }
} 