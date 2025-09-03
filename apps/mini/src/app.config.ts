export default defineAppConfig({
  pages: [
    "pages/skills/index",
    "pages/skills/detail",
    "pages/skills/create",
    "pages/feed/index",
    "pages/feed/detail",
    "pages/feed/create",
    "pages/me/index",
    "pages/me/profile",
    "pages/me/collections",
    "pages/me/posts",
    "pages/me/settings",
    "pages/login/index",
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#FF6B9D",
    navigationBarTitleText: "Coshub",
    navigationBarTextStyle: "white",
    backgroundColor: "#f8f9fa",
  },
  tabBar: {
    color: "#888",
    selectedColor: "#FF6B9D",
    backgroundColor: "#ffffff",
    borderStyle: "black",
    list: [
      {
        pagePath: "pages/skills/index",
        text: "技能",
        iconPath: "assets/tab-skills.png",
        selectedIconPath: "assets/tab-skills-active.png",
      },
      {
        pagePath: "pages/feed/index",
        text: "分享",
        iconPath: "assets/tab-feed.png",
        selectedIconPath: "assets/tab-feed-active.png",
      },
      {
        pagePath: "pages/me/index",
        text: "我的",
        iconPath: "assets/tab-me.png",
        selectedIconPath: "assets/tab-me-active.png",
      },
    ],
  },
  sitemapLocation: "sitemap.json",
});

function defineAppConfig(config: any) {
  return config;
}
