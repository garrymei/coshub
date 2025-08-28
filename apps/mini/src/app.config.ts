export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/skill-posts/index',
    'pages/skill-posts/detail',
    'pages/skill-posts/create'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FF6B9D',
    navigationBarTitleText: 'Coshub Mini',
    navigationBarTextStyle: 'white',
    backgroundColor: '#f8f9fa'
  },
  tabBar: {
    color: '#666',
    selectedColor: '#FF6B9D',
    backgroundColor: '#fafafa',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: 'assets/tab-home.png',
        selectedIconPath: 'assets/tab-home-active.png'
      }
    ]
  },
  sitemapLocation: 'sitemap.json'
})

function defineAppConfig(config: any) {
  return config
}
