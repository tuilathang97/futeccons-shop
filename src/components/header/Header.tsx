"use client"
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowDownIcon, Home, Menu, SquarePen } from "lucide-react"
import { NavigationMenu } from "../ui/navigation-menu"
import SearchBar from "./SearchBar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { optionI, OPTIONS } from "@/app/post/page"
import RegisterButtonGroup from "./registerButtonGroup"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"


export default function Header() {
    return (
        <header className="fixed border-b-[0.1px] gap-4 border-gray-500 top-0 left-0 flex justify-between md:justify-around h-16 min-w-full shrink-0 items-center px-4 md:px-6">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="lg:hidden">
                        <SheetTitle><Menu className="h-6 w-6" /></SheetTitle>
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                {/* đây là mobile nav */}
                <SheetContent side="left">
                    <Link href="#" className="!max-w-8" prefetch={false}>
                        <Home className="h-6 w-6" />
                    </Link>
                    <div className="grid gap-2 py-6">
                        {OPTIONS.categories.map((category,index) => (
                            <Accordion key={index} type="single" collapsible className="w-full">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>{category.label}</AccordionTrigger>
                                    {category.options.map((option,index) => {
                                        {
                                            return (
                                                <AccordionContent key={index} className="pl-4">
                                                    <Link className="hover:underline" href={`${category.slug}${option.slug}`}>{option.label}</Link>
                                                </AccordionContent>
                                            )
                                        }
                                    })}
                                </AccordionItem>
                            </Accordion>

                        ))}
                    </div>
                </SheetContent>
            </Sheet>
            <Link href="#" className="mr-6 hidden lg:flex" prefetch={false}>
                <Home className="h-6 w-6" />
                <span className="sr-only">Futeccons</span>
            </Link>
            <NavigationMenu className="hidden lg:flex">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Link
                            href="#"
                            prefetch={false}
                        >
                            <Button variant={"outline"} className="flex gap-2">
                                <p>Danh mục</p>
                                <ArrowDownIcon size={16} />
                            </Button>
                        </Link>
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
            <div className="flex gap-4">
                <RegisterButtonGroup />
                <Link
                    href="/post"
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