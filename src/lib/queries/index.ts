import {db} from "@/db/drizzle";
import { eq, ilike, or, and } from 'drizzle-orm';
import { categoriesTable, postsTable } from "@/db/schema";

export async function getPostByCategoryPath(slug1?: string, slug2?: string, slug3?: string,) {
    const path1 = `${slug1 ? '/' + slug1 : ''}`;
    const path2 = path1 + `${slug2 ? '/' + slug2 : ''}`
    const path3 = path2 + `${slug3 ? '/' + slug3 : ''}`

    const categories = await db.select()
        .from(categoriesTable)
        .where(or(
            path1 ? ilike(categoriesTable.path, path1) : undefined,
            path2 ? ilike(categoriesTable.path, path2) : undefined,
            path3 ? ilike(categoriesTable.path, path3) : undefined
        ));

    const categoryNameByLevel: Record<string, number> = {};
    for (const cat of categories) {
        categoryNameByLevel[cat.level] = cat.id;
    }

    const segmentsLength = [slug1, slug2, slug3].filter(Boolean).length;

    for (let i = 0; i < segmentsLength; i++) {
        const level = i + 1;
        if (!categoryNameByLevel[level]) {
            throw new Error(`Category not found for slug at level ${level}`);
        }
    }

    const postConditions = [];

    if (categoryNameByLevel[1]) {
        postConditions.push(eq(postsTable.level1Category, categoryNameByLevel[1]));
    }

    if (categoryNameByLevel[2]) {
        postConditions.push(eq(postsTable.level2Category, categoryNameByLevel[2]));
    }

    if (categoryNameByLevel[3]) {
        postConditions.push(eq(postsTable.level3Category, categoryNameByLevel[3]));
    }

    return await db.select()
        .from(postsTable)
        .where(and(...postConditions));
}
