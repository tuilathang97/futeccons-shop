'use server'

import { db } from '@/db/drizzle';
import { categories } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function createCategory(name: string, parentId: number | null, note: string | null) {
  await db.insert(categories).values({ name, parentId, note });
}

export async function getCategories() {
  return await db.select().from(categories);
}

export async function getCategoryById(id: number) {
  const result = await db.select().from(categories).where(eq(categories.id, id));
  return result[0];
}

export async function updateCategory(id: number, name: string, parentId: number | null, note: string | null) {
  await db.update(categories).set({ name, parentId, note }).where(eq(categories.id, id));
}

export async function deleteCategory(id: number) {
  await db.delete(categories).where(eq(categories.id, id));
}