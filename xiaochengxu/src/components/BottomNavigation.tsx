import type { CSSProperties } from "react";
import { Home, Grid3X3, Zap, User } from "lucide-react";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: "home", icon: Home, label: "首页" },
    { id: "square", icon: Grid3X3, label: "广场" },
    { id: "skills", icon: Zap, label: "技能" },
    { id: "profile", icon: User, label: "我的" },
  ];

  const navStyle: CSSProperties & { "--safe-area-bottom"?: string } = {
    paddingTop: "0.25rem",
    paddingBottom: "calc(var(--safe-area-bottom, 0px) + 0.25rem)",
    "--safe-area-bottom": "env(safe-area-inset-bottom)",
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 shadow-lg"
      style={navStyle}
      role="navigation"
      aria-label="主导航"
    >
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center py-2 px-3 relative transition-all duration-200"
            aria-label={tab.label}
            aria-current={activeTab === tab.id ? "page" : undefined}
          >
            <div className="relative">
              <tab.icon
                className={`w-6 h-6 transition-colors ${
                  activeTab === tab.id ? "text-pink-500" : "text-gray-400"
                }`}
              />
              {activeTab === tab.id && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-pink-500 rounded-full" />
              )}
            </div>
            <span
              className={`text-xs mt-1 transition-colors ${
                activeTab === tab.id ? "text-pink-500" : "text-gray-400"
              }`}
            >
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}