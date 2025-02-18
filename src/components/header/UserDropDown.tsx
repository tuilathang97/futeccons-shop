"use client"
import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { LogOut, Settings, User2 } from "lucide-react"
import { User } from './Header'
import { logout } from '@/actions/authActions'

function UserDropdown({user}:{user:User}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className="relative h-8 w-8 rounded-full"
                >
                    {user.fullName?.charAt(0).toUpperCase()}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <User2 className="mr-2 h-4 w-4" />
                    <span>Thông tin cá nhân</span>
                </DropdownMenuItem>

                <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Cài đặt</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => logout()}
                    className="text-red-600 focus:text-red-600"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>
                        {/* {isLoading ? 'Đang đăng xuất...' : 'Đăng xuất'} */}
                        Đăng xuất
                    </span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserDropdown
