'use server'
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { postImagesTable, postsTable } from "@/db/schema";
import { cloudinaryInstance } from "@/lib/cloudinary";
import { UploadApiResponse } from "cloudinary";
import { createPostImages, createPostToDb } from "@/lib/queries/postQueries";
import { db } from "@/db/drizzle";

interface ActionResult {
  success: boolean;
  message: string;
  data?: unknown;
}


async function uploadImageToCloudinary(imageFile: File): Promise<UploadApiResponse | null> {
  let tmpFilePath = '';
  
  try {
    const buffer = await imageFile.arrayBuffer();
    tmpFilePath = join(tmpdir(), `upload_${Date.now()}_${imageFile.name}`);
    await writeFile(tmpFilePath, Buffer.from(buffer));

    const result = await cloudinaryInstance.uploader.upload(tmpFilePath, {
      folder: 'posts',
      resource_type: 'image'
    });
    
    return result;
  } catch (error) {
    console.error("Failed to upload image:", error);
    return null;
  } finally {
    if (tmpFilePath) {
      try {
        await unlink(tmpFilePath);
      } catch (unlinkError) {
        console.error(`Failed to delete temporary file: ${tmpFilePath}`, unlinkError);
      }
    }
  }
}

function formatNumberValue(value: string): string {
  if (!value) return '0';
  return value.replace(/\./g, '').replace(',', '.');
}

export async function createPost(prevState: any, formData: FormData): Promise<ActionResult> {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  
  const user = session?.user;

  try {
    if (!user?.id) {
      return {
        success: false,
        message: "Post failed: no user found"
      };
    }
    
    const formDataEntries: Record<string, any> = {};
    for (const [key, value] of formData.entries()) {
      if (!(value instanceof File)) {
        formDataEntries[key] = value;
      }
    }

    const imagesCount = Number(formDataEntries.imagesCount || 0);
    const uploadedImageUrls: UploadApiResponse[] = [];

    for (let i = 0; i < imagesCount; i++) {
      const imageFile = formData.get(`image${i}`);
      if (imageFile instanceof File) {
        const imageUrl = await uploadImageToCloudinary(imageFile);
        if (imageUrl) {
          uploadedImageUrls.push(imageUrl);
        }
      }
    }
    
    const postData: Omit<typeof postsTable.$inferInsert, 'id' | 'createdAt' | 'updatedAt'> = {
      userId: user.id,
      active: formDataEntries.active === 'true' || false,
      level1Category: Number(formDataEntries.level1Category),
      level2Category: Number(formDataEntries.level2Category),
      level3Category: Number(formDataEntries.level3Category),
      path: formDataEntries.path || '',
      thanhPho: formDataEntries.thanhPho,
      thanhPhoCodeName: formDataEntries.thanhPhoCodeName,
      quan: formDataEntries.quan,
      tieuDeBaiViet: formDataEntries.tieuDeBaiViet,
      quanCodeName: formDataEntries.quanCodeName,
      phuong: formDataEntries.phuong,
      phuongCodeName: formDataEntries.phuongCodeName,
      duong: formDataEntries.duong,
      giaTien: formatNumberValue(formDataEntries.giaTien),
      dienTichDat: formatNumberValue(formDataEntries.dienTichDat),
      soTang: Number(formDataEntries.soTang),
      soPhongNgu: Number(formDataEntries.soPhongNgu),
      soPhongVeSinh: Number(formDataEntries.soPhongVeSinh),
      giayToPhapLy: formDataEntries.giayToPhapLy,
      loaiHinhNhaO: formDataEntries.loaiHinhNhaO,
      noiDung: formDataEntries.noiDung,
    };


    const result = await createPostToDb(postData);
    if(result.postId && result.success){
      // Map Cloudinary upload responses to our database schema
      for(let i = 0; i < uploadedImageUrls.length; i++){
        const uploadResponse = uploadedImageUrls[i];
        
        // Create image data with proper field mapping
        const imageData = {
          assetId: uploadResponse.asset_id,
          publicId: uploadResponse.public_id,
          version: uploadResponse.version,
          versionId: uploadResponse.version_id,
          signature: uploadResponse.signature,
          width: uploadResponse.width,
          height: uploadResponse.height,
          format: uploadResponse.format,
          resourceType: uploadResponse.resource_type,
          createdAt: new Date(),
          tags: uploadResponse.tags || [],
          bytes: uploadResponse.bytes,
          type: uploadResponse.type,
          etag: uploadResponse.etag,
          placeholder: false,
          displayName: uploadResponse.display_name,
          url: uploadResponse.url,
          secureUrl: uploadResponse.secure_url,
          assetFolder: 'posts',
          originalFilename: uploadResponse.original_filename,
          postId: result.postId
        };
        
        try {
          await db.insert(postImagesTable).values(imageData)
          return {
            success:true,
            message: "Đăng tải bài viết thành công "
          }
        } catch (error) {
          console.error("Failed to save image to database:", error);
          return {
            success: false,
            message: "Đăng tải bài viết thất bại vì hình ảnh chưa được lưu trên đám mây"
          }
        }
      }
    }
    if (!result.success) {
      return {
        success: false,
        message: `Post creation failed: ${result.message}`
      };
    }
    
    return {
      success: true,
      message: "Post created successfully with images"
    };
  } catch (error) {
    console.error("Post creation error:", error);
    return {
      success: false,
      message: `Post creation failed: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}