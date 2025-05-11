"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowDownIcon, Home, SquarePen } from "lucide-react"
import { NavigationMenu } from "../ui/navigation-menu"
import SearchBar from "./SearchBar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { optionI, OPTIONS } from "@/app/(frontend)/posting/page"
import NavigationSubMenu from "./NavigationSubMenu"
import UserActionGroup from "./userActionGroup"
import UserDropDown from "./UserDropDown"
import { Session, User } from "@/db/schema"

export default function Header({ user, session }: { user: User, session: Session }) {
    return (
        <header className="fixed z-50 bg-gray-50 border-b-[0.1px] gap-4 border-gray-500 top-0 left-0 flex justify-between md:justify-around h-16 min-w-full shrink-0 items-center px-4 md:px-6">
            <NavigationSubMenu></NavigationSubMenu>
            <Link href="/" className="mr-6 hidden lg:flex" prefetch={false}>
                <Home className="h-6 w-6" />
                <span className="sr-only">Futeccons</span>
            </Link>
            <NavigationMenu className="hidden lg:flex">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={"outline"} className="flex gap-2">
                            <p>Danh mục</p>
                            <ArrowDownIcon size={16} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Bất Động Sản</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            {
                                OPTIONS.categories.map((category, index) => {
                                    return (
                                        <DropdownMenuSub key={index}>
                                            <DropdownMenuSubTrigger>
                                                <Link href={category.slug}>
                                                    {category.label}
                                                </Link>
                                            </DropdownMenuSubTrigger>
                                            <DropdownMenuPortal>
                                                <DropdownMenuSubContent>
                                                    {category.options.map((option: optionI, index: number) => {
                                                        return (
                                                            <DropdownMenuItem
                                                                key={`${index}`} // Key unique
                                                            >
                                                                <Link href={`${category.slug}${option.slug}`}>{option.label}</Link>
                                                            </DropdownMenuItem>
                                                        )
                                                    })}
                                                </DropdownMenuSubContent>
                                            </DropdownMenuPortal>
                                        </DropdownMenuSub>
                                    )
                                })
                            }
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </NavigationMenu>
            <SearchBar />
            <div className="flex gap-4 items-center">
                {user?.id && session?.id ? (
                    <UserDropDown user={user} />
                ) : <UserActionGroup />
                }
                <Link
                    href="/post-page"
                >
                    <Button variant={"destructive"} className="flex gap-2">
                        <p>Đăng tin</p>
                        <SquarePen size={16} />
                    </Button>
                </Link>
            </div>
        </header>
    )
}