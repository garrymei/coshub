"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface PostForm {
  type: "work" | "skill";
  media: File[];
  caption: string;
  tags: string[];
  // 技能帖特有字段
  price?: number;
  currency?: "CNY" | "USD";
  skillTags?: string[];
  city?: string;
  serviceRadiusKm?: number;
  availableSlots?: string[];
  desc?: string;
}

const SKILL_TAGS = [
  "摄影",
  "妆娘",
  "毛娘",
  "道具师",
  "服装师",
  "后期",
  "策划",
  "其他",
];

export default function NewPostPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<PostForm>({
    type: "work",
    media: [],
    caption: "",
    tags: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/post/new");
    }
  }, [user, router]);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm((prev) => ({
        ...prev,
        media: [...Array.from(e.target.files || [])],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.media.length || !form.caption.trim()) {
      alert("请填写必填项");
      return;
    }

    if (form.type === "skill" && (!form.price || !form.city)) {
      alert("技能帖请填写价格和城市");
      return;
    }

    setLoading(true);
    try {
      // TODO: 实现文件上传和发帖逻辑
      console.log("提交发帖:", form);

      // 模拟成功
      setTimeout(() => {
        router.push("/feed");
      }, 1000);
    } catch (error) {
      console.error("发帖失败:", error);
      alert("发帖失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">发布新帖子</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 帖子类型选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            帖子类型 *
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="work"
                checked={form.type === "work"}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    type: e.target.value as "work" | "skill",
                  }))
                }
                className="mr-2"
              />
              作品帖
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="skill"
                checked={form.type === "skill"}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    type: e.target.value as "work" | "skill",
                  }))
                }
                className="mr-2"
              />
              技能帖
            </label>
          </div>
        </div>

        {/* 媒体上传 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            图片/视频 *
          </label>
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleMediaChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {form.media.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              已选择 {form.media.length} 个文件
            </div>
          )}
        </div>

        {/* 文案描述 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            文案描述 *
          </label>
          <textarea
            value={form.caption}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, caption: e.target.value }))
            }
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="分享你的想法..."
          />
        </div>

        {/* 标签 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            标签
          </label>
          <input
            type="text"
            value={form.tags.join(", ")}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                tags: e.target.value
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean),
              }))
            }
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="用逗号分隔多个标签"
          />
        </div>

        {/* 技能帖特有字段 */}
        {form.type === "skill" && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  价格 *
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.price || ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      price: Number(e.target.value),
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  货币
                </label>
                <select
                  value={form.currency || "CNY"}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      currency: e.target.value as "CNY" | "USD",
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="CNY">CNY</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                技能标签
              </label>
              <div className="flex flex-wrap gap-2">
                {SKILL_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      const currentTags = form.skillTags || [];
                      const newTags = currentTags.includes(tag)
                        ? currentTags.filter((t) => t !== tag)
                        : [...currentTags, tag];
                      setForm((prev) => ({ ...prev, skillTags: newTags }));
                    }}
                    className={`px-3 py-1 rounded-full text-sm ${
                      (form.skillTags || []).includes(tag)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  城市 *
                </label>
                <input
                  type="text"
                  value={form.city || ""}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, city: e.target.value }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="如：北京"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  服务半径 (km)
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.serviceRadiusKm || ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      serviceRadiusKm: Number(e.target.value),
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                详细描述
              </label>
              <textarea
                value={form.desc || ""}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, desc: e.target.value }))
                }
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="详细描述你的技能和服务..."
              />
            </div>
          </>
        )}

        {/* 提交按钮 */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "发布中..." : "发布"}
          </button>
        </div>
      </form>
    </div>
  );
}
