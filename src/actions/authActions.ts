'use server'
import db from "@/db/drizzle";
import { rolesTable, usersTable, usersToRoles } from "@/db/schema";
import { generateSessionToken, createSession, setSessionTokenCookie, invalidateSession, getCurrentSession, deleteSessionTokenCookie } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import * as argon2 from "argon2";
import { signInSchema, signUpSchema } from "@/components/signup/authSchema";
import { createPostToDb } from "@/lib/queries/categoryQueries";

export async function login(formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsedData = signInSchema.safeParse(data);
  if (parsedData.error || !parsedData.success) {
    return {
      message: "Đăng nhập không thành công"
    }
  }
  const { data: {password, email}} = parsedData;
  internalLogin(email, password);
  redirect("/signup");
}

async function internalLogin(email: string, password: string) {
  if (!email || !password) {
    return { message: "Người dùng không tồn tại"}
  }
  const [user] = await db.select().from(usersTable)
    .where(
      and(
        eq(usersTable.email, email),
      )).limit(1);

  if (!user) {
    return { message: "Người dùng không tồn tại"}
  }
  const valid = await argon2.verify(user.passwordHash, password);
  if (!valid) {
    return { message: "Email hoặc mật khẩu không đúng"}
  }

  const token = generateSessionToken();
  const session = await createSession(token, user.id);
  await setSessionTokenCookie(token, session.expiresAt);
}

export async function logout() {
  const { session } = await getCurrentSession();
  if (session) {
    invalidateSession(session?.id);
    deleteSessionTokenCookie();
    redirect('/');
  }
}

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




export async function signUp(formData: FormData) {
  console.log("dang dang ky")
  const data = Object.fromEntries(formData);
  const parsedData = signUpSchema.safeParse(data);
  if (parsedData.error || !parsedData.success) {
    return {
      message: "Lỗi tạo tài khoản"
    }
  }

  const { data: { email, fullName, password} } = parsedData;
  const hashedPassword = await argon2.hash(password, {
    type: argon2.argon2id,
    timeCost: 3,
    memoryCost: 4096,
    parallelism: 1,
    hashLength: 32,
  });

  let createdUserEmail, createdUserPassword;
  await db.transaction(async (tx) => {
    const [newUser] = await tx
      .insert(usersTable)
      .values({
        email,
        passwordHash: hashedPassword,
        fullName,
      })
      .returning();
    const [userRole] = await tx.select().from(rolesTable).where(eq(rolesTable.name, 'user')).limit(1);
    if (!userRole) {
      console.log("tao that bai")
      return { message: 'Tạo tài thất bại' }
    }
    await tx.insert(usersToRoles).values({
      userId: newUser.id,
      roleId: userRole.id,
    });
    createdUserEmail = email;
    createdUserPassword = password;
  });

  if (createdUserEmail && createdUserPassword) {
    console.log("tao tai khoan thanh cong, bât đầu đăng nhập");
    await internalLogin(createdUserEmail, createdUserPassword);
  }

  return { message: 'Tạo tài khoản thành công' }
}