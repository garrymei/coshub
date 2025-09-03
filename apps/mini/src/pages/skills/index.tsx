import { View, Input, ScrollView } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import React, { useState, useEffect } from "react";
import { SkillPost } from "../../types";
import { skillApi } from "../../services/api";
import { showToast, showLoading, hideLoading } from "../../utils/common";
import SkillCard from "../../components/SkillCard";
import Banner from "../../components/Banner";
import "./index.scss";

const SkillsPage: React.FC = () => {
  const [skills, setSkills] = useState<SkillPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const tags = [
    "摄影",
    "妆娘",
    "毛娘",
    "道具师",
    "后期",
    "修图",
    "场地",
    "服装",
  ];

  useLoad(() => {
    fetchSkills();
  });

  const fetchSkills = async () => {
    try {
      if (!refreshing) {
        showLoading();
      }

      const data = await skillApi.getSkills({
        tags: selectedTags.length > 0 ? selectedTags : undefined,
      });

      setSkills(data);
    } catch (error) {
      console.error("获取技能列表失败:", error);
      showToast("获取技能列表失败", "error");
    } finally {
      hideLoading();
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchSkills();
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    // 实际项目中可能需要调用搜索API
  };

  const handleTagSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddSkill = () => {
    Taro.navigateTo({
      url: "/pages/skills/create",
    });
  };

  return (
    <View className="skills-page">
      <View className="search-bar">
        <Input
          className="search-input"
          placeholder="搜索技能"
          value={searchValue}
          onInput={(e) => handleSearch(e.detail.value)}
        />
      </View>

      <Banner type="skill" />

      <View className="tags-container">
        <ScrollView scrollX className="tags-scroll">
          {tags.map((tag) => (
            <View
              key={tag}
              className={`tag-item ${selectedTags.includes(tag) ? "active" : ""}`}
              onClick={() => handleTagSelect(tag)}
            >
              {tag}
            </View>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        className="skills-container"
        scrollY
        enableBackToTop
        refresherEnabled
        refresherTriggered={refreshing}
        onRefresherRefresh={handleRefresh}
      >
        {skills.length > 0 ? (
          skills.map((skill) => <SkillCard key={skill.id} skill={skill} />)
        ) : (
          <View className="empty-state">
            {loading ? "加载中..." : "暂无技能，快来发布吧！"}
          </View>
        )}
      </ScrollView>

      <View className="add-button" onClick={handleAddSkill}>
        <View className="add-icon">+</View>
      </View>
    </View>
  );
};

export default SkillsPage;
