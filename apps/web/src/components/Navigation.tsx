"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navigation() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🎌</span>
            <span className="text-xl font-bold text-gray-900">Coshub</span>
          </Link>

          {/* 导航链接 */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/feed"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              交流区
            </Link>
            <Link
              href="/skills"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              技能区
            </Link>
            {user && (
              <Link
                href="/post/new"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                发布
              </Link>
            )}
          </div>

          {/* 用户菜单 */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  {user.nickname || user.username}
                </span>
                <Link
                  href="/me/profile"
                  className="text-sm text-gray-700 hover:text-blue-600"
                >
                  个人中心
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-700 hover:text-red-600"
                >
                  退出
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                登录
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
