"use client"

import { Input } from '@/components/ui/input'
import React, { useState, useEffect, useCallback } from 'react'
import { Post } from '@/db/schema'
import { Search } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const SearchBar = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(false)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    router.push(`/tim-kiem-theo-tu-khoa?query=${encodeURIComponent(query)}`)
    clearSearch()
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setShowResults(false)
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-3xl mx-auto">
      <div className="relative flex items-center">
        <button
          name="search-button"
          aria-label="search-button"
          type="submit"
          className="absolute flex items-center justify-center text-[24px] w-4 h-4 right-5 top-1/2 transform -translate-y-1/2"
        >
          <Search size={24} className=" text-gray-400 w-5 h-5" />
        </button>
        <Input
          name="search-input"
          aria-label="search-input"
          type="text"
          placeholder="Tìm kiếm bài viết, địa chỉ, khu vực..."
          onChange={handleInputChange}
          value={query}
          className="pr-10 h-12 pl-4 py-3 text-sm border-2 rounded-l-xl font-montserrat focus:border-brand-medium focus:ring-0 shadow-lg"
        />
      </div>

      {showResults && (query.trim() || isLoading) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
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
              <div className="p-3 border-b border-gray-100 text-sm text-gray-600 font-medium">
                {results.length} kết quả tìm thấy
              </div>
              {results.slice(0, 5).map((result: Post) => (
                <Link
                  key={result.id}
                  href={`/post/${result.id}`}
                  onClick={clearSearch}
                  className="block p-4 hover:bg-gray-50 border-b border-gray-100 transition-colors"
                >
                  <div className="flex flex-col">
                    <h3 className="font-semibold font-montserrat line-clamp-1 text-start">
                      {result.tieuDeBaiViet}
                    </h3>
                    <div className="flex justify-between text-start">
                      <p className="text-sm">
                        {result.thanhPho} - {result.quan} - {result.phuong}
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
            </>
          )}
        </div>
      )}
    </form>
  )
}

export default SearchBar
