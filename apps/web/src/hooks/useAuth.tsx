"use client";

import { useState, useEffect, createContext, useContext } from "react";

interface User {
  id: string;
  username: string;
  nickname?: string;
  avatar?: string;
  email: string;
  role: "admin" | "moderator" | "user";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查本地存储的登录状态
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (token) {
          // TODO: 验证 token 有效性
          const mockUser: User = {
            id: "1",
            username: "demo_user",
            nickname: "演示用户",
            email: "demo@coshub.com",
            role: "admin",
          };
          setUser(mockUser);
        }
      } catch (error) {
        console.error("认证检查失败:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    // TODO: 实现真实登录逻辑
    if (username === "demo" && password === "demo") {
      const mockUser: User = {
        id: "1",
        username: "demo_user",
        nickname: "演示用户",
        email: "demo@coshub.com",
        role: "admin",
      };

      localStorage.setItem("auth_token", "mock_token");
      setUser(mockUser);
    } else {
      throw new Error("用户名或密码错误");
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
