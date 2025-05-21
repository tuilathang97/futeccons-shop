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
import Image from 'next/image'
import Link from 'next/link'
import { signOut } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'


function UserDropdown({ user }: { user: User }) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {user.image ?
                    <Image className={"rounded-full w-10 h-10 border border-gray-900/10 cursor-pointer "} src={user?.image} height={50} width={50} alt={user.name}></Image>
                    : <User2 strokeWidth={1} className="mr-2 h-8 w-8 border border-gray-900 cursor-pointer rounded-full" />}
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
                    router.push('/')
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
