/**
 * AnalyticsService - 数据埋点服务
 *
 * 架构设计（与Claude共同确认）：
 * - 统一从 authService 获取 userId，解决埋点数据与用户数据关联不上的问题
 * - MVP阶段：存储到 localStorage（注意：localStorage会爆满，Pro阶段必须迁移）
 * - Pro阶段：替换为发送到后端 API（/api/analytics/events），只需修改此文件
 *
 * 注意：MVP阶段的localStorage存储有容量限制（约5MB），
 * 高频使用时可能导致存储失败。Pro阶段必须迁移到后端API。
 */

import { getCurrentUserId } from './authService';
import { ANALYTICS_EVENTS } from '@/lib/analytics';

export { ANALYTICS_EVENTS };

const STORAGE_KEY = 'qinjia_analytics_events';
const SESSION_ID_KEY = 'qinjia_session_id';
const MAX_EVENTS_IN_STORAGE = 500; // 防止localStorage爆满

interface AnalyticsEvent {
  event_name: string;
  user_id: string;
  timestamp: string;
  page_path: string;
  session_id: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  properties: Record<string, unknown>;
}

/**
 * 获取或创建会话ID（标签页级别）
 */
function getOrCreateSessionId(): string {
  let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  return sessionId;
}

/**
 * 从URL中提取UTM参数
 */
function getUtmParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
  };
}

/**
 * 获取已存储的埋点事件
 */
function getStoredEvents(): AnalyticsEvent[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * 记录埋点事件
 * - userId 统一从 authService 获取，确保与用户数据关联一致
 * Pro阶段替换为：POST /api/analytics/events
 */
export async function trackEvent(
  eventName: string,
  properties: Record<string, unknown> = {}
): Promise<void> {
  try {
    const userId = await getCurrentUserId();
    const utmParams = getUtmParams();

    const event: AnalyticsEvent = {
      event_name: eventName,
      user_id: userId,
      timestamp: new Date().toISOString(),
      page_path: window.location.pathname,
      session_id: getOrCreateSessionId(),
      utm_source: utmParams.utm_source,
      utm_medium: utmParams.utm_medium,
      utm_campaign: utmParams.utm_campaign,
      properties,
    };

    // MVP阶段：存储到localStorage（有容量限制）
    const events = getStoredEvents();
    events.push(event);

    // 防止localStorage爆满：超过上限时删除最旧的事件
    const trimmed = events.length > MAX_EVENTS_IN_STORAGE
      ? events.slice(events.length - MAX_EVENTS_IN_STORAGE)
      : events;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));

    // Pro阶段：发送到后端API
    // await fetch('/api/analytics/events', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(event),
    // });

    if (import.meta.env.DEV) {
      console.log('[Analytics]', event.event_name, event.properties);
    }
  } catch (error) {
    // 埋点失败不应影响用户体验，静默处理
    console.warn('[Analytics] Failed to track event:', eventName, error);
  }
}

/**
 * 获取埋点统计信息
 * Pro阶段替换为：GET /api/analytics/stats
 */
export function getAnalyticsStats() {
  const events = getStoredEvents();
  const uniqueUsers = new Set(events.map(e => e.user_id)).size;
  const uniqueSessions = new Set(events.map(e => e.session_id)).size;
  const eventsByType: Record<string, number> = {};
  events.forEach(event => {
    eventsByType[event.event_name] = (eventsByType[event.event_name] || 0) + 1;
  });
  return {
    total_events: events.length,
    unique_users: uniqueUsers,
    unique_sessions: uniqueSessions,
    events_by_type: eventsByType,
  };
}

/**
 * 导出埋点数据为JSON字符串
 */
export function exportAnalyticsAsJson(): string {
  const events = getStoredEvents();
  return JSON.stringify({
    export_time: new Date().toISOString(),
    total_events: events.length,
    events,
  }, null, 2);
}

/**
 * 下载埋点数据为JSON文件
 */
export function downloadAnalyticsJson(): void {
  const jsonData = exportAnalyticsAsJson();
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `analytics_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 清空埋点数据（仅用于测试）
 */
export function clearAnalyticsData(): void {
  localStorage.removeItem(STORAGE_KEY);
  console.warn('[Analytics] All data cleared');
}
