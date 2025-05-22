import FilterArea from '@/components/filterComponent/FilterArea'
import FilterBedrooms from '@/components/filterComponent/FilterBedrooms'
import FilterEstateKind from '@/components/filterComponent/FilterEstateKind'
import FilterEstateTransaction from '@/components/filterComponent/FilterEstateTransaction'
import FilterEstateType from '@/components/filterComponent/FilterEstateType'
import FilterPrice from '@/components/filterComponent/FilterPrice'
import ProductsListWithFilter from '@/components/filterComponent/ProductsListWithFilter'
import ProductCard from '@/components/products/ProductCard'
import { getPostByCategoryPath } from '@/lib/queries'
import { getCategories, getCategoryByPath } from '@/lib/queries/categoryQueries'
import { notFound } from 'next/navigation'
import React from 'react'
import { getPublishedArticleByParams } from '@/actions/articleActions'
import ArticleContent from '@/components/articles/ArticleContent'
import { getPostImages } from '@/lib/queries/postImagesQueries'
import { CategoriesProvider } from '@/contexts/CategoriesContext'
import PageWrapper from '@/components/PageWrapper'

export default async function ProductListing3LevelDeep({ params, searchParams }: {
    params: Promise<{ categoryLevel1: string, categoryLevel2: string, categoryLevel3: string }>;
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const { categoryLevel1, categoryLevel2, categoryLevel3 } = await params
    const parentCategory = await getCategoryByPath(`/${categoryLevel1}`)
    const currentCategory = await getCategoryByPath(`/${categoryLevel1}/${categoryLevel2}`)

    if (!parentCategory && !currentCategory) {
        notFound();
    }

    const categories = await getCategories()
    const currentSubChildCategory = await getCategoryByPath(`/${categoryLevel1}/${categoryLevel2}/${categoryLevel3}`)

    if (!currentSubChildCategory) {
        notFound();
    }

    const article = await getPublishedArticleByParams({
        level1Slug: categoryLevel1,
        level2Slug: categoryLevel2,
        level3Slug: categoryLevel3
    });

    const filteredCategories = categories.filter((e) => e.level === parentCategory?.level)
    const filteredChildCategories = categories.filter((e) => e.level === 2 && e.parentId === parentCategory?.id)
    const filteredSubChildCategories = categories.filter((e) => e.parentId === currentCategory?.id)
    const data = await getPostByCategoryPath(categoryLevel1, categoryLevel2, categoryLevel3)
    const postImages = await getPostImages()
    return (
        <CategoriesProvider initialCategories={categories}>
            <PageWrapper className='flex flex-col gap-4 '>
                <div className="grid items-center grid-cols-1 gap-4 sm:flex sm:flex-wrap sm:justify-center md:justify-normal">
                    <ProductsListWithFilter />
                    <FilterEstateTransaction currentCategory={parentCategory} categories={filteredCategories} />
                    <FilterEstateType childCategories={filteredChildCategories} currentChildCategory={currentCategory} />
                    {filteredSubChildCategories && <FilterEstateKind childSubCategories={filteredSubChildCategories} CurrentSubCategory={currentSubChildCategory} />}
                    <FilterPrice priceType="sale" />
                    <FilterArea />
                    <FilterBedrooms />
                </div>
                <div>
                    <h1 className='text-xl font-bold'>Mua bán nhà đất chính chủ T3/2025</h1>
                </div>
                <div className="flex flex-col grid-cols-6 gap-4 sm:grid">
                    <div className="flex flex-col col-span-4 gap-4 py-4 min-h-fit">
                        {data && data.length > 0 ? data.map((data, index) => {
                            const postImage = postImages.find((e) => e.postId === data.id)
                            return (
                                <ProductCard thumbnailImg={postImage} variant="horizontal" post={data} key={index} />
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
