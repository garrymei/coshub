import { Component, ReactNode } from "react";
import "./app.scss";

// 声明wx对象
declare const wx: {
  getStorageSync(key: string): any;
  switchTab(options: { url: string }): void;
};

class App extends Component<{ children?: ReactNode }> {
  componentDidMount() {
    // 检查登录状态
    this.checkLoginStatus();
  }

  // 检查登录状态
  checkLoginStatus = () => {
    try {
      const token = wx.getStorageSync("token");
      const userInfo = wx.getStorageSync("userInfo");

      if (!token || !userInfo) {
        // 如果没有登录信息，可以在这里处理
        console.log("用户未登录");
      } else {
        console.log("用户已登录");
        // 已登录用户重定向到分享页
        wx.switchTab({
          url: '/pages/feed/index'
        });
      }
    } catch (error) {
      console.error("检查登录状态失败:", error);
    }
  };

  // 在入口组件不会渲染任何内容
  // 这个方法返回一个空的React元素
  render() {
    // this.props.children 是将要被渲染的页面
    return this.props.children;
  }
}

export default App;
