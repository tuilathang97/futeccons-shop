// Remove the "use client" directive
import Link from 'next/link'
import React from 'react'
import PostDetail from '@/components/products/PostDetail'
import { getPostById } from '@/lib/queries/postQueries'
import { getPostImageyById } from '@/lib/queries/postImagesQueries'
import { getUserById } from '@/lib/queries/userQueries'
import UserSection from './UserSection'

export default async function Page({ params }: { params: { postId: string[] } }) {
    if (!params) return <div>Không tìm thấy bài viết</div>
    const { postId } = await params
    const postFound = await getPostById(Number(postId))
    const postImages = await getPostImageyById(Number(postId))
    const user = await getUserById(postFound.userId)
    if(!user) return <div>Không tìm thấy người dùng</div>
    return (
        <div className='container px-0 '>
            {
                postFound ?
                    <div className='flex flex-col gap-4'>
                        <div className='grid grid-cols-12 gap-4 py-2'>
                            <div className='col-span-12 md:col-span-8 gap-4'>
                                <PostDetail post={postFound} images={postImages} />
                            </div>
                            <div className='col-span-12 md:col-span-4'>
                                <UserSection user={user} />
                            </div>
                        </div>
                    </div>
                    : <div>
                        Không tìm thấy bài viết, <Link href={"/"} className='text-red-500'>ấn vào đây để quay về trang chủ</Link>
                    </div>
            }
        </div>
    )
}
