import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { AlignJustify, LogOut, Home, User, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useCategories } from '@/contexts/CategoriesContext'
import { useSession } from '@/contexts/SessionContext'
import { useRouter } from 'next/navigation'
import UserActionGroup from './userActionGroup'
import { signOut } from '@/lib/auth-client'

export default function MobileMenuToggle() {
  const { categories } = useCategories()
  const { user, setSession, setUser } = useSession()
  const router = useRouter()

  const level1 = categories.filter(c => c.level === 1)
  const level2 = categories.filter(c => c.level === 2)
  const level3 = categories.filter(c => c.level === 3)

  const [openLv1, setOpenLv1] = useState<Record<string, boolean>>({})
  const [openLv2, setOpenLv2] = useState<Record<string, boolean>>({})

  const toggleLv1 = (id: string) => setOpenLv1(prev => ({ ...prev, [id]: !prev[id] }))
  const toggleLv2 = (id: string) => setOpenLv2(prev => ({ ...prev, [id]: !prev[id] }))

  const renderCategories = () => (
    <ul className="pl-0">
      {level1.map(lv1 => {
        const lv2s = level2.filter(lv2 => lv2.parentId === lv1.id)
        const isOpenLv1 = openLv1[lv1.id]
        return (
          <li key={lv1.id} className="mb-1">
            <div className="flex items-center">
              <button
                type="button"
                className="flex-1 text-left font-semibold tracking-wide py-2 px-3 rounded hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
                onClick={() => lv2s.length ? toggleLv1(lv1.id.toString()) : router.push(lv1.slug || '/')}
                aria-expanded={!!isOpenLv1}
              >
                <span className="text-base text-gray-800">{lv1.name}</span>
              </button>
              {lv2s.length > 0 && (
                <button
                  type="button"
                  className={`ml-1 p-1 transition-transform ${isOpenLv1 ? 'rotate-90' : ''}`}
                  onClick={() => toggleLv1(lv1.id.toString())}
                  aria-label={isOpenLv1 ? 'Thu gọn' : 'Mở rộng'}
                  tabIndex={-1}
                >
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
            <div
              className={`transition-all duration-200 overflow-hidden ${isOpenLv1 ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <ul className="pl-4">
                {lv2s.map(lv2 => {
                  const lv3s = level3.filter(lv3 => lv3.parentId === lv2.id)
                  const isOpenLv2 = openLv2[lv2.id]
                  return (
                    <li key={lv2.id} className="mb-1 mt-2">
                      <div className="flex items-center">
                        <button
                          type="button"
                          className="flex-1 text-left font-medium tracking-wide py-1.5 px-3 rounded hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 text-gray-700"
                          onClick={() => lv3s.length ? toggleLv2(lv2.id.toString()) : router.push(`${lv1.slug}${lv2.slug}`)}
                          aria-expanded={!!isOpenLv2}
                        >
                          <span className="text-sm">{lv2.name}</span>
                        </button>
                        {lv3s.length > 0 && (
                          <button
                            type="button"
                            className={`ml-1 p-1 transition-transform ${isOpenLv2 ? 'rotate-90' : ''}`}
                            onClick={() => toggleLv2(lv2.id.toString())}
                            aria-label={isOpenLv2 ? 'Thu gọn' : 'Mở rộng'}
                            tabIndex={-1}
                          >
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          </button>
                        )}
                      </div>
                      <div
                        className={`transition-all duration-200 overflow-hidden ${isOpenLv2 ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                      >
                        <ul className="pl-4">
                          {lv3s.map(lv3 => (
                            <li key={lv3.id} className='mt-2'>
                              <button
                                type="button"
                                className="block w-full text-left py-1 px-3 rounded hover:bg-gray-100 text-gray-600 text-sm transition-colors"
                                onClick={() => router.push(`${lv1.slug}${lv2.slug}${lv3.slug}`)}
                              >
                                {lv3.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </li>
        )
      })}
    </ul>
  )

  const handleLogout = async () => {
    await signOut()
    setSession(null)
    setUser(null)
    router.push('/')
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <AlignJustify strokeWidth={1.5} size={24} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className=" flex overflow-scroll flex-col gap-4">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {user?.id ? (
              <>
                <Link href="/account" className="text-base gap-4 p-2 rounded-md hover:bg-gray-900/10 min-w-full flex justify-start items-center text-muted-foreground hover:underline">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.image || ''} alt={user.name || 'User'} />
                    <AvatarFallback>{user.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-semibold text-base">{user.name || 'Người dùng'}</span>
                  </div>
                </Link>
              </>
            ) : (
              <UserActionGroup />
            )}
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-2 mt-2">
          <SheetClose asChild>
            <Button variant="ghost" className="w-full justify-start gap-2" asChild>
              <Link href="/">
                <Home className="w-4 h-4" />
                Trang chủ
              </Link>
            </Button>
          </SheetClose>
          {user?.id && (
            <SheetClose asChild>
              <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                <Link href="/account">
                  <User className="w-4 h-4" />
                  Trang cá nhân
                </Link>
              </Button>
            </SheetClose>
          )}
          {user?.id && (
            <Button variant="ghost" className="w-full justify-start gap-2 text-red-600" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              Đăng xuất
            </Button>
          )}
        </div>
        <div className="border-t pt-4 mt-2">
          <div className="font-semibold mb-2">Danh mục</div>
          <nav>{renderCategories()}</nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}