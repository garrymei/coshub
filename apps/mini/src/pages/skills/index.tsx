import { View, ScrollView, Picker } from "@tarojs/components";
import { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import Banner from "@/components/Banner";
import SkillCard from "@/components/SkillCard";
import { getPosts } from "@/services/post";
import "./index.scss";

interface ISkill {
  id: string;
  title: string;
  price: number;
  city: string;
  tags: string[];
  coverImage: string;
  role: string;
}

export default function SkillsIndex() {
  const [skills, setSkills] = useState<ISkill[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);
  
  // 筛选条件
  const [city, setCity] = useState("");
  const [role, setRole] = useState("");
  const [priceRange, setPriceRange] = useState("");
  
  const cities = ["全部", "北京", "上海", "广州", "深圳", "杭州", "成都"];
  const roles = ["全部", "画师", "模型师", "声优", "程序员", "策划"];
  const priceRanges = ["全部", "0-100", "100-500", "500-1000", "1000以上"];

  // 获取技能数据
  const fetchSkills = async (refresh = false) => {
    if (loading) return;

    setLoading(true);
    try {
      // 处理价格区间
      let priceMin, priceMax;
      if (priceRange === "0-100") {
        priceMin = 0;
        priceMax = 100;
      } else if (priceRange === "100-500") {
        priceMin = 100;
        priceMax = 500;
      } else if (priceRange === "500-1000") {
        priceMin = 500;
        priceMax = 1000;
      } else if (priceRange === "1000以上") {
        priceMin = 1000;
        priceMax = undefined;
      }

      const res = await getPosts({
        type: "skill",
        cursor: refresh ? null : cursor,
        city: city === "全部" ? undefined : city,
        role: role === "全部" ? undefined : role,
        priceMin,
        priceMax
      });
      
      const list = res?.data || [];
      const nextCursor = res?.nextCursor ?? null;
      const more = res?.hasMore ?? list.length > 0;

      setSkills((prev) => (refresh ? list : [...prev, ...list]));
      setCursor(nextCursor);
      setHasMore(more);
    } catch (error) {
      Taro.showToast({ title: "加载失败", icon: "none" });
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    fetchSkills(true);
  }, [city, role, priceRange]);

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
    <ScrollView
      className="skills-page"
      scrollY
      refresherEnabled
      onRefresherRefresh={onRefresh}
      onScrollToLower={onScrollToLower}
    >
      <Banner scene="skills" />

      <View className="filter-bar">
        <Picker
          mode="selector"
          range={cities}
          onChange={(e) => setCity(cities[e.detail.value])}
        >
          <View className="filter-item">
            {city || "城市"}
          </View>
        </Picker>
        
        <Picker
          mode="selector"
          range={roles}
          onChange={(e) => setRole(roles[e.detail.value])}
        >
          <View className="filter-item">
            {role || "角色"}
          </View>
        </Picker>
        
        <Picker
          mode="selector"
          range={priceRanges}
          onChange={(e) => setPriceRange(priceRanges[e.detail.value])}
        >
          <View className="filter-item">
            {priceRange || "价格"}
          </View>
        </Picker>
      </View>

      <View className="skills-list">
        {skills.map((skill) => (
          <SkillCard key={skill.id} {...skill} />
        ))}
      </View>
      
      {loading && <View className="loading">加载中...</View>}
      {!hasMore && <View className="no-more">没有更多内容了</View>}
    </ScrollView>
  );
}
