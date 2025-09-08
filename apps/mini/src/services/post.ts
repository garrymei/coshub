import { request } from "@/utils/api";

interface GetPostsParams {
  type: "share" | "skill";
  cursor?: string | null;
  city?: string;
  role?: string;
  priceMin?: number;
  priceMax?: number;
  page?: number;
  limit?: number;
  tags?: string[];
}

interface GetPostsResponse {
  data: Array<
    | {
        id: string;
        avatar: string;
        nickname: string;
        time: string;
        content: string;
        images?: string[];
        likeCount: number;
        commentCount: number;
        collectCount: number;
        isLiked: boolean;
        isCollected: boolean;
      }
    | {
        id: string;
        title: string;
        price: number;
        city: string;
        tags: string[];
        coverImage: string;
        role: string;
      }
  >;
  nextCursor: string | null;
  hasMore: boolean;
}

export async function getPosts(
  params: GetPostsParams,
): Promise<GetPostsResponse> {
  const res = await request({
    url: "/posts",
    method: "GET",
    data: {
      ...params,
      type:
        params.type === "skill"
          ? "skill"
          : params.type === "share"
            ? "share"
            : undefined,
    },
  });
  // 适配后端 PostListResponse 结构
  return {
    data: (res as any).data,
    nextCursor: (res as any).cursor ?? (res as any).meta?.nextCursor ?? null,
    hasMore: Boolean((res as any).meta?.hasNext),
  } as any;
}

interface CreatePostParams {
  type: "share" | "skill";
  title: string;
  content: string;
  tags: string[];
  images: string[];
  videos: string[];
  price?: number;
  city?: string;
  role?: string;
}

interface CreatePostResponse {
  id: string;
}

export async function createPost(
  params: CreatePostParams,
): Promise<CreatePostResponse> {
  const url = params.type === "skill" ? "/skills" : "/posts";
  return request({
    url,
    method: "POST",
    data: params,
  });
}

export async function likePost(postId: string): Promise<void> {
  return request({
    url: `/posts/${postId}/like`,
    method: "POST",
  });
}

export async function unlikePost(postId: string): Promise<void> {
  return request({
    url: `/posts/${postId}/like`,
    method: "DELETE",
  });
}

export async function collectPost(postId: string): Promise<void> {
  return request({
    url: `/posts/${postId}/collect`,
    method: "POST",
  });
}

export async function uncollectPost(postId: string): Promise<void> {
  return request({
    url: `/posts/${postId}/collect`,
    method: "DELETE",
  });
}

export async function commentPost(
  postId: string,
  content: string,
): Promise<{ id: string }> {
  return request({
    url: `/posts/${postId}/comments`,
    method: "POST",
    data: { content },
  });
}
