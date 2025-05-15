import { ActionResult } from "@/actions/postActions";
import { db } from "@/db/drizzle";
import { Image, postImagesTable, postsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createPostImages(image: Image) {
  try{
    await db.insert(postImagesTable).values(image);
    return {
      success: true,
      message: "Image created successfully"
    };
  }catch{
    return {
      success: false,
      message: "Image creation failed"
    }
  }
}

export async function getPosts() {
  return await db.select().from(postsTable);
}

export async function createPostToDb(postData: Omit<typeof postsTable.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const [result] = await db.insert(postsTable).values(postData).returning();
    return { 
      success: true,
      postId: result.id,
      message: "Post created successfully"
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Database error"
    };
  }
}

export async function getPostById(id: number) {
  const result = await db.select().from(postsTable).where(eq(postsTable.id, id));
  return result[0];
}

export async function savePostImageToDb(imageData: typeof postImagesTable.$inferInsert): Promise<ActionResult> {
  try {
    await db.insert(postImagesTable).values(imageData);
    return {
      success: true,
      message: "Image saved to database successfully"
    };
  } catch (error) {
    console.error("Failed to save image to database:", error);
    return {
      success: false,
      message: "Failed to save image to database"
    };
  }
}