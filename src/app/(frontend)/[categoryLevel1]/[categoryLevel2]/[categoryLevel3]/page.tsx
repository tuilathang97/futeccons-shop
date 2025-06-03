import ProductsContainer from '@/components/post/ProductsContainer'
import { getPostByCategoryPath } from '@/lib/queries'
import { getCategories, validateCategoryPath } from '@/lib/queries/categoryQueries'
import { notFound } from 'next/navigation'
import React from 'react'
import { getPublishedArticleByParams } from '@/actions/articleActions'
import ArticleContent from '@/components/articles/ArticleContent'
import { getPostImages } from '@/lib/queries/postImagesQueries'
import PageWrapper from '@/components/PageWrapper'
import FilterBar from '@/components/filterComponent/FilterBar'
import Sidebar from '@/components/location/Sidebar'

export default async function ProductListing3LevelDeep({ params }: {
    params: Promise<{ categoryLevel1: string, categoryLevel2: string, categoryLevel3: string }>;
}) {
    const { categoryLevel1, categoryLevel2, categoryLevel3 } = await params
    
    const isValidPath = await validateCategoryPath(`/${categoryLevel1}/${categoryLevel2}/${categoryLevel3}`);
    
    // Get all categories
    const categories = await getCategories();
    const result = await getPostByCategoryPath(categoryLevel1, categoryLevel2, categoryLevel3);
    
    if (!isValidPath || !categories) {
        notFound();
    }

    const article = await getPublishedArticleByParams({
        level1Slug: categoryLevel1,
        level2Slug: categoryLevel2,
        level3Slug: categoryLevel3
    });

    const postImages = await getPostImages();

    return (
        <PageWrapper className="flex flex-col 2xl:px-0 w-full gap-4">
            <div className="grid items-center grid-cols-1 gap-4 sm:flex sm:flex-wrap sm:justify-center md:justify-normal">
                <FilterBar 
                    level1Slug={categoryLevel1}
                    level2Slug={categoryLevel2}
                    level3Slug={categoryLevel3}
                />
            </div>
            <PageWrapper className="flex flex-col !px-0 gap-4 my-4 md:grid md:grid-cols-[70%_30%]">
                <div className="min-w-full">
                    <ProductsContainer
                        data={result || []}
                        postImages={postImages}
                        searchParam={{}}
                        cardVariant="horizontal"
                    />
                </div>
                <div className="mt-4 md:mt-0">
                    <Sidebar />
                </div>
            </PageWrapper>

            {article && (
                <div className="mt-8">
                    <ArticleContent article={article} />
                </div>
            )}
        </PageWrapper>
    )
}
