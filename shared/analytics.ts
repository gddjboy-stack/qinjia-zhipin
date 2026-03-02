/**
 * 数据埋点系统 - 事件定义和类型
 * 用于追踪用户行为、流量来源、转化漏斗等关键指标
 */

// 埋点事件名称常量
export const ANALYTICS_EVENTS = {
  // 页面浏览
  PAGE_VIEW: 'page_view',
  
  // 用户行为 - 发布资料
  PUBLISH_PAGE_ENTER: 'publish_page_enter',
  PUBLISH_PAGE_EXIT: 'publish_page_exit',
  PUBLISH_FORM_START: 'publish_form_start',
  PUBLISH_FORM_COMPLETE: 'publish_form_complete',
  
  // 用户行为 - 浏览资料
  PROFILE_VIEW: 'profile_view',
  PROFILE_LIKE: 'profile_like',
  
  // 用户行为 - 申请联系
  APPLICATION_SUBMIT: 'application_submit',
  
  // 用户行为 - 邀请分享
  INVITE_SHARE: 'invite_share',
  
  // 用户行为 - 筛选
  FILTER_APPLY: 'filter_apply',
  
  // 用户行为 - 性别切换
  GENDER_SWITCH: 'gender_switch',
  
  // 支付相关（为未来支付功能预留）
  PAYMENT_INITIATED: 'payment_initiated',
  PAYMENT_SUCCESS: 'payment_success',
  PAYMENT_FAILED: 'payment_failed',
  
  // 认证相关
  VERIFICATION_VIEWED: 'verification_viewed',
  
  // 指南相关
  GUIDE_SHOWN: 'guide_shown',
  GUIDE_DISMISSED: 'guide_dismissed',
  GUIDE_ACTION_CLICKED: 'guide_action_clicked',
} as const;

// 埋点事件属性接口
export interface AnalyticsEventProperties {
  [key: string]: string | number | boolean | null | undefined;
}

// 埋点事件数据结构
export interface AnalyticsEvent {
  event_name: string;
  user_id: string;
  timestamp: string;
  page_path: string;
  properties: AnalyticsEventProperties;
  session_id: string;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
}

// 埋点数据导出格式
export interface AnalyticsExport {
  export_time: string;
  total_events: number;
  events: AnalyticsEvent[];
}

// 页面路径常量
export const PAGE_PATHS = {
  HOME: '/home',
  PUBLISH: '/publish',
  PROFILE_DETAIL: '/profile/:id',
  CONTACT: '/contact/:id',
  PROFILE: '/profile',
  GUIDE: '/guide',
} as const;
