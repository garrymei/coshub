import { UserLevel, SkillCategory, PostType } from "@coshub/types";

// 模拟用户数据
const mockUser = {
  id: "1",
  username: "cosplay_lover",
  email: "user@coshub.com",
  level: UserLevel.REGULAR,
  isActive: true,
  isVerified: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// 模拟技能数据
const featuredSkills = [
  { category: SkillCategory.COSPLAY, name: "Cosplay 表演", icon: "🎨" },
  { category: SkillCategory.PHOTOGRAPHY, name: "摄影技术", icon: "📷" },
  { category: SkillCategory.MAKEUP, name: "化妆技巧", icon: "💄" },
  { category: SkillCategory.PROP_MAKING, name: "道具制作", icon: "🔨" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-coshub-primary via-coshub-secondary to-coshub-accent">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-8 animate-pulse">
            Coshub Web
          </h1>
          <div className="bg-white/20 backdrop-blur-lg rounded-xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-white mb-4">
              🎌 二次元交流网站
            </h2>
            <p className="text-white/90 text-lg mb-6">
              专为二次元爱好者设计的现代化交流平台
            </p>

            {/* 展示用户等级 */}
            <div className="bg-white/10 rounded-lg p-4 mb-6">
              <p className="text-white text-sm">
                👤 模拟用户: {mockUser.username} ({mockUser.level})
              </p>
            </div>

            {/* 技能分类展示 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white mb-6">
              {featuredSkills.map((skill, index) => (
                <div key={index} className="bg-white/10 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">
                    {skill.icon} {skill.name}
                  </h3>
                  <p className="text-sm opacity-90">{skill.category}</p>
                </div>
              ))}
            </div>

            {/* 快速导航 */}
            <div className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href="/skill-posts"
                  className="bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors group"
                >
                  <h3 className="font-semibold mb-2 text-white group-hover:text-coshub-accent">
                    🎯 技能帖广场
                  </h3>
                  <p className="text-sm text-white/90">
                    发现技能服务，连接二次元伙伴
                  </p>
                </a>
                <a
                  href="/skill-posts/create"
                  className="bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors group"
                >
                  <h3 className="font-semibold mb-2 text-white group-hover:text-coshub-accent">
                    ✨ 发布技能
                  </h3>
                  <p className="text-sm text-white/90">分享你的专业技能</p>
                </a>
              </div>
            </div>

            <div className="mt-8 text-sm text-white/70">
              <p>🚀 Web 应用运行在端口 3000</p>
              <p>📦 使用共享类型: @coshub/types</p>
              <p>📱 当前版本：v0.1.0 (开发中)</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
