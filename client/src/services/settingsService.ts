/**
 * SettingsService - 用户设置管理服务
 *
 * 架构设计（与Claude共同确认）：
 * - MVP阶段：使用 localStorage 存储用户设置
 * - Pro阶段：替换为 REST API 调用（/api/settings），只需修改此文件
 *
 * 所有方法均为 async，保持接口一致性
 */

import { UserSettings } from '@/contexts/DataContext';
import { Errors } from '@/lib/errors';

const SETTINGS_STORAGE_KEY = 'qinjia_user_settings';
const GENDER_FILTER_KEY = 'qinjia_gender_filter';
const FIRST_VISIT_KEY = 'qinjia_first_visit_shown';

export const DEFAULT_SETTINGS: UserSettings = {
  privacy: {
    pauseReceivingApplications: false,
    showProfile: true,
    allowApplications: true,
    showLocation: true,
    showContact: true,
  },
  notifications: {
    newApplications: true,
    messageReplies: true,
    recommendations: true,
  },
};

/**
 * 获取用户设置
 * Pro阶段替换为：GET /api/settings
 */
export async function getSettings(): Promise<UserSettings> {
  try {
    const data = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!data) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(data) as UserSettings;
    // 深度合并，确保新增字段有默认值
    return {
      privacy: { ...DEFAULT_SETTINGS.privacy, ...parsed.privacy },
      notifications: { ...DEFAULT_SETTINGS.notifications, ...parsed.notifications },
    };
  } catch (error) {
    console.error('Failed to parse settings, using defaults:', error);
    return DEFAULT_SETTINGS;
  }
}

/**
 * 更新隐私设置
 * Pro阶段替换为：PATCH /api/settings/privacy
 */
export async function updatePrivacySettings(
  settings: Partial<UserSettings['privacy']>
): Promise<UserSettings> {
  try {
    const current = await getSettings();
    const updated: UserSettings = {
      ...current,
      privacy: { ...current.privacy, ...settings },
    };
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    throw Errors.STORAGE();
  }
}

/**
 * 更新通知设置
 * Pro阶段替换为：PATCH /api/settings/notifications
 */
export async function updateNotificationSettings(
  settings: Partial<UserSettings['notifications']>
): Promise<UserSettings> {
  try {
    const current = await getSettings();
    const updated: UserSettings = {
      ...current,
      notifications: { ...current.notifications, ...settings },
    };
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    throw Errors.STORAGE();
  }
}

/**
 * 获取性别筛选偏好
 * Pro阶段替换为：包含在 GET /api/settings 中
 */
export async function getGenderFilter(): Promise<'female' | 'male'> {
  const stored = localStorage.getItem(GENDER_FILTER_KEY);
  if (stored === 'male' || stored === 'female') return stored;
  return 'female'; // 默认值
}

/**
 * 保存性别筛选偏好
 * Pro阶段替换为：包含在 PATCH /api/settings 中
 */
export async function saveGenderFilter(gender: 'female' | 'male'): Promise<void> {
  localStorage.setItem(GENDER_FILTER_KEY, gender);
}

/**
 * 检查是否是首次访问
 * Pro阶段替换为：包含在 GET /api/settings 中
 */
export async function isFirstVisit(): Promise<boolean> {
  return !localStorage.getItem(FIRST_VISIT_KEY);
}

/**
 * 标记首次访问已完成
 * Pro阶段替换为：包含在 PATCH /api/settings 中
 */
export async function markFirstVisitDone(): Promise<void> {
  localStorage.setItem(FIRST_VISIT_KEY, 'true');
}
