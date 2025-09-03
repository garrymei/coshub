"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface ProfileForm {
  nickname: string;
  city: string;
  bio: string;
  roles: string[];
}

const AVAILABLE_ROLES = [
  "Coser",
  "摄影",
  "妆娘",
  "毛娘",
  "道具师",
  "服装师",
  "后期",
  "策划",
];

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<ProfileForm>({
    nickname: "",
    city: "",
    bio: "",
    roles: [],
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/me/profile");
      return;
    }

    if (user) {
      setForm({
        nickname: user.nickname || "",
        city: "",
        bio: "",
        roles: [],
      });
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="flex justify-center p-8">加载中...</div>;
  }

  if (!user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // TODO: 实现真实的 API 调用
      console.log("保存个人信息:", form);

      // 模拟保存成功
      setTimeout(() => {
        alert("保存成功！");
        setSaving(false);
      }, 1000);
    } catch (error) {
      console.error("保存失败:", error);
      alert("保存失败，请重试");
      setSaving(false);
    }
  };

  const toggleRole = (role: string) => {
    setForm((prev) => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role],
    }));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">个人信息</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本信息 */}
        <div className="bg-white rounded-lg p-6 border">
          <h2 className="text-lg font-semibold mb-4">基本信息</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                用户名
              </label>
              <input
                type="text"
                value={user.username}
                disabled
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                昵称
              </label>
              <input
                type="text"
                value={form.nickname}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, nickname: e.target.value }))
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="设置你的昵称"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                城市
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, city: e.target.value }))
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="如：北京、上海、广州"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                个人简介
              </label>
              <textarea
                value={form.bio}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, bio: e.target.value }))
                }
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="介绍一下你自己..."
              />
            </div>
          </div>
        </div>

        {/* 角色标签 */}
        <div className="bg-white rounded-lg p-6 border">
          <h2 className="text-lg font-semibold mb-4">角色标签</h2>
          <p className="text-sm text-gray-600 mb-4">
            选择你的角色，这将影响技能区的默认筛选
          </p>

          <div className="flex flex-wrap gap-3">
            {AVAILABLE_ROLES.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => toggleRole(role)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  form.roles.includes(role)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* 我的发布 */}
        <div className="bg-white rounded-lg p-6 border">
          <h2 className="text-lg font-semibold mb-4">我的发布</h2>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => router.push("/me/posts?type=work")}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              作品帖
            </button>
            <button
              type="button"
              onClick={() => router.push("/me/posts?type=skill")}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              技能帖
            </button>
          </div>
        </div>

        {/* 提交按钮 */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "保存中..." : "保存"}
          </button>
        </div>
      </form>
    </div>
  );
}
