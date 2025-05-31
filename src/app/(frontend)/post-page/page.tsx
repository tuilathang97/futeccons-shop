import React, { Suspense } from 'react'

import { ProductPostForm } from '@/components/post/ProductPostForm';
import GeneralInfoServer from '@/components/post/GeneralInfoServer';
import BasicInfoServer from '@/components/post/BasicInfoServer';
import PostInfo from '@/components/post/PostInfo';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { UploadForm } from '@/components/image-upload-form';
import { ImageUploadProvider } from '@/contexts/ImageUploadContext';
import LocationPickerServer from '@/components/post/LocationPickerServer';
import { redirect } from 'next/navigation';

async function PostPage() {
	const session = await auth.api.getSession({
    headers: await headers()
	})
	const currentSession = session?.session
	const user = session?.user

	if (!currentSession || !user) {
		return redirect(`/auth/sign-in?callbackUrl=${encodeURIComponent('/post-page')}`);
	}

	if (!user.number) {
		return redirect(`/account?reason=phone_required&callbackUrl=${encodeURIComponent('/post-page')}`);
	}

	return (
		<ImageUploadProvider>
			<ProductPostForm>
				<Suspense fallback={<div>Đang tải...</div>}>
					<GeneralInfoServer />
				</Suspense>
				<Suspense fallback={<div>Đang tải...</div>}>
					<BasicInfoServer />
				</Suspense>
				<Suspense fallback={<div>Đang tải...</div>}>
					<PostInfo />
				</Suspense>
				<Suspense fallback={<div>Đang tải bản đồ...</div>}>
					<LocationPickerServer />
				</Suspense>
				<Suspense>
					<UploadForm/>
				</Suspense>
			</ProductPostForm>
		</ImageUploadProvider>
	)
}

export default PostPage;