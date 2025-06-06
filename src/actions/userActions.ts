"use server"
import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUserId } from '@/lib/auth-utils';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { cloudinaryInstance } from "@/lib/cloudinary";
import { UploadApiResponse } from "cloudinary";

interface UpdateUserDataProps {
  name?: string;
  number?: string;
  image?: string;
}

interface ActionResult {
  success: boolean;
  message: string;
  data?: unknown;
}

async function uploadAvatarToCloudinary(imageFile: File): Promise<UploadApiResponse | null> {
  let tmpFilePath = '';
  
  try {
    const buffer = await imageFile.arrayBuffer();
    tmpFilePath = join(tmpdir(), `avatar_${Date.now()}_${imageFile.name}`);
    await writeFile(tmpFilePath, Buffer.from(buffer));

    const result = await cloudinaryInstance.uploader.upload(tmpFilePath, {
      folder: 'avatars',
      resource_type: 'image',
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    });
    
    return result;
  } catch (error) {
    console.error("Failed to upload avatar:", error);
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

export async function updateUserAvatar(formData: FormData): Promise<ActionResult> {
  try {
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return {
        success: false,
        message: 'Không tìm thấy thông tin người dùng.',
      };
    }

    const imageFile = formData.get('avatar') as File;
    
    if (!imageFile || imageFile.size === 0) {
      return {
        success: false,
        message: 'Không tìm thấy file ảnh.',
      };
    }

    // Validate image file
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(imageFile.type)) {
      return {
        success: false,
        message: 'Chỉ hỗ trợ các định dạng ảnh: JPEG, PNG, GIF, WebP',
      };
    }

    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    if (imageFile.size > maxSizeInBytes) {
      return {
        success: false,
        message: 'Kích thước ảnh không được vượt quá 5MB',
      };
    }

    // Upload to Cloudinary
    const uploadResult = await uploadAvatarToCloudinary(imageFile);
    
    if (!uploadResult) {
      return {
        success: false,
        message: 'Lỗi khi tải ảnh lên server.',
      };
    }

    // Update user avatar in database
    await db
      .update(user)
      .set({ 
        image: uploadResult.secure_url,
        updatedAt: new Date()
      })
      .where(eq(user.id, userId));

    return {
      success: true,
      message: 'Cập nhật ảnh đại diện thành công.',
      data: { imageUrl: uploadResult.secure_url },
    };
  } catch (error) {
    console.error('Update avatar error:', error);
    return {
      success: false,
      message: 'Cập nhật ảnh đại diện thất bại.',
    };
  }
}

export async function updateUser(userId: string, data: UpdateUserDataProps) {
  const { name, number, image } = data;
  if (!name && !number && !image || number?.length !== 10) {
    return {
      success: false,
      message: "Không có thông tin nào để cập nhật"
    }
  }
  try {
    // Có gì update đó, không có thì không update
    await db.update(user)
      .set({ name, number, image })
      .where(eq(user.id, userId));
    return {
      success: true,
      message: "Cập nhật thông tin người dùng thành công"
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Lỗi khi cập nhật thông tin người dùng"
    }
  }
}

export async function updateUserPhone(phoneNumber: string): Promise<ActionResult> {
  try {
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return {
        success: false,
        message: 'Không tìm thấy thông tin người dùng.',
      };
    }

    // Update user phone number in database
    await db
      .update(user)
      .set({ 
        number: phoneNumber,
        updatedAt: new Date()
      })
      .where(eq(user.id, userId));

    return {
      success: true,
      message: 'Cập nhật số điện thoại thành công.',
    };
  } catch (error) {
    console.error('Update phone error:', error);
    
    // Check for unique constraint violation
    if (error instanceof Error && error.message.includes('unique')) {
      return {
        success: false,
        message: 'Số điện thoại này đã được sử dụng.',
      };
    }

    return {
      success: false,
      message: 'Cập nhật số điện thoại thất bại.',
    };
  }
}

export async function createUserWithPhone(
  email: string,
  name: string,
  phoneNumber: string
): Promise<ActionResult> {
  try {
    // First check if user exists with this email
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (existingUser.length === 0) {
      return {
        success: false,
        message: 'Không tìm thấy người dùng.',
      };
    }

    const userId = existingUser[0].id;

    // Update the user with phone number
    await db
      .update(user)
      .set({ 
        number: phoneNumber,
        updatedAt: new Date()
      })
      .where(eq(user.id, userId));

    return {
      success: true,
      message: 'Tạo tài khoản thành công.',
      data: { userId },
    };
  } catch (error) {
    console.error('Create user with phone error:', error);
    
    // Check for unique constraint violation
    if (error instanceof Error && error.message.includes('unique')) {
      return {
        success: false,
        message: 'Số điện thoại này đã được sử dụng.',
      };
    }

    return {
      success: false,
      message: 'Tạo tài khoản thất bại.',
    };
  }
}