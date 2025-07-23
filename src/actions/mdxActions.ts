'use server';

import { cloudinaryInstance } from "@/lib/cloudinary";
import { UploadApiResponse } from "cloudinary";
import { writeFile } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";

export interface ActionResult {
  success: boolean;
  message: string;
  data?: unknown;
}

async function uploadImageToCloudinary(imageFile: File): Promise<UploadApiResponse | null> {
  let tmpFilePath = '';
  
  try {
    const buffer = await imageFile.arrayBuffer();
    tmpFilePath = join(tmpdir(), `mdx_upload_${Date.now()}_${imageFile.name}`);
    await writeFile(tmpFilePath, Buffer.from(buffer));

    const result = await cloudinaryInstance.uploader.upload(tmpFilePath, {
      folder: 'mdx-pages',
      resource_type: 'image',
      quality: 'auto:good',
      fetch_format: 'auto',
      auto_tagging: 0.5,
      flags: 'progressive',
      transformation: [
        { width: 1200, height: 800, crop: 'limit' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    });

    return result;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return null;
  } finally {
    // Clean up temporary file
    if (tmpFilePath) {
      try {
        const { unlink } = await import('fs/promises');
        await unlink(tmpFilePath);
      } catch (error) {
        console.error('Error cleaning up temp file:', error);
      }
    }
  }
}

export async function uploadMdxImage(formData: FormData): Promise<ActionResult> {
  try {
    const imageFile = formData.get('image') as File;
    
    if (!imageFile || !imageFile.name) {
      return {
        success: false,
        message: 'Không có file ảnh được chọn'
      };
    }

    // Validate file type
    if (!imageFile.type.startsWith('image/')) {
      return {
        success: false,
        message: 'File phải là định dạng ảnh'
      };
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (imageFile.size > maxSize) {
      return {
        success: false,
        message: 'Kích thước file không được vượt quá 5MB'
      };
    }

    const uploadResult = await uploadImageToCloudinary(imageFile);

    if (!uploadResult) {
      return {
        success: false,
        message: 'Lỗi khi upload ảnh lên Cloudinary'
      };
    }

    return {
      success: true,
      message: 'Upload ảnh thành công',
      data: {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height
      }
    };

  } catch (error) {
    console.error('Upload image error:', error);
    return {
      success: false,
      message: 'Đã xảy ra lỗi khi upload ảnh'
    };
  }
}

export async function deleteMdxImage(publicId: string): Promise<ActionResult> {
  try {
    if (!publicId) {
      return {
        success: false,
        message: 'Không có publicId để xóa'
      };
    }

    const result = await cloudinaryInstance.uploader.destroy(publicId);

    if (result.result === 'ok') {
      return {
        success: true,
        message: 'Xóa ảnh thành công'
      };
    } else {
      return {
        success: false,
        message: 'Không thể xóa ảnh'
      };
    }

  } catch (error) {
    console.error('Delete image error:', error);
    return {
      success: false,
      message: 'Đã xảy ra lỗi khi xóa ảnh'
    };
  }
} 