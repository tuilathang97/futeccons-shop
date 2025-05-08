import { z } from "zod"

export const registerFormSchema = z.object({
    fullName: z.string()
        .min(2, { message: "Họ tên phải có ít nhất 2 ký tự" })
        .max(50, { message: "Họ tên không được quá 50 ký tự" }),
    email: z.string()
        .min(2, { message: "Email không được để trống" })
        .email({ message: "Email không hợp lệ" }),
    password: z.string()
        .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự" }),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
});

export type RegisterFormValues = z.infer<typeof registerFormSchema>;

// RegisterForm.tsx
import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function RegisterForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    const onSubmit = async (values: RegisterFormValues) => {
        try {
            setIsLoading(true)
            const formData = new FormData()
            Object.entries(values).forEach(([key, value]) => {
                formData.append(key, value)
            })
            // await signUp(formData)
            form.reset()
            setOpen(false)
        } catch (error) {
            console.error("Registration failed:", error)
            form.setError("root", {
                type: "server",
                message: "Đăng ký thất bại. Vui lòng thử lại.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">Đăng ký</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-4 flex flex-col gap-2 min-w-[350px]">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="flex flex-col gap-2">
                                                <Label htmlFor="fullName">Họ và tên</Label>
                                                <Input
                                                    {...field}
                                                    id="fullName"
                                                    placeholder="Nhập họ và tên"
                                                    disabled={isLoading}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Email field */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="flex flex-col gap-2">
                                                <Label htmlFor="email">Email</Label>
                                                <Input
                                                    {...field}
                                                    id="email"
                                                    type="email"
                                                    placeholder="Nhập email"
                                                    disabled={isLoading}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Password fields */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="flex flex-col gap-2">
                                                <Label htmlFor="password">Mật khẩu</Label>
                                                <Input
                                                    {...field}
                                                    id="password"
                                                    type="password"
                                                    placeholder="Nhập mật khẩu"
                                                    disabled={isLoading}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="flex flex-col gap-2">
                                                <Label htmlFor="confirmPassword">
                                                    Xác nhận mật khẩu
                                                </Label>
                                                <Input
                                                    {...field}
                                                    id="confirmPassword"
                                                    type="password"
                                                    placeholder="Xác nhận mật khẩu"
                                                    disabled={isLoading}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {form.formState.errors.root && (
                                <div className="text-red-500 text-sm">
                                    {form.formState.errors.root.message}
                                </div>
                            )}

                            <div className="flex">
                                <Button
                                    className="w-full"
                                    type="submit"
                                    variant="secondary"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Đang xử lý..." : "Đăng ký"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default RegisterForm