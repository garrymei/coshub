"use client";

import { useState, useEffect } from "react";
import { Banner } from "@/types/banner";

export default function BannerManagementPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  // 模拟数据
  useEffect(() => {
    const mockBanners: Banner[] = [
      {
        id: "1",
        scene: "feed",
        imageUrl: "/api/banners/1.jpg",
        linkType: "external",
        linkUrl: "https://example.com",
        priority: 1,
        online: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        scene: "skills",
        imageUrl: "/api/banners/2.jpg",
        linkType: "internal",
        linkUrl: "/skills",
        priority: 2,
        online: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    setBanners(mockBanners);
    setLoading(false);
  }, []);

  const handleToggleOnline = async (id: string) => {
    // TODO: 调用API切换状态
    setBanners((prev) =>
      prev.map((banner) =>
        banner.id === id ? { ...banner, online: !banner.online } : banner,
      ),
    );
  };

  const handleDelete = async (id: string) => {
    if (confirm("确定要删除这个Banner吗？")) {
      // TODO: 调用API删除
      setBanners((prev) => prev.filter((banner) => banner.id !== id));
    }
  };

  if (loading) {
    return <div className="text-center py-8">加载中...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Banner管理</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          添加Banner
        </button>
      </div>

      {/* Banner列表 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                预览
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                场景
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                链接
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                优先级
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {banners.map((banner) => (
              <tr key={banner.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={banner.imageUrl}
                    alt="Banner"
                    className="h-16 w-24 object-cover rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {banner.scene === "feed" ? "交流区" : "技能区"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {banner.linkType === "external" ? "外部链接" : "内部链接"}
                  <br />
                  <span className="text-gray-500">{banner.linkUrl}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {banner.priority}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      banner.online
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {banner.online ? "在线" : "离线"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => setEditingBanner(banner)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleToggleOnline(banner.id)}
                    className={`${
                      banner.online
                        ? "text-yellow-600 hover:text-yellow-900"
                        : "text-green-600 hover:text-green-900"
                    }`}
                  >
                    {banner.online ? "下线" : "上线"}
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 创建/编辑表单 */}
      {(showCreateForm || editingBanner) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingBanner ? "编辑Banner" : "创建Banner"}
            </h3>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  场景
                </label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="feed">交流区</option>
                  <option value="skills">技能区</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  图片URL
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  链接类型
                </label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="external">外部链接</option>
                  <option value="internal">内部链接</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  链接URL
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  优先级
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="0"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="online"
                  className="mr-2"
                  defaultChecked
                />
                <label htmlFor="online" className="text-sm text-gray-700">
                  立即上线
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingBanner(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editingBanner ? "更新" : "创建"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
