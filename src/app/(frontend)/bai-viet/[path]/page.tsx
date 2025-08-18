import Link from 'next/link'
import React from 'react'
import PostDetail from '@/components/products/PostDetail'
import { getPostDetailsById, type PostWithUserAndImages } from '@/lib/queries/postQueries'
import { getPostImageyById } from '@/lib/queries/postImagesQueries'
import PostSectionWrapper from '@/components/postSectionWrapper'
import { getServerSession, type UserSession } from '@/lib/auth-utils'
import ContactOwnerButton from '@/components/post/ContactOwnerButton'
import { type User as DbUser, type Image as DbImage } from '@/db/schema';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import RevealPhoneNumberButton from '@/components/post/RevealPhoneNumberButton'
import { getPostByPath } from '@/actions/postActions'

export default async function Page({ params }: { params: Promise<{ path: string }> }) {
    if (!params) return <div>Không tìm thấy bài viết</div>
    const { path } = await params
    const post = await getPostByPath(path)
    const {data, success} = post
    if(!success) {
        return <div className='container'>Không tìm thấy bài viết, <Link href={"/"} className='text-red-500'>Quay về trang chủ</Link></div>
    }
    const numericPostId = Number(data?.id)

    const [postResult, postImagesResult, session] = await Promise.all([
        getPostDetailsById(numericPostId),
        getPostImageyById(numericPostId),
        getServerSession() as Promise<UserSession | null>
    ]);
    let currentUser: DbUser | null = null;
    if (session?.user) {
        const sUser = session.user;
        currentUser = {
            id: sUser.id,
            name: sUser.name,
            email: sUser.email,
            number: sUser.number ?? "",
            emailVerified: sUser.emailVerified,
            image: sUser.image ?? "",
            createdAt: new Date(),
            updatedAt: new Date(),
            role: sUser.role ?? null,
            banned: sUser.banned ?? null,
            banReason: sUser.banReason ?? null,
            banExpires: sUser.banExpires ?? null,
            username: sUser.username ?? null,
            displayUsername: sUser.displayUsername ?? null,
        };
    }

    const postImagesForDetail: DbImage[] = Array.isArray(postImagesResult)
        ? postImagesResult
        : (postImagesResult ? [postImagesResult] : []);

    if (!postResult || !postResult.user) {
        return <div>Không tìm thấy thông tin bài viết hoặc chủ sở hữu. <Link href={"/"} className='text-red-500'>Quay về trang chủ</Link></div>;
    }

    const postForDetail: PostWithUserAndImages & { user: DbUser } = {
        ...postResult,
        user: postResult.user,
    };
    const urlForJsonLd = postImagesForDetail.map((image) => image.secureUrl);

    // Prepare post data for PropertySchema
    const postWithImages = {
        ...postForDetail,
        images: urlForJsonLd,
        createdAt: postForDetail.createdAt,
        giaTien: Number(postForDetail.giaTien),
        dienTichDat: Number(postForDetail.dienTichDat),
        user: {
            ...postForDetail.user,
            number: postForDetail.user.number || 'N/A'
        }
    };


    const ownerUserForButton = postForDetail.user;
    const currentPath = `/bai-viet/${path}`;

    return (
        <div className='container 2xl:px-0'>
            <div className='flex flex-col gap-4'>
                <div className='grid grid-cols-12 gap-4 py-2'>
                    <div className='col-span-12 md:col-span-8 gap-4'>
                        <PostDetail post={postForDetail} images={postImagesForDetail} />
                    </div>
                    <div className='col-span-12 md:col-span-4'>
                        <PostSectionWrapper className='flex flex-col gap-4'>
                            <div className='flex gap-4 items-center'>
                                <Avatar>
                                    <AvatarImage src={ownerUserForButton.image || "https://github.com/shadcn.png"} alt={ownerUserForButton.name || "User"} />
                                    <AvatarFallback>{ownerUserForButton.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                                </Avatar>
                                <p className="font-semibold">{ownerUserForButton.name || "Không có tên"}</p>
                            </div>
                            <Separator className='w-full' />
                            <RevealPhoneNumberButton
                                phoneNumber={ownerUserForButton.number}
                            />
                            <ContactOwnerButton
                                post={postForDetail}
                                currentUser={currentUser}
                                loginUrl="/dang-nhap"
                                pageCallbackUrl={currentPath}
                            />
                        </PostSectionWrapper>
                    </div>
                </div>
            </div>
            <PropertySchema post={postWithImages} />
        </div>
    )
}
