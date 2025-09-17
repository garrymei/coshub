"use client";

import { useState, useEffect } from "react";

interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: string;
  fontFamily: string;
}

export default function ThemeManagementPage() {
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>({
    primaryColor: "#D946EF",
    secondaryColor: "#9D5CFF", 
    accentColor: "#FFE66D",
    backgroundColor: "#ffffff",
    textColor: "#030213",
    borderRadius: "0.625rem",
    fontFamily: "Inter",
  });

  const [previewMode, setPreviewMode] = useState(false);

  // 保存主题配置
  const handleSave = async () => {
    try {
      // TODO: 调用API保存主题配置
      console.log("保存主题配置:", themeConfig);
      alert("主题配置已保存！");
    } catch (error) {
      console.error("保存失败:", error);
      alert("保存失败，请重试");
    }
  };

  // 重置为默认主题
  const handleReset = () => {
    if (confirm("确定要重置为默认主题吗？")) {
      setThemeConfig({
        primaryColor: "#D946EF",
        secondaryColor: "#9D5CFF",
        accentColor: "#FFE66D", 
        backgroundColor: "#ffffff",
        textColor: "#030213",
        borderRadius: "0.625rem",
        fontFamily: "Inter",
      });
    }
  };

  // 预览主题效果
  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">主题管理</h1>
        <div className="flex space-x-3">
          <button
            onClick={togglePreview}
            className={`px-4 py-2 rounded-md transition-colors ${
              previewMode 
                ? "bg-green-600 text-white hover:bg-green-700" 
                : "bg-gray-600 text-white hover:bg-gray-700"
            }`}
          >
            {previewMode ? "退出预览" : "预览主题"}
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
          >
            重置默认
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            保存配置
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 主题配置表单 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">主题配置</h3>
          
          <div className="space-y-4">
            {/* 主色调 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                主色调 (Primary Color)
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={themeConfig.primaryColor}
                  onChange={(e) => setThemeConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={themeConfig.primaryColor}
                  onChange={(e) => setThemeConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                  placeholder="#D946EF"
                />
              </div>
            </div>

            {/* 辅助色 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                辅助色 (Secondary Color)
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={themeConfig.secondaryColor}
                  onChange={(e) => setThemeConfig(prev => ({ ...prev, secondaryColor: e.target.value }))}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={themeConfig.secondaryColor}
                  onChange={(e) => setThemeConfig(prev => ({ ...prev, secondaryColor: e.target.value }))}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                  placeholder="#9D5CFF"
                />
              </div>
            </div>

            {/* 强调色 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                强调色 (Accent Color)
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={themeConfig.accentColor}
                  onChange={(e) => setThemeConfig(prev => ({ ...prev, accentColor: e.target.value }))}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={themeConfig.accentColor}
                  onChange={(e) => setThemeConfig(prev => ({ ...prev, accentColor: e.target.value }))}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                  placeholder="#FFE66D"
                />
              </div>
            </div>

            {/* 背景色 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                背景色 (Background Color)
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={themeConfig.backgroundColor}
                  onChange={(e) => setThemeConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={themeConfig.backgroundColor}
                  onChange={(e) => setThemeConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                  placeholder="#ffffff"
                />
              </div>
            </div>

            {/* 文字颜色 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                文字颜色 (Text Color)
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={themeConfig.textColor}
                  onChange={(e) => setThemeConfig(prev => ({ ...prev, textColor: e.target.value }))}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={themeConfig.textColor}
                  onChange={(e) => setThemeConfig(prev => ({ ...prev, textColor: e.target.value }))}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                  placeholder="#030213"
                />
              </div>
            </div>

            {/* 圆角大小 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                圆角大小 (Border Radius)
              </label>
              <select
                value={themeConfig.borderRadius}
                onChange={(e) => setThemeConfig(prev => ({ ...prev, borderRadius: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="0">无圆角</option>
                <option value="0.25rem">小圆角</option>
                <option value="0.5rem">中圆角</option>
                <option value="0.625rem">大圆角</option>
                <option value="1rem">超大圆角</option>
              </select>
            </div>

            {/* 字体 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                字体 (Font Family)
              </label>
              <select
                value={themeConfig.fontFamily}
                onChange={(e) => setThemeConfig(prev => ({ ...prev, fontFamily: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="Inter">Inter</option>
                <option value="PingFang SC">PingFang SC</option>
                <option value="Microsoft YaHei">Microsoft YaHei</option>
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
              </select>
            </div>
          </div>
        </div>

        {/* 主题预览 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">主题预览</h3>
          
          <div 
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: themeConfig.backgroundColor,
              color: themeConfig.textColor,
              borderRadius: themeConfig.borderRadius,
              fontFamily: themeConfig.fontFamily,
            }}
          >
            <div className="space-y-4">
              {/* 按钮预览 */}
              <div className="space-x-2">
                <button
                  className="px-4 py-2 text-white rounded-md"
                  style={{ 
                    backgroundColor: themeConfig.primaryColor,
                    borderRadius: themeConfig.borderRadius,
                  }}
                >
                  主要按钮
                </button>
                <button
                  className="px-4 py-2 text-white rounded-md"
                  style={{ 
                    backgroundColor: themeConfig.secondaryColor,
                    borderRadius: themeConfig.borderRadius,
                  }}
                >
                  次要按钮
                </button>
                <button
                  className="px-4 py-2 text-black rounded-md"
                  style={{ 
                    backgroundColor: themeConfig.accentColor,
                    borderRadius: themeConfig.borderRadius,
                  }}
                >
                  强调按钮
                </button>
              </div>

              {/* 卡片预览 */}
              <div 
                className="p-4 border rounded-md"
                style={{ 
                  borderColor: themeConfig.primaryColor + "30",
                  borderRadius: themeConfig.borderRadius,
                }}
              >
                <h4 className="font-semibold mb-2">示例卡片</h4>
                <p className="text-sm opacity-75">
                  这是一个使用当前主题配置的示例卡片，展示了颜色和样式的效果。
                </p>
              </div>

              {/* 链接预览 */}
              <div>
                <a
                  href="#"
                  className="underline"
                  style={{ color: themeConfig.primaryColor }}
                >
                  示例链接
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 应用范围说明 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">应用范围</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• 小程序端：更新 Tailwind 配置和 SCSS 变量</li>
          <li>• Web端：更新 Tailwind 配置和 CSS 变量</li>
          <li>• 管理后台：实时预览主题效果</li>
          <li>• 所有组件：自动应用新的颜色方案</li>
        </ul>
      </div>
    </div>
  );
}
