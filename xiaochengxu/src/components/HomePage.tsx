import { useState } from 'react';
import { Header } from './Header';
import { Carousel } from './Carousel';
import { DynamicCard } from './DynamicCard';

const carouselItems = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1639784119996-3de5792ddff1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWZlc3R5bGUlMjBiYW5uZXIlMjB5b3VuZyUyMHBlb3BsZXxlbnwxfHx8fDE3NTcwNjIyNjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: '青春无限',
    subtitle: '发现更多精彩生活'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1464854860390-e95991b46441?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbGlmZXN0eWxlJTIwYmFubmVyfGVufDF8fHx8MTc1NzA2MjI2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: '时尚达人',
    subtitle: '分享你的穿搭灵感'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1578960281840-cb36759fb109?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwbGlmZXN0eWxlJTIwYmFubmVyfGVufDF8fHx8MTc1NzA2MjI2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    title: '美食探店',
    subtitle: '记录每一次味蕾旅行'
  }
];

const mockDynamics = [
  {
    id: '1',
    user: {
      avatar: 'https://images.unsplash.com/photo-1632506823413-200b3d091e90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrYXdhaWklMjBhbmltZSUyMGdpcmx8ZW58MXx8fHwxNzU3MDYxNTU1fDA&ixlib=rb-4.1.0&q=80&w=200&utm_source=figma&utm_medium=referral',
      name: '甜心小可爱',
      location: '上海·静安区'
    },
    content: {
      text: '今天和朋友们去了新开的网红咖啡店，环境超棒！咖啡也很香醇，拍照超出片～推荐给大家！',
      images: [
        'https://images.unsplash.com/photo-1578960281840-cb36759fb109?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwbGlmZXN0eWxlJTIwYmFubmVyfGVufDF8fHx8MTc1NzA2MjI2NHww&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral',
        'https://images.unsplash.com/photo-1464854860390-e95991b46441?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbGlmZXN0eWxlJTIwYmFubmVyfGVufDF8fHx8MTc1NzA2MjI2NHww&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral'
      ],
      tags: ['咖啡', '网红店', '拍照圣地', '周末好去处']
    },
    stats: {
      likes: 128,
      comments: 23,
      isLiked: false,
      isBookmarked: false
    }
  },
  {
    id: '2',
    user: {
      avatar: 'https://images.unsplash.com/photo-1697059172415-f1e08f9151bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGNoYXJhY3RlciUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NzA1NDE4Nnww&ixlib=rb-4.1.0&q=80&w=200&utm_source=figma&utm_medium=referral',
      name: '时尚达人Lily',
      location: '北京·朝阳区'
    },
    content: {
      text: '春日穿搭分享！这套look既舒适又时尚，颜色搭配也很清新，收到好多小伙伴的赞美～',
      images: [
        'https://images.unsplash.com/photo-1639784119996-3de5792ddff1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWZlc3R5bGUlMjBiYW5uZXIlMjB5b3VuZyUyMHBlb3BsZXxlbnwxfHx8fDE3NTcwNjIyNjN8MA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral'
      ],
      tags: ['春日穿搭', '时尚', 'OOTD', '清新风']
    },
    stats: {
      likes: 89,
      comments: 15,
      isLiked: true,
      isBookmarked: true
    }
  }
];

export function HomePage() {
  const [dynamics, setDynamics] = useState(mockDynamics);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Coshub" />
      
      <div className="pt-24 pb-20">
        {/* Carousel */}
        <div className="px-4 mb-6">
          <Carousel items={carouselItems} />
        </div>
        
        {/* Dynamics Feed */}
        <div className="px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">精选动态</h2>
            <span className="text-sm text-pink-500">查看更多</span>
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