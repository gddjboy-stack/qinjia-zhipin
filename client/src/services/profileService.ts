/**
 * ProfileService - 用户资料管理服务
 *
 * 架构设计（与Claude共同确认）：
 * - MVP阶段：使用 localStorage 存储用户资料
 * - Pro阶段：替换为 REST API 调用（/api/profiles/*），只需修改此文件
 *
 * 所有方法均为 async，保持接口一致性
 */

import { UserPublishedProfile } from '@/contexts/DataContext';
import { AppError, Errors, toAppError } from '@/lib/errors';
import { getCurrentUserId } from './authService';

const PROFILE_STORAGE_KEY = 'qinjia_user_profile';

/**
 * 获取当前用户发布的资料
 * Pro阶段替换为：GET /api/profiles/me
 */
export async function getMyProfile(): Promise<UserPublishedProfile | null> {
  try {
    const data = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data) as UserPublishedProfile;
  } catch (error) {
    throw new AppError('加载资料失败，请刷新页面重试', 'PROFILE_LOAD_ERROR', undefined, true, error);
  }
}

/**
 * 发布/更新用户资料
 * Pro阶段替换为：POST /api/profiles 或 PUT /api/profiles/:id
 */
export async function saveProfile(
  profileData: Omit<UserPublishedProfile, 'id' | 'userId' | 'publishedAt' | 'isVerified'>
): Promise<UserPublishedProfile> {
  try {
    const userId = await getCurrentUserId();
    const newProfile: UserPublishedProfile = {
      ...profileData,
      id: `profile_${Date.now()}`,
      userId,
      publishedAt: new Date().toISOString(),
      isVerified: false,
    };
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
    return newProfile;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw Errors.STORAGE();
  }
}

/**
 * 删除当前用户的资料
 * Pro阶段替换为：DELETE /api/profiles/:id
 */
export async function deleteMyProfile(): Promise<void> {
  try {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
  } catch (error) {
    throw Errors.STORAGE();
  }
}

/**
 * 检查当前用户是否已发布资料
 * Pro阶段替换为：GET /api/profiles/me（检查返回是否为null）
 */
export async function hasPublishedProfile(): Promise<boolean> {
  const profile = await getMyProfile();
  return profile !== null;
}

/**
 * 获取公开资料列表（用于首页展示）
 * MVP阶段：从 mockData 获取
 * Pro阶段替换为：GET /api/profiles?gender=xxx&page=xxx
 */
export async function getPublicProfiles(filters?: {
  gender?: 'male' | 'female';
  page?: number;
  pageSize?: number;
}): Promise<UserPublishedProfile[]> {
  // MVP阶段：返回空数组，由调用方（Context）合并mock数据
  // Pro阶段：调用 GET /api/profiles
  return [];
}

/**
 * 获取单个公开资料详情
 * MVP阶段：从 mockData 获取
 * Pro阶段替换为：GET /api/profiles/:id
 */
export async function getProfileById(id: string): Promise<UserPublishedProfile | null> {
  // MVP阶段：返回null，由调用方（Context）从mock数据中查找
  // Pro阶段：调用 GET /api/profiles/:id
  return null;
}
