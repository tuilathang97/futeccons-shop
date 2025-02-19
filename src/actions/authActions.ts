'use server'
import db from "@/db/drizzle";
import { rolesTable, usersTable, usersToRoles } from "@/db/schema";
import { generateSessionToken, createSession, setSessionTokenCookie, invalidateSession, getCurrentSession, deleteSessionTokenCookie } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import * as argon2 from "argon2";
import { signInSchema, signUpSchema } from "@/components/signup/authSchema";

export async function login(formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsedData = signInSchema.safeParse(data);
  if (parsedData.error || !parsedData.success) {
    return {
      message: "Đăng nhập không thành công"
    }
  }
  const { data: {password, email}} = parsedData;
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
  redirect("/signup");
}

export async function logout() {
  const { session } = await getCurrentSession();
  if (session) {
    invalidateSession(session?.id);
    deleteSessionTokenCookie();
    redirect('/');
  }
}

export async function signUp(formData: FormData) {
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
      return { message: 'Tạo tài thất bại' }
    }
    await tx.insert(usersToRoles).values({
      userId: newUser.id,
      roleId: userRole.id,
    });
  });
  return { message: 'Tạo tài khoản thành công' }
}