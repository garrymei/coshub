import { useState, useEffect } from "react";
import Taro from "@tarojs/taro";

export type ThemeMode = "light" | "dark" | "auto";

interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;
  isSystemDark: boolean;
}

export function useTheme() {
  const [themeState, setThemeState] = useState<ThemeState>({
    mode: "auto",
    isDark: false,
    isSystemDark: false,
  });

  useEffect(() => {
    // 初始化主题
    initializeTheme();
    
    // 监听主题变化事件
    const handleThemeChange = (event: any) => {
      const { isDark } = event.detail || {};
      setThemeState(prev => ({
        ...prev,
        isDark,
      }));
    };

    Taro.eventCenter.on("theme-change", handleThemeChange);

    return () => {
      Taro.eventCenter.off("theme-change", handleThemeChange);
    };
  }, []);

  // 初始化主题
  const initializeTheme = () => {
    try {
      // 从本地存储读取主题设置
      const savedMode = Taro.getStorageSync("theme-mode") as ThemeMode;
      const mode = savedMode || "auto";
      
      // 检查系统主题（小程序中暂时无法直接检测，使用默认值）
      const isSystemDark = false; // 后续可以集成系统主题检测
      
      let isDark = false;
      if (mode === "light") {
        isDark = false;
      } else if (mode === "dark") {
        isDark = true;
      } else if (mode === "auto") {
        isDark = isSystemDark;
      }

      setThemeState({
        mode,
        isDark,
        isSystemDark,
      });

      // 应用主题
      applyTheme(mode, isDark);
    } catch (error) {
      console.error("初始化主题失败:", error);
    }
  };

  // 应用主题
  const applyTheme = (mode: ThemeMode, isDark: boolean) => {
    try {
      // 更新页面类名
      const pages = Taro.getCurrentPages();
      if (pages.length > 0) {
        const currentPage = pages[pages.length - 1];
        if (currentPage) {
          // 通过事件通知页面更新主题
          Taro.eventCenter.trigger("theme-change", { isDark, mode });
        }
      }

      // 更新全局状态
      setThemeState(prev => ({
        ...prev,
        mode,
        isDark,
      }));
    } catch (error) {
      console.error("应用主题失败:", error);
    }
  };

  // 切换主题
  const setTheme = (mode: ThemeMode) => {
    try {
      // 保存到本地存储
      Taro.setStorageSync("theme-mode", mode);
      
      // 计算新的暗色状态
      let isDark = false;
      if (mode === "light") {
        isDark = false;
      } else if (mode === "dark") {
        isDark = true;
      } else if (mode === "auto") {
        isDark = themeState.isSystemDark;
      }

      // 应用主题
      applyTheme(mode, isDark);

      // 显示提示
      const modeText = {
        light: "浅色",
        dark: "深色", 
        auto: "跟随系统"
      }[mode];

      Taro.showToast({
        title: `已切换到${modeText}模式`,
        icon: "none",
        duration: 1500,
      });
    } catch (error) {
      console.error("切换主题失败:", error);
      Taro.showToast({
        title: "切换主题失败",
        icon: "error",
      });
    }
  };

  // 切换下一个主题模式
  const toggleTheme = () => {
    const modes: ThemeMode[] = ["light", "dark", "auto"];
    const currentIndex = modes.indexOf(themeState.mode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setTheme(modes[nextIndex]);
  };

  // 获取主题图标
  const getThemeIcon = (mode: ThemeMode) => {
    switch (mode) {
      case "light":
        return "☀️";
      case "dark":
        return "🌙";
      case "auto":
        return "🔄";
    }
  };

  // 获取主题文本
  const getThemeText = (mode: ThemeMode) => {
    switch (mode) {
      case "light":
        return "浅色";
      case "dark":
        return "深色";
      case "auto":
        return "跟随系统";
    }
  };

  return {
    ...themeState,
    setTheme,
    toggleTheme,
    getThemeIcon,
    getThemeText,
  };
}
