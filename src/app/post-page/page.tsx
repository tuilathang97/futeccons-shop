import React, { Suspense } from 'react'

import { ProductPostForm } from '@/components/post/ProductPostForm';
import GeneralInfoServer from '@/components/post/GeneralInfoServer';
import BasicInfoServer from '@/components/post/BasicInfoServer';

async function PostPage() {
	return (
		<ProductPostForm>
			<Suspense fallback={<div>Đang tải...</div>}>
				<GeneralInfoServer />
			</Suspense>
			<Suspense fallback={<div>Đang tải...</div>}>
				<BasicInfoServer />
			</Suspense>
		</ProductPostForm>
	)
}

export default PostPage;