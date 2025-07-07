'use server'

import { db } from '@/db/drizzle';
import { articlesTable, type Article, type Category, type NewArticle, type User } from '@/db/schema';
import { eq, and, or, isNull, desc, asc, count as drizzleCount, ilike, not, type SQL, type AnyColumn } from 'drizzle-orm';
import { customUnstableCache } from '@/lib/cache';
import type { PaginationParams, PaginatedResult } from './paginateQuery';
import { getAllCategories, getCategoryBySlug } from './categoryQueries';

type ArticleWithRelations = Article & { 
  level1Category?: Category | null; 
  level2Category?: Category | null; 
  level3Category?: Category | null; 
  author?: User | null; 
};

type ArticleWithAuthorAndLevel1 = Article & { 
  author?: User | null; 
  level1Category?: Category | null;
};

export type CategoryWithArticleStatusType = Category & {
  hasArticle: boolean;
  articleStatus: string | null;
  lastUpdated: Date | null; 
  articleId: number | null;
};

const articleSortableColumns: Record<string, AnyColumn | undefined> = {
  id: articlesTable.id,
  title: articlesTable.title,
  slug: articlesTable.slug,
  status: articlesTable.status,
  publishedAt: articlesTable.publishedAt,
  createdAt: articlesTable.createdAt,
  updatedAt: articlesTable.updatedAt,
};

function getArticleOrderBy(sortBy?: string, sortOrder?: 'asc' | 'desc'): SQL[] {
  const column = sortBy ? articleSortableColumns[sortBy] : undefined;
  const order = sortOrder || 'desc';
  if (column) {
    return order === 'desc' ? [desc(column)] : [asc(column)];
  }
  return [desc(articlesTable.updatedAt)];
}

export const getArticlesWithCategory = customUnstableCache(
  async (params: PaginationParams): Promise<PaginatedResult<ArticleWithRelations>> => {
    console.log(`Executing DB query for getArticlesWithCategory: ${JSON.stringify(params)}`);
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const offset = (page - 1) * pageSize;

    const totalItemsResult = await db.select({ count: drizzleCount() }).from(articlesTable);
    const totalItems = totalItemsResult[0].count;
    const totalPages = Math.ceil(totalItems / pageSize);
    
    const orderByCondition = getArticleOrderBy(params.sortBy, params.sortOrder);

    const data = await db.query.articlesTable.findMany({
      with: {
        level1Category: true,
        level2Category: true,
        level3Category: true,
        author: true,
      },
      limit: pageSize,
      offset: offset,
      orderBy: orderByCondition,
    });

    return {
      data: data as ArticleWithRelations[],
      metadata: {
        currentPage: page,
        pageSize,
        totalPages,
        totalItems,
      },
    };
  },
  ['articles', 'paginated'],
  {
    tags: ['articles', 'articles:paginated', 'categories', 'users'],
    revalidate: 900, // 15 minutes
  }
);

export const getArticleByIdWithCategory = customUnstableCache(
  async (articleId: number): Promise<ArticleWithRelations | null> => {
    console.log(`Executing DB query for getArticleByIdWithCategory: ${articleId}`);
    const article = await db.query.articlesTable.findFirst({
      where: eq(articlesTable.id, articleId),
      with: {
        level1Category: true,
        level2Category: true,
        level3Category: true,
        author: true,
      },
    });
    return (article as ArticleWithRelations) || null;
  },
  ['articles', 'id'],
  {
    tags: ['articles', 'article-by-id', 'categories', 'users'],
    revalidate: 3600, // 1 hour
  }
);

export const getArticlesByCategorySlug = customUnstableCache(
  async (slug: string, params: PaginationParams): Promise<PaginatedResult<Article & { author?: User | null }>> => {
    console.log(`Executing DB query for getArticlesByCategorySlug: ${slug}, ${JSON.stringify(params)}`);
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const offset = (page - 1) * pageSize;

    const category = await getCategoryBySlug(slug);

    if (!category) {
      return { data: [], metadata: { currentPage: page, pageSize, totalPages: 0, totalItems: 0 } };
    }

    let categoryCondition;
    if (category.level === 1) {
      categoryCondition = eq(articlesTable.level1CategoryId, category.id);
    } else if (category.level === 2) {
      categoryCondition = eq(articlesTable.level2CategoryId, category.id);
    } else {
      categoryCondition = eq(articlesTable.level3CategoryId, category.id);
    }

    const totalItemsResult = await db.select({ count: drizzleCount() }).from(articlesTable).where(categoryCondition);
    const totalItems = totalItemsResult[0]?.count || 0;
    const totalPages = Math.ceil(totalItems / pageSize);
    
    const orderByCondition = getArticleOrderBy(params.sortBy, params.sortOrder);

    const data = await db.query.articlesTable.findMany({
        where: categoryCondition,
        with: { author: true }, 
        limit: pageSize,
        offset: offset,
        orderBy: orderByCondition,
    });

    return {
      data: data as (Article & { author?: User | null })[],
      metadata: {
        currentPage: page,
        pageSize,
        totalPages,
        totalItems,
      },
    };
  },
  ['articles', 'category-slug'],
  {
    tags: ['articles', 'articles-by-category-slug', 'categories', 'users'],
    revalidate: 900, // 15 minutes
  }
);

export const getRelatedArticles = customUnstableCache(
  async (articleId: number, categoryId: number, limit: number = 5): Promise<Article[]> => {
    console.log(`Executing DB query for getRelatedArticles: articleId=${articleId}, categoryId=${categoryId}, limit=${limit}`);
    return db.query.articlesTable.findMany({
      where: and(
        eq(articlesTable.level1CategoryId, categoryId), 
        eq(articlesTable.status, 'published'),
        not(eq(articlesTable.id, articleId))
      ),
      orderBy: desc(articlesTable.updatedAt),
      limit: limit,
    });
  },
  ['articles', 'related'],
  {
    tags: ['articles', 'related-articles'],
    revalidate: 1800, // 30 minutes
  }
);

export const getLatestArticles = customUnstableCache(
  async (limit: number = 5): Promise<(Article & {level1Category?: Category | null})[]> => {
    console.log(`Executing DB query for getLatestArticles: limit=${limit}`);
    const articles = await db.query.articlesTable.findMany({
      where: eq(articlesTable.status, 'published'),
      orderBy: desc(articlesTable.updatedAt),
      limit: limit,
      with: { level1Category: true }
    });
    return articles as (Article & {level1Category?: Category | null})[];
  },
  ['articles', 'latest'],
  {
    tags: ['articles', 'articles:latest', 'categories'],
    revalidate: 900, // 15 minutes
  }
);

export const getFeaturedArticles = customUnstableCache(
  async (limit: number = 5): Promise<(Article & {level1Category?: Category | null})[]> => {
    console.log(`Executing DB query for getFeaturedArticles: limit=${limit}`);
    const articles = await db.query.articlesTable.findMany({
      where: eq(articlesTable.status, 'published'),
      orderBy: desc(articlesTable.updatedAt),
      limit: limit,
      with: { level1Category: true }
    });
    return articles as (Article & {level1Category?: Category | null})[];
  },
  ['articles', 'featured'],
  {
    tags: ['articles', 'articles:featured', 'categories'],
    revalidate: 1800, // 30 minutes
  }
);

export const countArticles = customUnstableCache(
  async (): Promise<number> => {
    console.log(`Executing DB query for countArticles`);
    const result = await db.select({ count: drizzleCount() }).from(articlesTable);
    return result[0].count;
  },
  ['articles', 'count', 'all'],
  {
    tags: ['articles', 'articles:count'],
    revalidate: 3600,
  }
);

export const countArticlesByCategory = customUnstableCache(
  async (categoryId: number): Promise<number> => {
    console.log(`Executing DB query for countArticlesByCategory: categoryId=${categoryId}`);
    const result = await db.select({ count: drizzleCount() }).from(articlesTable)
      .where(or(
        eq(articlesTable.level1CategoryId, categoryId),
        eq(articlesTable.level2CategoryId, categoryId),
        eq(articlesTable.level3CategoryId, categoryId)
      )); 
    return result[0]?.count || 0;
  },
  ['articles', 'count', 'category'],
  {
    tags: ['articles', 'articles:count:category'],
    revalidate: 3600,
  }
);

export const getArticlesForSitemap = customUnstableCache(
  async (): Promise<{ slug: string; updatedAt: Date | null }[]> => {
    console.log(`Executing DB query for getArticlesForSitemap`);
    const articles = await db
      .select({
        slug: articlesTable.slug,
        updatedAt: articlesTable.updatedAt,
      })
      .from(articlesTable)
      .where(eq(articlesTable.status, 'published'))
      .orderBy(desc(articlesTable.updatedAt));
    
    return articles.filter(a => a.slug !== null).map(a => ({ slug: a.slug!, updatedAt: a.updatedAt }));
  },
  ['articles', 'sitemap'],
  {
    tags: ['articles', 'articles:sitemap'],
    revalidate: 86400, // 24 hours
  }
);

export const searchArticles = customUnstableCache(
  async (searchTerm: string, params: PaginationParams): Promise<PaginatedResult<ArticleWithAuthorAndLevel1>> => {
    console.log(`Executing DB query for searchArticles: ${searchTerm}, ${JSON.stringify(params)}`);
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const offset = (page - 1) * pageSize;

    const searchCondition = or(
      ilike(articlesTable.title, `%${searchTerm}%`),
      ilike(articlesTable.content, `%${searchTerm}%`)
    );

    const combinedCondition = and(eq(articlesTable.status, 'published'), searchCondition);

    const totalItemsResult = await db.select({ count: drizzleCount() }).from(articlesTable).where(combinedCondition);
    const totalItems = totalItemsResult[0]?.count || 0;
    const totalPages = Math.ceil(totalItems / pageSize);

    const orderByCondition = getArticleOrderBy(params.sortBy, params.sortOrder);
    
    const data = await db.query.articlesTable.findMany({
        where: combinedCondition,
        with: { author: true, level1Category: true },
        limit: pageSize,
        offset: offset,
        orderBy: orderByCondition,
    });

    return {
      data: data as ArticleWithAuthorAndLevel1[],
      metadata: {
        currentPage: page,
        pageSize,
        totalPages,
        totalItems,
      },
    };
  },
  ['articles', 'search'],
  {
    tags: ['articles', 'articles:search'],
    revalidate: 900, // 15 minutes
  }
);

export const getPublicArticleBySlugWithCategory = customUnstableCache(
  async (slug: string): Promise<ArticleWithRelations | null> => {
    console.log(`Executing DB query for getPublicArticleBySlugWithCategory: ${slug}`);
    const article = await db.query.articlesTable.findFirst({
      where: and(eq(articlesTable.slug, slug), eq(articlesTable.status, 'published')),
      with: {
        level1Category: true,
        level2Category: true,
        level3Category: true,
        author: true,
      },
    });
    return (article as ArticleWithRelations) || null;
  },
  ['articles', 'public', 'slug'],
  {
    tags: ['articles', 'article-public-by-slug', 'categories', 'users'],
    revalidate: 3600, // 1 hour
  }
);

// getAllArticlesForAdmin (from plan)
export const getAllArticlesForAdmin = customUnstableCache(
  async (params: PaginationParams): Promise<PaginatedResult<ArticleWithAuthorAndLevel1>> => {
    // Similar to getArticlesWithCategory but might not filter by status or have different included relations for admin
    console.log(`Executing DB query for getAllArticlesForAdmin: ${JSON.stringify(params)}`);
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const offset = (page - 1) * pageSize;

    const totalItemsResult = await db.select({ count: drizzleCount() }).from(articlesTable);
    const totalItems = totalItemsResult[0].count;
    const totalPages = Math.ceil(totalItems / pageSize);

    const orderByCondition = getArticleOrderBy(params.sortBy, params.sortOrder);
    
    const data = await db.query.articlesTable.findMany({
      with: { 
        author: true, // Include author
        level1Category: true, // Include primary category for context
      }, 
      limit: pageSize,
      offset: offset,
      orderBy: orderByCondition,
    });

    return {
      data: data as ArticleWithAuthorAndLevel1[],
      metadata: {
        currentPage: page,
        pageSize,
        totalPages,
        totalItems,
      },
    };
  },
  ['articles', 'admin', 'paginated'],
  {
    tags: ['articles', 'articles:admin:paginated', 'users', 'categories'],
    revalidate: 600, // 10 minutes
  }
);

// getArticleBySlug (simple, from plan - if different from public one above)
export const getArticleBySlug = customUnstableCache(
  async (slug: string): Promise<Article | null> => {
    console.log(`Executing DB query for getArticleBySlug (simple): ${slug}`);
    const result = await db.query.articlesTable.findFirst({
        where: eq(articlesTable.slug, slug)
        // No status check, fetches any article by slug
    });
    return result || null;
  },
  ['articles', 'slug', 'simple'],
  {
    tags: ['articles', 'article-by-slug-simple'], 
    revalidate: 3600, 
  }
);

// getArticleContent (from plan)
export const getArticleContent = customUnstableCache(
  async (articleId: number): Promise<{ content: string | null } | null> => {
    console.log(`Executing DB query for getArticleContent: ${articleId}`);
    const result = await db.select({ content: articlesTable.content }).from(articlesTable).where(eq(articlesTable.id, articleId));
    return result[0] || null;
  },
  ['articles', 'content', 'id'],
  {
    tags: ['articles', 'article-content-by-id'],
    revalidate: 3600,
  }
);


// --- MUTATIONS (No Caching Here, Revalidation in Actions) ---
export async function createArticle(article: NewArticle) {
  return db.insert(articlesTable).values(article).returning(); // Return created article
}

export async function updateArticle(id: number, article: Partial<NewArticle>) {
  return db.update(articlesTable).set({
    ...article,
    updatedAt: new Date(), // Ensure updatedAt is updated
  }).where(eq(articlesTable.id, id)).returning();
}

export async function deleteArticle(id: number) {
  return db.delete(articlesTable).where(eq(articlesTable.id, id)).returning();
}

// --- Potentially Misplaced or Complex Queries (Review / Refactor if needed) ---

// getCategoriesWithArticleStatus - Considers categories, might be better in categoryQueries.ts
// For now, caching as per its existence here.
export const getCategoriesWithArticleStatus = customUnstableCache(
  async (): Promise<CategoryWithArticleStatusType[]> => {
    console.log('Executing DB query for getCategoriesWithArticleStatus');
    const categories: Category[] = await getAllCategories();
    
    const categoriesWithStatus: CategoryWithArticleStatusType[] = await Promise.all(
      categories.map(async (category) => {
        let categorySpecificCondition;
        if (category.level === 1) {
            categorySpecificCondition = and(
                eq(articlesTable.level1CategoryId, category.id),
                isNull(articlesTable.level2CategoryId),
                isNull(articlesTable.level3CategoryId)
            );
        } else if (category.level === 2) {
            categorySpecificCondition = and(
                eq(articlesTable.level2CategoryId, category.id),
                isNull(articlesTable.level3CategoryId)
            );
        } else { // Level 3 or other (assuming level 3)
            categorySpecificCondition = eq(articlesTable.level3CategoryId, category.id);
        }

        const articleInfo = await db.select({ 
          id: articlesTable.id,
          updatedAt: articlesTable.updatedAt,
          status: articlesTable.status
        })
        .from(articlesTable)
        .where(categorySpecificCondition)
        .orderBy(desc(articlesTable.updatedAt))
        .limit(1);
  
        const hasArticle = articleInfo.length > 0;
        const firstArticle = hasArticle ? articleInfo[0] : null;

        return {
          ...category,
          hasArticle,
          articleStatus: firstArticle?.status || null,
          lastUpdated: firstArticle?.updatedAt || null,
          articleId: firstArticle?.id || null
        };
      })
    );
    return categoriesWithStatus;
  },
  ['categories', 'with-article-status'],
  {
    tags: ['categories', 'articles', 'categories-with-article-status'],
    revalidate: 1800, // 30 minutes
  }
);

// getPublishedArticleByParams - Complex logic, multiple DB calls. Caching the whole function.
// Revalidation needs to be thorough for this one, considering changes in articles and categories.
export const getPublishedArticleByParams = customUnstableCache(
  async (params: { 
    level1Slug?: string, 
    level2Slug?: string, 
    level3Slug?: string, 
    state?: string, // Assuming articlesTable has targetState
    city?: string  // Assuming articlesTable has targetCity
  }): Promise<Article | null> => {
    console.log(`Executing DB query for getPublishedArticleByParams: ${JSON.stringify(params)}`);
    let level1Id: number | undefined;
    let level2Id: number | undefined;
    let level3Id: number | undefined;
    
    // Fetch category IDs using optimized cached category lookups
    const allCategories = await getAllCategories();
    
    if (params.level1Slug) {
      const level1Category = allCategories.find(cat => cat.slug === params.level1Slug && cat.level === 1);
      level1Id = level1Category?.id;
    }
    if (params.level2Slug && level1Id) {
      const level2Category = allCategories.find(cat => cat.slug === params.level2Slug && cat.level === 2 && cat.parentId === level1Id);
      level2Id = level2Category?.id;
    }
    if (params.level3Slug && level2Id) {
      const level3Category = allCategories.find(cat => cat.slug === params.level3Slug && cat.level === 3 && cat.parentId === level2Id);
      level3Id = level3Category?.id;
    }
    
    if (!level1Id) return null;
    
    let categoryConditions: SQL[] = []; // Explicitly type as SQL[]
    if (level3Id && level2Id) { 
      categoryConditions = [eq(articlesTable.level1CategoryId, level1Id), eq(articlesTable.level2CategoryId, level2Id), eq(articlesTable.level3CategoryId, level3Id)];
    } else if (level2Id) {
      categoryConditions = [eq(articlesTable.level1CategoryId, level1Id), eq(articlesTable.level2CategoryId, level2Id), isNull(articlesTable.level3CategoryId)];
    } else {
      categoryConditions = [eq(articlesTable.level1CategoryId, level1Id), isNull(articlesTable.level2CategoryId), isNull(articlesTable.level3CategoryId)];
    }
    
    const baseConditions: SQL[] = [...categoryConditions, eq(articlesTable.status, 'published')]; // Explicitly type
    
    // Try with specific city and state
    if (params.city && params.state) {
      const cityStateArticle = await db.query.articlesTable.findFirst({ where: and(...baseConditions, eq(articlesTable.targetState, params.state), eq(articlesTable.targetCity, params.city)) });
      if (cityStateArticle) return cityStateArticle as Article;
    }
    
    // Try with state only
    if (params.state) {
      const stateArticle = await db.query.articlesTable.findFirst({ where: and(...baseConditions, eq(articlesTable.targetState, params.state), isNull(articlesTable.targetCity)) });
      if (stateArticle) return stateArticle as Article;
    }
    
    // Try with no location
    const generalArticle = await db.query.articlesTable.findFirst({ where: and(...baseConditions, isNull(articlesTable.targetState), isNull(articlesTable.targetCity)) });
    return generalArticle as Article || null;
  },
  ['articles', 'published-by-params'],
  {
    tags: ['articles', 'categories', 'articles:published-by-params'], // Broad tags due to complexity
    revalidate: 900, // 15 mins
  }
); 