"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowDownIcon, Home, SquarePen } from "lucide-react"
import { NavigationMenu } from "../ui/navigation-menu"
import SearchBar from "./SearchBar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "../ui/dropdown-menu"
import UserActionGroup from "./userActionGroup"
import UserDropDown from "./UserDropDown"
import { useSession } from "@/contexts/SessionContext"
import MobileMenuToggle from "./MobileMenuToggle"
import { useCategories } from "@/contexts/CategoriesContext"

export default function Header() {
    const { categories } = useCategories()
    const level1Categories = categories.filter((category) => category.level === 1)
    const level2Categories = categories.filter((category) => category.level === 2)
    const level3Categories = categories.filter((category) => category.level === 3)
    const { user, session } = useSession()
    return (
        <header className="fixed max-w-7xl z-[50] gap-4 top-0 px-4 lg:px-8  md:top-8 left-0 flex  h-16 min-w-full items-center ">
            <nav className=" items-center px-4 bg-gray-100 shadow-xl gap-2 rounded-xl flex justify-between container border py-2 ">
                <div>
                <Link href="/" className="mr-6 hidden md:flex" prefetch={false}>
                    <Home className="h-6 w-6" />
                </Link>
                </div>
                <NavigationMenu className="hidden md:flex">
                    <DropdownMenu >
                        <DropdownMenuTrigger asChild>
                            <Button variant={"outline"} className="flex gap-2">
                                <p>Danh mục</p>
                                <ArrowDownIcon size={16} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 mt-2">
                            <DropdownMenuLabel className="text-lg font-bold">Bất Động Sản</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                {
                                    level1Categories.map((category, index) => {
                                        return (
                                            <DropdownMenuSub key={index}>
                                                <DropdownMenuSubTrigger className="min-h-12">
                                                    <Link href={category?.slug || ""}>
                                                        {category?.name}
                                                    </Link>
                                                </DropdownMenuSubTrigger>
                                                <DropdownMenuPortal>
                                                    <DropdownMenuSubContent>
                                                        {level2Categories.filter((option) => option.parentId === category.id).map((option, level2Index) => {
                                                            const level3s = level3Categories.filter((lv3) => lv3.parentId === option.id);
                                                            if (level3s.length > 0) {
                                                                return (
                                                                    <DropdownMenuSub key={level2Index}>
                                                                        <DropdownMenuSubTrigger className="min-h-12">
                                                                            <Link href={`${category.slug}${option.slug}`}>{option.name}</Link>
                                                                        </DropdownMenuSubTrigger>
                                                                        <DropdownMenuPortal>
                                                                            <DropdownMenuSubContent>
                                                                                {level3s.map((lv3, level3Index) => (
                                                                                    <DropdownMenuItem key={level3Index} className="min-h-10" >
                                                                                        <Link href={`${category.slug}${option.slug}${lv3.slug}`}>{lv3.name}</Link>
                                                                                    </DropdownMenuItem>
                                                                                ))}
                                                                            </DropdownMenuSubContent>
                                                                        </DropdownMenuPortal>
                                                                    </DropdownMenuSub>
                                                                );
                                                            } else {
                                                                return (
                                                                    <DropdownMenuItem key={level2Index} className="min-h-12">
                                                                        <Link className="min-h-12" href={`${category.slug}${option.slug}`}>{option.name}</Link>
                                                                    </DropdownMenuItem>
                                                                );
                                                            }
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
                <div className="flex gap-4 items-center min-w-full justify-between md:min-w-fit">
                    <div>
                        <div className="hidden md:flex">
                            {user?.id && session?.id ? (
                                <UserDropDown user={user} />
                            ) : <UserActionGroup />
                            }
                        </div>
                        <div className="flex md:hidden">
                            <MobileMenuToggle />
                        </div>
                    </div>
                    <Link
                        href="/post-page"
                    >
                        <Button variant={"destructive"} className="flex gap-2">
                            <p>Đăng tin</p>
                            <SquarePen size={16} />
                        </Button>
                    </Link>
                </div>
            </nav>
        </header>
    )
}