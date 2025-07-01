import ProductsContainer from "@/components/post/ProductsContainer";
import { getPosts, getPublishedArticleByParams } from "@/lib/queries";
import ArticleContent from "@/components/articles/ArticleContent";
import FilterBar from "@/components/filterComponent/FilterBar";
import { PaginationParams } from "@/lib/queries/paginateQuery";

interface PageProps {
    params: Promise<{ categoryLevel1: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const DEFAULT_PAGE_SIZE = 10;

async function searchWithTypesense(query: string) {
    try {
        const response = await fetch(`${process.env.BETTER_AUTH_URL}/api/typesense`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: query }),
            cache: 'no-store'
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch from Typesense');
        }
        
        const result = await response.json();
        return result.data || [];
    } catch (error) {
        console.error('Error searching with Typesense:', error);
        return [];
    }
}

export default async function BaiViet({searchParams }: PageProps) {
    const searchConditions = await searchParams;
    console.log({searchConditions})
    const query = searchConditions.query as string;
    
    // Handle pagination
    const page = searchConditions.page ? parseInt(searchConditions.page as string, 10) : 1;
    const pageSize = searchConditions.pageSize ? parseInt(searchConditions.pageSize as string, 10) : DEFAULT_PAGE_SIZE;
    
    const paginationParams: PaginationParams = {
        page: isNaN(page) ? 1 : page,
        pageSize: isNaN(pageSize) ? DEFAULT_PAGE_SIZE : pageSize,
    };

    // Use Typesense for search, fallback to regular getPosts for non-search
    const posts = query 
        ? { 
            data: await searchWithTypesense(decodeURIComponent(query)),
            metadata: {
                currentPage: 1,
                pageSize: DEFAULT_PAGE_SIZE,
                totalPages: 1,
                totalItems: 0
            }
          }
        : await getPosts(paginationParams);
    const article = await getPublishedArticleByParams({
        level1Slug: "tim-kiem-theo-tu-khoa"
    });
    return (
        <section className="flex flex-col gap-4 container xl:px-0">
            <div className="grid items-center grid-cols-1 gap-4 sm:flex sm:flex-wrap sm:justify-center md:justify-normal">
                <FilterBar
                    level1Slug={"tim-kiem-theo-tu-khoa"}
                />
            </div>
            
            {/* Search results indicator */}
            {query && (
                <div className="bg-brand-light/30 border border-brand-medium rounded-lg p-4">
                    <p className="text-brand-medium">
                        Kết quả tìm kiếm cho: <strong>&ldquo;{decodeURIComponent(query)}&rdquo;</strong>
                        {posts.data && posts.data.length > 0 
                            ? ` - Tìm thấy ${posts.data.length} bài viết`
                            : " - Không tìm thấy kết quả nào"
                        }
                    </p>
                </div>
            )}
            
            <div className="flex flex-col gap-4 my-4">
                <div className="min-w-full">
                    <ProductsContainer
                        data={posts.data || []}
                        searchParam={searchConditions}
                        />
                </div>
            </div>
            {article && (
                <div className="my-16">
                    <ArticleContent article={article} />
                </div>
            )}
        </section>
    );
}