import { Component } from "react";
import "./app.scss";

class App extends Component {
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
        // 可以在这里做一些已登录用户的初始化工作
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
