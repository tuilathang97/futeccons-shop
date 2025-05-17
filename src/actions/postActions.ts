'use server'
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { postsTable } from "@/db/schema";
import { cloudinaryInstance } from "@/lib/cloudinary";
import { UploadApiResponse } from "cloudinary";
import { createPostToDb, savePostImageToDb, approvePost, deletePost } from "@/lib/queries/postQueries";
import { isAdminUser, requireAdmin } from "@/lib/auth-utils";

export interface ActionResult {
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

function processCoordinates(value: string | number | null | undefined): number | null {
  if (value === undefined || value === null) return null;
  if (typeof value === 'string') return parseFloat(value);
  return value;
}

function preparePostImagesData(uploadResponse: UploadApiResponse, postId: number) {
  return {
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
    postId: postId
  };
}

async function processAndUploadImages(formData: FormData, imagesCount: number): Promise<UploadApiResponse[]> {
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

  return uploadedImageUrls;
}

function extractFormData(formData: FormData): Record<string, string> {
  const formDataEntries: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (!(value instanceof File)) {
      formDataEntries[key] = value as string;
    }
  }
  return formDataEntries;
}

function preparePostData(formDataEntries: Record<string, string>, userId: string, isAdmin: boolean): Omit<typeof postsTable.$inferInsert, 'id' | 'createdAt' | 'updatedAt'> {
  const latitude = processCoordinates(formDataEntries.latitude);
  const longitude = processCoordinates(formDataEntries.longitude);
  
  console.log("Processing post with latitude:", latitude, "longitude:", longitude);

  return {
    userId: userId,
    active: isAdmin ? true : (formDataEntries.active === 'true' || false),
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
    latitude: latitude as typeof postsTable.$inferInsert.latitude,
    longitude: longitude as typeof postsTable.$inferInsert.longitude,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createPost(prevState: any, formData: FormData): Promise<ActionResult> {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  
  const user = session?.user;
  const isAdmin = user ? await isAdminUser() : false;

  try {
    if (!user?.id) {
      return {
        success: false,
        message: "Post failed: no user found"
      };
    }
    
    const formDataEntries = extractFormData(formData);
    const imagesCount = Number(formDataEntries.imagesCount || 0);
    const uploadedImageUrls = await processAndUploadImages(formData, imagesCount);
    
    const postData = preparePostData(formDataEntries, user.id, isAdmin);
    const result = await createPostToDb(postData);
    
    if(result.postId && result.success && uploadedImageUrls.length > 0){
      for(let i = 0; i < uploadedImageUrls.length; i++){
        const uploadResponse = uploadedImageUrls[i];
        const imageData = preparePostImagesData(uploadResponse, result.postId);
        
        const saveResult = await savePostImageToDb(imageData);
        if (!saveResult.success) {
          return {
            success: false,
            message: "Đăng tải bài viết thất bại vì hình ảnh chưa được lưu trên đám mây"
          };
        }
      }
      
      return {
        success: true,
        message: "Đăng tải bài viết thành công"
      };
    }
    
    if (!result.success) {
      return {
        success: false,
        message: `Đăng tải bài viết thất bại: ${result.message}`
      };
    }
    
    return {
      success: true,
      message: "Đăng tải bài viết thành công"
    };
  } catch (error) {
    console.error("Đăng tải bài viết thất bại:", error);
    return {
      success: false,
      message: `Đăng tải bài viết thất bại: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

export async function approvePostAction(postId: number): Promise<ActionResult> {
  try {
    await requireAdmin();
    const result = await approvePost(postId);
    return result;
  } catch (error) {
    console.error("Phê duyệt bài viết thất bại:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Phê duyệt bài viết thất bại vì lỗi không xác định."
    };
  }
}

export async function deletePostAction(postId: number): Promise<ActionResult> {
  try {
    await requireAdmin();
    const result = await deletePost(postId);
    return result;
  } catch (error) {
    console.error("Xóa bài viết thất bại:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Xóa bài viết thất bại vì lỗi không xác định."
    };
  }
}