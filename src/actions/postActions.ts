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
import { isAdminUser, requireAdmin, getServerSession } from "@/lib/auth-utils";
import { revalidateTag } from 'next/cache';
import { eq } from 'drizzle-orm';
import { db } from "@/db/drizzle";
import { revalidatePostNotifications } from './notificationActions';

export interface ActionResult {
  success: boolean;
  message: string;
  postId?: number;
}


async function uploadImageToCloudinary(imageFile: File): Promise<UploadApiResponse | null> {
  let tmpFilePath = '';
  
  try {
    const buffer = await imageFile.arrayBuffer();
    tmpFilePath = join(tmpdir(), `upload_${Date.now()}_${imageFile.name}`);
    await writeFile(tmpFilePath, Buffer.from(buffer));

    const result = await cloudinaryInstance.uploader.upload(tmpFilePath, {
      folder: 'posts',
      resource_type: 'image',
      quality: 'auto:good',
      fetch_format: 'auto',
      flags: 'progressive',
      transformation: [
        { width: 1200, height: 800, crop: 'limit' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
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
      
      // Revalidate post caches
      revalidateTag('posts');
      revalidateTag('posts:all');
      revalidateTag('posts:user');
      revalidateTag('posts:latest');
      
      if (postData.active) {
        revalidateTag('posts:published');
      } else {
        revalidateTag('posts:inactive');
      }
      
      // Revalidate notification counts if post needs approval
      if (!postData.active) {
        await revalidatePostNotifications();
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
    
    if (result.success) {
      // Revalidate both inactive and published posts caches
      revalidateTag('posts');
      revalidateTag('posts:inactive');
      revalidateTag('posts:published');
      revalidateTag(`post:dynamic`);
      
      // Revalidate notification counts
      await revalidatePostNotifications();
    }
    
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
    
    if (result.success) {
      // Revalidate all post-related caches
      revalidateTag('posts');
      revalidateTag('posts:all');
      revalidateTag('posts:user');
      revalidateTag('posts:published');
      revalidateTag('posts:inactive');
      revalidateTag('posts:count');
      revalidateTag('posts:category');
      revalidateTag(`post:dynamic`);
      
      // Revalidate notification counts
      await revalidatePostNotifications();
    }
    
    return result;
  } catch (error) {
    console.error("Xóa bài viết thất bại:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Xóa bài viết thất bại vì lỗi không xác định."
    };
  }
}

export async function updatePost(postId: number, formData: FormData): Promise<ActionResult> {
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return {
        success: false,
        message: "Bạn cần đăng nhập để thực hiện hành động này"
      };
    }

    const post = await db.query.postsTable.findFirst({
      where: eq(postsTable.id, postId),
    });

    if (!post) {
      return {
        success: false,
        message: "Bài viết không tồn tại"
      };
    }

    // Check if user is the post owner or an admin
    const isOwner = post.userId === session.user.id;
    const isAdmin = await isAdminUser();

    if (!isOwner && !isAdmin) {
      return {
        success: false,
        message: "Bạn không có quyền chỉnh sửa bài viết này"
      };
    }

    const rawData = Object.fromEntries(formData);
    
    // Update post data with correct properties based on schema
    const updatedData: Partial<typeof postsTable.$inferInsert> = {
      tieuDeBaiViet: String(rawData.tieuDeBaiViet || post.tieuDeBaiViet),
      noiDung: String(rawData.noiDung || post.noiDung),
      // For Decimal types, we need to ensure they're properly handled
      giaTien: rawData.giaTien ? String(rawData.giaTien) : post.giaTien?.toString(),
      dienTichDat: rawData.dienTichDat ? String(rawData.dienTichDat) : post.dienTichDat?.toString(),
      soPhongNgu: rawData.soPhongNgu ? Number(rawData.soPhongNgu) : post.soPhongNgu,
      soPhongVeSinh: rawData.soPhongVeSinh ? Number(rawData.soPhongVeSinh) : post.soPhongVeSinh,
      thanhPho: String(rawData.thanhPho || post.thanhPho),
      thanhPhoCodeName: String(rawData.thanhPhoCodeName || post.thanhPhoCodeName),
      quan: String(rawData.quan || post.quan),
      quanCodeName: String(rawData.quanCodeName || post.quanCodeName),
      phuong: String(rawData.phuong || post.phuong),
      phuongCodeName: String(rawData.phuongCodeName || post.phuongCodeName),
      duong: String(rawData.duong || post.duong),
      // latitude and longitude are decimal in the schema
      latitude: rawData.latitude ? String(rawData.latitude) : post.latitude?.toString(),
      longitude: rawData.longitude ? String(rawData.longitude) : post.longitude?.toString(),
      updatedAt: new Date()
    };

    await db.update(postsTable).set(updatedData).where(eq(postsTable.id, postId));
    
    // Add revalidation tags
    revalidateTag('posts');
    revalidateTag('post:dynamic');
    revalidateTag('posts:all');
    revalidateTag('posts:user');
    
    if (post.active) {
      revalidateTag('posts:published');
    } else {
      revalidateTag('posts:inactive');
    }
    
    return {
      success: true,
      message: "Bài viết đã được cập nhật"
    };
  } catch (error) {
    console.error("Error updating post:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Lỗi khi cập nhật bài viết"
    };
  }
}