"use client"

import { Input } from '@/components/ui/input'
import React, { useState, useEffect, useCallback } from 'react'
import { Post } from '@/db/schema'

const Page = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Debounced search function
  const searchPosts = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/typesense", {
        method: "POST",
        body: JSON.stringify({ query: searchQuery })
      })
      const resJson = await res.json()
      setResults(resJson.data)
    } catch (error) {
      console.error(error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Debounce effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchPosts(query)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [query, searchPosts])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const PostList = () => {
    return (
      <div className='grid grid-cols-3 gap-4'>
        {results.map((result: Post) => <div key={result.id} className='border border-gray-300 rounded-md p-4'>
          <h2 className='text-lg font-bold'>{result.tieuDeBaiViet}</h2>
          <p className='text-sm text-gray-500'>{result.noiDung}</p>
          <p className='text-sm text-gray-500'>{result.thanhPho} - {result.quan} - {result.phuong} - {result.duong}</p>
          <p className='text-sm text-gray-500'>{result.giaTien}</p>
        </div>)}
      </div>
    )
  }
  return (
    <div className='flex flex-col gap-4 items-center justify-center h-screen container'>
      <h1>Test Page</h1>
      <Input type="text" placeholder="Search" onChange={handleInputChange} value={query} />
      {isLoading && <div>Đang tìm kiếm...</div>}
      <PostList />
    </div>
  )
}

export default Page