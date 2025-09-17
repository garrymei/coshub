import { View, Text } from "@tarojs/components";
import { useTheme } from "@/hooks/useTheme";
import "./index.scss";

export default function ThemeToggle() {
  const { mode, toggleTheme, getThemeIcon, getThemeText } = useTheme();

  return (
    <View className="theme-toggle" onClick={toggleTheme}>
      <View className="theme-toggle__icon">
        {getThemeIcon(mode)}
      </View>
      <Text className="theme-toggle__text">
        {getThemeText(mode)}
      </Text>
    </View>
  );
}
