import { db } from "@/db/drizzle";
import { postImagesTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getPostImageyById(id: number,getOne:boolean = false) {
  const result = await db.select().from(postImagesTable).where(eq(postImagesTable.postId, id));
  if(getOne) return result[0];
  return result;
}