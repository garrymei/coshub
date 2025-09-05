import { useState } from 'react';
import { HomePage } from './components/HomePage';
import { SquarePage } from './components/SquarePage';
import { SkillsPage } from './components/SkillsPage';
import { ProfilePage } from './components/ProfilePage';
import { BottomNavigation } from './components/BottomNavigation';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'square':
        return <SquarePage />;
      case 'skills':
        return <SkillsPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative">
      {renderContent()}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}