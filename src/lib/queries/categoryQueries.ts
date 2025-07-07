'use server'

import { db } from '@/db/drizzle';
import { categoriesTable, Category } from '@/db/schema';
import { eq, asc, sql } from 'drizzle-orm';
import { customUnstableCache } from '@/lib/cache';

export async function createCategory(name: string, parentId: number | null, level: 1 | 2 | 3, slug: string, path: string, note: string = '') {
  await db.insert(categoriesTable).values({ name, parentId, level, note, path, slug });
}

export const getAllCategories = customUnstableCache(
  async (hierarchical: boolean = false): Promise<Category[]> => {
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

export async function getCategoryById(id: number): Promise<Category | null> {
  const allCategories = await getAllCategories();
  const category = allCategories.find(cat => cat.id === id);
  return category || null;
}

export async function getCategoryByPath(path: string): Promise<Category | null> {
  const allCategories = await getAllCategories();
  const category = allCategories.find(cat => cat.path === path);
  return category || null;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const allCategories = await getAllCategories();
  const category = allCategories.find(cat => cat.slug === slug);
  return category || null;
}

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

export async function getCategoriesByParentId(parentId: number | null): Promise<Category[]> {
  const allCategories = await getAllCategories();
  const filteredCategories = allCategories.filter(cat => cat.parentId === parentId);
  // Sort by name to match original behavior
  return filteredCategories.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getCategoryBreadcrumbs(categoryId: number | null): Promise<Category[]> {
  if (categoryId === null) return [];
  
  const allCategories = await getAllCategories();
  const breadcrumbs: Category[] = [];
  let currentCategoryId: number | null = categoryId;

  while (currentCategoryId !== null) {
    const categoryItem = allCategories.find(cat => cat.id === currentCategoryId);

    if (categoryItem) {
      breadcrumbs.unshift(categoryItem);
      currentCategoryId = categoryItem.parentId;
    } else {
      currentCategoryId = null;
    }
  }
  return breadcrumbs;
}

export async function getTopLevelCategories(): Promise<Category[]> {
  return getCategoriesByParentId(null);
}

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

export async function getCategoriesForSitemap(): Promise<{ path: string; }[]> {
  const allCategories = await getAllCategories();
  return allCategories
    .filter(cat => cat.path !== null)
    .map(cat => ({ path: cat.path! }))
    .sort((a, b) => a.path.localeCompare(b.path));
}

export const getCategories = getAllCategories;

// Bulk category lookup helper for better performance
export async function getCategoriesByPathsBulk(paths: string[]): Promise<Record<string, Category | null>> {
  const allCategories = await getAllCategories();
  const result: Record<string, Category | null> = {};
  
  for (const path of paths) {
    const category = allCategories.find(cat => cat.path === path);
    result[path] = category || null;
  }
  
  return result;
}