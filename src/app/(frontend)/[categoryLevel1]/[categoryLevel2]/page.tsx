import ProductCard from "@/components/products/ProductCard";
import { getPostByCategoryPath } from "@/lib/queries";
import { getCategories } from "@/lib/queries/categoryQueries";
import { notFound } from "next/navigation";
import { getPublishedArticleByParams } from "@/actions/articleActions";
import ArticleContent from "@/components/articles/ArticleContent";
import { CategoriesProvider } from "@/contexts/CategoriesContext";
import { getPostImages } from "@/lib/queries/postImagesQueries";
import PageWrapper from "@/components/PageWrapper";
import FilterBar from "@/components/filterComponent/FilterBar";

export default async function ProductListing2LevelDeep({ params }: {
    params: Promise<{ categoryLevel1: string, categoryLevel2: string }>;
}) {
    const { categoryLevel1, categoryLevel2 } = await params;
    
    const allCategories = await getCategories();

    const currentDeepestCategory = allCategories.find(c => c.path === `/${categoryLevel1}/${categoryLevel2}`);
    if (!currentDeepestCategory) {
        notFound();
    }

    const article = await getPublishedArticleByParams({
        level1Slug: categoryLevel1,
        level2Slug: categoryLevel2
    });

    const data = await getPostByCategoryPath(categoryLevel1, categoryLevel2);
    const postImages = await getPostImages();

    return (
        <CategoriesProvider initialCategories={allCategories}>
            <PageWrapper className="flex flex-col gap-8 ">
                <FilterBar 
                    allCategories={allCategories}
                    level1Slug={categoryLevel1}
                    level2Slug={categoryLevel2}
                    // level3Slug is omitted as this is a 2-level page
                />
                <div>
                    <h1 className='text-xl font-bold'>Mua bán nhà đất chính chủ T3/2025</h1>
                </div>
                <div className="flex flex-col grid-cols-6 gap-4 sm:grid">
                    <div className="flex flex-col col-span-4 gap-4 py-4 min-h-fit">
                        {data && data.length > 0 ? data.map((postData, index) => { // Renamed 'data' to 'postData'
                            const postImage = postImages.find((e) => e.postId === postData.id);
                            return (
                                <ProductCard thumbnailImg={postImage} variant="horizontal" post={postData} key={index} />
                            );
                        }) : <div>no post found</div>
                        }
                    </div>
                    <div className="col-span-2"></div>
                </div>

                {article && (
                    <div className="mt-8">
                        <ArticleContent article={article} />
                    </div>
                )}
            </PageWrapper>
        </CategoriesProvider>
    );
}
