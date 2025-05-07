import React, { Suspense } from 'react'

import { ProductPostForm } from '@/components/post/ProductPostForm';
import GeneralInfoServer from '@/components/post/GeneralInfoServer';
import BasicInfoServer from '@/components/post/BasicInfoServer';
import PostInfo from '@/components/post/PostInfo';
import { getCurrentSession } from '@/lib/auth';

async function PostPage() {
		const {user} = await getCurrentSession()
	
	return (
		user ?
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
		</ProductPostForm> : <ProductPostForm>No user found, please try again </ProductPostForm>
	)
}

export default PostPage;