import ProductsContainer from '@/components/post/ProductsContainer'
import { getPostByCategoryPath } from '@/lib/queries'
import { getCategories, validateCategoryPath } from '@/lib/queries/categoryQueries'
import { notFound } from 'next/navigation'
import React from 'react'
import { getPublishedArticleByParams } from '@/actions/articleActions'
import ArticleContent from '@/components/articles/ArticleContent'
import FilterBar from '@/components/filterComponent/FilterBar'

export default async function ProductListing3LevelDeep({ params,searchParams }: {
    params: Promise<{ categoryLevel1: string, categoryLevel2: string, categoryLevel3: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { categoryLevel1, categoryLevel2, categoryLevel3 } = await params
    const searchConditions = await searchParams;
    const isValidPath = await validateCategoryPath(`/${categoryLevel1}/${categoryLevel2}/${categoryLevel3}`);
    
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


    return (
        <section className="flex flex-col 2xl:px-0 w-full gap-4">
            <div className="grid items-center grid-cols-1 gap-4 sm:flex sm:flex-wrap sm:justify-center md:justify-normal">
                <FilterBar 
                    level1Slug={categoryLevel1}
                    level2Slug={categoryLevel2}
                    level3Slug={categoryLevel3}
                />
            </div>
            <div className="flex flex-col gap-4 my-4">
                <div className="min-w-full">
                    <ProductsContainer
                        data={result || []}
                        searchParam={searchConditions}
                        />
                </div>
            </div>

            {article && (
                <div className="mt-8">
                    <ArticleContent article={article} />
                </div>
            )}
        </section>
    )
}
