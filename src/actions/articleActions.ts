'use server';

import { revalidatePath } from 'next/cache';
import { revalidateTag } from 'next/cache';
import { z } from 'zod';
import { 
  createArticle,
  getArticleByIdWithCategory as getArticleById,
  updateArticle as updateArticleInDb,
  deleteArticle as deleteArticleInDb,
  getCategoriesWithArticleStatus
} from '@/lib/queries/articleQueries';
import { getServerSession } from '@/lib/auth-utils';
import { db } from "@/db/drizzle";
import { articlesTable } from "@/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { getCategoryByPath } from "@/lib/queries/categoryQueries";
import { getCategories } from '@/lib/queries/categoryQueries';

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
  data?: unknown;
};

function revalidateArticleCaches(
  articleId?: number, 
  slug?: string, 
  level1CategoryId?: number | null, 
  level2CategoryId?: number | null, 
  level3CategoryId?: number | null,
  status?: string
) {
  revalidateTag('articles');
  revalidateTag('articles:paginated');
  revalidateTag('articles:admin:paginated');
  revalidateTag('articles:sitemap');
  
  if (articleId) {
    revalidateTag('article-by-id');
    revalidateTag('article-content-by-id');
  }
  
  if (slug) {
    revalidateTag('article-by-slug-simple');
    revalidateTag('article-public-by-slug');
  }
  
  if (level1CategoryId) {
    revalidateTag('articles:count:category');
    revalidateTag('articles-by-category-slug');
    
    revalidateTag('categories');
    revalidateTag('categories:all:counts');
    revalidateTag('categories:public:counts');
  }
  
  if (status === 'published') {
    revalidateTag('articles:latest');
    revalidateTag('articles:featured');
  }
  
  revalidateTag('articles:search');
  revalidateTag('related-articles');
}

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
      authorId: session.user?.id,
      level1CategoryId: Number(validationResult.data.level1CategoryId),
      level2CategoryId: Number(validationResult.data.level2CategoryId) || null,
      level3CategoryId: Number(validationResult.data.level3CategoryId) || null,
    };


    const [createdArticle] = await createArticle(articleData);

    // Revalidate both path-based and tag-based caches
    revalidateArticleCaches(
      createdArticle?.id,
      articleData.slug,
      articleData.level1CategoryId,
      articleData.level2CategoryId, 
      articleData.level3CategoryId,
      articleData.status
    );

    // Keep existing path-based revalidation
    revalidatePath('/admin/articles');
    revalidatePath('/');
    
    if (articleData.level1CategoryId) {
      const category1 = await getCategoryByPath(`/${articleData.slug?.split('/')[1] || ''}`);
      if (category1?.slug) {
        revalidatePath(`/${category1.slug}`);
        
        if (articleData.level2CategoryId) {
          const category2 = await getCategoryByPath(`/${category1.slug}/${articleData.slug?.split('/')[2] || ''}`);
          if (category2?.slug) {
            revalidatePath(`/${category1.slug}/${category2.slug}`);
            
            if (articleData.level3CategoryId) {
              const category3 = await getCategoryByPath(`/${category1.slug}/${category2.slug}/${articleData.slug?.split('/')[3] || ''}`);
              if (category3?.slug) {
                revalidatePath(`/${category1.slug}/${category2.slug}/${category3.slug}`);
              }
            }
          }
        }
      }
    }

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

    // Get the original article to compare changes
    const originalArticle = await getArticleById(parseInt(id, 10));
    if (!originalArticle) {
      return {
        success: false,
        message: "Bài viết không tồn tại",
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

    await updateArticleInDb(parseInt(id, 10), {
      ...validationResult.data,
      level1CategoryId: Number(validationResult.data.level1CategoryId),
      level2CategoryId: Number(validationResult.data.level2CategoryId) || null,
      level3CategoryId: Number(validationResult.data.level3CategoryId) || null,
    });

    // Revalidate both path-based and tag-based caches
    revalidateArticleCaches(
      parseInt(id, 10),
      validationResult.data.slug,
      validationResult.data.level1CategoryId,
      validationResult.data.level2CategoryId,
      validationResult.data.level3CategoryId,
      validationResult.data.status
    );
    
    // If slug changed, also revalidate the old slug
    if (originalArticle.slug !== validationResult.data.slug) {
      revalidateTag('article-by-slug-simple');
      revalidateTag('article-public-by-slug');
    }
    
    // If category changed, revalidate both old and new category article counts
    if (originalArticle.level1CategoryId !== validationResult.data.level1CategoryId ||
        originalArticle.level2CategoryId !== validationResult.data.level2CategoryId ||
        originalArticle.level3CategoryId !== validationResult.data.level3CategoryId) {
      revalidateTag('articles:count:category');
      revalidateTag('articles-by-category-slug');
      revalidateTag('categories:all:counts');
      revalidateTag('categories:public:counts');
    }
    
    // If status changed, revalidate specific status-related tags
    if (originalArticle.status !== validationResult.data.status) {
      revalidateTag('articles:latest');
      revalidateTag('articles:featured');
      revalidateTag('articles:published-by-params');
    }

    // Keep existing path-based revalidation
    revalidatePath('/admin/articles');
    revalidatePath('/');
    
    if (validationResult.data.level1CategoryId) {
      const category1 = await getCategoryByPath(`/${validationResult.data.slug?.split('/')[1] || ''}`);
      if (category1?.slug) {
        revalidatePath(`/${category1.slug}`);
        
        if (validationResult.data.level2CategoryId) {
          const category2 = await getCategoryByPath(`/${category1.slug}/${validationResult.data.slug?.split('/')[2] || ''}`);
          if (category2?.slug) {
            revalidatePath(`/${category1.slug}/${category2.slug}`);
            
            if (validationResult.data.level3CategoryId) {
              const category3 = await getCategoryByPath(`/${category1.slug}/${category2.slug}/${validationResult.data.slug?.split('/')[3] || ''}`);
              if (category3?.slug) {
                revalidatePath(`/${category1.slug}/${category2.slug}/${category3.slug}`);
              }
            }
          }
        }
      }
    }

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

    // Revalidate tag-based caches
    revalidateArticleCaches(
      id,
      article.slug,
      article.level1CategoryId,
      article.level2CategoryId,
      article.level3CategoryId,
      article.status
    );

    // Revalidate admin paths
    revalidatePath('/admin/articles');
    
    // Revalidate frontend paths
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

interface ArticleQueryParams {
  level1Slug?: string;
  level2Slug?: string;
  level3Slug?: string;
  // Other params may be added as needed but not used directly
}

export async function getPublishedArticleByParams({
  level1Slug,
  level2Slug,
  level3Slug,
}: ArticleQueryParams) {
  try {
    let level1Category = null;
    let level2Category = null;
    let level3Category = null;

    if (level1Slug) {
      level1Category = await getCategoryByPath(`/${level1Slug}`);
      if (!level1Category) return null;
    }

    if (level2Slug) {
      if (level2Slug.startsWith('/')) {
        level2Category = await getCategoryByPath(level2Slug);
      } else {
        level2Category = await getCategoryByPath(`/${level1Slug}/${level2Slug}`);
      }
      if (!level2Category) return null;
    }

    if (level3Slug) {
      if (level3Slug.startsWith('/')) {
        level3Category = await getCategoryByPath(level3Slug);
      } else if (level2Slug && !level2Slug.startsWith('/')) {
        level3Category = await getCategoryByPath(`/${level1Slug}/${level2Slug}/${level3Slug}`);
      } else {
        // If level2Slug contains full path, extract just the slug part
        const level2Parts = level2Slug?.split('/') || [];
        const level2SlugOnly = level2Parts[level2Parts.length - 1];
        level3Category = await getCategoryByPath(`/${level1Slug}/${level2SlugOnly}/${level3Slug}`);
      }
      if (!level3Category) return null;
    }

    // For now, ignore state and city and just fetch the general article for the category
    const generalArticle = await db.query.articlesTable.findFirst({
      where: and(
        level1Category ? eq(articlesTable.level1CategoryId, level1Category.id) : isNull(articlesTable.level1CategoryId),
        level2Category ? eq(articlesTable.level2CategoryId, level2Category.id) : isNull(articlesTable.level2CategoryId),
        level3Category ? eq(articlesTable.level3CategoryId, level3Category.id) : isNull(articlesTable.level3CategoryId),
        eq(articlesTable.status, 'published')
      ),
    });
    
    return generalArticle;
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
} 