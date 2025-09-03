"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import PostCard from "@/components/PostCard";
import CommentList from "@/components/CommentList";
import { Post } from "@/types/post";

// 模拟评论数据
const mockComments = [
  {
    id: "1",
    content: "这个作品太棒了！请问是用什么材料制作的？",
    authorId: "user1",
    authorName: "Cosplay爱好者",
    authorAvatar: "/default-avatar.png",
    createdAt: new Date(Date.now() - 3600000),
    likeCount: 5,
    replyCount: 2,
    replies: [
      {
        id: "1-1",
        content: "主要是EVA泡沫板，然后上色",
        authorId: "user2",
        authorName: "道具制作师",
        authorAvatar: "/default-avatar.png",
        createdAt: new Date(Date.now() - 1800000),
        likeCount: 3,
        replyCount: 0,
      },
    ],
  },
  {
    id: "2",
    content: "拍摄角度很专业，学习了！",
    authorId: "user3",
    authorName: "摄影新手",
    authorAvatar: "/default-avatar.png",
    createdAt: new Date(Date.now() - 7200000),
    likeCount: 2,
    replyCount: 0,
  },
];

// 模拟推荐帖子
const mockRecommendedPosts: Post[] = [
  {
    id: "rec1",
    title: "Cosplay摄影技巧分享",
    content: "分享一些我在Cosplay摄影中的经验和技巧...",
    authorId: "user4",
    authorName: "专业摄影师",
    authorAvatar: "/default-avatar.png",
    type: "tutorial",
    category: "photography",
    tags: ["摄影", "技巧", "Cosplay"],
    images: ["/mock-image-1.jpg"],
    videos: [],
    stats: {
      viewCount: 1200,
      likeCount: 89,
      commentCount: 23,
      shareCount: 12,
    },
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 86400000),
  },
  {
    id: "rec2",
    title: "道具制作材料推荐",
    content: "推荐一些性价比高的道具制作材料...",
    authorId: "user5",
    authorName: "道具达人",
    authorAvatar: "/default-avatar.png",
    type: "tips_tricks",
    category: "prop_making",
    tags: ["道具", "材料", "推荐"],
    images: ["/mock-image-2.jpg"],
    videos: [],
    stats: {
      viewCount: 890,
      likeCount: 67,
      commentCount: 18,
      shareCount: 8,
    },
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 172800000),
  },
];

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟获取帖子数据
    const fetchPost = async () => {
      setLoading(true);
      // 这里应该调用API获取帖子数据
      // const response = await fetch(`/api/posts/${params.id}`);
      // const postData = await response.json();

      // 模拟数据
      const mockPost: Post = {
        id: params.id as string,
        title: "我的第一个Cosplay作品 - 初音未来",
        content:
          "经过一个月的准备，终于完成了我的第一个Cosplay作品！从服装制作到道具准备，再到拍摄，整个过程都充满了挑战和乐趣。\n\n服装方面，我选择了初音未来的经典造型，蓝色双马尾、绿色短裙，还有标志性的领带。制作过程中遇到了很多困难，比如裙子的褶皱处理、假发的造型等，但通过查阅资料和请教前辈，最终都得到了解决。\n\n道具方面，我制作了一个简单的麦克风道具，使用EVA泡沫板作为主体，然后用丙烯颜料上色。虽然看起来简单，但制作过程中需要注意很多细节，比如边缘的打磨、颜色的均匀性等。\n\n拍摄是在一个废弃的工厂进行的，工业风格和初音未来的科技感很搭配。摄影师朋友帮我调整了很多角度和光线，最终的效果我很满意。\n\n这次经历让我学到了很多，不仅是技术上的，更重要的是坚持和耐心。虽然过程中遇到了很多困难，但看到最终成果的那一刻，所有的辛苦都值得了！",
        authorId: "user1",
        authorName: "初音爱好者",
        authorAvatar: "/default-avatar.png",
        type: "showcase",
        category: "cosplay",
        tags: ["初音未来", "Cosplay", "道具制作", "摄影"],
        images: ["/mock-image-1.jpg", "/mock-image-2.jpg", "/mock-image-3.jpg"],
        videos: [],
        stats: {
          viewCount: 2340,
          likeCount: 156,
          commentCount: 28,
          shareCount: 15,
        },
        createdAt: new Date(Date.now() - 259200000),
        updatedAt: new Date(Date.now() - 259200000),
      };

      setPost(mockPost);
      setLoading(false);
    };

    if (params.id) {
      fetchPost();
    }
  }, [params.id]);

  const handleLike = () => {
    if (post) {
      setPost({
        ...post,
        stats: {
          ...post.stats,
          likeCount: post.stats.likeCount + 1,
        },
      });
    }
  };

  const handleShare = () => {
    if (navigator.share && post) {
      navigator.share({
        title: post.title,
        text: post.content.substring(0, 100) + "...",
        url: window.location.href,
      });
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href);
      alert("链接已复制到剪贴板！");
    }
  };

  const handleAddComment = (content: string, parentId?: string) => {
    // 这里应该调用API添加评论
    console.log("添加评论:", content, parentId);
  };

  const handleLikeComment = (commentId: string) => {
    // 这里应该调用API点赞评论
    console.log("点赞评论:", commentId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">帖子不存在</h1>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            返回上一页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 帖子内容 */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          {/* 标题和作者信息 */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            <div className="flex items-center space-x-4 mb-4">
              <Image
                src={post.authorAvatar}
                alt={post.authorName}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <div className="font-medium text-gray-900">
                  {post.authorName}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* 标签 */}
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 媒体内容 */}
          {post.images.length > 0 && (
            <div className="p-6 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {post.images.map((image, index) => (
                  <div key={index} className="relative aspect-square">
                    <Image
                      src={image}
                      alt={`图片 ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 帖子内容 */}
          <div className="p-6 border-b border-gray-200">
            <div className="prose max-w-none">
              {post.content.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* 互动按钮 */}
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button
                onClick={handleLike}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600"
              >
                <span className="text-xl">❤️</span>
                <span>{post.stats.likeCount}</span>
              </button>

              <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                <span className="text-xl">💬</span>
                <span>{post.stats.commentCount}</span>
              </button>

              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                <span className="text-xl">👁️</span>
                <span>{post.stats.viewCount}</span>
              </button>
            </div>

            <button
              onClick={handleShare}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              分享
            </button>
          </div>
        </div>

        {/* 评论区域 */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="p-6">
            <CommentList
              comments={mockComments}
              onAddComment={handleAddComment}
              onLikeComment={handleLikeComment}
            />
          </div>
        </div>

        {/* 推荐帖子 */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              相关推荐
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockRecommendedPosts.map((recPost) => (
                <PostCard key={recPost.id} post={recPost} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
