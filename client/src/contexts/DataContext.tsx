/**
 * Data Context - 全局数据管理
 * 使用 localStorage 保存用户发布的资料信息和未读消息
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserPublishedProfile {
  id: string;
  userId: string;          // 用户ID，用于区分不同用户
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
  fromUserId: string;      // 申请者的用户ID
  fromProfileId: string;   // 申请者的资料ID
  fromParentName: string;  // 申请者的家长名字
  fromChildName: string;   // 申请者的孩子名字
  toUserId: string;        // 被申请者的用户ID
  toProfileId: string;     // 被申请者的资料ID
  toParentName: string;    // 被申请者的家长名字
  toChildName: string;     // 被申请者的孩子名字
  message: string;
  timestamp: string;
  isRead: boolean;
}

interface DataContextType {
  userProfile: UserPublishedProfile | null;
  publishProfile: (profile: Omit<UserPublishedProfile, 'id' | 'userId' | 'publishedAt' | 'isVerified'>) => void;
  clearProfile: () => void;
  hasPublishedProfile: boolean;
  contactRequests: ContactRequest[];
  addContactRequest: (request: Omit<ContactRequest, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (requestId: string) => void;
  markAllAsRead: () => void;
  unreadCount: number;
  genderFilter: 'female' | 'male';
  setGenderFilter: (gender: 'female' | 'male') => void;
  isFirstVisit: boolean;
  markFirstVisitDone: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const PROFILE_STORAGE_KEY = 'qinjia_user_profile';
const CONTACTS_STORAGE_KEY = 'qinjia_contact_requests';
const GENDER_FILTER_KEY = 'qinjia_gender_filter';
const FIRST_VISIT_KEY = 'qinjia_first_visit_shown';
const USER_ID_KEY = 'qinjia_user_id';

// 生成UUID
function generateUUID(): string {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserPublishedProfile | null>(null);
  const [hasPublishedProfile, setHasPublishedProfile] = useState(false);
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [genderFilter, setGenderFilter] = useState<'female' | 'male'>('female');
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [userId, setUserId] = useState<string>('');

  // 从 localStorage 加载数据
  useEffect(() => {
    // 加载或创建用户ID
    let storedUserId = localStorage.getItem(USER_ID_KEY);
    if (!storedUserId) {
      storedUserId = generateUUID();
      localStorage.setItem(USER_ID_KEY, storedUserId);
    }
    setUserId(storedUserId);

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
        // 计算未读数量：只统计发送给当前用户的未读消息
        const unread = contacts.filter((c: ContactRequest) => !c.isRead && c.toUserId === storedUserId).length;
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

    // 检查是否是首次访问
    const firstVisitShown = localStorage.getItem(FIRST_VISIT_KEY);
    setIsFirstVisit(!firstVisitShown);
  }, []);

  const publishProfile = (profile: Omit<UserPublishedProfile, 'id' | 'userId' | 'publishedAt' | 'isVerified'>) => {
    const newProfile: UserPublishedProfile = {
      ...profile,
      id: `profile_${Date.now()}`,
      userId: userId,  // 使用当前用户ID
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
    // 只在消息发送给当前用户时增加未读计数
    if (newRequest.toUserId === userId) {
      setUnreadCount(prev => prev + 1);
    }
    localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(updatedRequests));
  };

  const markAsRead = (requestId: string) => {
    const updatedRequests = contactRequests.map(req => 
      req.id === requestId ? { ...req, isRead: true } : req
    );
    setContactRequests(updatedRequests);
    // 只在标记发送给当前用户的消息时减少未读计数
    const request = contactRequests.find(r => r.id === requestId);
    if (request && request.toUserId === userId && !request.isRead) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(updatedRequests));
  };

  const markAllAsRead = () => {
    const updatedRequests = contactRequests.map(req => ({ ...req, isRead: true }));
    setContactRequests(updatedRequests);
    // 只清空发送给当前用户的未读消息
    const unreadToCurrentUser = contactRequests.filter(c => !c.isRead && c.toUserId === userId).length;
    setUnreadCount(0);
    localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(updatedRequests));
  };

  const handleSetGenderFilter = (gender: 'female' | 'male') => {
    setGenderFilter(gender);
    localStorage.setItem(GENDER_FILTER_KEY, gender);
  };

  const markFirstVisitDone = () => {
    localStorage.setItem(FIRST_VISIT_KEY, 'true');
    setIsFirstVisit(false);
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
        setGenderFilter,
        isFirstVisit,
        markFirstVisitDone
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
