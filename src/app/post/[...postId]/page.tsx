"use client"
import { postsData } from '@/db/Data'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React from 'react'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import PostDetail from '@/components/products/PostDetail'
import { Phone } from 'lucide-react'

function Page() {
    const { postId } = useParams()
    const foundPost = postsData.filter(p => p.id === postId?.toString());
    return (
        <div className='max-w-[70rem] mx-auto'>
            {
                postId && foundPost.length > 0 ?
                    <div className='flex flex-col gap-4'>
                        <div className='grid grid-cols-12 gap-4 py-2'>
                            <div className='col-span-12 md:col-span-8 gap-4'>
                                <PostDetail postId={postId?.toString()}/>
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
                                        {/* TODO : chức năng tắt hiện số điện thoại | schema của post |  */}
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

export default Page