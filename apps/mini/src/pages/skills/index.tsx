import { View, ScrollView } from "@tarojs/components";
import { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import Banner from "../../components/Banner";
import SkillCard from "../../components/SkillCard";
import "./index.scss";

interface ISkill {
  id: string;
  title: string;
  price: number;
  images: string[];
  author: {
    avatar: string;
    nickname: string;
  };
}

export default function SkillsIndex() {
  const [skills, setSkills] = useState<ISkill[]>([]);
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    fetchSkills();
    fetchBanners();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await Taro.request({
        url: "/api/skills",
        method: "GET",
      });
      setSkills(res.data.data);
    } catch (error) {
      Taro.showToast({ title: "加载失败", icon: "none" });
    }
  };

  const fetchBanners = async () => {
    try {
      const res = await Taro.request({
        url: "/api/banners?scene=SKILLS",
        method: "GET",
      });
      setBanners(res.data.data);
    } catch (error) {
      console.error("Banner加载失败", error);
    }
  };

  return (
    <ScrollView className="skills-page">
      {banners.map((banner) => (
        <Banner
          key={banner.id}
          data={{
            id: banner.id,
            imageUrl: banner.imageUrl,
            linkUrl: banner.linkUrl,
          }}
        />
      ))}

      <View className="skills-list">
        {skills.map((skill) => (
          <SkillCard key={skill.id} data={skill} />
        ))}
      </View>
    </ScrollView>
  );
}
