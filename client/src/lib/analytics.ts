/**
 * 数据埋点系统 - 客户端实现
 * 负责收集、存储和导出用户行为数据
 */

import { AnalyticsEvent, AnalyticsEventProperties, AnalyticsExport, ANALYTICS_EVENTS } from '@/../../shared/analytics';

export { ANALYTICS_EVENTS };

const STORAGE_KEY = 'qinjia_analytics_events';
const SESSION_ID_KEY = 'qinjia_session_id';
const USER_ID_KEY = 'qinjia_user_id';

/**
 * 获取或创建用户ID
 */
function getOrCreateUserId(): string {
  let userId = localStorage.getItem(USER_ID_KEY);
  
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(USER_ID_KEY, userId);
  }
  
  return userId;
}

/**
 * 获取或创建会话ID
 * 会话ID在浏览器标签页关闭时重置
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
function getUtmParams(): {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
} {
  const params = new URLSearchParams(window.location.search);
  
  return {
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
  };
}

/**
 * 获取所有已存储的埋点事件
 */
function getStoredEvents(): AnalyticsEvent[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to parse analytics events:', error);
    return [];
  }
}

/**
 * 保存埋点事件到localStorage
 */
function saveEvent(event: AnalyticsEvent): void {
  try {
    const events = getStoredEvents();
    events.push(event);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('Failed to save analytics event:', error);
  }
}

/**
 * 记录埋点事件
 * @param eventName - 事件名称
 * @param properties - 事件属性
 */
export function trackEvent(
  eventName: string,
  properties: AnalyticsEventProperties = {}
): void {
  const utmParams = getUtmParams();
  
  const event: AnalyticsEvent = {
    event_name: eventName,
    user_id: getOrCreateUserId(),
    timestamp: new Date().toISOString(),
    page_path: window.location.pathname,
    properties: properties,
    session_id: getOrCreateSessionId(),
    utm_source: utmParams.utm_source,
    utm_medium: utmParams.utm_medium,
    utm_campaign: utmParams.utm_campaign,
  };
  
  saveEvent(event);
  
  // 开发环境下打印日志
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', event);
  }
}

/**
 * 导出所有埋点数据为JSON格式
 */
export function exportAnalyticsAsJson(): string {
  const events = getStoredEvents();
  
  const exportData: AnalyticsExport = {
    export_time: new Date().toISOString(),
    total_events: events.length,
    events: events,
  };
  
  return JSON.stringify(exportData, null, 2);
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
 * 清空所有埋点数据（仅用于测试）
 */
export function clearAnalyticsData(): void {
  localStorage.removeItem(STORAGE_KEY);
  console.warn('[Analytics] All data cleared');
}

/**
 * 获取埋点数据统计信息
 */
export function getAnalyticsStats(): {
  total_events: number;
  unique_users: number;
  unique_sessions: number;
  events_by_type: Record<string, number>;
} {
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
 * 获取用户ID（用于调试）
 */
export function getUserId(): string {
  return getOrCreateUserId();
}

/**
 * 获取会话ID（用于调试）
 */
export function getSessionId(): string {
  return getOrCreateSessionId();
}
