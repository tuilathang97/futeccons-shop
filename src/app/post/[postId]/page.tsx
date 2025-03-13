// Remove the "use client" directive
import Link from 'next/link'
import React from 'react'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import PostDetail from '@/components/products/PostDetail'
import { Phone } from 'lucide-react'
import { getPostById } from '@/lib/queries/categoryQueries'

export default async function Page({ params }: { params: { postId: string[] } }) {
    const postId = await params.postId;
    const postFound = await getPostById(Number(postId))
    return (
        <div className='max-w-[70rem] mx-auto'>
            {
                postFound ?
                    <div className='flex flex-col gap-4'>
                        <div className='grid grid-cols-12 gap-4 py-2'>
                            <div className='col-span-12 md:col-span-8 gap-4'>
                                <PostDetail post={postFound}/>
                            </div>
                            <div className='col-span-12 md:col-span-4'>
                                <div className='h-[10rem] w-full rounded-md border border-gray-300 p-4'>
                                    <div className='flex flex-col gap-4'>
                                        <div className='flex gap-4'>
                                            <Avatar>
                                                <div className='flex'>
                                                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                                    <AvatarFallback>User</AvatarFallback>
                                                </div>
                                            </Avatar>
                                            <p>User Name</p>
                                        </div>
                                        <Separator className='w-full' />
                                        <Button> Bấm để hiện số 00000000000 <Phone /></Button>
                                    </div>
                                </div>
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
