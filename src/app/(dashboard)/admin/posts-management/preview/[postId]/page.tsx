import { getPostDetailsById } from "@/lib/queries/postQueries";
import { notFound } from "next/navigation";
import { Metadata } from 'next';
import PostDetail from "@/components/products/PostDetail";

interface PostPreviewPageProps {
  params: {
    postId?: string;
  };
}

export async function generateMetadata({ params }: PostPreviewPageProps): Promise<Metadata> {
  const { postId: postIdString } = await params; 
  if (!postIdString || isNaN(Number(postIdString))) {
    return {
      title: 'Xem trước bài đăng - Lỗi',
      description: 'Không tìm thấy bài đăng.',
    };
  }

  const postId = Number(postIdString);
  const postData = await getPostDetailsById(postId);

  if (!postData) {
    return {
      title: 'Xem trước bài đăng - Không tìm thấy',
      description: 'Bài đăng bạn đang tìm kiếm không tồn tại.',
    };
  }

  return {
    title: `Admin Preview: ${postData.tieuDeBaiViet}`,
    description: postData.noiDung ? postData.noiDung.substring(0, 160) + '...' : 'Chi tiết bài đăng',
  };
}

export default async function PostPreviewPage({ params }: PostPreviewPageProps) {
  const { postId: postIdString } = await params; 
  if (!postIdString || isNaN(Number(postIdString))) {
    notFound();
  }
  const postId = Number(postIdString);
  const postData = await getPostDetailsById(postId);

  if (!postData) {
    notFound();
  }

  // Adapt postData for PostDetail component
  // PostDetailProps expects post.createdAt to be a string, while postData.createdAt is a Date.
  const { createdAt, ...restOfPost } = postData;
  const adaptedPostProp = {
    ...restOfPost,
    createdAt: createdAt.toISOString(), // Convert Date to ISO string
    // mediaItems can be omitted as it's optional in PostDetailProps
    // latitude and longitude are already part of 'restOfPost' from the base Post type
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PostDetail 
        // The 'adaptedPostProp' should now better align with PostDetailProps['post']
        // @ts-expect-error TODO: The PostDetailProps['post'] has a conflicting intersection type for createdAt (Date & string). Ideally, PostDetailProps should be fixed. This is a workaround.
        post={adaptedPostProp} 
        images={postData.images} 
        article={null} 
        fetchArticle={false} 
      />
    </div>
  );
} 