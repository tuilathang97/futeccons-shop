"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Home, SquarePen } from "lucide-react"
import UserActionGroup from "./userActionGroup"
import UserDropDown from "./UserDropDown"
import { useSession } from "@/contexts/SessionContext"
import MobileMenuToggle from "./MobileMenuToggle"
import HeaderNavigation from "./HeaderNavigation"   
import HeaderSearchDialog from "./HeaderSearchDialog"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function Header() {
    const { user, session } = useSession()
    const router = useRouter()
    const handleDirect = () => {
        if (user?.id && session?.id) {
            router.push("/dang-tin")
        } else {
            router.push("/dang-nhap")
        }
    }

    return (
        <header className="fixed z-[50] gap-4 top-0 left-0 flex h-16 min-w-full bg-white/10 backdrop-blur-2xl ">
            <div className="container 2xl:px-0">
                <nav className="items-center gap-2 flex justify-between py-2 w-full ml-auto mr-auto">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="mr-6 hidden md:flex" prefetch={false}>
                            <Image src="/logo.svg" alt="logo" width={50} height={50} priority />
                        </Link>
                        <HeaderNavigation />
                    </div>
                    <div className="flex gap-4 items-center min-w-full justify-between md:min-w-fit">
                        <div className="hidden lg:flex">
                            <HeaderSearchDialog />
                        </div>
                        <div >
                            <div className="hidden md:flex">
                                {user?.id && session?.id ? (
                                    <UserDropDown />
                                ) : <UserActionGroup />
                            }
                            
                            </div>
                            
                            <div className="flex md:hidden">
                                <MobileMenuToggle />
                            </div>
                        </div>
                        <Link href="/" prefetch={false} className="md:hidden">
                            <Image src="/logo.svg" alt="logo" width={50} height={50} priority />
                        </Link>
                        <Button className="flex gap-2 bg-brand-medium text-white" onClick={handleDirect}>
                            <p>Đăng tin</p>
                            <SquarePen size={16} />
                        </Button>
                    </div>
                </nav>
            </div>
        </header>
    )
}