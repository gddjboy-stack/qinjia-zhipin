/**
 * Mock Data - 集中管理所有模拟数据
 *
 * 所有页面统一引用此文件，避免数据分散和不一致
 * 字段名与 shared/types.ts 中的 UserPublishedProfile 接口保持一致
 *
 * 开关控制：通过 VITE_MOCK_ENABLED 环境变量控制是否启用 mock 数据
 * - 开发/演示环境：VITE_MOCK_ENABLED=true
 * - 生产环境：VITE_MOCK_ENABLED=false（不显示 mock 数据）
 */

/**
 * Mock数据开关
 * 默认为 true（未配置环境变量时保持 mock 数据可见）
 */
export const MOCK_ENABLED = import.meta.env.VITE_MOCK_ENABLED !== 'false';

// 首页卡片和详情页共用的完整资料接口
export interface MockProfile {
  id: string;
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
  isVerified: boolean;
  certificationLevel?: 0 | 1 | 2 | 3;  // 认证等级预留
  profileImage: string;
  certifications?: {
    phoneVerified: boolean;
    idVerified: boolean;
    profileVerified: boolean;
  };
  verificationDate?: string;
  // mock用户的userId，用于消息路由
  userId: string;
}

const PROFILE_IMAGE_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663294512282/7Lo4nggRFmy8FNkeNMysMy/profile-placeholder-ShbPNkLasTbVzht6qnEX9J.webp';

export const mockProfiles: MockProfile[] = [
  {
    id: '1',
    userId: 'mock_user_1',
    childName: '李明',
    childAge: 32,
    childGender: 'male',
    childEducation: '本科',
    childOccupation: '软件工程师',
    childLocation: '北京',
    workCity: '北京',
    hasHousing: 'yes',
    hasCar: 'yes',
    annualIncome: '50-80万',
    nativePlace: '山东',
    zodiacSign: '龙',
    childDescription: '性格开朗，喜欢运动和旅游，希望找到一个温柔体贴的女性。工作稳定，有房有车，家庭观念强。',
    parentName: '李女士',
    parentPhone: '13812341234',
    parentLocation: '北京',
    isVerified: true,
    profileImage: PROFILE_IMAGE_URL,
    certifications: {
      phoneVerified: true,
      idVerified: true,
      profileVerified: true
    },
    verificationDate: '2026-02-28'
  },
  {
    id: '2',
    userId: 'mock_user_2',
    childName: '王芳',
    childAge: 28,
    childGender: 'female',
    childEducation: '硕士',
    childOccupation: '医生',
    childLocation: '上海',
    workCity: '上海',
    hasHousing: 'yes',
    hasCar: 'no',
    annualIncome: '30-50万',
    nativePlace: '江苏',
    zodiacSign: '兔',
    childDescription: '温柔贤惠，家庭观念强，希望找到一个有责任心的男性。工作稳定，独立自强。',
    parentName: '王先生',
    parentPhone: '13956785678',
    parentLocation: '上海',
    isVerified: true,
    profileImage: PROFILE_IMAGE_URL,
    certifications: {
      phoneVerified: true,
      idVerified: true,
      profileVerified: true
    },
    verificationDate: '2026-02-27'
  },
  {
    id: '3',
    userId: 'mock_user_3',
    childName: '张浩',
    childAge: 35,
    childGender: 'male',
    childEducation: '本科',
    childOccupation: '企业管理',
    childLocation: '深圳',
    workCity: '深圳',
    hasHousing: 'yes',
    hasCar: 'yes',
    annualIncome: '80-100万',
    nativePlace: '湖北',
    zodiacSign: '虎',
    childDescription: '成熟稳重，事业有成，寻找志同道合的伴侣。',
    parentName: '张女士',
    parentPhone: '13799999999',
    parentLocation: '深圳',
    isVerified: false,
    profileImage: PROFILE_IMAGE_URL
  },
  {
    id: '4',
    userId: 'mock_user_4',
    childName: '陈思',
    childAge: 26,
    childGender: 'female',
    childEducation: '本科',
    childOccupation: '设计师',
    childLocation: '杭州',
    workCity: '杭州',
    hasHousing: 'no',
    hasCar: 'no',
    annualIncome: '20-30万',
    nativePlace: '浙江',
    zodiacSign: '马',
    childDescription: '创意十足，热爱生活，期待遇见有趣的灵魂。独立自主，有自己的事业和梦想。',
    parentName: '陈先生',
    parentPhone: '13633333333',
    parentLocation: '杭州',
    isVerified: true,
    profileImage: PROFILE_IMAGE_URL
  },
  {
    id: '5',
    userId: 'mock_user_5',
    childName: '刘军',
    childAge: 38,
    childGender: 'male',
    childEducation: '硕士',
    childOccupation: '律师',
    childLocation: '北京',
    workCity: '北京',
    hasHousing: 'yes',
    hasCar: 'yes',
    annualIncome: '100万以上',
    nativePlace: '北京',
    zodiacSign: '蛇',
    childDescription: '专业素养高，生活品质讲究，寻找志同道合的伴侣。事业有成，家庭观念强。',
    parentName: '刘女士',
    parentPhone: '13544444444',
    parentLocation: '北京',
    isVerified: true,
    profileImage: PROFILE_IMAGE_URL
  },
  {
    id: '6',
    userId: 'mock_user_6',
    childName: '周丽',
    childAge: 30,
    childGender: 'female',
    childEducation: '大专',
    childOccupation: '教师',
    childLocation: '南京',
    workCity: '南京',
    hasHousing: 'yes',
    hasCar: 'yes',
    annualIncome: '20-30万',
    nativePlace: '安徽',
    zodiacSign: '羊',
    childDescription: '温柔善良，热爱教育工作，希望找到一个稳定可靠的伴侣。有房有车，生活稳定。',
    parentName: '周女士',
    parentPhone: '13455555555',
    parentLocation: '南京',
    isVerified: true,
    profileImage: PROFILE_IMAGE_URL
  },
  {
    id: '7',
    userId: 'mock_user_7',
    childName: '吴涛',
    childAge: 34,
    childGender: 'male',
    childEducation: '本科',
    childOccupation: '销售经理',
    childLocation: '广州',
    workCity: '广州',
    hasHousing: 'no',
    hasCar: 'yes',
    annualIncome: '30-50万',
    nativePlace: '广东',
    zodiacSign: '猴',
    childDescription: '外向热情，善于沟通，期待找到一个理解自己的伴侣。有车，生活充满活力。',
    parentName: '吴先生',
    parentPhone: '13366666666',
    parentLocation: '广州',
    isVerified: false,
    profileImage: PROFILE_IMAGE_URL
  }
];

/**
 * 获取所有 mock 资料（支持开关控制）
 */
export function getMockProfiles(): MockProfile[] {
  if (!MOCK_ENABLED) return [];
  return mockProfiles;
}

/**
 * 通过ID查找 mock资料
 */
export function getMockProfileById(id: string): MockProfile | undefined {
  if (!MOCK_ENABLED) return undefined;
  return mockProfiles.find(p => p.id === id);
}

/**
 * 获取mock资料的简要信息（用于Contact页面）
 */
export function getMockProfileBrief(id: string): { childName: string; parentName: string; userId: string } | undefined {
  const profile = getMockProfileById(id);
  if (!profile) return undefined;
  return {
    childName: profile.childName,
    parentName: profile.parentName,
    userId: profile.userId
  };
}
