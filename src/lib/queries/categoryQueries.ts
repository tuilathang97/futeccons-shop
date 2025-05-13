'use server'

import { db } from '@/db/drizzle';
import { categoriesTable, postImagesTable, postsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function createCategory(name: string, parentId: number | null, level: any, slug: string, path: string, note: string = '') {
  await db.insert(categoriesTable).values({ name, parentId, level, note, path, slug });
}

export async function getCategories() {
  return await db.select().from(categoriesTable);
}

export async function getCategoryById(id: number) {
  const result = await db.select().from(categoriesTable).where(eq(categoriesTable.id, id));
  return result[0];
}

export async function getCategoryByPath(path: string) {
  const result = await db.select().from(categoriesTable).where(eq(categoriesTable.path, path));
  return result[0];
}
export async function getCategoryBySlug(slug: string) {
  const result = await db.select().from(categoriesTable).where(eq(categoriesTable.slug, slug));
  return result[0];
}

export async function updateCategory(id: number, name: string, parentId: number | null, note: string | null, slug: string | null, path: string | null) {
  await db.update(categoriesTable).set({ name, parentId, note, slug, path }).where(eq(categoriesTable.id, id));
}

export async function deleteCategory(id: number) {
  await db.delete(categoriesTable).where(eq(categoriesTable.id, id));
}