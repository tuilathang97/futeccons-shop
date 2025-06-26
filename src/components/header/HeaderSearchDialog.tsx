'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Search } from 'lucide-react'
import { Input } from '../ui/input'
import { Post } from '@/db/schema'
import { Separator } from '../ui/separator'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const HeaderSearchDialog = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const router = useRouter()
  const searchPosts = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      setShowResults(false)
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/typesense", {
        method: "POST",
        body: JSON.stringify({ query: searchQuery })
      })
      const resJson = await res.json()
      setResults(resJson.data || [])
      setShowResults(true)
    } catch (error) {
      console.error(error)
      setResults([])
      setShowResults(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchPosts(query)

    }, 500)

    return () => clearTimeout(timeoutId)
  }, [query, searchPosts])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }
  const handleSearchRedirect = () => {
    if (!query.trim()) return
    setIsDialogOpen(false)
    clearSearch()
    router.push(`/tim-kiem-theo-tu-khoa?query=${encodeURIComponent(query)}`)
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setShowResults(false)
    setIsDialogOpen(false)
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger className="flex gap-4 items-center mr-4 ">
          <p>Tìm kiếm</p>
          <Search className="w-4 h-4" />
      </DialogTrigger>
      <DialogContent className="w-full">
        <DialogTitle className='font-montserrat'>Tìm kiếm</DialogTitle>
        <div className='min-h-[400px]'>
        <div className="flex relative items-center gap-2">
          <Search onClick={handleSearchRedirect} className=" absolute right-3 w-5 h-5 cursor-pointer" />
          <Input
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearchRedirect()
              }
            }}
            type="text"
            placeholder="Tìm kiếm bài viết, địa chỉ, khu vực..."
            onChange={handleInputChange}
            value={query}
            className="pr-10 h-12 pl-4 py-3 text-sm border-2 rounded-l-xl font-montserrat focus:border-brand-medium focus:ring-0 shadow-lg"
          />
        </div>
        <Separator />
        {showResults && (query.trim() || isLoading) && (
          <div className=" mt-2 max-h-96 overflow-y-auto">
            {isLoading && (
              <div className="p-4 text-center text-gray-500">
                Đang tìm kiếm...
              </div>
            )}

            {!isLoading && results.length === 0 && query.trim() && (
              <div className="p-4 text-center text-gray-500">
                Không tìm thấy kết quả nào
              </div>
            )}

            {!isLoading && results.length > 0 && (
              <>
                <div className="p-3 border-b border-gray-100 text-sm font-medium">
                  {results.length} kết quả tìm thấy
                </div>
                {results.slice(0, 4).map((result: Post) => (
                  <Link
                    key={result.id}
                    href={`/post/${result.id}`}
                    onClick={clearSearch}
                    className="block w-full min-h-12 p-4 hover:bg-gray-50 border-b border-gray-100 transition-colors"
                  >
                    <div className="flex flex-col">
                      <h3 className="font-semibold font-montserrat line-clamp-1 text-start">
                        {result.tieuDeBaiViet}
                      </h3>
                      <div className="flex justify-between text-start">
                        <p className="text-sm">
                          {result.thanhPho} - {result.quan}
                        </p>
                        {result.giaTien && (
                          <p className="text-sm font-semibold text-brand-medium">
                            {Number(result.giaTien).toLocaleString('vi-VN')} VND
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
                {
                  results.length > 4 && (
                    <p className='text-sm w-full text-center text-gray-500'>xem thêm <Link href={`/bai-viet?query=${query}`} className='text-brand-medium'> {results.length - 4} bài viết với từ khoá <strong>{query}</strong></Link></p>
                  )
                }
              </>
            )}
          </div>
        )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default HeaderSearchDialog