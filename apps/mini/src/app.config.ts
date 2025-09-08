export default defineAppConfig({
  pages: [
    "pages/home/index",
    "pages/plaza/index",
    "pages/skills/index",
    "pages/me/index",
    "pages/login/index",
    "pages/feed/detail",
    "pages/skills/detail",
    "pages/skills/create",
    "pages/feed/create",
    "pages/webview/index",
    "pages/post/new/index",
    "pages/me/profile",
    "pages/me/collections",
    "pages/me/posts",
    "pages/me/settings",
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#D946EF",
    navigationBarTitleText: "Coshub",
    navigationBarTextStyle: "white",
    backgroundColor: "#FEF2F2",
    navigationStyle: "custom",
    enablePullDownRefresh: true,
    onReachBottomDistance: 50,
    networkTimeout: {
      request: 60000,
      connectSocket: 60000,
      uploadFile: 60000,
      downloadFile: 60000,
    },
  },
  tabBar: {
    color: "#6b7280",
    selectedColor: "#D946EF",
    backgroundColor: "#ffffff",
    borderStyle: "black",
    list: [
      {
        pagePath: "pages/home/index",
        text: "首页",
        iconPath: "assets/images/tab-feed.png",
        selectedIconPath: "assets/images/tab-feed-active.png",
      },
      {
        pagePath: "pages/plaza/index",
        text: "广场",
        iconPath: "assets/images/tab-plaza.png",
        selectedIconPath: "assets/images/tab-plaza-active.png",
      },
      {
        pagePath: "pages/skills/index",
        text: "技能",
        iconPath: "assets/images/tab-skills.png",
        selectedIconPath: "assets/images/tab-skills-active.png",
      },
      {
        pagePath: "pages/me/index",
        text: "我的",
        iconPath: "assets/images/tab-me.png",
        selectedIconPath: "assets/images/tab-me-active.png",
      },
    ],
  },
  permission: {
    "scope.userLocation": {
      desc: "你的位置信息将用于推荐附近的内容",
    },
    "scope.writePhotosAlbum": {
      desc: "需要保存图片到相册",
    },
    "scope.record": {
      desc: "需要录制音频",
    },
  },
  requiredBackgroundModes: ["location", "audio"],
  navigateToMiniProgramAppIdList: [],
  sitemapLocation: "sitemap.json",
  preloadRule: {
    "pages/feed/index": {
      network: "all",
      packages: [],
    },
  },
  debug: false,
  functionalPages: true,
});

function defineAppConfig(config: any) {
  return config;
}
