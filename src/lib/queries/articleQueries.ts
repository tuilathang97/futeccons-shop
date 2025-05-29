'use server'

import { db } from '@/db/drizzle';
import { articlesTable, categoriesTable } from '@/db/schema';
import { eq, and, isNull, desc } from 'drizzle-orm';
import { type NewArticle } from '@/db/schema';

export async function getArticles() {
  return await db.select().from(articlesTable);
}

export async function getArticlesWithCategoryInfo() {
  return await db.query.articlesTable.findMany({
    with: {
      level1Category: true,
      level2Category: true,
      level3Category: true,
      author: true
    },
    orderBy: [desc(articlesTable.updatedAt)]
  });
}

export async function getArticleById(id: number) {
  const result = await db.select().from(articlesTable).where(eq(articlesTable.id, id));
  return result[0];
}

export async function getArticleWithCategoryInfo(id: number) {
  return await db.query.articlesTable.findFirst({
    where: eq(articlesTable.id, id),
    with: {
      level1Category: true,
      level2Category: true,
      level3Category: true,
      author: true
    }
  });
}

export async function createArticle(article: NewArticle) {
  await db.insert(articlesTable).values(article);
}

export async function updateArticle(id: number, article: Partial<NewArticle>) {
  await db.update(articlesTable).set({
    ...article,
    updatedAt: new Date()
  }).where(eq(articlesTable.id, id));
}

export async function deleteArticle(id: number) {
  await db.delete(articlesTable).where(eq(articlesTable.id, id));
}

export async function getCategoriesWithArticleStatus() {
  const categories = await db.select().from(categoriesTable);
  
  const categoriesWithStatus = await Promise.all(
    categories.map(async (category) => {
      const query = db.select({ 
        id: articlesTable.id,
        updatedAt: articlesTable.updatedAt,
        status: articlesTable.status
      })
      .from(articlesTable)
      .where(
        category.level === 1 
          ? and(
              eq(articlesTable.level1CategoryId, category.id),
              isNull(articlesTable.level2CategoryId),
              isNull(articlesTable.level3CategoryId)
            )
          : category.level === 2
          ? and(
              eq(articlesTable.level2CategoryId, category.id),
              isNull(articlesTable.level3CategoryId)
            )
          : eq(articlesTable.level3CategoryId, category.id)
      )
      .orderBy(desc(articlesTable.updatedAt))
      .limit(1);

      const result = await query;
      const hasArticle = result.length > 0;
      
      return {
        ...category,
        hasArticle,
        articleStatus: hasArticle ? result[0].status : null,
        lastUpdated: hasArticle ? result[0].updatedAt : null,
        articleId: hasArticle ? result[0].id : null
      };
    })
  );
  
  return categoriesWithStatus;
}

export async function getPublishedArticleByParams(params: { 
  level1Slug?: string, 
  level2Slug?: string, 
  level3Slug?: string, 
  state?: string, 
  city?: string 
}) {
  // Get category IDs based on slugs
  let level1Id: number | undefined;
  let level2Id: number | undefined;
  let level3Id: number | undefined;
  
  if (params.level1Slug) {
    const level1Category = await db.select()
      .from(categoriesTable)
      .where(and(
        eq(categoriesTable.slug, params.level1Slug),
        eq(categoriesTable.level, 1)
      ));
    level1Id = level1Category[0]?.id;
  }
  
  if (params.level2Slug && level1Id) {
    const level2Category = await db.select()
      .from(categoriesTable)
      .where(and(
        eq(categoriesTable.slug, params.level2Slug),
        eq(categoriesTable.level, 2),
        eq(categoriesTable.parentId, level1Id)
      ));
    level2Id = level2Category[0]?.id;
  }
  
  if (params.level3Slug && level2Id) {
    const level3Category = await db.select()
      .from(categoriesTable)
      .where(and(
        eq(categoriesTable.slug, params.level3Slug),
        eq(categoriesTable.level, 3),
        eq(categoriesTable.parentId, level2Id)
      ));
    level3Id = level3Category[0]?.id;
  }
  
  // Early return if no matching categories
  if (!level1Id) return null;
  
  // Build query conditions
  let conditions: any[];
  
  if (level3Id) {
    conditions = [
      eq(articlesTable.level1CategoryId, level1Id),
      eq(articlesTable.level2CategoryId, level2Id),
      eq(articlesTable.level3CategoryId, level3Id)
    ];
  } else if (level2Id) {
    conditions = [
      eq(articlesTable.level1CategoryId, level1Id),
      eq(articlesTable.level2CategoryId, level2Id),
      isNull(articlesTable.level3CategoryId)
    ];
  } else {
    conditions = [
      eq(articlesTable.level1CategoryId, level1Id),
      isNull(articlesTable.level2CategoryId),
      isNull(articlesTable.level3CategoryId)
    ];
  }
  
  // Add published condition
  conditions.push(eq(articlesTable.status, 'published'));
  
  // Try with specific city and state
  if (params.city && params.state) {
    const cityStateArticle = await db.select()
      .from(articlesTable)
      .where(and(
        ...conditions,
        eq(articlesTable.targetState, params.state),
        eq(articlesTable.targetCity, params.city)
      ));
    
    if (cityStateArticle.length > 0) return cityStateArticle[0];
  }
  
  // Try with state only
  if (params.state) {
    const stateArticle = await db.select()
      .from(articlesTable)
      .where(and(
        ...conditions,
        eq(articlesTable.targetState, params.state),
        isNull(articlesTable.targetCity)
      ));
    
    if (stateArticle.length > 0) return stateArticle[0];
  }
  
  // Try with no location
  const generalArticle = await db.select()
    .from(articlesTable)
    .where(and(
      ...conditions,
      isNull(articlesTable.targetState),
      isNull(articlesTable.targetCity)
    ));
  
  return generalArticle.length > 0 ? generalArticle[0] : null;
} 