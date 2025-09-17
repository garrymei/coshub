import { View, Text, Button } from "@tarojs/components";
import { Component, ReactNode } from "react";
import Taro from "@tarojs/taro";
import "./index.scss";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // 可以在这里添加错误上报逻辑
    // reportError(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  handleGoHome = () => {
    Taro.switchTab({ url: "/pages/home/index" });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View className="error-boundary">
          <View className="error-content">
            <View className="error-icon">😵</View>
            <Text className="error-title">出错了</Text>
            <Text className="error-message">
              {this.state.error?.message || "页面加载失败，请重试"}
            </Text>
            <View className="error-actions">
              <Button className="retry-button" onClick={this.handleRetry}>
                重试
              </Button>
              <Button className="home-button" onClick={this.handleGoHome}>
                返回首页
              </Button>
            </View>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}
