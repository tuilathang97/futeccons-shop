import { Post, User } from "@/db/schema";
import { PaginatedResult } from "@/lib/queries/paginateQuery";

export type InactivePostWithUser = Post & {
  user: Pick<User, 'id' | 'name' | 'email'> | null;
};

export interface PostsManagementTableProps {
  posts: InactivePostWithUser[];
  onApprove: (postId: number) => void;
  onDelete: (postId: number) => void;
  isPending: boolean;
}

export interface PostsManagementClientUIProps {
  paginatedPostsData: PaginatedResult<InactivePostWithUser>;
} 