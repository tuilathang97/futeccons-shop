'use server'

import { db } from '@/db/drizzle';
import { categoriesTable, Category } from '@/db/schema';
import { eq, asc, isNull, sql } from 'drizzle-orm';
import { customUnstableCache } from '@/lib/cache';

export async function createCategory(name: string, parentId: number | null, level: 1 | 2 | 3, slug: string, path: string, note: string = '') {
  await db.insert(categoriesTable).values({ name, parentId, level, note, path, slug });
}

export const getAllCategories = customUnstableCache(
  async (hierarchical: boolean = false): Promise<Category[]> => {
    console.log(`Executing DB query for getAllCategories (hierarchical: ${hierarchical})`);
    const query = db.select().from(categoriesTable).orderBy(asc(categoriesTable.name));
    const allCategories = await query;

    if (!hierarchical) {
      return allCategories;
    }

    const categoryMap = new Map<number, Category & { children?: Category[] }>();
    allCategories.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    const rootCategories: (Category & { children?: Category[] })[] = [];
    allCategories.forEach(category => {
      if (category.parentId && categoryMap.has(category.parentId)) {
        categoryMap.get(category.parentId)!.children!.push(categoryMap.get(category.id)!);
      } else {
        rootCategories.push(categoryMap.get(category.id)!);
      }
    });
    return rootCategories;
  },
  ['categories', 'all'],
  {
    tags: ['categories', 'all-categories'],
    revalidate: 86400,
  }
);

export const getCategoryById = customUnstableCache(
  async (id: number): Promise<Category | null> => {
    console.log(`Executing DB query for getCategoryById: ${id}`);
    const result = await db.select().from(categoriesTable).where(eq(categoriesTable.id, id));
    return result[0] || null;
  },
  ['categories', 'id'],
  {
    tags: ['categories', 'category-by-id'],
    revalidate: 86400,
  }
);

export const getCategoryByPath = customUnstableCache(
  async (path: string): Promise<Category | null> => {
    console.log(`Executing DB query for getCategoryByPath: ${path}`);
    const result = await db.select().from(categoriesTable).where(eq(categoriesTable.path, path));
    return result[0] || null;
  },
  ['categories', 'path'],
  {
    tags: ['categories', 'category-by-path'],
    revalidate: 86400,
  }
);

export const getCategoryBySlug = customUnstableCache(
  async (slug: string): Promise<Category | null> => {
    console.log(`Executing DB query for getCategoryBySlug: ${slug}`);
    const result = await db.select().from(categoriesTable).where(eq(categoriesTable.slug, slug));
    return result[0] || null;
  },
  ['categories', 'slug'],
  {
    tags: ['categories', 'category-by-slug'],
    revalidate: 86400,
  }
);

export async function updateCategory(id: number, name: string, parentId: number | null, note: string | null, slug: string | null, path: string | null) {
  await db.update(categoriesTable).set({ name, parentId, note, slug, path }).where(eq(categoriesTable.id, id));
}

export async function deleteCategory(id: number) {
  await db.delete(categoriesTable).where(eq(categoriesTable.id, id));
}

export async function validateCategoryPath(path: string): Promise<boolean> {
  const isInclude = path.includes('%');
  if (isInclude) {
    const cleanedPath = path.split('%')[0];
    const category = await getCategoryByPath(cleanedPath);
    return category !== null && category !== undefined;
  }
  const category = await getCategoryByPath(path);
  return category !== null && category !== undefined;
}

export const getCategoriesByParentId = customUnstableCache(
  async (parentId: number | null): Promise<Category[]> => {
    console.log(`Executing DB query for getCategoriesByParentId: ${parentId}`);
    if (parentId === null) {
      return db.select().from(categoriesTable).where(isNull(categoriesTable.parentId)).orderBy(asc(categoriesTable.name));
    }
    return db.select().from(categoriesTable).where(eq(categoriesTable.parentId, parentId)).orderBy(asc(categoriesTable.name));
  },
  ['categories', 'parent'],
  {
    tags: ['categories', 'categories-by-parent-id'],
    revalidate: 86400,
  }
);

export const getCategoryBreadcrumbs = customUnstableCache(
  async (categoryId: number | null): Promise<Category[]> => {
    if (categoryId === null) return [];
    console.log(`Executing DB query for getCategoryBreadcrumbs: ${categoryId}`);
    const breadcrumbs: Category[] = [];
    let currentCategoryId: number | null = categoryId;

    while (currentCategoryId !== null) {
      const categoryItem: Category | undefined = await db.query.categoriesTable.findFirst({
        where: eq(categoriesTable.id, currentCategoryId),
      });

      if (categoryItem) {
        breadcrumbs.unshift(categoryItem);
        currentCategoryId = categoryItem.parentId;
      } else {
        currentCategoryId = null;
      }
    }
    return breadcrumbs;
  },
  ['categories', 'breadcrumbs'],
  {
    tags: ['categories', 'category-breadcrumbs'],
    revalidate: 86400,
  }
);

export const getTopLevelCategories = customUnstableCache(
  async (): Promise<Category[]> => {
    console.log(`Executing DB query for getTopLevelCategories`);
    return getCategoriesByParentId(null);
  },
  ['categories', 'top-level'],
  {
    tags: ['categories', 'categories:top-level'],
    revalidate: 86400,
  }
);

type CategoryWithCount = Omit<Category, 'createdAt' | 'updatedAt'> & { articleCount: number };

export const getPublicCategoriesWithCounts = customUnstableCache(
  async (): Promise<CategoryWithCount[]> => {
    console.log(`Executing DB query for getPublicCategoriesWithCounts`);
    const result = await db
      .select({
        id: categoriesTable.id,
        name: categoriesTable.name,
        slug: categoriesTable.slug,
        path: categoriesTable.path,
        parentId: categoriesTable.parentId,
        level: categoriesTable.level,
        note: categoriesTable.note,
        articleCount: sql<number>`(SELECT COUNT(*) FROM articles WHERE articles."categoryId" = ${categoriesTable.id})`.as('article_count'),
      })
      .from(categoriesTable)
      .orderBy(asc(categoriesTable.name));

    return result.map(r => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      path: r.path,
      parentId: r.parentId,
      level: r.level,
      note: r.note,
      articleCount: Number(r.articleCount)
    }));
  },
  ['categories', 'public', 'counts'],
  {
    tags: ['categories', 'categories:public:counts', 'articles'],
    revalidate: 86400,
  }
);

export const getAllCategoriesWithArticleCounts = customUnstableCache(
  async (): Promise<CategoryWithCount[]> => {
    console.log(`Executing DB query for getAllCategoriesWithArticleCounts`);
    const result = await db
      .select({
        id: categoriesTable.id,
        name: categoriesTable.name,
        slug: categoriesTable.slug,
        path: categoriesTable.path,
        parentId: categoriesTable.parentId,
        level: categoriesTable.level,
        note: categoriesTable.note,
        articleCount: sql<number>`(SELECT COUNT(*) FROM articles WHERE articles."categoryId" = ${categoriesTable.id})`.as('article_count'),
      })
      .from(categoriesTable)
      .orderBy(asc(categoriesTable.name));
    
    return result.map(r => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      path: r.path,
      parentId: r.parentId,
      level: r.level,
      note: r.note,
      articleCount: Number(r.articleCount)
    }));
  },
  ['categories', 'all', 'counts'],
  {
    tags: ['categories', 'categories:all:counts', 'articles'],
    revalidate: 86400,
  }
);

export const getCategoriesForSitemap = customUnstableCache(
  async (): Promise<{ path: string; }[]> => {
    console.log(`Executing DB query for getCategoriesForSitemap`);
    const categories = await db
      .select({
        path: categoriesTable.path,
      })
      .from(categoriesTable)
      .orderBy(asc(categoriesTable.path));
    
    return categories.filter(c => c.path !== null).map(c => ({
        path: c.path!,
    }));
  },
  ['categories', 'sitemap'],
  {
    tags: ['categories', 'categories:sitemap'],
    revalidate: 86400,
  }
);

export const getCategories = getAllCategories;