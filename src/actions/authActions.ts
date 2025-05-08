'use server'
import { auth } from "@/lib/auth";
import { createPostToDb } from "@/lib/queries/categoryQueries";
import { headers } from "next/headers";

export async function createPost(prevState: any, formData: FormData) {
  try {
    const data = Object.fromEntries(formData);
    
    if(!data.userId){
      return {message: "Post failed : no user found"}
    }
    
    if (!data.giaTien) {
      throw Error("Missing required field: giaTien");
    }

    // formatMoney();
    const currency = data.giaTien as string;
    const number = Number(currency.replace(/[.,]/g, ''));
    data.giaTien = number as any;
    
    // 
    if(data.level1Category && data.level2Category && data.level3Category){
      (data.level1Category as any) = Number(data.level1Category);
      (data.level2Category as any) = Number(data.level2Category);
      (data.level3Category as any) = Number(data.level3Category);
    }
    
    createPostToDb(data);
    return {message: "Post created"}
  } catch (error) {
    return {message: "Post created" + error};
  }
}