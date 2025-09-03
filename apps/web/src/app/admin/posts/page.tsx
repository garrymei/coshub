"use client";

import { useState, useEffect } from "react";
import { Post } from "@/types/post";

export default function PostModerationPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");

  // 模拟数据
  useEffect(() => {
    const mockPosts: Post[] = [
      {
        id: "1",
        title: "我的第一个Cosplay作品",
        content: "分享我的第一个Cosplay作品，希望大家喜欢...",
        type: "showcase",
        category: "cosplay",
        images: ["/api/posts/1.jpg"],
        videos: [],
        tags: ["cosplay", "初音未来"],
        authorId: "user1",
        authorName: "Cosplayer001",
        authorAvatar: "/api/avatars/1.jpg",
        stats: {
          viewCount: 150,
          likeCount: 25,
          commentCount: 8,
          shareCount: 3,
        },
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
      },
      {
        id: "2",
        title: "摄影技巧分享",
        content: "分享一些Cosplay摄影的技巧和经验...",
        type: "tutorial",
        category: "tips_tricks",
        images: ["/api/posts/2.jpg"],
        videos: [],
        tags: ["摄影", "技巧", "分享"],
        authorId: "user2",
        authorName: "摄影师002",
        authorAvatar: "/api/avatars/2.jpg",
        stats: {
          viewCount: 89,
          likeCount: 12,
          commentCount: 5,
          shareCount: 2,
        },
        createdAt: new Date("2024-01-14"),
        updatedAt: new Date("2024-01-14"),
      },
    ];
    setPosts(mockPosts);
    setLoading(false);
  }, []);

  const handleApprove = async (id: string) => {
    // TODO: 调用API审核通过
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, status: "approved" } : post,
      ),
    );
  };

  const handleReject = async (id: string) => {
    const reason = prompt("请输入拒绝原因：");
    if (reason) {
      // TODO: 调用API审核拒绝
      setPosts((prev) =>
        prev.map((post) =>
          post.id === id ? { ...post, status: "rejected" } : post,
        ),
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("确定要删除这个帖子吗？")) {
      // TODO: 调用API删除
      setPosts((prev) => prev.filter((post) => post.id !== id));
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (filter === "all") return true;
    if (filter === "pending") return post.status === "pending";
    if (filter === "approved") return post.status === "approved";
    if (filter === "rejected") return post.status === "rejected";
    return true;
  });

  if (loading) {
    return <div className="text-center py-8">加载中...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">帖子审核</h1>
        <div className="flex space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="all">全部</option>
            <option value="pending">待审核</option>
            <option value="approved">已通过</option>
            <option value="rejected">已拒绝</option>
          </select>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{posts.length}</div>
          <div className="text-sm text-gray-600">总帖子数</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {posts.filter((p) => p.status === "pending").length}
          </div>
          <div className="text-sm text-gray-600">待审核</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {posts.filter((p) => p.status === "approved").length}
          </div>
          <div className="text-sm text-gray-600">已通过</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {posts.filter((p) => p.status === "rejected").length}
          </div>
          <div className="text-sm text-gray-600">已拒绝</div>
        </div>
      </div>

      {/* 帖子列表 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                内容预览
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                作者
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                类型
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                发布时间
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPosts.map((post) => (
              <tr key={post.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    {post.images.length > 0 && (
                      <img
                        src={post.images[0]}
                        alt="预览"
                        className="h-16 w-16 object-cover rounded"
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {post.title}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {post.content}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      className="h-8 w-8 rounded-full"
                      src={post.authorAvatar}
                      alt={post.authorName}
                    />
                    <div className="ml-2">
                      <div className="text-sm font-medium text-gray-900">
                        {post.authorName}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                    {post.type === "showcase"
                      ? "作品展示"
                      : post.type === "tutorial"
                        ? "教程"
                        : "其他"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      post.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : post.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {post.status === "pending"
                      ? "待审核"
                      : post.status === "approved"
                        ? "已通过"
                        : "已拒绝"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {post.createdAt.toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {post.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(post.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        通过
                      </button>
                      <button
                        onClick={() => handleReject(post.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        拒绝
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          没有找到符合条件的帖子
        </div>
      )}
    </div>
  );
}
