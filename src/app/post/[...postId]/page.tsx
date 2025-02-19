"use client"
import PostSectionWrapper from '@/components/postSectionWrapper'
import { postsData, RealEstateCardProps } from '@/db/Data'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React from 'react'
import Image from 'next/image';
import { Clock, LandPlot, MapPin, Phone, Toilet } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

function Page() {
    const { postId } = useParams()
    const foundPost = postsData.filter(p => p.id === postId?.toString());
    console.log(foundPost)
    return (
        <div className='max-w-[70rem] mx-auto'>
            {
                postId && foundPost.length > 0 ?
                    <div className='flex flex-col gap-4'>
                        <div className='grid grid-cols-12 gap-4 py-2'>
                            <div className='col-span-12 md:col-span-8 gap-4'>
                                <div className='flex flex-col gap-4'>
                                    {foundPost.map((post: RealEstateCardProps, index: number) => (
                                        <div key={index} className='flex flex-col gap-3'>
                                            <div className='rounded-md overflow-hidden'>
                                                <Image src={"/lorem.png"} width={1500} height={500} className='max-h-[25rem]' alt='picture'></Image>
                                            </div>
                                            <PostSectionWrapper>
                                                <div className='flex flex-col gap-4'>
                                                    <h1 className='font-semibold text-md md:text-xl lg:text-2xl'>{post.title}</h1>
                                                    <div>
                                                        <p className='text-lg font-medium text-red-500'>{post.price}</p>
                                                    </div>
                                                    <div className='flex flex-col gap-2'>
                                                        <p className='flex gap-2 items-center'> <span><MapPin size={16} /></span> {post.address} </p>
                                                        <p className='flex gap-2 items-center'> <span><Clock size={16} /></span> {post.datePost} </p>
                                                    </div>
                                                </div>
                                            </PostSectionWrapper>
                                            <PostSectionWrapper>
                                                <p>{post.description}</p>
                                            </PostSectionWrapper>
                                            <PostSectionWrapper>
                                                <div className='flex flex-col gap-4'>
                                                    <h2 className='font-semibold text-lg'>Thông tin cơ bản</h2>
                                                    <Separator className='w-full' />
                                                    <div className='grid grid-cols-2'>
                                                        <p className='flex gap-2 items-center'> <span><LandPlot size={16} /></span> {post.area} </p>
                                                        <p className='flex gap-2 items-center'> <span><Toilet size={16} /></span> {post.bathrooms} </p>
                                                    </div>
                                                </div>
                                            </PostSectionWrapper>
                                        </div>
                                    ))}
                                </div>
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
                                        <Button> Bấm để hiện số 00000000000 <Phone/></Button>
                                        {/* TODO : chức năng tắt hiện số điện thoại | schema của post |  */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    : <div>
                        No post found <Link href={"/"} className='text-red-500'>Click here to redirect home page</Link>
                    </div>
            }
        </div>
    )
}

export default Page