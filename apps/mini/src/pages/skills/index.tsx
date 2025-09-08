import { View, ScrollView, Input } from "@tarojs/components";
import { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import SkillCard from "@/components/SkillCard";
import Masonry from "@/components/Masonry";
import { api, mockData, Skill } from "@/services/api";
import "./index.scss";

export default function SkillsIndex() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [viewMode, setViewMode] = useState<"masonry" | "list">("masonry");
  const [selectedCategory, setSelectedCategory] = useState("全部");

  // 技能分类
  const categories = ["全部", "化妆", "摄影", "后期", "道具", "假发"];

  // 获取技能数据
  const fetchSkills = async (refresh = false) => {
    if (loading) return;

    setLoading(true);
    try {
      // 通过环境变量控制是否使用模拟数据
      if (process.env.TARO_APP_USE_MOCK === "true") {
        setSkills(mockData.skills);
        setHasMore(false);
      } else {
        // 生产环境调用真实API
        const res = await api.skills.getList({
          cursor: refresh ? null : cursor,
          search: searchValue || undefined,
          category: selectedCategory === "全部" ? undefined : selectedCategory,
        });

        setSkills((prev) => (refresh ? res.data : [...prev, ...res.data]));
        setCursor(res.nextCursor || null);
        setHasMore(res.hasMore);
      }
    } catch (error) {
      console.error("获取技能数据失败:", error);
      Taro.showToast({ title: "加载失败", icon: "none" });
      // 降级到模拟数据
      setSkills(mockData.skills);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // 搜索处理
  const handleSearch = (value: string) => {
    setSearchValue(value);
    fetchSkills(true);
  };

  // 视图切换
  const toggleViewMode = () => {
    setViewMode(viewMode === "masonry" ? "list" : "masonry");
  };

  // 分类切换
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    fetchSkills(true);
  };

  // 初始化加载
  useEffect(() => {
    fetchSkills(true);
  }, [selectedCategory]);

  // 下拉刷新
  const onRefresh = async () => {
    await fetchSkills(true);
  };

  // 上拉加载更多
  const onScrollToLower = async () => {
    if (hasMore && !loading) {
      await fetchSkills();
    }
  };

  return (
    <View className="skills-page h-screen bg-secondary-50 flex flex-col">
      {/* 搜索栏 */}
      <View className="sticky top-0 z-10 bg-white/90 backdrop-blur-soft px-4 py-3 border-b border-gray-100">
        <View className="flex items-center gap-3">
          <View className="flex-1 relative">
            <Input
              className="search-input"
              placeholder="搜索技能服务"
              value={searchValue}
              onInput={(e) => handleSearch(e.detail.value)}
            />
            <View className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </View>
          </View>
          <View className="flex items-center gap-2">
            <View
              className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-full cursor-pointer"
              onClick={toggleViewMode}
            >
              {viewMode === "masonry" ? "📋" : "🔲"}
            </View>
            <View
              className="w-9 h-9 flex items-center justify-center text-white rounded-full cursor-pointer"
              style={{ backgroundColor: "#D946EF" }}
              onClick={() => Taro.navigateTo({ url: "/pages/skills/create" })}
            >
              ➕
            </View>
          </View>
        </View>
      </View>

      {/* 分类标签 */}
      <View className="bg-white border-b border-gray-100 px-4">
        <ScrollView className="category-scroll" scrollX>
          <View className="flex gap-3 py-3">
            {categories.map((category) => (
              <View
                key={category}
                className={`skill-tag ${selectedCategory === category ? "skill-tag-active" : ""}`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView
        className="flex-1 px-4"
        scrollY
        refresherEnabled
        onRefresherRefresh={onRefresh}
        onScrollToLower={onScrollToLower}
      >
        {/* 内容区域 */}
        {viewMode === "masonry" ? (
          <Masonry columns={2} gap={3}>
            {skills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} layout="masonry" />
            ))}
          </Masonry>
        ) : (
          <View className="space-y-4">
            {skills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} layout="list" />
            ))}
          </View>
        )}

        {/* 加载状态 */}
        {loading && (
          <View className="text-center py-4 text-gray-500">加载中...</View>
        )}

        {!hasMore && skills.length > 0 && (
          <View className="text-center py-4 text-gray-500">没有更多内容了</View>
        )}
      </ScrollView>
    </View>
  );
}
