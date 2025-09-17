"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 检查用户权限
    if (!user || (user.role !== "admin" && user.role !== "moderator")) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user || (user.role !== "admin" && user.role !== "moderator")) {
    return <div>正在检查权限...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 管理端导航 */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/admin" className="flex items-center space-x-2">
                <span className="text-2xl">⚙️</span>
                <span className="text-xl font-bold text-gray-900">
                  管理后台
                </span>
              </Link>

              <div className="flex items-center space-x-6">
                <Link
                  href="/admin/banners"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Banner管理
                </Link>
                <Link
                  href="/admin/posts"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  帖子审核
                </Link>
                <Link
                  href="/admin/reports"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  举报处理
                </Link>
                <Link
                  href="/admin/theme"
                  className="text-gray-700 hover:text-purple-600 transition-colors"
                >
                  主题管理
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {user.nickname || user.username}
              </span>
              <Link
                href="/"
                className="text-sm text-gray-700 hover:text-blue-600"
              >
                返回前台
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 主内容区域 */}
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
