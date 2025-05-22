import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import React, { useState } from 'react'
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
import { z } from "zod";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "@/lib/auth-client"
import { useToast } from "@/hooks/use-toast"


const loginFormSchema = z.object({
    email: z.string()
        .min(2, { message: "Tài khoản ko được dưới 2 ký tự" })
        .max(30)
        .email({ message: "Không phải email" }),
    password: z.string()
        .min(8, { message: "Mật khẩu ko được dưới 8 ký tự" })
})

function LoginHeaderForm() {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast()
    const form = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })
    const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
        try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append('email', values.email);
            formData.append('password', values.password);
            await signIn.email(
                {
                    email: values.email,
                    password: values.password,
                    callbackURL:"/"
                },
                {
                    onRequest: () => {
                        toast({
                            title: "Đang đăng nhập...",
                            description: "Vui lòng đợi..."
                        })
                    },
                    onSuccess: () => {
                        toast({
                            title: "Đăng nhập thành công",
                            description: "Bạn đã đăng nhập thành công"
                        })
                    },
                    onError: () => {
                        toast({
                            title: "Đăng nhập thất bại",
                            description: "Bạn đã đăng nhập thất bại"
                        })
                    }
                }
            );
        } catch (error) {
            console.error("Login failed:", error);
            form.setError("root", {
                type: "server",
                message: "Đăng nhập thất bại. Vui lòng thử lại."
            });
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">Đăng nhập</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='p-4 flex flex-col gap-2 min-w-[300px]'>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className='flex flex-col gap-2'>
                                                <Label htmlFor='header-username-input'>
                                                    Tên đăng nhập
                                                </Label>
                                                <Input
                                                    {...field}
                                                    id="header-username-input"
                                                    type='text'
                                                    placeholder='Input user name'
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
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className='flex flex-col gap-2'>
                                                <Label htmlFor='header-password-input'>
                                                    Mật khẩu
                                                </Label>
                                                <Input
                                                    {...field}
                                                    id="header-password-input"
                                                    type='password'
                                                    placeholder='Input password'
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
                            <div className='flex'>
                                <Button
                                    className="w-full"
                                    type="submit"
                                    variant="secondary"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default LoginHeaderForm
