import { ChevronLeft } from 'lucide-react';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightContent?: React.ReactNode;
}

export function Header({ title, showBack, onBack, rightContent }: HeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 bg-white z-50">
      {/* Status bar */}
      <div className="flex justify-between items-center px-6 py-2 text-sm">
        <span>9:41</span>
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          </div>
          <div className="ml-2 flex items-center gap-1">
            <div className="w-4 h-2 border border-black rounded-sm">
              <div className="w-3 h-1 bg-black rounded-sm m-0.5"></div>
            </div>
            <div className="w-2 h-3 border border-black rounded-sm">
              <div className="w-1 h-2 bg-black rounded-sm m-0.5"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Header content */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center">
          {showBack && (
            <button onClick={onBack} className="mr-3">
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          {title && (
            <h1 className="text-xl">{title}</h1>
          )}
        </div>
        {rightContent}
      </div>
    </div>
  );
}