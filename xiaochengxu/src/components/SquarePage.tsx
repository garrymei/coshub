import { useEffect, useMemo, useState } from "react";
import { Search, Plus } from "lucide-react";
import { Header } from "./Header";
import { DynamicCard } from "./DynamicCard";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { fetchSquareFeed } from "../services/contentService";
import type { DynamicItem, SquareFeedData } from "../types/content";

type DialogState = {
  type: "publish" | "comment" | "share";
  dynamic?: DynamicItem;
};

export function SquarePage() {
  const [feed, setFeed] = useState<SquareFeedData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeOrder, setActiveOrder] = useState<"latest" | "popular">("latest");
  const [dialog, setDialog] = useState<DialogState | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchSquareFeed();
        if (isMounted) {
          setFeed(data);
        }
      } catch (err) {
        if (isMounted) {
          setError("内容加载失败，请稍后重试");
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
    fetchSquareFeed()
      .then(setFeed)
      .catch(() => setError("内容加载失败，请稍后重试"))
      .finally(() => setIsLoading(false));
  };

  const handleLike = (id: string) => {
    setFeed((prev) => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        dynamics: prev.dynamics.map((dynamic) =>
          dynamic.id === id
            ? {
                ...dynamic,
                stats: {
                  ...dynamic.stats,
                  isLiked: !dynamic.stats.isLiked,
                  likes: dynamic.stats.isLiked
                    ? dynamic.stats.likes - 1
                    : dynamic.stats.likes + 1,
                },
              }
            : dynamic
        ),
      };
    });
  };

  const handleBookmark = (id: string) => {
    setFeed((prev) => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        dynamics: prev.dynamics.map((dynamic) =>
          dynamic.id === id
            ? {
                ...dynamic,
                stats: {
                  ...dynamic.stats,
                  isBookmarked: !dynamic.stats.isBookmarked,
                },
              }
            : dynamic
        ),
      };
    });
  };

  const handlePublish = () => {
    setDialog({ type: "publish" });
  };

  const resolveDynamic = (id: string) =>
    feed?.dynamics.find((item) => item.id === id);

  const handleComment = (id: string) => {
    setDialog({ type: "comment", dynamic: resolveDynamic(id) });
  };

  const handleShare = (id: string) => {
    setDialog({ type: "share", dynamic: resolveDynamic(id) });
  };

  const handleTopicSelect = (topic: string) => {
    const pure = topic.replace(/^#/, "");
    setSearchQuery(pure);
  };

  const filteredDynamics = useMemo(() => {
    if (!feed) {
      return [];
    }

    const query = searchQuery.trim().toLowerCase();

    const matchesQuery = (dynamic: DynamicItem) => {
      if (!query) {
        return true;
      }

      const text = dynamic.content.text.toLowerCase();
      const name = dynamic.user.name.toLowerCase();
      const location = (dynamic.user.location || "").toLowerCase();
      const tags = dynamic.content.tags.map((tag) => tag.toLowerCase());

      return (
        text.includes(query) ||
        name.includes(query) ||
        location.includes(query) ||
        tags.some((tag) => tag.includes(query))
      );
    };

    const base = feed.dynamics.filter(matchesQuery);

    const sorted = [...base].sort((a, b) => {
      if (activeOrder === "popular") {
        return b.stats.likes - a.stats.likes;
      }

      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    });

    return sorted;
  }, [feed, searchQuery, activeOrder]);

  const dialogTitleMap: Record<DialogState["type"], string> = {
    publish: "发布动态",
    comment: "评论功能即将上线",
    share: "分享功能即将上线",
  };

  const dialogDescriptionMap: Record<DialogState["type"], string> = {
    publish: "即将跳转至发布流程，敬请期待正式版的小程序发布页。",
    comment: dialog?.dynamic
      ? `我们正在完善互动体验，很快就能和 ${dialog.dynamic.user.name} 互动啦！`
      : "我们正在完善互动体验，敬请期待。",
    share: dialog?.dynamic
      ? `${dialog.dynamic.user.name} 的精彩内容值得分享，稍后我们会开放多平台分享能力。`
      : "精彩内容值得分享，稍后我们会开放多平台分享能力。",
  };

  const renderAlertDialog = () => (
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
          <AlertDialogTitle>{dialog ? dialogTitleMap[dialog.type] : ""}</AlertDialogTitle>
          <AlertDialogDescription>
            {dialog ? dialogDescriptionMap[dialog.type] : ""}
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

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="px-4 space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse"
            >
              <div className="h-4 bg-gray-200/80 rounded w-24 mb-4" />
              <div className="h-3 bg-gray-200/80 rounded w-full mb-2" />
              <div className="h-3 bg-gray-200/80 rounded w-3/4" />
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="px-4 py-20 text-center">
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={retry} className="rounded-full px-6">
            重新加载
          </Button>
        </div>
      );
    }

    if (!feed) {
      return (
        <div className="px-4 py-20 text-center text-gray-500">
          暂无动态，稍后再来看吧～
        </div>
      );
    }

    return (
      <>
        <div className="px-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="搜索动态、用户、话题..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="pl-10 pr-4 py-3 rounded-full bg-white border-gray-200 focus:border-pink-300 focus:ring-pink-200"
            />
          </div>
        </div>

        <div className="px-4 mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">热门话题</h3>
          <div className="flex flex-wrap gap-2">
            {feed.topics.map((topic) => (
              <button
                key={topic.value}
                onClick={() => handleTopicSelect(topic.label)}
                className="px-3 py-1.5 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-600 rounded-full text-sm hover:from-pink-200 hover:to-purple-200 transition-colors"
              >
                {topic.label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">最新动态</h2>
            <div className="flex space-x-2 text-sm">
              <button
                className={`font-medium ${
                  activeOrder === "latest" ? "text-pink-500" : "text-gray-500"
                }`}
                onClick={() => setActiveOrder("latest")}
              >
                最新
              </button>
              <span className="text-gray-300">|</span>
              <button
                className={activeOrder === "popular" ? "text-pink-500" : "text-gray-500"}
                onClick={() => setActiveOrder("popular")}
              >
                热门
              </button>
            </div>
          </div>

          {filteredDynamics.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              没有找到相关内容，换个关键词试试吧～
            </div>
          ) : (
            filteredDynamics.map((dynamic) => (
              <DynamicCard
                key={dynamic.id}
                {...dynamic}
                onLike={handleLike}
                onBookmark={handleBookmark}
                onComment={handleComment}
                onShare={handleShare}
              />
            ))
          )}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
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

      <div className="pt-24 pb-24 space-y-6">{renderContent()}</div>
      {renderAlertDialog()}
    </div>
  );
}