/**
 * Data Context - 全局数据管理
 * 使用 localStorage 保存用户发布的资料信息
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserPublishedProfile {
  id: string;
  childName: string;
  childAge: number;
  childGender: 'male' | 'female';
  childEducation: string;
  childOccupation: string;
  childLocation: string;
  childDescription: string;
  parentName: string;
  parentPhone: string;
  parentLocation: string;
  isVerified: boolean;
  profileImage: string;
  publishedAt: string;
}

interface DataContextType {
  userProfile: UserPublishedProfile | null;
  publishProfile: (profile: Omit<UserPublishedProfile, 'id' | 'publishedAt' | 'isVerified' | 'profileImage'>) => void;
  clearProfile: () => void;
  hasPublishedProfile: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEY = 'qinjia_user_profile';

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserPublishedProfile | null>(null);
  const [hasPublishedProfile, setHasPublishedProfile] = useState(false);

  // 从 localStorage 加载数据
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const profile = JSON.parse(stored);
        setUserProfile(profile);
        setHasPublishedProfile(true);
      } catch (error) {
        console.error('Failed to parse stored profile:', error);
      }
    }
  }, []);

  const publishProfile = (profile: Omit<UserPublishedProfile, 'id' | 'publishedAt' | 'isVerified' | 'profileImage'>) => {
    const newProfile: UserPublishedProfile = {
      ...profile,
      id: `user_${Date.now()}`,
      publishedAt: new Date().toISOString(),
      isVerified: false,
      profileImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663294512282/7Lo4nggRFmy8FNkeNMysMy/profile-placeholder-ShbPNkLasTbVzht6qnEX9J.webp'
    };

    setUserProfile(newProfile);
    setHasPublishedProfile(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
  };

  const clearProfile = () => {
    setUserProfile(null);
    setHasPublishedProfile(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <DataContext.Provider
      value={{
        userProfile,
        publishProfile,
        clearProfile,
        hasPublishedProfile
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
