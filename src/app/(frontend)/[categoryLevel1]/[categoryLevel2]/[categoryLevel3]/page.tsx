import ProductCard from '@/components/products/ProductCard'
import { getPostByCategoryPath } from '@/lib/queries'
import { getCategories } from '@/lib/queries/categoryQueries'
import { notFound } from 'next/navigation'
import React from 'react'
import { getPublishedArticleByParams } from '@/actions/articleActions'
import ArticleContent from '@/components/articles/ArticleContent'
import { getPostImages } from '@/lib/queries/postImagesQueries'
import { CategoriesProvider } from '@/contexts/CategoriesContext'
import PageWrapper from '@/components/PageWrapper'
import FilterBar from '@/components/filterComponent/FilterBar'

export default async function ProductListing3LevelDeep({ params }: {
    params: Promise<{ categoryLevel1: string, categoryLevel2: string, categoryLevel3: string }>;
}) {
    const { categoryLevel1, categoryLevel2, categoryLevel3 } = await params
    
    const allCategories = await getCategories()

    // We still need to check if the current path is valid by trying to fetch the deepest category.
    // FilterBar will derive the individual category objects internally.
    const currentDeepestCategory = allCategories.find(c => c.path === `/${categoryLevel1}/${categoryLevel2}/${categoryLevel3}`)
    if (!currentDeepestCategory) {
        notFound()
    }

    const article = await getPublishedArticleByParams({
        level1Slug: categoryLevel1,
        level2Slug: categoryLevel2,
        level3Slug: categoryLevel3
    })

    const data = await getPostByCategoryPath(categoryLevel1, categoryLevel2, categoryLevel3)
    const postImages = await getPostImages()

    return (
        <CategoriesProvider initialCategories={allCategories}>
            <PageWrapper className='flex flex-col gap-4 '>
                <FilterBar 
                    allCategories={allCategories}
                    level1Slug={categoryLevel1}
                    level2Slug={categoryLevel2}
                    level3Slug={categoryLevel3}
                />
                <div>
                    <h1 className='text-xl font-bold'>Mua bán nhà đất chính chủ T3/2025</h1>
                </div>
                <div className="flex flex-col grid-cols-6 gap-4 sm:grid">
                    <div className="flex flex-col col-span-4 gap-4 py-4 min-h-fit">
                        {data && data.length > 0 ? data.map((postData, index) => {
                            const postImage = postImages.find((e) => e.postId === postData.id)
                            return (
                                <ProductCard thumbnailImg={postImage} variant="horizontal" post={postData} key={index} />
                            )
                        }) : <div>no post found</div>
                        }
                    </div>
                    <div className="col-span-2"></div>
                </div>

                {/* Display article content if available */}
                {article && (
                    <div className="mt-8">
                        <ArticleContent article={article} />
                    </div>
                )}
            </PageWrapper>
        </CategoriesProvider>
    )
}
