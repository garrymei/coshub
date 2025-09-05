import { useState } from 'react';
import { Settings, Heart, Bookmark, Users, Edit } from 'lucide-react';
import { Header } from './Header';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const userPosts = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1697059172415-f1e08f9151bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGNoYXJhY3RlciUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NzA1NDE4Nnww&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral',
    title: '青春甜美时光',
    likes: 245,
    views: '6.8k'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1632506823413-200b3d091e90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrYXdhaWklMjBhbmltZSUyMGdpcmx8ZW58MXx8fHwxNzU3MDYxNTU1fDA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral',
    title: '梦幻公主',
    likes: 389,
    views: '12.3k'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1673047233994-78df05226bfc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwYW5pbWUlMjBjaGFyYWN0ZXJ8ZW58MXx8fHwxNzU3MDYxNTU5fDA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral',
    title: '温柔时光',
    likes: 156,
    views: '4.2k'
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1581132285926-a4c91a76ef14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGdpcmwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTcwNjE1NjJ8MA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral',
    title: '午后阳光',
    likes: 203,
    views: '7.1k'
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1641298583600-7d6ad2098298?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGNoYXJhY3RlciUyMGNvc3BsYXl8ZW58MXx8fHwxNzU3MDYxNTY1fDA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral',
    title: '春日花语',
    likes: 298,
    views: '9.5k'
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1697059172415-f1e08f9151bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGNoYXJhY3RlciUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NzA1NDE4Nnww&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral',
    title: '甜美笑容',
    likes: 421,
    views: '15.2k'
  }
];

const likedPosts = [
  {
    id: '7',
    image: 'https://images.unsplash.com/photo-1632506823413-200b3d091e90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrYXdhaWklMjBhbmltZSUyMGdpcmx8ZW58MXx8fHwxNzU3MDYxNTU1fDA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral',
    title: '可爱头像',
    likes: 189,
    views: '5.6k'
  },
  {
    id: '8',
    image: 'https://images.unsplash.com/photo-1673047233994-78df05226bfc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwYW5pbWUlMjBjaGFyYWN0ZXJ8ZW58MXx8fHwxNzU3MDYxNTU5fDA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral',
    title: '梦幻少女',
    likes: 267,
    views: '8.3k'
  },
  {
    id: '9',
    image: 'https://images.unsplash.com/photo-1581132285926-a4c91a76ef14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGdpcmwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTcwNjE1NjJ8MA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral',
    title: '纯真年代',
    likes: 134,
    views: '3.9k'
  }
];

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState('dynamics');

  const PostGrid = ({ posts }: { posts: typeof userPosts }) => (
    <div className="grid grid-cols-3 gap-1">
      {posts.map((post) => (
        <div key={post.id} className="relative aspect-square">
          <ImageWithFallback
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="我的" 
        rightContent={
          <Button variant="ghost" className="w-8 h-8 p-0">
            <Settings className="w-5 h-5 text-gray-600" />
          </Button>
        }
      />
      
      <div className="pt-24 pb-20">
        {/* Profile Header */}
        <div className="bg-white px-6 py-6">
          <div className="flex items-center mb-6">
            <div className="relative mr-4">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1632506823413-200b3d091e90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrYXdhaWklMjBhbmltZSUyMGdpcmx8ZW58MXx8fHwxNzU3MDYxNTU1fDA&ixlib=rb-4.1.0&q=80&w=200&utm_source=figma&utm_medium=referral"
                alt="我的头像"
                className="w-16 h-16 rounded-full object-cover"
              />
            </div>
            
            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-1">甜心小可爱</h2>
              <p className="text-gray-500 text-sm mb-2">分享生活中的美好时光 ✨</p>
              <Button 
                variant="outline" 
                className="text-sm px-4 py-1 rounded-full border-pink-200 text-pink-600 hover:bg-pink-50"
              >
                <Edit className="w-3 h-3 mr-1" />
                编辑资料
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-xl font-semibold text-gray-900">23</div>
              <div className="text-xs text-gray-500">动态</div>
            </div>
            <div>
              <div className="text-xl font-semibold text-gray-900">156</div>
              <div className="text-xs text-gray-500">粉丝</div>
            </div>
            <div>
              <div className="text-xl font-semibold text-gray-900">89</div>
              <div className="text-xs text-gray-500">关注</div>
            </div>
            <div>
              <div className="text-xl font-semibold text-gray-900">342</div>
              <div className="text-xs text-gray-500">获赞</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 mt-4 mb-6">
          <div className="bg-white rounded-2xl p-4">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-2">
                  <Heart className="w-6 h-6 text-pink-500" />
                </div>
                <span className="text-xs text-gray-600">我的点赞</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
                  <Bookmark className="w-6 h-6 text-yellow-500" />
                </div>
                <span className="text-xs text-gray-600">我的收藏</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
                <span className="text-xs text-gray-600">我的关注</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                  <Settings className="w-6 h-6 text-purple-500" />
                </div>
                <span className="text-xs text-gray-600">设置</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white rounded-xl p-1">
              <TabsTrigger 
                value="dynamics" 
                className="text-sm py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg"
              >
                我的动态
              </TabsTrigger>
              <TabsTrigger 
                value="skills" 
                className="text-sm py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg"
              >
                我的技能
              </TabsTrigger>
              <TabsTrigger 
                value="drafts" 
                className="text-sm py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg"
              >
                草稿箱
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="dynamics" className="mt-6">
              <PostGrid posts={userPosts} />
            </TabsContent>
            
            <TabsContent value="skills" className="mt-6">
              <div className="text-center py-12">
                <p className="text-gray-500">还没有发布技能课程</p>
                <Button className="mt-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-6">
                  发布我的第一个技能
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="drafts" className="mt-6">
              <div className="text-center py-12">
                <p className="text-gray-500">草稿箱是空的</p>
                <p className="text-sm text-gray-400 mt-1">写作时的内容会自动保存到这里</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}