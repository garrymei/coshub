"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/feed");
      } else {
        router.replace("/login?redirect=/feed");
      }
    }
  }, [user, loading, router]);

  // 显示加载状态
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Coshub</h1>
        <p className="text-gray-600">正在跳转...</p>
      </div>
    </div>
  );
}
