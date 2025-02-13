import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Mật khẩu không được bỏ trống"}),
});

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: "Mật khẩu phải có ít nhất 8 kí tự"}),
  fullName: z.string().min(1, { message: "Vui lòng nhập họ tên"}),
});