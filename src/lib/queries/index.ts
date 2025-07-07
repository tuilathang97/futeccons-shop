import {db} from "@/db/drizzle";
import { eq, and } from 'drizzle-orm';
import { postsTable } from "@/db/schema";
import { customUnstableCache } from '@/lib/cache';

export * from './categoryQueries';
export * from './postQueries';
export * from './articleQueries';
export * from './messageQueries';
export * from './paginateQuery';

export const getPostByCategoryPath = customUnstableCache(
    async (slug1?: string, slug2?: string, slug3?: string,) => {
        // Build paths for direct category lookup
        const paths = [];
        if (slug1) paths.push(`/${slug1}`);
        if (slug2) paths.push(`/${slug1}/${slug2}`);
        if (slug3) paths.push(`/${slug1}/${slug2}/${slug3}`);
        
        if (paths.length === 0) return null;

        // Use bulk category lookup for better performance
        const { getCategoriesByPathsBulk } = await import('./categoryQueries');
        const categoryMap = await getCategoriesByPathsBulk(paths);
        
        // Extract category IDs based on the provided slugs
        const categoryIds: Record<number, number> = {};
        const segmentsLength = [slug1, slug2, slug3].filter(Boolean).length;
        
        for (let i = 0; i < segmentsLength; i++) {
            const level = i + 1;
            const path = paths[i];
            const category = categoryMap[path];
            
            if (!category) {
                return null; // Invalid path
            }
            
            categoryIds[level] = category.id;
        }

        // Build optimized query conditions
        const postConditions = [eq(postsTable.active, true)];

        if (categoryIds[1]) {
            postConditions.push(eq(postsTable.level1Category, categoryIds[1]));
        }

        if (categoryIds[2]) {
            postConditions.push(eq(postsTable.level2Category, categoryIds[2]));
        }

        if (categoryIds[3]) {
            postConditions.push(eq(postsTable.level3Category, categoryIds[3]));
        }

        return await db.select()
            .from(postsTable)
            .where(and(...postConditions))
            .orderBy(postsTable.createdAt);
    },
    ['posts', 'category', 'path'],
    {
        tags: ['posts', 'posts:category', 'categories'],
        revalidate: 86400, // 24 hours
    }
);
