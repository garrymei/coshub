"use client";

import { useState, useEffect } from "react";
import PostCard from "./PostCard";
import { Post } from "@/types/post";

interface PostListProps {
  type: "work" | "skill";
}

export default function PostList({ type }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [cursor, setCursor] = useState<string | null>(null);

  const fetchPosts = async (isLoadMore = false) => {
    if (loading) return;

    setLoading(true);
    try {
      // TODO: 替换为真实 API 调用
      const response = await fetch(
        `/api/posts?type=${type}&page=${isLoadMore ? page + 1 : 1}&cursor=${cursor || ""}`,
      );

      if (!response.ok) throw new Error("获取帖子失败");

      const data = await response.json();
      const newPosts = data.posts || [];

      if (isLoadMore) {
        setPosts((prev) => [...prev, ...newPosts]);
        setPage((prev) => prev + 1);
      } else {
        setPosts(newPosts);
        setPage(1);
      }

      setHasMore(newPosts.length === 10); // 假设每页 10 条
      setCursor(data.nextCursor || null);
    } catch (error) {
      console.error("获取帖子失败:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPosts([]);
    setPage(1);
    setCursor(null);
    setHasMore(true);
    fetchPosts();
  }, [type]);

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchPosts(true);
    }
  };

  const handleRefresh = () => {
    setPosts([]);
    setPage(1);
    setCursor(null);
    setHasMore(true);
    fetchPosts();
  };

  if (posts.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          暂无{type === "work" ? "作品" : "技能"}帖子
        </p>
        <button
          onClick={handleRefresh}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          刷新
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 帖子列表 */}
      <div className="grid gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* 加载更多 */}
      {hasMore && (
        <div className="text-center py-6">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
          >
            {loading ? "加载中..." : "加载更多"}
          </button>
        </div>
      )}

      {/* 下拉刷新提示 */}
      <div className="text-center text-sm text-gray-500">
        下拉刷新获取最新内容
      </div>
    </div>
  );
}
