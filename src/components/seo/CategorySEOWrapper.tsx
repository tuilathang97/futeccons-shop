import { CategoryPathBreadcrumbs, RelatedLinks } from './InternalLinks'

interface CategorySEOWrapperProps {
  children: React.ReactNode
  level1?: { name: string; path: string }
  level2?: { name: string; path: string }
  level3?: { name: string; path: string }
  currentPage?: string
  relatedCategories?: Array<{ name: string; href: string }>
}

export default function CategorySEOWrapper({
  children,
  level1,
  level2,
  level3,
  currentPage,
  relatedCategories = []
}: CategorySEOWrapperProps) {
  return (
    <div className="container mx-auto px-4">
      <CategoryPathBreadcrumbs 
        level1={level1}
        level2={level2}
        level3={level3}
        currentPage={currentPage}
      />
      
      {children}
      
      {relatedCategories.length > 0 && (
        <RelatedLinks 
          category={currentPage || level3?.name || level2?.name || level1?.name || 'danh mục'}
          links={relatedCategories}
        />
      )}
    </div>
  )
}