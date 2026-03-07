/**
 * Shared Type Definitions for QinJia Match
 * 亲家直聘 - 数据模型
 * 
 * 注意：此文件与 client/src/contexts/DataContext.tsx 中的接口保持同步
 * 如需修改接口，必须同时更新两处
 */

export interface UserPublishedProfile {
  id: string;
  userId: string;
  certificationLevel?: 0 | 1 | 2 | 3;  // 认证等级预留：0=未认证, 1=基础, 2=标准, 3=高级
  childName: string;
  childAge: number;
  childGender: 'male' | 'female';
  childEducation: string;
  childOccupation: string;
  childLocation: string;
  workCity: string;
  hasHousing: 'yes' | 'no' | 'unknown';
  hasCar: 'yes' | 'no' | 'unknown';
  annualIncome: string;
  nativePlace: string;
  zodiacSign: string;
  childDescription: string;
  parentName: string;
  parentPhone: string;
  parentLocation: string;
  profileImage: string;
  isVerified: boolean;
  publishedAt: string;
  certifications: {
    phoneVerified: boolean;
    idVerified: boolean;
    profileVerified: boolean;
  };
  verificationDate?: string;
}

export type ContactRequestStatus = 'sent' | 'viewed' | 'accepted' | 'rejected' | 'cancelled';

export interface ContactRequest {
  id: string;
  fromUserId: string;
  fromProfileId: string;
  fromParentName: string;
  fromChildName: string;
  toUserId: string;
  toProfileId: string;
  toParentName: string;
  toChildName: string;
  message: string;
  timestamp: string;
  /**
   * 申请状态流转：
   * - sent: 已发送（初始状态）
   * - viewed: 对方已查看
   * - accepted: 对方已接受（可查看联系方式）
   * - rejected: 对方已拒绝
   * - cancelled: 申请方已撤回
   */
  status: ContactRequestStatus;
}

export interface UserSettings {
  privacy: {
    pauseReceivingApplications: boolean;  // 总开关：暂停接收申请（与DataContext.tsx保持一致）
    showProfile: boolean;
    allowApplications: boolean;
    showLocation: boolean;
    showContact: boolean;
  };
  notifications: {
    newApplications: boolean;
    messageReplies: boolean;
    recommendations: boolean;
  };
}

export interface SearchFilters {
  ageMin?: number;
  ageMax?: number;
  gender?: 'male' | 'female';
  location?: string;
  education?: string;
  zodiac?: string;
}

export const ZODIAC_SIGNS = [
  '鼠', '牛', '虎', '兔', '龙', '蛇',
  '马', '羊', '猴', '鸡', '狗', '猪'
];

export const EDUCATION_LEVELS = [
  '高中及以下',
  '大专',
  '本科',
  '硕士',
  '博士'
];

export const INCOME_RANGES = [
  '20万以下',
  '20-30万',
  '30-50万',
  '50-80万',
  '80-100万',
  '100万以上',
  '不便透露'
];
