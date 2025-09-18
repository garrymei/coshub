import { View, Text, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { Skill } from "@/types";
import "./index.scss";

interface SkillCardProps {
  skill: Skill;
  layout?: "masonry" | "list";
  onContact?: (skillId: string) => void;
}

export default function SkillCard({
  skill,
  layout = "masonry",
  onContact,
}: SkillCardProps) {
  const handleCardClick = () => {
    Taro.navigateTo({ url: `/pages/skills/detail?id=${skill.id}` });
  };

  const handleContact = (e: any) => {
    e.stopPropagation();
    if (onContact) {
      onContact(skill.id);
    }
  };

  const getCategoryName = (category: string) => {
    const names = {
      makeup: "化妆",
      photography: "摄影",
      editing: "后期",
      props: "道具",
      wigs: "假发",
    };
    return names[category as keyof typeof names] || category;
  };

  return (
    <View
      className={`skill-card skill-card--${layout}`}
      hoverClass="skill-card--hover"
      onClick={handleCardClick}
    >
      {layout === "masonry" ? (
        <>
          {/* 瀑布流布局 */}
          <View className="skill-card__media">
            {skill.category && (
              <Text className="skill-card__tag">
                {getCategoryName(skill.category)}
              </Text>
            )}
            <Image
              className="skill-card__img"
              src={skill.images[0]}
              mode="aspectFill"
              lazyLoad
            />
          </View>

          <View className="skill-card__body">
            <Text className="skill-card__title">{skill.title}</Text>
            <View className="skill-card__meta">
              <View className="skill-card__author-info">
                <Image
                  className="skill-card__avatar"
                  src={skill.user.avatar}
                />
                <Text className="skill-card__author">{skill.user.nickname}</Text>
              </View>
              <Text className="skill-card__price">
                {skill.price > 0 ? `￥${skill.price}` : "议价"}
              </Text>
            </View>
          </View>
        </>
      ) : (
        <>
          {/* 列表布局 */}
          <View className="skill-card__media skill-card__media--list">
            <Image
              className="skill-card__img skill-card__img--list"
              src={skill.images[0]}
              mode="aspectFill"
              lazyLoad
            />
            {skill.category && (
              <Text className="skill-card__tag skill-card__tag--list">
                {getCategoryName(skill.category)}
              </Text>
            )}
          </View>

          <View className="skill-card__body skill-card__body--list">
            <View className="skill-card__header">
              <Text className="skill-card__title skill-card__title--list">
                {skill.title}
              </Text>
            </View>

            <Text className="skill-card__description">
              {skill.description}
            </Text>

            <View className="skill-card__meta skill-card__meta--list">
              <View className="skill-card__author-info">
                <Image
                  className="skill-card__avatar"
                  src={skill.user.avatar}
                />
                <Text className="skill-card__author">{skill.user.nickname}</Text>
              </View>
              <Text className="skill-card__price skill-card__price--list">
                {skill.price > 0 ? `￥${skill.price}` : "议价"}
              </Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
}
