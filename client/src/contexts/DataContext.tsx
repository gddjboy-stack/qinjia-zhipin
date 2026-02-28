/**
 * Data Context - 全局数据管理
 * 使用 localStorage 保存用户发布的资料信息和未读消息
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

export interface ContactRequest {
  id: string;
  fromProfileId: string;
  fromParentName: string;
  fromChildName: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

interface DataContextType {
  userProfile: UserPublishedProfile | null;
  publishProfile: (profile: Omit<UserPublishedProfile, 'id' | 'publishedAt' | 'isVerified' | 'profileImage'>) => void;
  clearProfile: () => void;
  hasPublishedProfile: boolean;
  contactRequests: ContactRequest[];
  addContactRequest: (request: Omit<ContactRequest, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (requestId: string) => void;
  markAllAsRead: () => void;
  unreadCount: number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const PROFILE_STORAGE_KEY = 'qinjia_user_profile';
const CONTACTS_STORAGE_KEY = 'qinjia_contact_requests';

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserPublishedProfile | null>(null);
  const [hasPublishedProfile, setHasPublishedProfile] = useState(false);
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // 从 localStorage 加载数据
  useEffect(() => {
    // 加载用户资料
    const storedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (storedProfile) {
      try {
        const profile = JSON.parse(storedProfile);
        setUserProfile(profile);
        setHasPublishedProfile(true);
      } catch (error) {
        console.error('Failed to parse stored profile:', error);
      }
    }

    // 加载联系申请
    const storedContacts = localStorage.getItem(CONTACTS_STORAGE_KEY);
    if (storedContacts) {
      try {
        const contacts = JSON.parse(storedContacts);
        setContactRequests(contacts);
        // 计算未读数量
        const unread = contacts.filter((c: ContactRequest) => !c.isRead).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error('Failed to parse stored contacts:', error);
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
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
  };

  const clearProfile = () => {
    setUserProfile(null);
    setHasPublishedProfile(false);
    localStorage.removeItem(PROFILE_STORAGE_KEY);
  };

  const addContactRequest = (request: Omit<ContactRequest, 'id' | 'timestamp' | 'isRead'>) => {
    const newRequest: ContactRequest = {
      ...request,
      id: `contact_${Date.now()}`,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    const updatedRequests = [newRequest, ...contactRequests];
    setContactRequests(updatedRequests);
    setUnreadCount(prev => prev + 1);
    localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(updatedRequests));
  };

  const markAsRead = (requestId: string) => {
    const updatedRequests = contactRequests.map(req => 
      req.id === requestId ? { ...req, isRead: true } : req
    );
    setContactRequests(updatedRequests);
    setUnreadCount(prev => Math.max(0, prev - 1));
    localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(updatedRequests));
  };

  const markAllAsRead = () => {
    const updatedRequests = contactRequests.map(req => ({ ...req, isRead: true }));
    setContactRequests(updatedRequests);
    setUnreadCount(0);
    localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(updatedRequests));
  };

  return (
    <DataContext.Provider
      value={{
        userProfile,
        publishProfile,
        clearProfile,
        hasPublishedProfile,
        contactRequests,
        addContactRequest,
        markAsRead,
        markAllAsRead,
        unreadCount
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
