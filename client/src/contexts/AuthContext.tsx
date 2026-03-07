/**
 * AuthContext - 用户身份管理
 *
 * 职责：管理用户ID和认证状态
 * 依赖：无（最外层Provider）
 * 被依赖：ProfileContext, ContactContext, SettingsContext
 *
 * MVP阶段：匿名用户ID（localStorage）
 * Pro阶段：Manus OAuth 认证
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUserId, getAuthState, type AuthState } from '@/services/authService';

interface AuthContextType {
  userId: string;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      try {
        const state: AuthState = await getAuthState();
        setUserId(state.userId);
        setIsAuthenticated(state.isAuthenticated);
      } catch (error) {
        console.error('[AuthContext] Failed to initialize auth:', error);
        // 降级处理：尝试直接获取userId
        try {
          const fallbackId = await getCurrentUserId();
          setUserId(fallbackId);
        } catch {
          console.error('[AuthContext] Complete auth failure');
        }
      } finally {
        setIsLoading(false);
      }
    }
    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ userId, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
