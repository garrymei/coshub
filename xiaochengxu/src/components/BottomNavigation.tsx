import { Home, Grid3X3, Zap, User } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: 'home', icon: Home, label: '首页' },
    { id: 'square', icon: Grid3X3, label: '广场' },
    { id: 'skills', icon: Zap, label: '技能' },
    { id: 'profile', icon: User, label: '我的' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 py-1 shadow-lg">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center py-2 px-3 relative transition-all duration-200"
          >
            <div className="relative">
              <tab.icon 
                className={`w-6 h-6 transition-colors ${
                  activeTab === tab.id ? 'text-pink-500' : 'text-gray-400'
                }`}
              />
              {activeTab === tab.id && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-pink-500 rounded-full"></div>
              )}
            </div>
            <span className={`text-xs mt-1 transition-colors ${
              activeTab === tab.id ? 'text-pink-500' : 'text-gray-400'
            }`}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}