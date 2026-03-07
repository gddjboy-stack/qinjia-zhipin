/**
 * SettingsContext - 用户设置管理
 *
 * 职责：管理隐私设置、通知设置、性别筛选偏好、首次访问状态
 * 依赖：AuthContext（需要userId）
 * 被依赖：页面组件（Home, ProfileDetail, Settings/Privacy, Settings/Notifications, App Router）
 *
 * MVP阶段：localStorage 存储
 * Pro阶段：通过 settingsService 调用 REST API
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  getSettings,
  updatePrivacySettings as serviceUpdatePrivacy,
  updateNotificationSettings as serviceUpdateNotifications,
  getGenderFilter,
  saveGenderFilter,
  isFirstVisit as serviceIsFirstVisit,
  markFirstVisitDone as serviceMarkFirstVisitDone,
  DEFAULT_SETTINGS,
} from '@/services/settingsService';
import type { UserSettings } from '@shared/types';

interface SettingsContextType {
  userSettings: UserSettings;
  updatePrivacySettings: (settings: Partial<UserSettings['privacy']>) => void;
  updateNotificationSettings: (settings: Partial<UserSettings['notifications']>) => void;
  genderFilter: 'female' | 'male';
  setGenderFilter: (gender: 'female' | 'male') => void;
  isFirstVisit: boolean;
  markFirstVisitDone: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { userId } = useAuth();
  const [userSettings, setUserSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [genderFilter, setGenderFilterState] = useState<'female' | 'male'>('female');
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  // 从Service层加载所有设置
  useEffect(() => {
    if (!userId) return;
    async function loadSettings() {
      try {
        const [settings, gender, firstVisit] = await Promise.all([
          getSettings(),
          getGenderFilter(),
          serviceIsFirstVisit(),
        ]);
        setUserSettings(settings);
        setGenderFilterState(gender);
        setIsFirstVisit(firstVisit);
      } catch (error) {
        console.error('[SettingsContext] Failed to load settings:', error);
        setUserSettings(DEFAULT_SETTINGS);
      }
    }
    loadSettings();
  }, [userId]);

  const updatePrivacySettings = useCallback(
    (settings: Partial<UserSettings['privacy']>) => {
      async function doUpdate() {
        try {
          const updated = await serviceUpdatePrivacy(settings);
          setUserSettings(updated);
        } catch (error) {
          console.error('[SettingsContext] Failed to update privacy settings:', error);
          // 降级：直接更新内存状态
          setUserSettings(prev => ({
            ...prev,
            privacy: { ...prev.privacy, ...settings },
          }));
        }
      }
      doUpdate();
    },
    []
  );

  const updateNotificationSettings = useCallback(
    (settings: Partial<UserSettings['notifications']>) => {
      async function doUpdate() {
        try {
          const updated = await serviceUpdateNotifications(settings);
          setUserSettings(updated);
        } catch (error) {
          console.error('[SettingsContext] Failed to update notification settings:', error);
          // 降级：直接更新内存状态
          setUserSettings(prev => ({
            ...prev,
            notifications: { ...prev.notifications, ...settings },
          }));
        }
      }
      doUpdate();
    },
    []
  );

  const setGenderFilter = useCallback((gender: 'female' | 'male') => {
    setGenderFilterState(gender);
    saveGenderFilter(gender).catch(error => {
      console.error('[SettingsContext] Failed to save gender filter:', error);
    });
  }, []);

  const markFirstVisitDone = useCallback(() => {
    setIsFirstVisit(false);
    serviceMarkFirstVisitDone().catch(error => {
      console.error('[SettingsContext] Failed to mark first visit done:', error);
    });
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        userSettings,
        updatePrivacySettings,
        updateNotificationSettings,
        genderFilter,
        setGenderFilter,
        isFirstVisit,
        markFirstVisitDone,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
