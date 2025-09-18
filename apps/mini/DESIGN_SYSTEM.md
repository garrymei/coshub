# Coshub 设计系统

## 🎨 设计语言

Coshub 采用现代化的玻璃拟物设计语言，结合二次元文化特色，打造独特的视觉体验。

### 核心特点

- **玻璃拟物风格**: 使用毛玻璃效果和半透明背景
- **统一主题系统**: 基于 CSS 变量的主题 Token 系统
- **暗色模式支持**: 自动跟随系统主题，支持手动切换
- **轻动效交互**: 微妙的动画和过渡效果
- **响应式设计**: 适配不同屏幕尺寸

## 🎯 主题 Token 系统

### 色彩系统

```scss
/* 品牌色彩 */
--coshub-primary: #d946ef;           /* 主品牌色 */
--coshub-primary-weak: #fbcfe8;      /* 主品牌色弱化 */
--coshub-primary-strong: #a21caf;    /* 主品牌色强化 */
--coshub-primary-subtle: #fdf2f8;    /* 主品牌色微妙 */

/* 中性色彩 */
--coshub-text: #1f2937;              /* 主要文本 */
--coshub-text-weak: #6b7280;         /* 次要文本 */
--coshub-text-subtle: #9ca3af;       /* 微妙文本 */
--coshub-text-inverse: #ffffff;      /* 反色文本 */

/* 背景色彩 */
--coshub-bg: #fff6fb;                /* 页面背景 */
--coshub-surface: #ffffff;           /* 表面背景 */
--coshub-surface-weak: #f9fafb;      /* 表面背景弱化 */
--coshub-surface-strong: #f3f4f6;    /* 表面背景强化 */
```

### 间距系统

```scss
--coshub-space-xs: 8rpx;     /* 超小间距 */
--coshub-space-sm: 16rpx;    /* 小间距 */
--coshub-space-md: 24rpx;    /* 中等间距 */
--coshub-space-lg: 32rpx;    /* 大间距 */
--coshub-space-xl: 48rpx;    /* 超大间距 */
--coshub-space-2xl: 64rpx;   /* 特大间距 */
```

### 圆角系统

```scss
--coshub-radius-sm: 8rpx;    /* 小圆角 */
--coshub-radius-md: 12rpx;   /* 中等圆角 */
--coshub-radius-lg: 20rpx;   /* 大圆角 */
--coshub-radius-xl: 32rpx;   /* 超大圆角 */
--coshub-radius-full: 9999rpx; /* 完全圆角 */
```

### 阴影系统

```scss
--coshub-shadow-sm: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
--coshub-shadow-md: 0 12rpx 40rpx rgba(217, 70, 239, 0.12);
--coshub-shadow-lg: 0 20rpx 60rpx rgba(217, 70, 239, 0.15);
--coshub-shadow-xl: 0 32rpx 80rpx rgba(217, 70, 239, 0.2);
```

## 🌙 暗色模式

### 自动跟随系统

```scss
@media (prefers-color-scheme: dark) {
  :root {
    --coshub-bg: #0b0b12;
    --coshub-surface: #12121a;
    --coshub-text: #e5e7eb;
    /* ... 其他暗色变量 */
  }
}
```

### 手动切换

```tsx
import { useTheme } from '@/hooks/useTheme';

function MyComponent() {
  const { mode, isDark, toggleTheme, setTheme } = useTheme();
  
  return (
    <View onClick={toggleTheme}>
      {isDark ? '🌙' : '☀️'}
    </View>
  );
}
```

## 🎭 组件使用

### SkillCard 技能卡片

```tsx
import SkillCard from '@/components/SkillCard';

<SkillCard
  skill={skillData}
  layout="masonry" // 或 "list"
  onContact={(skillId) => console.log('联系技能', skillId)}
/>
```

### FeedCard 分享卡片

```tsx
import FeedCard from '@/components/FeedCard';

<FeedCard
  post={postData}
  layout="masonry" // 或 "list"
  onLike={(postId) => console.log('点赞', postId)}
  onCollect={(postId) => console.log('收藏', postId)}
  onComment={(postId) => console.log('评论', postId)}
/>
```

### ThemeToggle 主题切换

```tsx
import ThemeToggle from '@/components/ThemeToggle';

<ThemeToggle
  size="medium" // "small" | "medium" | "large"
  showLabel={true}
/>
```

## 🎨 样式类

### 玻璃效果

```scss
.glass-card {
  background: var(--coshub-glass);
  backdrop-filter: blur(var(--coshub-blur));
  -webkit-backdrop-filter: blur(var(--coshub-blur));
}

.glass-card--strong {
  background: var(--coshub-glass-strong);
}

.glass-card--weak {
  background: var(--coshub-glass-weak);
}
```

### 动画效果

```scss
.bounce-in { animation: bounce-in 0.5s ease-out; }
.fade-in { animation: fade-in 0.3s ease-out; }
.slide-in-left { animation: slide-in-left 0.4s ease-out; }
.slide-in-right { animation: slide-in-right 0.4s ease-out; }
```

### 交互效果

```scss
.float:hover { transform: translateY(-4rpx); }
.scale:hover { transform: scale(1.05); }
.ripple:active::before { /* 波纹效果 */ }
```

## 📱 响应式设计

### 网格布局

```scss
.card-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--coshub-space-md);

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### 弹性布局工具类

```scss
.flex { display: flex; }
.flex-col { flex-direction: column; }
.flex-row { flex-direction: row; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.flex-1 { flex: 1; }
```

## 🚀 性能优化

### 硬件加速

```scss
.gpu-accelerated {
  transform: translateZ(0);
  will-change: transform;
}
```

### 平滑滚动

```scss
.smooth-scroll {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}
```

## 🎯 最佳实践

1. **始终使用主题变量**: 不要硬编码颜色值
2. **合理使用动画**: 避免过度动画影响性能
3. **响应式设计**: 确保在不同设备上都有良好体验
4. **无障碍访问**: 考虑色盲用户和键盘导航
5. **性能优化**: 使用硬件加速和合理的动画时长

## 🔧 自定义主题

如需自定义主题，可以覆盖 CSS 变量：

```scss
:root {
  --coshub-primary: #your-color;
  --coshub-bg: #your-bg;
  /* 其他自定义变量 */
}
```

---

**设计系统版本**: 1.0.0  
**最后更新**: 2024年12月
