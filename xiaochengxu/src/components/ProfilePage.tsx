import { useEffect, useState, type ComponentType } from "react";
import { Settings, Heart, Bookmark, Users, Edit } from "lucide-react";
import { Header } from "./Header";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { fetchProfile } from "../services/contentService";
import type { ProfileData, ProfileHighlight, ProfilePost } from "../types/content";

const highlightIconMap: Record<ProfileHighlight["icon"], ComponentType<{ className?: string }>> = {
  heart: Heart,
  bookmark: Bookmark,
  users: Users,
  settings: Settings,
};

type DialogState =
  | { type: "edit" }
  | { type: "highlight"; highlight: ProfileHighlight };

const PostGrid = ({ posts }: { posts: ProfilePost[] }) => (
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

export function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("dynamics");
  const [dialog, setDialog] = useState<DialogState | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchProfile();
        if (isMounted) {
          setProfile(data);
        }
      } catch (err) {
        if (isMounted) {
          setError("资料加载失败，请稍后重试");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const retry = () => {
    setIsLoading(true);
    setError(null);
    fetchProfile()
      .then(setProfile)
      .catch(() => setError("资料加载失败，请稍后重试"))
      .finally(() => setIsLoading(false));
  };

  const handleEditProfile = () => {
    setDialog({ type: "edit" });
  };

  const handleHighlightClick = (highlight: ProfileHighlight) => {
    setDialog({ type: "highlight", highlight });
  };

  const renderDialog = () => (
    <AlertDialog
      open={Boolean(dialog)}
      onOpenChange={(open) => {
        if (!open) {
          setDialog(null);
        }
      }}
    >
      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {dialog?.type === "edit" ? "编辑资料" : dialog?.highlight.label}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {dialog?.type === "edit"
              ? "个人主页编辑功能准备中，敬请期待新版上线."
              : dialog?.highlight
              ? `我们会将 "${dialog.highlight.label}" 功能与正式版小程序打通，后续可在这里集中管理.`
              : ""}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction asChild>
            <Button className="rounded-full" onClick={() => setDialog(null)}>
              好的
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  const renderSkeleton = () => (
    <div className="px-6 py-6">
      <div className="flex items-center mb-6 animate-pulse">
        <div className="w-16 h-16 rounded-full bg-gray-200 mr-4" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-3 bg-gray-200 rounded w-40" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 text-center">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2 animate-pulse">
            <div className="h-5 bg-gray-200 rounded" />
            <div className="h-3 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return renderSkeleton();
    }

    if (error) {
      return (
        <div className="px-6 py-20 text-center">
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={retry} className="rounded-full px-6">
            重新加载
          </Button>
        </div>
      );
    }

    if (!profile) {
      return (
        <div className="px-6 py-20 text-center text-gray-500">
          暂无个人资料，稍后再来看看吧～
        </div>
      );
    }

    return (
      <>
        <div className="bg-white px-6 py-6">
          <div className="flex items-center mb-6">
            <div className="relative mr-4">
              <ImageWithFallback
                src={profile.user.avatar}
                alt="我的头像"
                className="w-16 h-16 rounded-full object-cover"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center mb-1">
                <h2 className="text-lg font-semibold text-gray-900 mr-2">
                  {profile.user.name}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 rounded-full text-xs"
                  onClick={handleEditProfile}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  编辑资料
                </Button>
              </div>
              <p className="text-sm text-gray-500 mb-2">{profile.user.bio}</p>
              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                {profile.user.location && <span>📍 {profile.user.location}</span>}
                {profile.user.website && (
                  <span className="truncate max-w-[150px]">
                    🔗 {profile.user.website}
                  </span>
                )}
              </div>
            </div>
          </div>

          {profile.user.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {profile.user.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 bg-pink-100 text-pink-600 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {profile.user.certifications && profile.user.certifications.length > 0 && (
            <div className="bg-pink-50 border border-pink-100 rounded-xl p-3 mb-4 text-xs text-pink-600">
              {profile.user.certifications.join(" · ")}
            </div>
          )}

          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-xl font-semibold text-gray-900">{profile.stats.dynamics}</div>
              <div className="text-xs text-gray-500">动态</div>
            </div>
            <div>
              <div className="text-xl font-semibold text-gray-900">{profile.stats.followers}</div>
              <div className="text-xs text-gray-500">粉丝</div>
            </div>
            <div>
              <div className="text-xl font-semibold text-gray-900">{profile.stats.following}</div>
              <div className="text-xs text-gray-500">关注</div>
            </div>
            <div>
              <div className="text-xl font-semibold text-gray-900">{profile.stats.likes}</div>
              <div className="text-xs text-gray-500">获赞</div>
            </div>
          </div>
        </div>

        <div className="px-4 mt-4 mb-6">
          <div className="bg-white rounded-2xl p-4">
            <div className="grid grid-cols-4 gap-4 text-center">
              {profile.highlights.map((highlight) => {
                const Icon = highlightIconMap[highlight.icon];
                return (
                  <button
                    key={highlight.id}
                    type="button"
                    className="flex flex-col items-center"
                    onClick={() => handleHighlightClick(highlight)}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                      style={{
                        background: highlight.icon === "heart"
                          ? "#ffe4f3"
                          : highlight.icon === "bookmark"
                          ? "#fff4d6"
                          : highlight.icon === "users"
                          ? "#e1f0ff"
                          : "#efe9ff",
                      }}
                    >
                      <Icon className="w-6 h-6 text-gray-600" />
                    </div>
                    <span className="text-xs text-gray-600">{highlight.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

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
              <PostGrid posts={profile.posts} />
            </TabsContent>

            <TabsContent value="skills" className="mt-6">
              {profile.skills.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  还没有发布技能课程
                  <div className="text-sm text-gray-400 mt-1">
                    去技能页看看灵感吧～
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {profile.skills.map((course) => (
                    <div
                      key={course.id}
                      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                    >
                      <div className="flex items-center">
                        <ImageWithFallback
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-20 h-20 rounded-xl object-cover mr-3"
                        />
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
                            {course.title}
                          </h3>
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {course.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="drafts" className="mt-6">
              <div className="text-center py-12">
                <p className="text-gray-500">草稿箱是空的</p>
                <p className="text-sm text-gray-400 mt-1">创作内容时会自动保存草稿</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header
        title="我的"
        rightContent={
          <Button variant="ghost" className="w-8 h-8 p-0">
            <Settings className="w-5 h-5 text-gray-600" />
          </Button>
        }
      />

      <div className="pt-24 pb-24 space-y-6">{renderContent()}</div>
      {renderDialog()}
    </div>
  );
}