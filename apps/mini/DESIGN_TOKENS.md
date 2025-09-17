# Coshub 设计Token系统

## 概述

Coshub 采用统一的设计Token系统，通过CSS变量实现主题统一和暗色模式支持。所有颜色、间距、圆角、阴影等设计元素都通过Token进行管理。

## 设计Token分类

### 1. 品牌色彩 (Brand Colors)

```scss
--coshub-primary: #d946ef;           // 主品牌色
--coshub-primary-weak: #fbcfe8;      // 主色弱化版
--coshub-primary-strong: #a21caf;    // 主色强化版
--coshub-primary-subtle: #fdf2f8;    // 主色微妙版
```

### 2. 中性色彩 (Neutral Colors)

```scss
--coshub-text: #1f2937;              // 主要文字
--coshub-text-weak: #6b7280;         // 次要文字
--coshub-text-subtle: #9ca3af;       // 辅助文字
--coshub-text-inverse: #ffffff;      // 反色文字
```

### 3. 背景色彩 (Background Colors)

```scss
--coshub-bg: #fff6fb;                // 页面背景
--coshub-surface: #ffffff;           // 卡片背景
--coshub-surface-weak: #f9fafb;      // 弱化背景
--coshub-surface-strong: #f3f4f6;    // 强化背景
```

### 4. 边框色彩 (Border Colors)

```scss
--coshub-border: #e5e7eb;            // 主要边框
--coshub-border-weak: #f3f4f6;       // 弱化边框
--coshub-border-strong: #d1d5db;     // 强化边框
```

### 5. 状态色彩 (Status Colors)

```scss
--coshub-success: #10b981;           // 成功状态
--coshub-warning: #f59e0b;           // 警告状态
--coshub-error: #ef4444;             // 错误状态
--coshub-info: #3b82f6;              // 信息状态
```

### 6. 阴影系统 (Shadow System)

```scss
--coshub-shadow-sm: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
--coshub-shadow-md: 0 12rpx 40rpx rgba(217, 70, 239, 0.12);
--coshub-shadow-lg: 0 20rpx 60rpx rgba(217, 70, 239, 0.15);
--coshub-shadow-xl: 0 32rpx 80rpx rgba(217, 70, 239, 0.2);
```

### 7. 圆角系统 (Border Radius)

```scss
--coshub-radius-sm: 8rpx;            // 小圆角
--coshub-radius-md: 12rpx;           // 中圆角
--coshub-radius-lg: 20rpx;           // 大圆角
--coshub-radius-xl: 32rpx;           // 超大圆角
--coshub-radius-full: 9999rpx;       // 完全圆角
```

### 8. 间距系统 (Spacing)

```scss
--coshub-space-xs: 8rpx;             // 超小间距
--coshub-space-sm: 16rpx;            // 小间距
--coshub-space-md: 24rpx;            // 中间距
--coshub-space-lg: 32rpx;            // 大间距
--coshub-space-xl: 48rpx;            // 超大间距
--coshub-space-2xl: 64rpx;           // 特大间距
```

### 9. 字体系统 (Typography)

```scss
--coshub-font-size-xs: 24rpx;        // 超小字体
--coshub-font-size-sm: 28rpx;        // 小字体
--coshub-font-size-md: 32rpx;        // 中字体
--coshub-font-size-lg: 36rpx;        // 大字体
--coshub-font-size-xl: 40rpx;        // 超大字体
--coshub-font-size-2xl: 48rpx;       // 特大字体

--coshub-font-weight-normal: 400;    // 正常字重
--coshub-font-weight-medium: 500;    // 中等字重
--coshub-font-weight-semibold: 600;  // 半粗字重
--coshub-font-weight-bold: 700;      // 粗字重
```

### 10. 动画系统 (Animation)

```scss
--coshub-transition-fast: 150ms ease-out;    // 快速过渡
--coshub-transition-normal: 250ms ease-out;  // 正常过渡
--coshub-transition-slow: 350ms ease-out;    // 慢速过渡
```

### 11. 毛玻璃效果 (Glass Effect)

```scss
--coshub-glass: rgba(255, 255, 255, 0.6);           // 毛玻璃
--coshub-glass-strong: rgba(255, 255, 255, 0.8);    // 强化毛玻璃
--coshub-glass-weak: rgba(255, 255, 255, 0.4);      // 弱化毛玻璃
--coshub-blur: 20rpx;                                // 模糊半径
```

## 暗色模式支持

所有Token都支持暗色模式，通过以下方式实现：

1. **系统自动检测**：`@media (prefers-color-scheme: dark)`
2. **手动切换**：`.dark` 类名

暗色模式下的Token值会相应调整，确保良好的对比度和可读性。

## 使用方法

### 1. 在SCSS中使用

```scss
.my-component {
  background-color: var(--coshub-surface);
  color: var(--coshub-text);
  border-radius: var(--coshub-radius-lg);
  box-shadow: var(--coshub-shadow-md);
  padding: var(--coshub-space-md);
  transition: all var(--coshub-transition-normal);
}
```

### 2. 在Tailwind中使用

```jsx
<div className="bg-surface text-text rounded-lg shadow-md p-md transition-normal">
  内容
</div>
```

### 3. 在组件中使用

```tsx
import { useTheme } from '@/hooks/useTheme';

function MyComponent() {
  const { isDark, mode } = useTheme();
  
  return (
    <div className={isDark ? 'dark' : ''}>
      {/* 组件内容 */}
    </div>
  );
}
```

## 通用样式类

基于设计Token，我们提供了一系列通用样式类：

### 颜色类
- `.primary-color` - 主色文字
- `.primary-bg` - 主色背景
- `.text-weak` - 弱化文字
- `.text-subtle` - 辅助文字

### 背景类
- `.bg-surface` - 卡片背景
- `.bg-surface-weak` - 弱化背景

### 圆角类
- `.rounded-sm` - 小圆角
- `.rounded-lg` - 大圆角
- `.rounded-full` - 完全圆角

### 阴影类
- `.shadow-sm` - 小阴影
- `.shadow-md` - 中阴影
- `.shadow-lg` - 大阴影

### 按钮类
- `.btn` - 基础按钮
- `.btn-primary` - 主要按钮
- `.btn-secondary` - 次要按钮
- `.btn-ghost` - 幽灵按钮

## 主题切换

### 使用ThemeToggle组件

```tsx
import ThemeToggle from '@/components/ThemeToggle';

function SettingsPage() {
  return (
    <div>
      <ThemeToggle />
    </div>
  );
}
```

### 使用useTheme Hook

```tsx
import { useTheme } from '@/hooks/useTheme';

function MyComponent() {
  const { mode, isDark, setTheme, toggleTheme } = useTheme();
  
  return (
    <div>
      <button onClick={toggleTheme}>
        当前模式: {mode}
      </button>
    </div>
  );
}
```

## 最佳实践

1. **始终使用Token**：不要硬编码颜色值，始终使用设计Token
2. **语义化命名**：使用有意义的Token名称，如`--coshub-primary`而不是`--color-1`
3. **响应式设计**：考虑不同屏幕尺寸下的Token使用
4. **无障碍性**：确保颜色对比度符合WCAG标准
5. **性能优化**：合理使用过渡动画，避免过度动画

## 扩展Token

如需添加新的Token，请遵循以下规范：

1. 使用`--coshub-`前缀
2. 使用语义化命名
3. 同时提供亮色和暗色模式的值
4. 更新此文档
5. 在通用样式类中添加对应的工具类

## 示例

### 卡片组件

```scss
.card {
  background-color: var(--coshub-surface);
  border-radius: var(--coshub-radius-lg);
  box-shadow: var(--coshub-shadow-md);
  padding: var(--coshub-space-md);
  border: 1px solid var(--coshub-border-weak);
  transition: all var(--coshub-transition-normal);
  
  &:hover {
    box-shadow: var(--coshub-shadow-lg);
    transform: translateY(-2rpx);
  }
}
```

### 按钮组件

```scss
.btn-primary {
  background-color: var(--coshub-primary);
  color: var(--coshub-text-inverse);
  border-radius: var(--coshub-radius-lg);
  padding: var(--coshub-space-sm) var(--coshub-space-md);
  font-size: var(--coshub-font-size-md);
  font-weight: var(--coshub-font-weight-medium);
  transition: all var(--coshub-transition-fast);
  
  &:hover {
    background-color: var(--coshub-primary-strong);
    transform: translateY(-1rpx);
    box-shadow: var(--coshub-shadow-md);
  }
}
```

通过统一的设计Token系统，我们可以确保整个应用的视觉一致性和可维护性，同时支持灵活的主题切换功能。
