"use client"
import React, { useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User2, MessageCircle, CheckCircle2, HousePlus } from "lucide-react"
import Link from 'next/link'
import { signOut } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useSession } from '@/contexts/SessionContext'
import { useToast } from '@/hooks/use-toast'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { NotificationBadge } from '../ui/notification-badge'
import { useNotificationCounts } from '@/hooks/useNotificationCounts'


function UserDropdown() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { setSession, setUser, user } = useSession();
    const { toast } = useToast()

    const isAdmin = user?.role === 'admin';

    const { counts } = useNotificationCounts({
        enabled: true,
        intervalMs: 30000,
    });

    const hasNotifications = counts.unreadMessages > 0 || (isAdmin && counts.pendingPosts > 0);

    if (!user) return <></>

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="relative">
                    <Avatar aria-label="user-avatar" className="h-10 w-10 rounded-full cursor-pointer">
                        <AvatarImage className="object-cover" src={user?.image || "/lorem.png"} alt={user.name || "User avatar"} />
                        <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    {hasNotifications && (
                        <div className="absolute -top-1 -right-1 h-4 w-4 bg-brand-medium border-2 border-white rounded-full flex items-center justify-center">
                            <div className="h-2 w-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                    )}
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-12 md:mt-4 ml-12 " align="end">
                {isAdmin && (
                    <DropdownMenuItem>
                        <HousePlus className="mr-2 h-4 w-4" />
                        <Link href={`/admin/category`} className="flex items-center justify-between w-full">
                            <span>Trang chủ quản trị viên </span>
                        </Link>
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                    <User2 className="mr-2 h-4 w-4" />
                    <Link href={`/account`}>Thông tin cá nhân</Link>
                </DropdownMenuItem>

                <DropdownMenuItem>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    <Link href={`/account/messages`} className="flex items-center justify-between w-full">
                        <span>Tin nhắn</span>
                        <NotificationBadge count={counts.unreadMessages} className="ml-2" />
                    </Link>
                </DropdownMenuItem>

                {isAdmin && (
                    <DropdownMenuItem>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        <Link href={`/admin/posts-management`} className="flex items-center justify-between w-full">
                            <span>Duyệt bài đăng</span>
                            <NotificationBadge count={counts.pendingPosts} className="ml-2" />
                        </Link>
                    </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => {
                    setIsLoading(true)
                    signOut()
                    setTimeout(() => {
                        setSession(null)
                        setUser(null)
                        toast({
                            title: "Đăng xuất thành công",
                            description: "Bạn đã đăng xuất thành công"
                        })
                        router.push('/')
                    }, 500)
                }}
                    className="text-red-600 focus:text-red-600"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>
                        {isLoading ? 'Đang đăng xuất...' : 'Đăng xuất'}
                    </span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserDropdown
