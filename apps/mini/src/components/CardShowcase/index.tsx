import { View, Text } from "@tarojs/components";
import SkillCard from "@/components/SkillCard";
import FeedCard from "@/components/FeedCard";
import ThemeToggle from "@/components/ThemeToggle";
import { Skill, Post } from "@/types";
import "./index.scss";

interface CardShowcaseProps {
  skills?: Skill[];
  posts?: Post[];
  onSkillContact?: (skillId: string) => void;
  onPostLike?: (postId: string) => void;
  onPostCollect?: (postId: string) => void;
  onPostComment?: (postId: string) => void;
}

export default function CardShowcase({
  skills = [],
  posts = [],
  onSkillContact,
  onPostLike,
  onPostCollect,
  onPostComment,
}: CardShowcaseProps) {
  // 模拟数据
  const mockSkills: Skill[] =
    skills.length > 0
      ? skills
      : [
          {
            id: "1",
            userId: "1",
            title: "专业二次元化妆服务",
            description: "提供专业的cosplay化妆服务，包括眼妆、底妆、特效妆等",
            price: 200,
            category: "makeup",
            images: [
              "https://via.placeholder.com/300x200/FF6B9D/FFFFFF?text=化妆",
            ],
            tags: ["化妆", "cosplay", "特效妆"],
            city: "北京",
            user: {
              id: "1",
              nickname: "化妆师小美",
              avatar: "https://via.placeholder.com/40x40/FF6B9D/FFFFFF?text=美",
              bio: "专业cosplay化妆师",
              location: "北京",
              tags: ["化妆", "cosplay"],
              followingCount: 120,
              followersCount: 500,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "2",
            userId: "2",
            title: "cosplay摄影服务",
            description: "专业cosplay摄影，提供外景拍摄和室内拍摄",
            price: 500,
            category: "photography",
            images: [
              "https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=摄影",
            ],
            tags: ["摄影", "cosplay", "外景"],
            city: "上海",
            user: {
              id: "2",
              nickname: "摄影师阿明",
              avatar: "https://via.placeholder.com/40x40/4F46E5/FFFFFF?text=明",
              bio: "专业cosplay摄影师",
              location: "上海",
              tags: ["摄影", "cosplay"],
              followingCount: 200,
              followersCount: 800,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];

  const mockPosts: Post[] =
    posts.length > 0
      ? posts
      : [
          {
            id: "1",
            authorId: "1",
            content:
              "今天拍了一套新的cosplay照片，效果超级棒！分享给大家看看～",
            images: [
              "https://via.placeholder.com/300x400/FF6B9D/FFFFFF?text=cos1",
              "https://via.placeholder.com/300x300/4F46E5/FFFFFF?text=cos2",
            ],
            user: {
              id: "1",
              nickname: "coser小樱",
              avatar: "https://via.placeholder.com/40x40/FF6B9D/FFFFFF?text=樱",
              bio: "cosplay爱好者",
              location: "北京",
              tags: ["cosplay", "摄影"],
              followingCount: 50,
              followersCount: 200,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            likeCount: 128,
            commentCount: 23,
            collectCount: 45,
            isLiked: false,
            isCollected: false,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "2",
            authorId: "2",
            content: "新买的假发到货了，质量真的很不错！推荐给大家",
            images: [
              "https://via.placeholder.com/300x200/10B981/FFFFFF?text=假发",
            ],
            user: {
              id: "2",
              nickname: "道具师小李",
              avatar: "https://via.placeholder.com/40x40/10B981/FFFFFF?text=李",
              bio: "道具制作专家",
              location: "上海",
              tags: ["道具", "制作"],
              followingCount: 80,
              followersCount: 300,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            likeCount: 67,
            commentCount: 12,
            collectCount: 28,
            isLiked: true,
            isCollected: false,
            createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];

  return (
    <View className="card-showcase">
      {/* 主题切换器 */}
      <View className="card-showcase__header">
        <Text className="card-showcase__title">卡片展示</Text>
        <ThemeToggle size="medium" />
      </View>

      {/* 技能卡片展示 */}
      <View className="card-showcase__section">
        <Text className="card-showcase__section-title">技能服务</Text>
        <View className="card-showcase__cards">
          {mockSkills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              layout="masonry"
              onContact={onSkillContact}
            />
          ))}
        </View>
      </View>

      {/* 分享卡片展示 */}
      <View className="card-showcase__section">
        <Text className="card-showcase__section-title">社区分享</Text>
        <View className="card-showcase__cards">
          {mockPosts.map((post) => (
            <FeedCard
              key={post.id}
              post={post}
              layout="masonry"
              onLike={onPostLike}
              onCollect={onPostCollect}
              onComment={onPostComment}
            />
          ))}
        </View>
      </View>
    </View>
  );
}
