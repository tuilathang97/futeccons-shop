import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod";
import { type Category } from "@/db/schema";
import { type ToastActionElement } from "@/components/ui/toast";

export interface ToastProps {
  title?: string;
  description: string;
  variant?: "default" | "destructive";
  action?: ToastActionElement;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function numberEnum<T extends number>(values: readonly T[]) {
  const set = new Set<unknown>(values);
  return (v: number, ctx: z.RefinementCtx): v is T => {
    if (!set.has(v)) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_enum_value,
        received: v,
        options: [...values]
      });
    }
    return z.NEVER;
  };
}

export function hasValue(arg0: string): boolean {
  return Boolean(arg0) ? true : false;
}

// Category utility functions
export function formatPath(path: string | null) {
  if (!path) return null;
  return path.startsWith('/') ? path : `/${path}`;
}

export function getParentCategories(categories: Category[]) {
  return categories.filter(c => c.level === 1 || c.level === 2);
}

// Action result utility function
export function handleActionResult(
  result: { success: boolean; message: string; data?: any },
  toast: (props: { title: string; description: string; variant?: "default" | "destructive" }) => void,
  onSuccess?: () => void
): any | undefined {
  if (result.success) {
    toast({ title: "Thành công", description: result.message });
    onSuccess?.();
    return result.data;
  } else {
    toast({
      variant: "destructive",
      title: "Lỗi",
      description: result.message || "Đã xảy ra lỗi"
    });
  }
  return result.data;
}


// Date utility functions
export function formatDate(date: Date | string | number, locale: string = 'vi-VN'): string {
  try {
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    return dateObj.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
}
