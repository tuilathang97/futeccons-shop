import { z } from "zod";

// Popular email providers to prevent spam/temporary emails
const POPULAR_EMAIL_PROVIDERS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'icloud.com',
  'live.com',
  'msn.com',
  'aol.com',
  'zoho.com',
  'protonmail.com',
  'mail.com',
  'yandex.com',
  'tutanota.com',
] as const;

// Vietnamese phone number validation
const VIETNAM_PHONE_REGEX = /^(\+84|84|0)(3[2-9]|5[689]|7[06-9]|8[1-689]|9[0-46-9])[0-9]{7}$/;

// Enhanced password validation
const passwordSchema = z.string()
  .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự" })
  .max(128, { message: "Mật khẩu không được quá 128 ký tự" })
  .regex(/[a-z]/, { message: "Mật khẩu phải có ít nhất 1 chữ thường" })
  .regex(/[A-Z]/, { message: "Mật khẩu phải có ít nhất 1 chữ hoa" })
  .regex(/[0-9]/, { message: "Mật khẩu phải có ít nhất 1 số" })
  .regex(/[^a-zA-Z0-9]/, { message: "Mật khẩu phải có ít nhất 1 ký tự đặc biệt" });

// Email validation with popular provider check
const emailSchema = z.string()
  .min(1, { message: "Email không được để trống" })
  .email({ message: "Email không hợp lệ" })
  .refine((email) => {
    const domain = email.split('@')[1]?.toLowerCase();
    return domain && POPULAR_EMAIL_PROVIDERS.includes(domain as typeof POPULAR_EMAIL_PROVIDERS[number]);
  }, {
    message: "Vui lòng sử dụng email từ nhà cung cấp phổ biến (Gmail, Yahoo, Outlook, v.v.)"
  });

// Phone number validation
const phoneSchema = z.string()
  .min(1, { message: "Số điện thoại không được để trống" })
  .refine((phone) => {
    // Remove all non-digit characters for validation
    const cleanPhone = phone.replace(/\D/g, '');
    return VIETNAM_PHONE_REGEX.test(phone) || /^(\+84|84|0)[0-9]{9,10}$/.test(cleanPhone);
  }, {
    message: "Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam hợp lệ"
  });

// Sign in schema
export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: "Mật khẩu không được để trống" }),
});

// Sign up schema
export const signUpSchema = z.object({
  name: z.string()
    .min(2, { message: "Họ tên phải có ít nhất 2 ký tự" })
    .max(50, { message: "Họ tên không được quá 50 ký tự" })
    .regex(/^[a-zA-ZÀ-ỹ\s]+$/, { message: "Họ tên chỉ được chứa chữ cái và khoảng trắng" }),
  email: emailSchema,
  number: phoneSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

// Export types
export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;

// Export popular email providers for reference
export { POPULAR_EMAIL_PROVIDERS }; 