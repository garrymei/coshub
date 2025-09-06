import { View, Text, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { Skill } from "@/services/api";

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

  const getCategoryColor = (category: string) => {
    const colors = {
      makeup: "bg-pink-100 text-pink-800",
      photography: "bg-blue-100 text-blue-800",
      editing: "bg-purple-100 text-purple-800",
      props: "bg-green-100 text-green-800",
      wigs: "bg-yellow-100 text-yellow-800",
    };
    return (
      colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
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
      className={`skill-card card transition-transform duration-300 hover:shadow-medium hover:-translate-y-1 ${layout}`}
      onClick={handleCardClick}
    >
      {layout === "masonry" ? (
        <>
          {/* 瀑布流布局 */}
          <View className="relative">
            <Image
              className="w-full h-48 object-cover"
              src={skill.images[0]}
              mode="aspectFill"
            />
            <View className="absolute top-2 left-2">
              <View
                className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(skill.category)}`}
              >
                {getCategoryName(skill.category)}
              </View>
            </View>
          </View>

          <View className="p-3">
            <Text className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2">
              {skill.title}
            </Text>

            <View className="flex items-center justify-between mb-2">
              <View className="flex items-center">
                <Image
                  className="w-5 h-5 rounded-full mr-2"
                  src={skill.user.avatar}
                />
                <Text className="text-xs text-gray-500 truncate flex-1">
                  {skill.user.nickname}
                </Text>
              </View>
              <Text className="text-sm font-bold text-primary-600">
                {skill.price > 0 ? `￥${skill.price}` : "议价"}
              </Text>
            </View>
          </View>
        </>
      ) : (
        <>
          {/* 列表布局 */}
          <View className="flex p-4">
            <Image
              className="w-20 h-20 rounded-lg mr-3 flex-shrink-0"
              src={skill.images[0]}
              mode="aspectFill"
            />

            <View className="flex-1 min-w-0">
              <View className="flex items-start justify-between mb-2">
                <Text className="text-base font-bold text-gray-800 truncate">
                  {skill.title}
                </Text>
                <View
                  className={`px-2 py-1 rounded-full text-xs font-semibold ml-2 ${getCategoryColor(skill.category)}`}
                >
                  {getCategoryName(skill.category)}
                </View>
              </View>

              <Text className="text-sm text-gray-500 mb-2 line-clamp-2">
                {skill.description}
              </Text>

              <View className="flex items-center justify-between">
                <View className="flex items-center text-sm text-gray-500">
                  <Image
                    className="w-5 h-5 rounded-full mr-2"
                    src={skill.user.avatar}
                  />
                  <Text className="text-sm">{skill.user.nickname}</Text>
                </View>
                <Text className="text-lg font-bold text-primary-600">
                  {skill.price > 0 ? `￥${skill.price}` : "议价"}
                </Text>
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
}
