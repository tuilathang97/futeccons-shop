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

export default async function Page({ params }: { params: Promise<{ postId: string[] }> }) {
    if (!params) return <div>Không tìm thấy bài viết</div>
    const { postId } = await params
    const numericPostId = Number(Array.isArray(postId) ? postId[0] : postId);

    if (isNaN(numericPostId)) {
        return <div>ID bài viết không hợp lệ</div>;
    }

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

    const jsonLdForPost = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": postForDetail.tieuDeBaiViet,
        "description": postForDetail.noiDung,
        "datePublished": postForDetail.createdAt,
        "url": `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/post/${numericPostId}`,
        "image": urlForJsonLd,
        "offers": {
            "@type": "Offer",
            "price": postForDetail.giaTien,
            "priceCurrency": "VND",
            "availability": "https://schema.org/InStock"
        },
        "brand": {
            "@type": "Organization",
            "name": "Fuland Shop"
        },
        "seller": {
            "@type": "Person",
            "name": postForDetail.user.name,
            "email": postForDetail.user.email,
            "telephone": postForDetail.user.number,
            "image": postForDetail.user.image
        }
    };


    const ownerUserForButton = postForDetail.user;
    const currentPath = `/post/${numericPostId}`;

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
                                isCurrentUserLoggedIn={!!currentUser}
                                loginUrl="/dang-nhap"
                                pageCallbackUrl={currentPath}
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
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLdForPost).replace(/</g, '\\u003c'),
                }}
            />
        </div>
    )
}
