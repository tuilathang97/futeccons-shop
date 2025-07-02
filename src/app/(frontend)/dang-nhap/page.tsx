"use client"

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth-client';
import { useToast } from '@/hooks/use-toast';
import { signInSchema, type SignInFormData } from '@/lib/schemas/authSchemas';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: SignInFormData) => {
    startTransition(async () => {
      try {
        await signIn.email(
          {
            email: values.email,
            password: values.password,
            callbackURL: '/',
          },
          {
            onRequest: () => {
              toast({
                title: 'Đang đăng nhập...',
                description: 'Vui lòng đợi trong giây lát',
              });
            },
            onSuccess: () => {
              toast({
                title: 'Đăng nhập thành công',
                description: 'Chào mừng bạn quay trở lại!',
              });
              router.push('/');
            },
            onError: (ctx) => {
              const errorMessage = ctx.error.message || 'Đăng nhập thất bại';
              toast({
                variant: 'destructive',
                title: 'Đăng nhập thất bại',
                description: errorMessage,
              });
            },
          }
        );
      } catch (error) {
        console.error('Sign in error:', error);
        toast({
          variant: 'destructive',
          title: 'Đã xảy ra lỗi',
          description: 'Vui lòng thử lại sau',
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light/30 to-white py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        {/* Brand Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-brand-medium rounded-full shadow-lg">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-brand-darkest mb-2">
            Futeccons Shop
          </h1>
          <p className="text-brand-dark">
            Nền tảng bất động sản hàng đầu
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center pb-6">
            <CardTitle className="text-2xl font-bold text-brand-darkest">
              Đăng nhập
            </CardTitle>
            <CardDescription className="text-brand-dark">
              Đăng nhập vào tài khoản của bạn để tiếp tục
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-brand-darkest font-medium">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-medium h-4 w-4" />
                          <Input
                            {...field}
                            type="email"
                            placeholder="example@gmail.com"
                            className="pl-10 border-brand-light/50 focus:border-brand-medium focus:ring-brand-medium"
                            disabled={isPending}
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
                      <FormLabel className="text-brand-darkest font-medium">Mật khẩu</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-medium h-4 w-4" />
                          <Input
                            {...field}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Nhập mật khẩu"
                            className="pl-10 pr-10 border-brand-light/50 focus:border-brand-medium focus:ring-brand-medium"
                            disabled={isPending}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isPending}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-brand-medium" />
                            ) : (
                              <Eye className="h-4 w-4 text-brand-medium" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.formState.errors.root && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {form.formState.errors.root.message}
                    </AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-brand-medium hover:bg-brand-dark text-white font-medium py-6 shadow-lg transition-all duration-200 hover:shadow-xl" 
                  disabled={isPending}
                >
                  {isPending ? (
                    'Đang đăng nhập...'
                  ) : (
                    <>
                      Đăng nhập
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-0">
            <div className="text-sm text-center text-brand-dark">
              <Link 
                href="/auth/forgot-password" 
                className="font-medium text-brand-medium hover:text-brand-dark transition-colors"
              >
                Quên mật khẩu?
              </Link>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-brand-light" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-brand-dark">
                  Chưa có tài khoản?
                </span>
              </div>
            </div>
            
            <Link 
              href="/dang-ky" 
              className="w-full"
            >
              <Button 
                variant="outline" 
                className="w-full border-brand-medium text-brand-medium hover:bg-brand-light hover:text-brand-darkest transition-all duration-200"
              >
                Đăng ký ngay
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-brand-dark">
          <p>
            Bằng việc đăng nhập, bạn đồng ý với{' '}
            <Link href="/terms" className="text-brand-medium hover:text-brand-dark underline">
              Điều khoản dịch vụ
            </Link>{' '}
            và{' '}
            <Link href="/privacy" className="text-brand-medium hover:text-brand-dark underline">
              Chính sách bảo mật
            </Link>{' '}
            của chúng tôi.
          </p>
        </div>
      </div>
    </div>
  );
}