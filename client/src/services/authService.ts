/**
 * AuthService - 用户身份管理服务
 *
 * 架构设计（与Claude共同确认）：
 * - MVP阶段：使用 localStorage 生成并持久化匿名用户ID
 * - Pro阶段：替换为 Manus OAuth 认证流程，只需修改此文件
 *
 * AuthState 接口预留字段：
 * - isAuthenticated: Pro阶段接入OAuth后使用
 * - token: JWT token（Manus OAuth返回）
 * - user.openId: Manus OAuth返回的openId
 * - user.role: 'user' | 'admin'，用于后台管理权限控制
 *
 * 所有方法均为 async，保持接口一致性（Pro阶段API调用必然异步）
 */

import { AppError, Errors } from '@/lib/errors';

const USER_ID_KEY = 'qinjia_user_id';

export interface AuthUser {
  openId: string;      // Manus OAuth 返回的 openId（MVP阶段与userId相同）
  name: string;
  avatar?: string;
  role: 'user' | 'admin';
}

export interface AuthState {
  userId: string;
  isAuthenticated: boolean;
  token: string | null;
  user: AuthUser | null;
}

/**
 * 生成匿名用户ID（MVP阶段使用）
 */
function generateUserId(): string {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * 获取当前用户ID
 * MVP阶段：从localStorage读取，不存在则创建
 * Pro阶段：从JWT token中解析
 */
export async function getCurrentUserId(): Promise<string> {
  try {
    let userId = localStorage.getItem(USER_ID_KEY);
    if (!userId) {
      userId = generateUserId();
      localStorage.setItem(USER_ID_KEY, userId);
    }
    return userId;
  } catch (error) {
    throw new AppError('无法获取用户身份', 'AUTH_ERROR', undefined, false, error);
  }
}

/**
 * 获取当前认证状态
 * MVP阶段：始终返回匿名状态（isAuthenticated=false，无token）
 * Pro阶段：检查JWT token有效性，调用Manus OAuth接口
 */
export async function getAuthState(): Promise<AuthState> {
  const userId = await getCurrentUserId();
  return {
    userId,
    isAuthenticated: false,  // Pro阶段：检查token有效性
    token: null,              // Pro阶段：从sessionStorage/cookie读取JWT
    user: null,               // Pro阶段：从Manus OAuth获取用户信息
  };
}

/**
 * 检查是否为管理员
 * MVP阶段：始终返回false
 * Pro阶段：检查user.role === 'admin'
 */
export async function isAdmin(): Promise<boolean> {
  // Pro阶段：const state = await getAuthState(); return state.user?.role === 'admin';
  return false;
}

/**
 * 登出
 * MVP阶段：清除localStorage中的用户ID（相当于重置匿名身份）
 * Pro阶段：清除JWT token，调用Manus OAuth登出接口
 */
export async function logout(): Promise<void> {
  try {
    // Pro阶段：清除JWT token
    // localStorage.removeItem('qinjia_auth_token');
    // 注意：MVP阶段不清除userId，避免用户数据丢失
  } catch (error) {
    throw Errors.AUTH_EXPIRED();
  }
}

/**
 * 跳转到Manus OAuth登录页面
 * MVP阶段：不执行任何操作（无需登录）
 * Pro阶段：跳转到 VITE_OAUTH_PORTAL_URL
 */
export function redirectToLogin(): void {
  const oauthUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  if (oauthUrl) {
    window.location.href = oauthUrl;
  }
  // MVP阶段：无需登录，不跳转
}
