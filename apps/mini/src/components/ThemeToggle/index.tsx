import { View, Text } from '@tarojs/components';
import { useTheme } from '@/hooks/useTheme';
import './index.scss';

interface ThemeToggleProps {
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  className?: string;
}

export default function ThemeToggle({ 
  size = 'medium', 
  showLabel = true,
  className = '' 
}: ThemeToggleProps) {
  const { mode, isDark, toggleTheme } = useTheme();

  const getIcon = () => {
    if (mode === 'auto') {
      return '🌓';
    }
    return isDark ? '🌙' : '☀️';
  };

  const getLabel = () => {
    if (mode === 'auto') {
      return '跟随系统';
    }
    return isDark ? '深色模式' : '浅色模式';
  };

  return (
    <View 
      className={`theme-toggle theme-toggle--${size} ${className}`}
      onClick={toggleTheme}
    >
      <Text className="theme-toggle__icon">{getIcon()}</Text>
      {showLabel && (
        <Text className="theme-toggle__label">{getLabel()}</Text>
      )}
    </View>
  );
}