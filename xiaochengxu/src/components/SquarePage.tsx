import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Header } from './Header';
import { DynamicCard } from './DynamicCard';
import { Input } from './ui/input';
import { Button } from './ui/button';

const mockSquareData = [
  {
    id: '1',
    user: {
      avatar: 'https://images.unsplash.com/photo-1673047233994-78df05226bfc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwYW5pbWUlMjBjaGFyYWN0ZXJ8ZW58MXx8fHwxNzU3MDYxNTU5fDA&ixlib=rb-4.1.0&q=80&w=200&utm_source=figma&utm_medium=referral',
      name: '旅行小达人',
      location: '杭州·西湖区'
    },
    content: {
      text: '周末去西湖边走走，春天的杭州真的太美了！樱花盛开，游人如织，每一帧都是明信片级别的风景～',
      images: [
        'https://images.unsplash.com/photo-1577949619851-db947ef972af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBsaWZlc3R5bGUlMjBiYW5uZXJ8ZW58MXx8fHwxNzU3MDYyMjY0fDA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral',
        'https://images.unsplash.com/photo-1639784119996-3de5792ddff1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWZlc3R5bGUlMjBiYW5uZXIlMjB5b3VuZyUyMHBlb3BsZXxlbnwxfHx8fDE3NTcwNjIyNjN8MA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral',
        'https://images.unsplash.com/photo-1464854860390-e95991b46441?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbGlmZXN0eWxlJTIwYmFubmVyfGVufDF8fHx8MTc1NzA2MjI2NHww&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral'
      ],
      tags: ['旅行', '杭州', '西湖', '春游', '樱花']
    },
    stats: {
      likes: 256,
      comments: 42,
      isLiked: false,
      isBookmarked: false
    }
  },
  {
    id: '2',
    user: {
      avatar: 'https://images.unsplash.com/photo-1581132285926-a4c91a76ef14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGdpcmwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTcwNjE1NjJ8MA&ixlib=rb-4.1.0&q=80&w=200&utm_source=figma&utm_medium=referral',
      name: '美食探索家',
      location: '广州·天河区'
    },
    content: {
      text: '发现了一家超棒的粤菜餐厅！招牌白切鸡嫩滑无比，虾饺皮薄馅鲜，环境也很雅致。价格合理，值得推荐！',
      images: [
        'https://images.unsplash.com/photo-1578960281840-cb36759fb109?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwbGlmZXN0eWxlJTIwYmFubmVyfGVufDF8fHx8MTc1NzA2MjI2NHww&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral'
      ],
      tags: ['美食', '粤菜', '广州', '探店', '推荐']
    },
    stats: {
      likes: 189,
      comments: 28,
      isLiked: true,
      isBookmarked: true
    }
  },
  {
    id: '3',
    user: {
      avatar: 'https://images.unsplash.com/photo-1641298583600-7d6ad2098298?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGNoYXJhY3RlciUyMGNvc3BsYXl8ZW58MXx8fHwxNzU3MDYxNTY1fDA&ixlib=rb-4.1.0&q=80&w=200&utm_source=figma&utm_medium=referral',
      name: '健身小姐姐',
      location: '深圳·南山区'
    },
    content: {
      text: '今天的健身打卡！坚持了30天的晨练，感觉整个人的精神状态都不一样了。分享一些简单的居家运动，一起变美变健康～',
      images: [
        'https://images.unsplash.com/photo-1639784119996-3de5792ddff1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWZlc3R5bGUlMjBiYW5uZXIlMjB5b3VuZyUyMHBlb3BsZXxlbnwxfHx8fDE3NTcwNjIyNjN8MA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral',
        'https://images.unsplash.com/photo-1588912914078-2fe5224fd8b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2lsbHMlMjBsZWFybmluZyUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NTcwNjIyNjV8MA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral'
      ],
      tags: ['健身', '晨练', '打卡', '运动', '健康生活']
    },
    stats: {
      likes: 312,
      comments: 56,
      isLiked: false,
      isBookmarked: false
    }
  }
];

export function SquarePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dynamics, setDynamics] = useState(mockSquareData);

  const handleLike = (id: string) => {
    setDynamics(prev => 
      prev.map(dynamic => 
        dynamic.id === id 
          ? { 
              ...dynamic, 
              stats: {
                ...dynamic.stats,
                isLiked: !dynamic.stats.isLiked,
                likes: dynamic.stats.isLiked ? dynamic.stats.likes - 1 : dynamic.stats.likes + 1
              }
            }
          : dynamic
      )
    );
  };

  const handleBookmark = (id: string) => {
    setDynamics(prev => 
      prev.map(dynamic => 
        dynamic.id === id 
          ? { 
              ...dynamic, 
              stats: {
                ...dynamic.stats,
                isBookmarked: !dynamic.stats.isBookmarked
              }
            }
          : dynamic
      )
    );
  };

  const handlePublish = () => {
    // 这里可以打开发布页面或模态框
    console.log('打开发布页面');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="广场" 
        rightContent={
          <Button
            onClick={handlePublish}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full w-8 h-8 p-0"
          >
            <Plus className="w-4 h-4" />
          </Button>
        }
      />
      
      <div className="pt-24 pb-20">
        {/* Search Bar */}
        <div className="px-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="搜索动态、用户、话题..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 rounded-full bg-white border-gray-200 focus:border-pink-300 focus:ring-pink-200"
            />
          </div>
        </div>

        {/* Hot Topics */}
        <div className="px-4 mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">热门话题</h3>
          <div className="flex flex-wrap gap-2">
            {['#春日穿搭', '#美食探店', '#旅行日记', '#健身打卡', '#护肤心得', '#学习分享'].map((topic, index) => (
              <span 
                key={index}
                className="px-3 py-1.5 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-600 rounded-full text-sm cursor-pointer hover:from-pink-200 hover:to-purple-200 transition-colors"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Dynamics Feed */}
        <div className="px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">最新动态</h2>
            <div className="flex space-x-2 text-sm">
              <button className="text-pink-500 font-medium">最新</button>
              <span className="text-gray-300">|</span>
              <button className="text-gray-500">热门</button>
            </div>
          </div>
          
          {dynamics.map((dynamic) => (
            <DynamicCard
              key={dynamic.id}
              {...dynamic}
              onLike={handleLike}
              onBookmark={handleBookmark}
            />
          ))}
        </div>
      </div>
    </div>
  );
}