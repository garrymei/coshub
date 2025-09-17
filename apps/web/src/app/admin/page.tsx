"use client";

import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">管理后台</h1>
        <p className="text-gray-600">欢迎使用Coshub管理后台</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Banner管理卡片 */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🖼️</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Banner管理
              </h3>
              <p className="text-sm text-gray-600">管理首页和技能区的轮播图</p>
            </div>
          </div>
          <Link
            href="/admin/banners"
            className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            进入管理
          </Link>
        </div>

        {/* 帖子审核卡片 */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">帖子审核</h3>
              <p className="text-sm text-gray-600">
                审核用户发布的帖子和技能帖
              </p>
            </div>
          </div>
          <Link
            href="/admin/posts"
            className="block w-full text-center bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
          >
            进入管理
          </Link>
        </div>

        {/* 举报处理卡片 */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🚨</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">举报处理</h3>
              <p className="text-sm text-gray-600">处理用户举报的违规内容</p>
            </div>
          </div>
          <Link
            href="/admin/reports"
            className="block w-full text-center bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
          >
            进入管理
          </Link>
        </div>

        {/* 主题管理卡片 */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🎨</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">主题管理</h3>
              <p className="text-sm text-gray-600">自定义应用颜色和样式主题</p>
            </div>
          </div>
          <Link
            href="/admin/theme"
            className="block w-full text-center bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
          >
            进入管理
          </Link>
        </div>
      </div>

      {/* 快速统计 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">快速统计</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-sm text-gray-600">待审核帖子</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-sm text-gray-600">在线Banner</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">0</div>
            <div className="text-sm text-gray-600">待处理举报</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-sm text-gray-600">今日新增用户</div>
          </div>
        </div>
      </div>
    </div>
  );
}
