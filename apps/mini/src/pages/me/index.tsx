import { useState, useEffect } from "react";
import { View, Text, Image, Button, ScrollView } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { api, mockData, User } from "@/services/api";
import { getUserCollections, getUserLikes } from "@/services/user";
import "./index.scss";

interface TabContent {
  id: string;
  title: string;
  content: any[];
}

export default function MePage() {
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [collections, setCollections] = useState<any[]>([]);
  const [likes, setLikes] = useState<any[]>([]);
  const [collectionsLoading, setCollectionsLoading] = useState(false);
  const [likesLoading, setLikesLoading] = useState(false);

  // 模拟数据
  const mockUserProfile: User = {
    id: "12345678",
    nickname: "你的昵称",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    bio: "这个人很懒，什么都没留下~",
    followers: 108,
    likes: 23000,
    collections: 99,
    level: "vip",
  };

  // 标签页内容
  const tabContents: TabContent[] = [
    {
      id: "posts",
      title: "我的分享",
      content: [
        {
          id: 1,
          image: "https://placehold.co/400x500/fb7185/ffffff?text=MyPost1",
        },
        {
          id: 2,
          image: "https://placehold.co/400x350/a5b4fc/ffffff?text=MyPost2",
        },
        {
          id: 3,
          image: "https://placehold.co/400x420/4ade80/ffffff?text=MyPost3",
        },
        {
          id: 4,
          image: "https://placehold.co/400x480/facc15/ffffff?text=MyPost4",
        },
      ],
    },
    {
      id: "skills",
      title: "我的技能",
      content: [
        {
          id: 1,
          title: "二次元cos妆造",
          price: 200,
          image: "https://placehold.co/100x100/fef08a/854d0e?text=妆造",
        },
        {
          id: 2,
          title: "EVA道具定制",
          price: 0,
          image: "https://placehold.co/100x100/d1fae5/059669?text=道具",
        },
      ],
    },
    {
      id: "collections",
      title: "收藏",
      content: [
        {
          id: 1,
          image: "https://placehold.co/400x400/a5b4fc/1e1b4b?text=收藏的LOLITA",
        },
        {
          id: 2,
          image: "https://placehold.co/400x550/6ee7b7/064e3b?text=收藏的JK",
        },
        {
          id: 3,
          image: "https://placehold.co/400x450/d1fae5/059669?text=收藏的手办",
        },
        {
          id: 4,
          image: "https://placehold.co/400x480/cffafe/0e7490?text=收藏的漫展",
        },
      ],
    },
    {
      id: "likes",
      title: "点赞",
      content: [
        {
          id: 1,
          image: "https://placehold.co/400x520/ffedd5/c2410c?text=点赞的板绘",
        },
        {
          id: 2,
          image: "https://placehold.co/400x500/fbcfe8/9d174d?text=点赞的Cos",
        },
        {
          id: 3,
          image: "https://placehold.co/400x400/f3e8ff/581c87?text=点赞的汉服",
        },
      ],
    },
  ];

  // 获取用户资料
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      if (process.env.TARO_APP_USE_MOCK === "true") {
        setUserProfile(mockUserProfile);
      } else {
        const profile = await api.user.getProfile();
        setUserProfile(profile);
      }
    } catch (error) {
      console.error("获取用户资料失败", error);
      // 降级到模拟数据
      setUserProfile(mockUserProfile);
    } finally {
      setLoading(false);
    }
  };

  // 检查登录状态
  const checkLoginStatus = () => {
    try {
      const token = Taro.getStorageSync("token");
      const userInfo = Taro.getStorageSync("userInfo");

      if (!token || !userInfo) {
        // 未登录，跳转到登录页
        Taro.navigateTo({ url: "/pages/login/index" });
      } else {
        // 已登录，获取用户资料
        fetchUserProfile();
      }
    } catch (error) {
      console.error("检查登录状态失败", error);
    }
  };

  // 跳转到资料编辑页
  const goToProfile = () => {
    Taro.navigateTo({ url: "/pages/me/profile" });
  };

  // 跳转到设置页
  const goToSettings = () => {
    Taro.navigateTo({ url: "/pages/me/settings" });
  };

  // 获取收藏内容
  const fetchCollections = async () => {
    try {
      setCollectionsLoading(true);
      const res = await getUserCollections(1);
      setCollections(res.list);
    } catch (error) {
      console.error("获取收藏内容失败", error);
      // 降级到模拟数据
      setCollections(
        tabContents.find((tab) => tab.id === "collections")?.content || [],
      );
    } finally {
      setCollectionsLoading(false);
    }
  };

  // 获取点赞内容
  const fetchLikes = async () => {
    try {
      setLikesLoading(true);
      const res = await getUserLikes(1);
      setLikes(res.list);
    } catch (error) {
      console.error("获取点赞内容失败", error);
      // 降级到模拟数据
      setLikes(tabContents.find((tab) => tab.id === "likes")?.content || []);
    } finally {
      setLikesLoading(false);
    }
  };

  // 标签页切换
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);

    // 当切换到收藏或点赞标签页时，获取真实数据
    if (tabId === "collections" && collections.length === 0) {
      fetchCollections();
    } else if (tabId === "likes" && likes.length === 0) {
      fetchLikes();
    }
  };

  // 退出登录
  const logout = () => {
    Taro.showModal({
      title: "提示",
      content: "确定要退出登录吗？",
      success: (res) => {
        if (res.confirm) {
          Taro.removeStorageSync("token");
          Taro.removeStorageSync("userInfo");
          Taro.reLaunch({ url: "/pages/login/index" });
        }
      },
    });
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  if (loading) {
    return (
      <View className="me-page loading">
        <Text>加载中...</Text>
      </View>
    );
  }

  if (!userProfile) {
    return (
      <View className="me-page error">
        <Text>获取用户信息失败</Text>
        <Button onClick={checkLoginStatus}>重试</Button>
      </View>
    );
  }

  const currentTabContent = tabContents.find((tab) => tab.id === activeTab);

  return (
    <View className="me-page h-screen bg-secondary-50 flex flex-col">
      {/* 用户信息区域 */}
      <View className="gradient-primary px-4 py-6">
        <View className="flex items-center mb-6">
          <Image
            className="w-20 h-20 rounded-full border-4 border-white shadow-medium mr-4"
            src={userProfile.avatar}
          />
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-800 mb-1">
              {userProfile.nickname}
            </Text>
            <Text className="text-sm text-gray-600">ID: {userProfile.id}</Text>
          </View>
          <View className="flex items-center gap-3">
            <Button
              className="text-sm bg-white border border-gray-200 rounded-full px-4 py-1.5 hover:bg-gray-100 transition-colors"
              onClick={goToProfile}
            >
              编辑资料
            </Button>
            <View
              className="w-9 h-9 flex items-center justify-center bg-white rounded-full cursor-pointer"
              onClick={goToSettings}
            >
              ⚙️
            </View>
          </View>
        </View>

        {/* 用户统计 */}
        <View className="bg-white rounded-2xl p-5 shadow-soft">
          <View className="flex justify-around">
            <View className="text-center">
              <Text className="text-2xl font-bold text-primary-600 mb-1">
                {userProfile.followers}
              </Text>
              <Text className="text-sm text-gray-600">粉丝</Text>
            </View>
            <View className="text-center">
              <Text className="text-2xl font-bold text-primary-600 mb-1">
                {userProfile.likes.toLocaleString()}
              </Text>
              <Text className="text-sm text-gray-600">获赞</Text>
            </View>
            <View className="text-center">
              <Text className="text-2xl font-bold text-primary-600 mb-1">
                {userProfile.collections}
              </Text>
              <Text className="text-sm text-gray-600">收藏</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 标签页导航 */}
      <View className="bg-white border-b border-gray-100 flex">
        {tabContents.map((tab) => (
          <View
            key={tab.id}
            className={`flex-1 text-center py-4 text-sm font-medium cursor-pointer transition-all ${
              activeTab === tab.id ? "tab-active" : "tab-inactive"
            }`}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.title}
          </View>
        ))}
      </View>

      {/* 标签页内容 */}
      <ScrollView className="flex-1 p-4" scrollY>
        {activeTab === "posts" && (
          <View className="grid grid-cols-2 gap-3">
            {currentTabContent?.content.map((item: any) => (
              <View
                key={item.id}
                className="relative group rounded-xl overflow-hidden"
              >
                <Image
                  className="w-full h-auto min-h-32 max-h-80 object-cover rounded-xl"
                  src={item.image}
                  mode="aspectFill"
                />
                <View className="absolute bottom-0 left-0 right-0 p-2 gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity">
                  <View className="flex justify-end gap-2">
                    <View className="text-white text-xs bg-white/20 backdrop-blur-sm hover:bg-white/30 px-2 py-1 rounded-full cursor-pointer">
                      修改
                    </View>
                    <View className="text-white text-xs bg-red-500/80 backdrop-blur-sm hover:bg-red-500 px-2 py-1 rounded-full cursor-pointer">
                      删除
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === "skills" && (
          <View className="space-y-4">
            {currentTabContent?.content.map((item: any) => (
              <View
                key={item.id}
                className="bg-white p-4 rounded-xl shadow-soft flex items-center"
              >
                <Image
                  className="w-16 h-16 rounded-lg mr-3 flex-shrink-0"
                  src={item.image}
                />
                <View className="flex-1 min-w-0">
                  <Text className="text-base font-bold text-gray-800 truncate mb-1">
                    {item.title}
                  </Text>
                  <Text className="text-base font-bold text-primary-600">
                    {item.price > 0 ? `￥${item.price}` : "议价"}
                  </Text>
                </View>
                <View className="flex flex-col gap-2">
                  <View className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1.5 rounded-full text-center cursor-pointer">
                    修改
                  </View>
                  <View className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1.5 rounded-full text-center cursor-pointer">
                    删除
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === "collections" && (
          <View className="grid grid-cols-2 gap-3">
            {collectionsLoading ? (
              <View className="col-span-2 text-center py-8">
                <Text className="text-gray-500">加载中...</Text>
              </View>
            ) : collections.length > 0 ? (
              collections.map((item: any) => (
                <View
                  key={item.id}
                  className="rounded-xl overflow-hidden cursor-pointer"
                  onClick={() =>
                    Taro.navigateTo({
                      url: `/pages/post/detail?id=${item.post?.id || item.id}`,
                    })
                  }
                >
                  <Image
                    className="w-full h-auto min-h-32 max-h-80 object-cover rounded-xl"
                    src={item.post?.images?.[0] || item.image}
                    mode="aspectFill"
                  />
                </View>
              ))
            ) : (
              <View className="col-span-2 text-center py-8">
                <Text className="text-gray-500">暂无收藏内容</Text>
              </View>
            )}
          </View>
        )}

        {activeTab === "likes" && (
          <View className="grid grid-cols-2 gap-3">
            {likesLoading ? (
              <View className="col-span-2 text-center py-8">
                <Text className="text-gray-500">加载中...</Text>
              </View>
            ) : likes.length > 0 ? (
              likes.map((item: any) => (
                <View
                  key={item.id}
                  className="rounded-xl overflow-hidden cursor-pointer"
                  onClick={() =>
                    Taro.navigateTo({
                      url: `/pages/post/detail?id=${item.post?.id || item.id}`,
                    })
                  }
                >
                  <Image
                    className="w-full h-auto min-h-32 max-h-80 object-cover rounded-xl"
                    src={item.post?.images?.[0] || item.image}
                    mode="aspectFill"
                  />
                </View>
              ))
            ) : (
              <View className="col-span-2 text-center py-8">
                <Text className="text-gray-500">暂无点赞内容</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
