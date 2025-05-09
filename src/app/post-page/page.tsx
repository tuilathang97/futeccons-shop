import React, { Suspense } from 'react'

import { ProductPostForm } from '@/components/post/ProductPostForm';
import GeneralInfoServer from '@/components/post/GeneralInfoServer';
import BasicInfoServer from '@/components/post/BasicInfoServer';
import PostInfo from '@/components/post/PostInfo';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';



async function PostPage() {
	const session = await auth.api.getSession({
    headers: await headers()
	})
	const currentSection = session?.session
	const user = session?.user
	if(currentSection && user){
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
	return <>No user or session found</>
}

export default PostPage;