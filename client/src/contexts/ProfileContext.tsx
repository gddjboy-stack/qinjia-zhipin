/**
 * ProfileContext - 用户资料管理
 *
 * 职责：管理当前用户发布的资料（CRUD）
 * 依赖：AuthContext（需要userId）
 * 被依赖：页面组件（Home, Profile, Publish, ProfileDetail, Contact）
 *
 * MVP阶段：localStorage 存储
 * Pro阶段：通过 profileService 调用 REST API
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getMyProfile, saveProfile, deleteMyProfile } from '@/services/profileService';
import type { UserPublishedProfile } from '@shared/types';

interface ProfileContextType {
  userProfile: UserPublishedProfile | null;
  hasPublishedProfile: boolean;
  publishProfile: (profile: Omit<UserPublishedProfile, 'id' | 'userId' | 'publishedAt' | 'isVerified'>) => void;
  clearProfile: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { userId } = useAuth();
  const [userProfile, setUserProfile] = useState<UserPublishedProfile | null>(null);
  const [hasPublishedProfile, setHasPublishedProfile] = useState(false);

  // 从Service层加载用户资料
  useEffect(() => {
    if (!userId) return;
    async function loadProfile() {
      try {
        const profile = await getMyProfile();
        if (profile) {
          setUserProfile(profile);
          setHasPublishedProfile(true);
        }
      } catch (error) {
        console.error('[ProfileContext] Failed to load profile:', error);
      }
    }
    loadProfile();
  }, [userId]);

  const publishProfile = useCallback(
    (profileData: Omit<UserPublishedProfile, 'id' | 'userId' | 'publishedAt' | 'isVerified'>) => {
      async function doSave() {
        try {
          const saved = await saveProfile(profileData);
          setUserProfile(saved);
          setHasPublishedProfile(true);
        } catch (error) {
          console.error('[ProfileContext] Failed to save profile:', error);
          // 降级：直接在内存中创建（保持MVP兼容）
          const fallback: UserPublishedProfile = {
            ...profileData,
            id: `profile_${Date.now()}`,
            userId,
            publishedAt: new Date().toISOString(),
            isVerified: false,
          };
          setUserProfile(fallback);
          setHasPublishedProfile(true);
          localStorage.setItem('qinjia_user_profile', JSON.stringify(fallback));
        }
      }
      doSave();
    },
    [userId]
  );

  const clearProfile = useCallback(() => {
    async function doDelete() {
      try {
        await deleteMyProfile();
      } catch (error) {
        console.error('[ProfileContext] Failed to delete profile:', error);
        localStorage.removeItem('qinjia_user_profile');
      }
      setUserProfile(null);
      setHasPublishedProfile(false);
    }
    doDelete();
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        userProfile,
        hasPublishedProfile,
        publishProfile,
        clearProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
