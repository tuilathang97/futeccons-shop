"use server"
import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUserId } from '@/lib/auth-utils';

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