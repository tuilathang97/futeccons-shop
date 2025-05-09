'use server'
import { auth } from "@/lib/auth";
import { createPostToDb } from "@/lib/queries/categoryQueries";
import { headers } from "next/headers";

export async function createPost(prevState: any, formData: FormData) {
  const session = await auth.api.getSession({
      headers: await headers()
    })
    const currentSection = session?.session
    const user = session?.user
  if(currentSection && user)
  try {
    const data = Object.fromEntries(formData);
    
    if(!data.userId){
      return {message: "Post failed : no user found"}
    } 
    if(data.level1Category && data.level2Category && data.level3Category){
      (data.level1Category) = Number(data.level1Category);
      (data.level2Category) = Number(data.level2Category);
      (data.level3Category) = Number(data.level3Category);
    }
    
    createPostToDb(data);
    return {message: "Post created"}
  } catch (error) {
    return {message: "Post created" + error};
  }
}