import { Component, ReactNode } from "react";
import Taro from "@tarojs/taro";
import ErrorBoundary from "@/components/ErrorBoundary";
import NetworkStatus from "@/components/NetworkStatus";
import { onNetworkStatusChange } from "@/utils/common";
import "./app.scss";

class App extends Component<{ children?: ReactNode }> {
  componentDidMount() {
    // 检查登录状态
    this.checkLoginStatus();

    // 监听网络状态变化
    this.setupNetworkListener();

    // 监听小程序生命周期
    this.setupLifecycleListeners();
  }

  // 检查登录状态
  checkLoginStatus = () => {
    try {
      const token = Taro.getStorageSync("token");
      const userInfo = Taro.getStorageSync("userInfo");

      if (!token || !userInfo) {
        console.log("用户未登录");
      } else {
        console.log("用户已登录");
      }
    } catch (error) {
      console.error("检查登录状态失败:", error);
    }
  };

  // 设置网络状态监听
  setupNetworkListener = () => {
    onNetworkStatusChange((isConnected) => {
      if (isConnected) {
        console.log("网络已连接");
      } else {
        console.log("网络已断开");
        Taro.showToast({
          title: "网络连接已断开",
          icon: "none",
          duration: 2000,
        });
      }
    });
  };

  // 设置生命周期监听
  setupLifecycleListeners = () => {
    // 监听小程序显示
    Taro.onAppShow((options) => {
      console.log("小程序显示", options);
      // 可以在这里处理分享、扫码等场景
    });

    // 监听小程序隐藏
    Taro.onAppHide(() => {
      console.log("小程序隐藏");
    });

    // 监听错误
    Taro.onError((error) => {
      console.error("小程序错误:", error);
      // 可以在这里上报错误
    });
  };

  // 在入口组件不会渲染任何内容
  // 这个方法返回一个空的React元素
  render() {
    return (
      <ErrorBoundary>
        <NetworkStatus />
        {this.props.children}
      </ErrorBoundary>
    );
  }
}

export default App;
