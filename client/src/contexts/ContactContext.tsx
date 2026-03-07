/**
 * ContactContext - 联系申请管理
 *
 * 职责：管理联系申请的发送、接收、已读状态
 * 依赖：AuthContext（需要userId）
 * 被依赖：页面组件（Home, Profile, Contact）
 *
 * MVP阶段：localStorage 存储
 * Pro阶段：通过 contactService 调用 REST API
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  getAllContacts,
  addContact,
  markAsRead as serviceMarkAsRead,
  markAllAsRead as serviceMarkAllAsRead,
  getUnreadCount as serviceGetUnreadCount,
} from '@/services/contactService';
import type { ContactRequest } from '@shared/types';

interface ContactContextType {
  contactRequests: ContactRequest[];
  addContactRequest: (request: Omit<ContactRequest, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (requestId: string) => void;
  markAllAsRead: () => void;
  unreadCount: number;
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export function ContactProvider({ children }: { children: React.ReactNode }) {
  const { userId } = useAuth();
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // 从Service层加载联系申请
  useEffect(() => {
    if (!userId) return;
    async function loadContacts() {
      try {
        const contacts = await getAllContacts();
        setContactRequests(contacts);
        const count = await serviceGetUnreadCount();
        setUnreadCount(count);
      } catch (error) {
        console.error('[ContactContext] Failed to load contacts:', error);
      }
    }
    loadContacts();
  }, [userId]);

  const addContactRequest = useCallback(
    (request: Omit<ContactRequest, 'id' | 'timestamp' | 'isRead'>) => {
      async function doAdd() {
        try {
          const newRequest = await addContact(request);
          setContactRequests(prev => [newRequest, ...prev]);
          // 只在消息发送给当前用户时增加未读计数
          if (newRequest.toUserId === userId) {
            setUnreadCount(prev => prev + 1);
          }
        } catch (error) {
          console.error('[ContactContext] Failed to add contact request:', error);
          // 降级：直接在内存中创建
          const fallback: ContactRequest = {
            ...request,
            id: `contact_${Date.now()}`,
            timestamp: new Date().toISOString(),
            isRead: false,
          };
          setContactRequests(prev => [fallback, ...prev]);
          if (fallback.toUserId === userId) {
            setUnreadCount(prev => prev + 1);
          }
          // 同步到localStorage
          const stored = localStorage.getItem('qinjia_contact_requests');
          const existing = stored ? JSON.parse(stored) : [];
          localStorage.setItem('qinjia_contact_requests', JSON.stringify([fallback, ...existing]));
        }
      }
      doAdd();
    },
    [userId]
  );

  const markAsRead = useCallback(
    (requestId: string) => {
      async function doMark() {
        try {
          await serviceMarkAsRead(requestId);
          setContactRequests(prev =>
            prev.map(req => (req.id === requestId ? { ...req, isRead: true } : req))
          );
          // 只在标记发送给当前用户的消息时减少未读计数
          const request = contactRequests.find(r => r.id === requestId);
          if (request && request.toUserId === userId && !request.isRead) {
            setUnreadCount(prev => Math.max(0, prev - 1));
          }
        } catch (error) {
          console.error('[ContactContext] Failed to mark as read:', error);
        }
      }
      doMark();
    },
    [userId, contactRequests]
  );

  const markAllAsRead = useCallback(() => {
    async function doMarkAll() {
      try {
        await serviceMarkAllAsRead();
        setContactRequests(prev =>
          prev.map(req => (req.toUserId === userId ? { ...req, isRead: true } : req))
        );
        setUnreadCount(0);
      } catch (error) {
        console.error('[ContactContext] Failed to mark all as read:', error);
      }
    }
    doMarkAll();
  }, [userId]);

  return (
    <ContactContext.Provider
      value={{
        contactRequests,
        addContactRequest,
        markAsRead,
        markAllAsRead,
        unreadCount,
      }}
    >
      {children}
    </ContactContext.Provider>
  );
}

export function useContacts() {
  const context = useContext(ContactContext);
  if (context === undefined) {
    throw new Error('useContacts must be used within a ContactProvider');
  }
  return context;
}
