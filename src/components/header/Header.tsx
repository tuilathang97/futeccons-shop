"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Home, SquarePen } from "lucide-react"
import UserActionGroup from "./userActionGroup"
import UserDropDown from "./UserDropDown"
import { useSession } from "@/contexts/SessionContext"
import MobileMenuToggle from "./MobileMenuToggle"
import HeaderNavigation from "./HeaderNavigation"   
import PageWrapper from "../PageWrapper"

export default function Header() {
    const { user, session } = useSession()
    return (
        <header className="fixed z-[50] gap-4 top-0 left-0 flex h-16 min-w-full ">
            <PageWrapper >
                <nav className="items-center px-8 gap-2 bg-gradient-to-br from-brand-light/30 backdrop-blur-2xl flex justify-between py-2 w-full ml-auto mr-auto">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="mr-6 hidden md:flex" prefetch={false}>
                            <Home className="h-6 w-6" />
                        </Link>
                        <HeaderNavigation />
                    </div>
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
            </PageWrapper>
        </header>
    )
}