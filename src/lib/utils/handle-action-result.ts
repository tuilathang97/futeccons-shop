import { toast as sonnerToast } from 'sonner'; // Or your specific toast implementation

// Define a generic ActionResult interface if not already globally defined
interface ActionResult {
  success: boolean;
  message: string;
  data?: unknown; // Or a more specific type like T[]
}

// Define ToastProps if not already globally defined, tailor to your toast library
interface ToastProps {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success'; // Example variants
  [key: string]: unknown; // Allow other toast props
}

/**
 * Handles the result of a server action, displaying a toast message
 * and optionally calling a success callback.
 * @param result The result object from the server action.
 * @param toastFn The toast function to call (e.g., from useToast or sonner).
 * @param onSuccess Optional callback to execute on success.
 * @returns The data from the result if successful, otherwise undefined.
 */
export function handleActionResult<T>(
  result: ActionResult | null | undefined,
  toastFn: (props: ToastProps) => void, // Adjust if your toast function has a different signature
  onSuccess?: () => void
): T | undefined {
  if (!result) {
    toastFn({
      variant: "destructive",
      title: "Lỗi",
      description: "Đã có lỗi xảy ra. Vui lòng thử lại."
    });
    return undefined;
  }

  if (result.success) {
    toastFn({
      variant: "success",
      title: "Thành công", 
      description: result.message 
    });
    onSuccess?.();
    return result.data as T | undefined;
  } else {
    toastFn({
      variant: "destructive",
      title: "Lỗi",
      description: result.message || "Đã xảy ra lỗi không mong muốn."
    });
    return undefined;
  }
} 