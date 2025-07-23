import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  name: string
  path: string
  isCurrentPage?: boolean
}

interface CategoryBreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function CategoryBreadcrumbs({ items }: CategoryBreadcrumbsProps) {
  return (
    <nav className="flex mb-4 text-sm" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        <li className="inline-flex items-center">
          <Link 
            href="/" 
            className="inline-flex items-center text-gray-600 hover:text-brand-medium transition-colors"
          >
            <Home className="w-4 h-4 mr-1" />
            Trang chủ
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.path}>
            <div className="flex items-center">
              <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
              {item.isCurrentPage ? (
                <span className="text-gray-900 font-medium" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link 
                  href={item.path} 
                  className="text-gray-600 hover:text-brand-medium transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}

// Helper component for category-based breadcrumbs
interface CategoryPathBreadcrumbsProps {
  level1?: { name: string; path: string }
  level2?: { name: string; path: string }
  level3?: { name: string; path: string }
  currentPage?: string
}

export function CategoryPathBreadcrumbs({ 
  level1, 
  level2, 
  level3, 
  currentPage 
}: CategoryPathBreadcrumbsProps) {
  const items: BreadcrumbItem[] = []
  
  if (level1) {
    items.push({ name: level1.name, path: level1.path })
  }
  
  if (level2) {
    items.push({ name: level2.name, path: level2.path })
  }
  
  if (level3) {
    items.push({ name: level3.name, path: level3.path })
  }
  
  if (currentPage) {
    items.push({ name: currentPage, path: '#', isCurrentPage: true })
  }

  return <CategoryBreadcrumbs items={items} />
}

// Related links component for SEO
interface RelatedLinksProps {
  category: string
  links: Array<{ name: string; href: string }>
}

export function RelatedLinks({ category, links }: RelatedLinksProps) {
  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">
        Xem thêm {category}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className="text-sm text-brand-medium hover:text-brand-dark hover:underline transition-colors"
          >
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  )
} 