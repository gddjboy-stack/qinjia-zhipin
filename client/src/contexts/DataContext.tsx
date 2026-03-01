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
  // 父母关心的"硬通货"信息
  hasHousing: 'yes' | 'no' | 'unknown';
  hasCar: 'yes' | 'no' | 'unknown';
  annualIncome: string; // 年收入范围，如"30-50万"
  nativePlace: string; // 籍贯
  zodiacSign: string; // 属相
  workCity: string; // 现在工作地
  // 认证信息
  certifications: {
    phoneVerified: boolean; // 手机号实名
    idVerified: boolean; // 身份证实名
    profileVerified: boolean; // 资料真实性验证
  };
  verificationDate?: string; // 认证日期
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
  publishProfile: (profile: Omit<UserPublishedProfile, 'id' | 'publishedAt' | 'isVerified'>) => void;
  clearProfile: () => void;
  hasPublishedProfile: boolean;
  contactRequests: ContactRequest[];
  addContactRequest: (request: Omit<ContactRequest, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (requestId: string) => void;
  markAllAsRead: () => void;
  unreadCount: number;
  genderFilter: 'female' | 'male';
  setGenderFilter: (gender: 'female' | 'male') => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const PROFILE_STORAGE_KEY = 'qinjia_user_profile';
const CONTACTS_STORAGE_KEY = 'qinjia_contact_requests';
const GENDER_FILTER_KEY = 'qinjia_gender_filter';

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserPublishedProfile | null>(null);
  const [hasPublishedProfile, setHasPublishedProfile] = useState(false);
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [genderFilter, setGenderFilter] = useState<'female' | 'male'>('female');

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

    // 加载性别筛选偏好
    const storedGenderFilter = localStorage.getItem(GENDER_FILTER_KEY);
    if (storedGenderFilter === 'male' || storedGenderFilter === 'female') {
      setGenderFilter(storedGenderFilter);
    }
  }, []);

  const publishProfile = (profile: Omit<UserPublishedProfile, 'id' | 'publishedAt' | 'isVerified'>) => {
    const newProfile: UserPublishedProfile = {
      ...profile,
      id: `user_${Date.now()}`,
      publishedAt: new Date().toISOString(),
      isVerified: false
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

  const handleSetGenderFilter = (gender: 'female' | 'male') => {
    setGenderFilter(gender);
    localStorage.setItem(GENDER_FILTER_KEY, gender);
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
        unreadCount,
        genderFilter,
        setGenderFilter: handleSetGenderFilter
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
