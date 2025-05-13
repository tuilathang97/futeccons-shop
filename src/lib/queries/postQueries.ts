import { db } from "@/db/drizzle";
import { postImagesTable, postsTable } from "@/db/schema";
import { UploadApiResponse } from "cloudinary";
import { eq } from "drizzle-orm";

export async function createPostImages(image: UploadApiResponse) {
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
    console.log(result.id)
    return { 
      success: true,
      postId: result.id,
      message: "Post created successfully"
    };
  } catch (error) {
    console.error("Failed to create post:", error);
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