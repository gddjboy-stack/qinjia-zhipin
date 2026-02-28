/**
 * Shared Type Definitions for QinJia Match
 * 亲家直聘 - 数据模型
 */

export interface User {
  id: string;
  name: string;
  avatar: string;
  phone?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  childName: string;
  childAge: number;
  childGender: 'male' | 'female';
  childZodiac: string;
  childEducation: string;
  childOccupation: string;
  childIncome?: string;
  childLocation: string;
  childDescription: string;
  parentName: string;
  parentPhone: string;
  parentLocation: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromProfile: Profile;
  toProfile: Profile;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
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
  '5000以下',
  '5000-10000',
  '10000-20000',
  '20000-50000',
  '50000以上'
];
