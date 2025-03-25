import React, { Suspense } from 'react'

import { ProductPostForm } from '@/components/post/ProductPostForm';
import GeneralInfoServer from '@/components/post/GeneralInfoServer';
import BasicInfoServer from '@/components/post/BasicInfoServer';
import PostInfo from '@/components/post/PostInfo';

async function PostPage() {
	return (
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
		</ProductPostForm>
	)
}

export default PostPage;