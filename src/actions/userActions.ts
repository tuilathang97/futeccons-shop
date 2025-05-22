"use server"
import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

interface UpdateUserDataProps {
  name?: string;
  number?: string;
  image?: string;
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