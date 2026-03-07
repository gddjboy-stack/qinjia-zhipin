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
  // 注意：isRead 字段将在 Step 4 升级为 status 字段
  // status: 'sent' | 'viewed' | 'replied' | 'accepted' | 'rejected' | 'cancelled'
  isRead: boolean;
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
