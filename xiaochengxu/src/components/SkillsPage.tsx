import { useState } from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import { Header } from './Header';
import { SkillCard } from './SkillCard';
import { Input } from './ui/input';
import { Button } from './ui/button';

const mockSkillsData = [
  {
    id: '1',
    title: 'Python零基础入门到实战',
    description: '从零开始学习Python编程，掌握基础语法，完成实际项目，适合编程小白',
    instructor: {
      name: '张老师',
      avatar: 'https://images.unsplash.com/photo-1588912914078-2fe5224fd8b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2lsbHMlMjBsZWFybmluZyUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NTcwNjIyNjV8MA&ixlib=rb-4.1.0&q=80&w=200&utm_source=figma&utm_medium=referral',
      rating: 4.8
    },
    category: '编程',
    difficulty: '初级',
    duration: '30小时',
    students: 2847,
    price: 199,
    thumbnail: 'https://images.unsplash.com/photo-1588912914078-2fe5224fd8b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2lsbHMlMjBsZWFybmluZyUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NTcwNjIyNjV8MA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral',
    tags: ['Python', '编程入门', '实战项目']
  },
  {
    id: '2',
    title: '手机摄影技巧大全',
    description: '教你用手机拍出专业级照片，包含构图、光线、后期等全方位技巧分享',
    instructor: {
      name: '小美老师',
      avatar: 'https://images.unsplash.com/photo-1639784119996-3de5792ddff1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWZlc3R5bGUlMjBiYW5uZXIlMjB5b3VuZyUyMHBlb3BsZXxlbnwxfHx8fDE3NTcwNjIyNjN8MA&ixlib=rb-4.1.0&q=80&w=200&utm_source=figma&utm_medium=referral',
      rating: 4.9
    },
    category: '摄影',
    difficulty: '初级',
    duration: '15小时',
    students: 1623,
    price: 0,
    thumbnail: 'https://images.unsplash.com/photo-1639784119996-3de5792ddff1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWZlc3R5bGUlMjBiYW5uZXIlMjB5b3VuZyUyMHBlb3BsZXxlbnwxfHx8fDE3NTcwNjIyNjN8MA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral',
    tags: ['手机摄影', '构图技巧', '免费课程']
  },
  {
    id: '3',
    title: 'UI设计系统化学习',
    description: '系统学习UI设计，从设计理论到实际操作，掌握Figma等设计工具的使用',
    instructor: {
      name: '设计师阿森',
      avatar: 'https://images.unsplash.com/photo-1464854860390-e95991b46441?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbGlmZXN0eWxlJTIwYmFubmVyfGVufDF8fHx8MTc1NzA2MjI2NHww&ixlib=rb-4.1.0&q=80&w=200&utm_source=figma&utm_medium=referral',
      rating: 4.7
    },
    category: '设计',
    difficulty: '中级',
    duration: '45小时',
    students: 987,
    price: 399,
    thumbnail: 'https://images.unsplash.com/photo-1464854860390-e95991b46441?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbGlmZXN0eWxlJTIwYmFubmVyfGVufDF8fHx8MTc1NzA2MjI2NHww&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral',
    tags: ['UI设计', 'Figma', '设计系统']
  },
  {
    id: '4',
    title: '健身训练营：塑造完美身材',
    description: '专业健身教练指导，科学训练计划，帮你在家就能练出好身材',
    instructor: {
      name: '健身达人小李',
      avatar: 'https://images.unsplash.com/photo-1578960281840-cb36759fb109?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwbGlmZXN0eWxlJTIwYmFubmVyfGVufDF8fHx8MTc1NzA2MjI2NHww&ixlib=rb-4.1.0&q=80&w=200&utm_source=figma&utm_medium=referral',
      rating: 4.6
    },
    category: '健身',
    difficulty: '初级',
    duration: '20小时',
    students: 3421,
    price: 99,
    thumbnail: 'https://images.unsplash.com/photo-1578960281840-cb36759fb109?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwbGlmZXN0eWxlJTIwYmFubmVyfGVufDF8fHx8MTc1NzA2MjI2NHww&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral',
    tags: ['健身', '塑形', '居家运动']
  },
  {
    id: '5',
    title: '英语口语突破训练',
    description: '地道英语表达，情景对话练习，让你的英语口语更加流利自然',
    instructor: {
      name: 'Emma老师',
      avatar: 'https://images.unsplash.com/photo-1577949619851-db947ef972af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBsaWZlc3R5bGUlMjBiYW5uZXJ8ZW58MXx8fHwxNzU3MDYyMjY0fDA&ixlib=rb-4.1.0&q=80&w=200&utm_source=figma&utm_medium=referral',
      rating: 4.8
    },
    category: '语言',
    difficulty: '中级',
    duration: '25小时',
    students: 1567,
    price: 299,
    thumbnail: 'https://images.unsplash.com/photo-1577949619851-db947ef972af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBsaWZlc3R5bGUlMjBiYW5uZXJ8ZW58MXx8fHwxNzU3MDYyMjY0fDA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral',
    tags: ['英语口语', '情景对话', '流利表达']
  }
];

const categories = ['全部', '编程', '设计', '摄影', '健身', '语言', '音乐', '烘焙'];

export function SkillsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [skills] = useState(mockSkillsData);

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         skill.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === '全部' || skill.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEnroll = (skillId: string) => {
    console.log('报名课程:', skillId);
  };

  const handlePublish = () => {
    console.log('发布新技能');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="技能" 
        rightContent={
          <Button
            onClick={handlePublish}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full w-8 h-8 p-0"
          >
            <Plus className="w-4 h-4" />
          </Button>
        }
      />
      
      <div className="pt-24 pb-20">
        {/* Search Bar */}
        <div className="px-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="搜索技能、讲师、标签..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-12 py-3 rounded-full bg-white border-gray-200 focus:border-purple-300 focus:ring-purple-200"
            />
            <Button
              variant="ghost"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 p-0 rounded-full hover:bg-gray-100"
            >
              <Filter className="w-4 h-4 text-gray-500" />
            </Button>
          </div>
        </div>

        {/* Categories */}
        <div className="px-4 mb-6">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Skills List */}
        <div className="px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedCategory === '全部' ? '热门技能' : `${selectedCategory}技能`}
            </h2>
            <span className="text-sm text-gray-500">{filteredSkills.length}个课程</span>
          </div>
          
          {filteredSkills.map((skill) => (
            <SkillCard
              key={skill.id}
              {...skill}
              onEnroll={handleEnroll}
            />
          ))}
          
          {filteredSkills.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">没有找到相关技能课程</p>
              <p className="text-sm text-gray-400 mt-1">试试搜索其他关键词</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}