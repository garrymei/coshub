export default defineAppConfig({
  pages: [
    "pages/feed/index",
    "pages/feed/detail",
    "pages/skills/index",
    "pages/skills/detail",
    "pages/skills/create",
    "pages/feed/create",
    "pages/webview/index",
    "pages/post/new/index",
    "pages/me/index",
    "pages/me/profile",
    "pages/me/collections",
    "pages/me/posts",
    "pages/me/settings",
    "pages/login/index",
  ],
  subPackages: [
    {
      root: "packageA",
      pages: ["pages/settings/account", "pages/settings/notifications"],
    },
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#FF6B9D",
    navigationBarTitleText: "Coshub",
    navigationBarTextStyle: "white",
    backgroundColor: "#f8f9fa",
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
    color: "#888",
    selectedColor: "#FF6B9D",
    backgroundColor: "#ffffff",
    borderStyle: "black",
    list: [
      {
        pagePath: "pages/feed/index",
        text: "发现",
        iconPath: "assets/images/tab-feed.png",
        selectedIconPath: "assets/images/tab-feed-active.png",
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
  navigateToMiniProgramAppIdList: [
    // 实际需要跳转的小程序ID列表
  ],
  sitemapLocation: "sitemap.json",
  preloadRule: {
    "pages/feed/index": {
      network: "all",
      packages: ["packageA"],
    },
  },
  debug: false,
  functionalPages: true,
});

function defineAppConfig(config: any) {
  return config;
}
