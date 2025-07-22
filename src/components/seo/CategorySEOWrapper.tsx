import { CategoryPathBreadcrumbs, RelatedLinks } from './InternalLinks'
import { generateCategoryMetadata } from '@/lib/seo/metadata'

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

// Usage example in category pages:
/*
<CategorySEOWrapper
  level1={{ name: "Bán nhà", path: "/ban-nha" }}
  level2={{ name: "Nhà đất", path: "/ban-nha/nha-dat" }}
  level3={{ name: "Biệt thự", path: "/ban-nha/nha-dat/biet-thu" }}
  relatedCategories={[
    { name: "Nhà phố", href: "/ban-nha/nha-dat/nha-pho" },
    { name: "Chung cư", href: "/ban-nha/chung-cu" },
    { name: "Đất nền", href: "/ban-nha/nha-dat/dat-nen" }
  ]}
>
  <YourCategoryContent />
</CategorySEOWrapper>
*/ 