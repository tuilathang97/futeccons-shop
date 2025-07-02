"use client";

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { signUp, signIn } from '@/lib/auth-client';
import { useToast } from '@/hooks/use-toast';
import { signUpSchema, type SignUpFormData } from '@/lib/schemas/authSchemas';
import { createUserWithPhone, updateUserAvatar } from '@/actions/userActions';
import { validateImageFile } from '@/lib/utils/imageUtils';
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
import { 
	Eye, 
	EyeOff, 
	Mail, 
	Lock, 
	User, 
	Phone, 
	ArrowRight, 
	CheckCircle,
	AlertCircle,
	Building2,
	X,
	Camera
} from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Password strength indicator component
const PasswordStrengthIndicator = ({ password }: { password: string }) => {
	const requirements = [
		{ regex: /.{8,}/, text: 'Ít nhất 8 ký tự' },
		{ regex: /[a-z]/, text: 'Chữ thường (a-z)' },
		{ regex: /[A-Z]/, text: 'Chữ hoa (A-Z)' },
		{ regex: /[0-9]/, text: 'Số (0-9)' },
		{ regex: /[^a-zA-Z0-9]/, text: 'Ký tự đặc biệt (!@#$...)' },
	];

	return (
		<div className="space-y-2 mt-3">
			<p className="text-sm font-medium text-brand-darkest">Yêu cầu mật khẩu:</p>
			{requirements.map((req, index) => {
				const isValid = req.regex.test(password);
				return (
					<div key={index} className="flex items-center gap-2">
						{isValid ? (
							<CheckCircle className="h-4 w-4 text-green-500" />
						) : (
							<AlertCircle className="h-4 w-4 text-brand-light" />
						)}
						<span
							className={`text-xs ${
								isValid ? 'text-green-600' : 'text-brand-dark'
							}`}
						>
							{req.text}
						</span>
					</div>
				);
			})}
		</div>
	);
};

export default function SignUpPage() {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [avatarFile, setAvatarFile] = useState<File | null>(null);
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
	const { toast } = useToast();
	const router = useRouter();

	const form = useForm<SignUpFormData>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			name: '',
			email: '',
			number: '',
			password: '',
			confirmPassword: '',
		},
	});

	const watchedPassword = form.watch('password');
	const watchedName = form.watch('name');

	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const validation = validateImageFile(file);
			if (!validation.isValid) {
				toast({
					title: "Lỗi",
					description: validation.error,
					variant: "destructive",
				});
				return;
			}

			setAvatarFile(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setAvatarPreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const clearAvatar = () => {
		setAvatarFile(null);
		setAvatarPreview(null);
	};

	const onSubmit = async (values: SignUpFormData) => {
		startTransition(async () => {
			try {
				await signUp.email(
					{
						email: values.email,
						password: values.password,
						name: values.name,
					},
					{
						onRequest: () => {
							toast({
								title: 'Đang đăng ký...',
								description: 'Vui lòng đợi trong giây lát',
							});
						},
						onSuccess: async () => {
							try {
								const phoneResult = await createUserWithPhone(
									values.email,
									values.name,
									values.number
								);

								if (!phoneResult.success) {
									toast({
										variant: 'destructive',
										title: 'Cảnh báo',
										description: `${phoneResult.message} Tài khoản đã được tạo nhưng chưa có số điện thoại.`,
									});
								}

								// Sign in the user first
								await signIn.email({
									email: values.email,
									password: values.password,
									callbackURL: '/',
								});

								// Upload avatar if provided
								if (avatarFile) {
									try {
										const formData = new FormData();
										formData.append('avatar', avatarFile);
										const avatarResult = await updateUserAvatar(formData);
										
										if (!avatarResult.success) {
											console.warn('Avatar upload failed:', avatarResult.message);
											toast({
												title: 'Cảnh báo',
												description: 'Tài khoản đã được tạo nhưng không thể tải ảnh đại diện. Bạn có thể thêm sau.',
											});
										}
									} catch (avatarError) {
										console.error('Avatar upload error:', avatarError);
									}
								}

								toast({
									title: 'Đăng ký thành công',
									description: 'Chào mừng bạn đến với hệ thống!',
								});
								
								router.push('/');
							} catch (phoneError) {
								console.error('Phone update error:', phoneError);
								toast({
									title: 'Đăng ký thành công',
									description: 'Tài khoản đã được tạo. Bạn có thể cập nhật số điện thoại sau.',
								});
								
								await signIn.email({
									email: values.email,
									password: values.password,
									callbackURL: '/',
								});
								
								router.push('/');
							}
						},
						onError: (ctx) => {
							const errorMessage = ctx.error.message || 'Đăng ký thất bại';
							toast({
								variant: 'destructive',
								title: 'Đăng ký thất bại',
								description: errorMessage,
							});
						},
					}
				);
			} catch (error) {
				console.error('Sign up error:', error);
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
							Đăng ký tài khoản
						</CardTitle>
						<CardDescription className="text-brand-dark">
							Tạo tài khoản mới để bắt đầu sử dụng dịch vụ
						</CardDescription>
					</CardHeader>

					<CardContent>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
								{/* Avatar Upload - Optional */}
								<FormItem>
									<FormLabel className="text-brand-darkest font-medium">Ảnh đại diện (tùy chọn)</FormLabel>
									<FormControl>
										<div className="flex flex-col items-center gap-3">
											{avatarPreview ? (
												<div className="relative">
													<Avatar className="h-20 w-20">
														<AvatarImage src={avatarPreview} alt="Avatar preview" />
														<AvatarFallback>
															{watchedName?.charAt(0).toUpperCase() || 'U'}
														</AvatarFallback>
													</Avatar>
													<Button
														type="button"
														variant="ghost"
														size="sm"
														className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-100 hover:bg-red-200 p-0"
														onClick={clearAvatar}
													>
														<X className="h-3 w-3 text-red-600" />
													</Button>
												</div>
											) : (
												<div className="w-20 h-20 rounded-full bg-brand-light/20 flex items-center justify-center">
													<Camera className="h-8 w-8 text-brand-medium" />
												</div>
											)}
											<div className="w-full">
												<Input
													type="file"
													accept="image/*"
													onChange={handleAvatarChange}
													className="border-brand-light/50 focus:border-brand-medium focus:ring-brand-medium"
													disabled={isPending}
												/>
												<p className="text-xs text-brand-dark mt-1">
													Tối đa 5MB, định dạng: JPEG, PNG, GIF, WebP
												</p>
											</div>
										</div>
									</FormControl>
								</FormItem>

								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-brand-darkest font-medium">Họ và tên</FormLabel>
											<FormControl>
												<div className="relative">
													<User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-medium h-4 w-4" />
													<Input
														{...field}
														placeholder="Nhập họ và tên"
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
									name="number"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-brand-darkest font-medium">Số điện thoại</FormLabel>
											<FormControl>
												<div className="relative">
													<Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-medium h-4 w-4" />
													<Input
														{...field}
														type="tel"
														placeholder="0123456789"
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
											{/* Password strength indicator */}
											{watchedPassword && (
												<PasswordStrengthIndicator password={watchedPassword} />
											)}
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="confirmPassword"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-brand-darkest font-medium">Xác nhận mật khẩu</FormLabel>
											<FormControl>
												<div className="relative">
													<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-medium h-4 w-4" />
													<Input
														{...field}
														type={showConfirmPassword ? 'text' : 'password'}
														placeholder="Nhập lại mật khẩu"
														className="pl-10 pr-10 border-brand-light/50 focus:border-brand-medium focus:ring-brand-medium"
														disabled={isPending}
													/>
													<Button
														type="button"
														variant="ghost"
														size="sm"
														className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
														onClick={() => setShowConfirmPassword(!showConfirmPassword)}
														disabled={isPending}
													>
														{showConfirmPassword ? (
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
										'Đang đăng ký...'
									) : (
										<>
											Đăng ký tài khoản
											<ArrowRight className="ml-2 h-4 w-4" />
										</>
									)}
								</Button>
							</form>
						</Form>
					</CardContent>

					<CardFooter className="flex flex-col space-y-4 pt-0">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t border-brand-light" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-white px-2 text-brand-dark">
									Đã có tài khoản?
								</span>
							</div>
						</div>
						
						<Link 
							href="/dang-nhap" 
							className="w-full"
						>
							<Button 
								variant="outline" 
								className="w-full border-brand-medium text-brand-medium hover:bg-brand-light hover:text-brand-darkest transition-all duration-200"
							>
								Đăng nhập ngay
							</Button>
						</Link>
					</CardFooter>
				</Card>

				{/* Footer */}
				<div className="text-center text-sm text-brand-dark">
					<p>
						Bằng việc đăng ký, bạn đồng ý với{' '}
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