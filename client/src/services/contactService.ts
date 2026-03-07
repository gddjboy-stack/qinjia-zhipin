/**
 * ContactService - 联系申请管理服务
 *
 * 架构设计（与Claude共同确认）：
 * - MVP阶段：使用 localStorage 存储联系申请
 * - Pro阶段：替换为 REST API 调用（/api/contacts/*），只需修改此文件
 *
 * 注意：isRead 字段将在 Step 4 升级为 status 字段
 * status: 'sent' | 'viewed' | 'replied' | 'accepted' | 'rejected' | 'cancelled'
 *
 * 所有方法均为 async，保持接口一致性
 */

import type { ContactRequest, ContactRequestStatus } from '@shared/types';
import { AppError, Errors } from '@/lib/errors';
import { getCurrentUserId } from './authService';

const CONTACTS_STORAGE_KEY = 'qinjia_contact_requests';

/**
 * 获取所有联系申请（包括发出和收到的）
 * Pro阶段替换为：GET /api/contacts
 */
export async function getAllContacts(): Promise<ContactRequest[]> {
  try {
    const data = localStorage.getItem(CONTACTS_STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as ContactRequest[];
  } catch (error) {
    throw new AppError('加载联系申请失败，请刷新页面重试', 'CONTACTS_LOAD_ERROR', undefined, true, error);
  }
}

/**
 * 获取当前用户收到的联系申请
 * Pro阶段替换为：GET /api/contacts/received
 */
export async function getReceivedContacts(): Promise<ContactRequest[]> {
  const userId = await getCurrentUserId();
  const all = await getAllContacts();
  return all.filter(c => c.toUserId === userId);
}

/**
 * 获取当前用户发出的联系申请
 * Pro阶段替换为：GET /api/contacts/sent
 */
export async function getSentContacts(): Promise<ContactRequest[]> {
  const userId = await getCurrentUserId();
  const all = await getAllContacts();
  return all.filter(c => c.fromUserId === userId);
}

/**
 * 发送联系申请
 * Pro阶段替换为：POST /api/contacts
 */
export async function addContact(
  request: Omit<ContactRequest, 'id' | 'timestamp' | 'status'>
): Promise<ContactRequest> {
  try {
    const all = await getAllContacts();

    // 检查是否已经申请过（防止重复申请）
    const isDuplicate = all.some(
      c => c.fromUserId === request.fromUserId && c.toProfileId === request.toProfileId
    );
    if (isDuplicate) {
      throw new AppError('您已经向该家庭发送过申请了', 'DUPLICATE_REQUEST', 400, false);
    }

    const newRequest: ContactRequest = {
      ...request,
      id: `contact_${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'sent',
    };

    const updated = [newRequest, ...all];
    localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(updated));
    return newRequest;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw Errors.STORAGE();
  }
}

/**
 * 标记单条申请为已查看（sent → viewed）
 * Pro阶段替换为：PATCH /api/contacts/:id/status
 */
export async function markAsRead(requestId: string): Promise<void> {
  try {
    const userId = await getCurrentUserId();
    const all = await getAllContacts();
    const updated = all.map(req =>
      req.id === requestId && req.toUserId === userId && req.status === 'sent'
        ? { ...req, status: 'viewed' as ContactRequestStatus }
        : req
    );
    localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw Errors.STORAGE();
  }
}

/**
 * 标记所有收到的申请为已查看
 * Pro阶段替换为：POST /api/contacts/read-all
 */
export async function markAllAsRead(): Promise<void> {
  try {
    const userId = await getCurrentUserId();
    const all = await getAllContacts();
    const updated = all.map(req =>
      req.toUserId === userId && req.status === 'sent'
        ? { ...req, status: 'viewed' as ContactRequestStatus }
        : req
    );
    localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw Errors.STORAGE();
  }
}

/**
 * 计算当前用户的未读申请数量（status === 'sent' 表示未查看）
 * Pro阶段替换为：GET /api/contacts/unread-count
 */
export async function getUnreadCount(): Promise<number> {
  const userId = await getCurrentUserId();
  const all = await getAllContacts();
  return all.filter(c => c.toUserId === userId && c.status === 'sent').length;
}

/**
 * 更新申请状态（接受/拒绝/撤回）
 * Pro阶段替换为：PATCH /api/contacts/:id/status
 */
export async function updateContactStatus(
  requestId: string,
  newStatus: ContactRequestStatus
): Promise<void> {
  try {
    const userId = await getCurrentUserId();
    const all = await getAllContacts();
    const updated = all.map(req => {
      if (req.id !== requestId) return req;
      // 接受/拒绝只能由被申请方操作
      if ((newStatus === 'accepted' || newStatus === 'rejected') && req.toUserId !== userId) return req;
      // 撤回只能由申请方操作
      if (newStatus === 'cancelled' && req.fromUserId !== userId) return req;
      return { ...req, status: newStatus };
    });
    localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw Errors.STORAGE();
  }
}

/**
 * 检查是否已向某资料发送过申请
 * Pro阶段替换为：GET /api/contacts/check?toProfileId=xxx
 */
export async function hasAppliedTo(toProfileId: string): Promise<boolean> {
  const userId = await getCurrentUserId();
  const all = await getAllContacts();
  return all.some(c => c.fromUserId === userId && c.toProfileId === toProfileId);
}
