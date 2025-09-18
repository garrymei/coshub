import { useEffect, useMemo, useState } from "react";
import { Search, Plus, Filter } from "lucide-react";
import { Header } from "./Header";
import { SkillCard } from "./SkillCard";
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
import { fetchSkillsCatalog } from "../services/contentService";
import type { SkillCourse, SkillsCatalog } from "../types/content";

type DialogState = {
  type: "enroll" | "publish";
  course?: SkillCourse;
};

export function SkillsPage() {
  const [catalog, setCatalog] = useState<SkillsCatalog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [dialog, setDialog] = useState<DialogState | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchSkillsCatalog();
        if (isMounted) {
          setCatalog(data);
        }
      } catch (err) {
        if (isMounted) {
          setError("课程加载失败，请稍后重试");
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
    fetchSkillsCatalog()
      .then(setCatalog)
      .catch(() => setError("课程加载失败，请稍后重试"))
      .finally(() => setIsLoading(false));
  };

  const handleEnroll = (courseId: string) => {
    const course = catalog?.courses.find((item) => item.id === courseId);

    if (!course) {
      return;
    }

    setDialog({ type: "enroll", course });
  };

  const handlePublish = () => {
    setDialog({ type: "publish" });
  };

  const filteredSkills = useMemo(() => {
    if (!catalog) {
      return [];
    }

    const query = searchQuery.trim().toLowerCase();

    return catalog.courses.filter((course) => {
      const matchesSearch =
        !query ||
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        course.instructor.name.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === "全部" || course.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [catalog, searchQuery, selectedCategory]);

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
            {dialog?.type === "enroll" ? "报名成功" : "发布课程"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {dialog?.type === "enroll" && dialog.course
              ? `我们会为你预留课程《${dialog.course.title}》，稍后将开放正式的报名流程。`
              : "敬请期待创作者中心，上线后你可以直接上传并发布技能课程。"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction asChild>
            <Button className="rounded-full" onClick={() => setDialog(null)}>
              知道了
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
              <div className="h-32 bg-gray-200/80 rounded-xl mb-4" />
              <div className="h-4 bg-gray-200/80 rounded w-32 mb-2" />
              <div className="h-3 bg-gray-200/80 rounded w-full mb-1" />
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

    if (!catalog) {
      return (
        <div className="px-4 py-20 text-center text-gray-500">
          暂无课程，稍后再来看吧～
        </div>
      );
    }

    return (
      <>
        <div className="px-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="搜索技能、讲师、标签..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="pl-10 pr-12 py-3 rounded-full bg-white border-gray-200 focus:border-purple-300 focus:ring-purple-200"
            />
            <Button
              variant="ghost"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 p-0 rounded-full hover:bg-gray-100"
            >
              <Filter className="w-4 h-4 text-gray-500" />
            </Button>
          </div>
        </div>

        <div className="px-4 mb-6">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
            {(catalog.categories || []).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedCategory === "全部" ? "热门技能" : `${selectedCategory}技能`}
            </h2>
            <span className="text-sm text-gray-500">{filteredSkills.length} 个课程</span>
          </div>

          {filteredSkills.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              没有找到相关课程，试试其他关键词吧～
            </div>
          ) : (
            filteredSkills.map((skill) => (
              <SkillCard
                key={skill.id}
                {...skill}
                onEnroll={handleEnroll}
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

      <div className="pt-24 pb-24 space-y-6">{renderContent()}</div>
      {renderDialog()}
    </div>
  );
}