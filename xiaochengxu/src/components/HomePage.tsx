import { useEffect, useState } from "react";
import { Header } from "./Header";
import { Carousel } from "./Carousel";
import { DynamicCard } from "./DynamicCard";
import { Button } from "./ui/button";
import { fetchHomeFeed } from "../services/contentService";
import type { DynamicItem, HomeFeedData } from "../types/content";

export function HomePage() {
  const [feed, setFeed] = useState<HomeFeedData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchHomeFeed();
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

  const retry = () => {
    setFeed(null);
    setError(null);
    setIsLoading(true);

    fetchHomeFeed()
      .then(setFeed)
      .catch(() => setError("内容加载失败，请稍后重试"))
      .finally(() => setIsLoading(false));
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="px-4 space-y-6">
          <div className="h-52 bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl animate-pulse" />
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, index) => (
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
          <Carousel items={feed.carousel} />
        </div>

        <div className="px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">精选动态</h2>
            <span className="text-sm text-pink-500">查看更多</span>
          </div>

          {feed.dynamics.map((dynamic: DynamicItem) => (
            <DynamicCard
              key={dynamic.id}
              {...dynamic}
              onLike={handleLike}
              onBookmark={handleBookmark}
            />
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header title="Coshub" />

      <div className="pt-24 pb-24 space-y-6">{renderContent()}</div>
    </div>
  );
}