"use client"
import React, { useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, Settings, User2 } from "lucide-react"
import { User } from '@/db/schema'
import Link from 'next/link'
import { signOut } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useSession } from '@/contexts/SessionContext'
import { useToast } from '@/hooks/use-toast'
import { Avatar, AvatarImage } from '../ui/avatar'


function UserDropdown({ user }: { user: User }) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { setSession, setUser } = useSession();
    const { toast } = useToast()
    if(!user) return <></>
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Avatar className="h-10 w-10 rounded-full cursor-pointer">
                <AvatarImage className="object-cover" src={user?.image || "https://picsum.photos/200/300"} alt={user.name || "User avatar"} />
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-12 md:mt-4 ml-12 " align="end">
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <User2 className="mr-2 h-4 w-4" />
                    <Link href={`/account`}>Thông tin cá nhân</Link>
                </DropdownMenuItem>

                <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Cài đặt</span>
                </DropdownMenuItem>

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
