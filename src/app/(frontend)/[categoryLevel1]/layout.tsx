import React from 'react'

interface CategoryLayoutProps {
  children: React.ReactNode
}

export default function CategoryLayout({ children }: CategoryLayoutProps) {
  return (
    <div className="container 2xl:px-0 w-full">
      {children}
    </div>
  )
} 