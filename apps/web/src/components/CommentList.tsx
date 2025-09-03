"use client";

import { useState } from "react";
import Image from "next/image";

interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  createdAt: Date;
  likeCount: number;
  replyCount: number;
  replies?: Comment[];
}

interface CommentListProps {
  comments: Comment[];
  onAddComment?: (content: string, parentId?: string) => void;
  onLikeComment?: (commentId: string) => void;
  className?: string;
}

export default function CommentList({
  comments,
  onAddComment,
  onLikeComment,
  className = "",
}: CommentListProps) {
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const handleSubmitReply = (parentId: string) => {
    if (replyContent.trim() && onAddComment) {
      onAddComment(replyContent, parentId);
      setReplyContent("");
      setReplyTo(null);
    }
  };

  const handleCancelReply = () => {
    setReplyContent("");
    setReplyTo(null);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "刚刚";
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return new Date(date).toLocaleDateString();
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`${isReply ? "ml-8" : ""} mb-4`}>
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <Image
            src={comment.authorAvatar || "/default-avatar.png"}
            alt={comment.authorName}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-sm font-medium text-gray-900">
                {comment.authorName}
              </span>
              <span className="text-xs text-gray-500">
                {formatDate(comment.createdAt)}
              </span>
            </div>

            <p className="text-sm text-gray-700 mb-2">{comment.content}</p>

            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <button
                onClick={() => onLikeComment?.(comment.id)}
                className="flex items-center space-x-1 hover:text-blue-600"
              >
                <span>👍</span>
                <span>{comment.likeCount}</span>
              </button>

              {!isReply && (
                <button
                  onClick={() => setReplyTo(comment.id)}
                  className="hover:text-blue-600"
                >
                  回复
                </button>
              )}
            </div>
          </div>

          {/* 回复输入框 */}
          {replyTo === comment.id && (
            <div className="mt-3 ml-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="写下你的回复..."
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleSubmitReply(comment.id)}
                  className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  发送
                </button>
                <button
                  onClick={handleCancelReply}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  取消
                </button>
              </div>
            </div>
          )}

          {/* 显示回复 */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3">
              {comment.replies.map((reply) => renderComment(reply, true))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        评论 ({comments.length})
      </h3>

      {comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          还没有评论，快来抢沙发吧！
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => renderComment(comment))}
        </div>
      )}
    </div>
  );
}
