'use server'

import { db } from '@/db/drizzle';
import { categoriesTable, Category } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { cache } from 'react';

export async function createCategory(name: string, parentId: number | null, level: 1 | 2 | 3, slug: string, path: string, note: string = '') {
  await db.insert(categoriesTable).values({ name, parentId, level, note, path, slug });
}

export const getCategories = cache(async (): Promise<Category[]> => {
  console.log(`Executing DB query for getCategories`); // For debugging, remove in production

  return await db.select().from(categoriesTable);
})

export async function getCategoryById(id: number) {
  const result = await db.select().from(categoriesTable).where(eq(categoriesTable.id, id));
  return result[0];
}

export const getCategoryByPath = cache(async (path: string): Promise<Category | null> => {
  const result = await db.select().from(categoriesTable).where(eq(categoriesTable.path, path));
  return result[0] || null;
})

export async function getCategoryBySlug(slug: string) {
  const result = await db.select().from(categoriesTable).where(eq(categoriesTable.slug, `/${slug}`));
  return result[0];
}

export async function updateCategory(id: number, name: string, parentId: number | null, note: string | null, slug: string | null, path: string | null) {
  await db.update(categoriesTable).set({ name, parentId, note, slug, path }).where(eq(categoriesTable.id, id));
}

export async function deleteCategory(id: number) {
  await db.delete(categoriesTable).where(eq(categoriesTable.id, id));
}

/**
 * Validates if a category path exists and returns 404 if not.
 * More efficient than fetching all categories when we just need to validate a path.
 */
export async function validateCategoryPath(path: string): Promise<boolean> {
  const category = await getCategoryByPath(path);
  return category !== null && category !== undefined;
}