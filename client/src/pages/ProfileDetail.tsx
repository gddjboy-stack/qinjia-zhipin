/**
 * Profile Detail Page - 子女详情页
 * 展示完整的子女资料和父母信息
 * 
 * 设计理念：温暖关怀型现代主义
 * - 详细的信息展示，建立信任感
 * - 清晰的信息层级
 * - 突出的"申请联系"按钮
 */

import { useParams } from 'wouter';
import { useLocation } from 'wouter';
import { ArrowLeft, MapPin, Briefcase, BookOpen, CheckCircle, Phone, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useData } from '@/contexts/DataContext';

interface ProfileDetail {
  id: string;
  childName: string;
  childAge: number;
  childGender: 'male' | 'female';
  childZodiac: string;
  childEducation: string;
  childOccupation: string;
  childIncome: string;
  childLocation: string;
  childDescription: string;
  parentName: string;
  parentPhone: string;
  parentLocation: string;
  isVerified: boolean;
  profileImage: string;
}

// Mock data - 包含所有7个资料
const mockProfileDetails: Record<string, ProfileDetail> = {
  '1': {
    id: '1',
    childName: '李明',
    childAge: 32,
    childGender: 'male',
    childZodiac: '龙',
    childEducation: '本科',
    childOccupation: '软件工程师',
    childIncome: '50-80万',
    childLocation: '北京',
    childDescription: '性格开朗，喜欢运动和旅游，希望找到一个温柔体贴的女性。工作稳定，有房有车，家庭观念强。',
    parentName: '李女士',
    parentPhone: '138****1234',
    parentLocation: '北京',
    isVerified: true,
    profileImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663294512282/7Lo4nggRFmy8FNkeNMysMy/profile-placeholder-ShbPNkLasTbVzht6qnEX9J.webp'
  },
  '2': {
    id: '2',
    childName: '王芳',
    childAge: 28,
    childGender: 'female',
    childZodiac: '兔',
    childEducation: '硕士',
    childOccupation: '医生',
    childIncome: '30-50万',
    childLocation: '上海',
    childDescription: '温柔贤惠，家庭观念强，希望找到一个有责任心的男性。工作稳定，独立自强。',
    parentName: '王先生',
    parentPhone: '139****5678',
    parentLocation: '上海',
    isVerified: true,
    profileImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663294512282/7Lo4nggRFmy8FNkeNMysMy/profile-placeholder-ShbPNkLasTbVzht6qnEX9J.webp'
  },
  '3': {
    id: '3',
    childName: '张浩',
    childAge: 35,
    childGender: 'male',
    childZodiac: '虎',
    childEducation: '本科',
    childOccupation: '企业管理',
    childIncome: '80-100万',
    childLocation: '深圳',
    childDescription: '成熟稳重，事业有成，寻找志同道合的伴侣。',
    parentName: '张女士',
    parentPhone: '137****9999',
    parentLocation: '深圳',
    isVerified: false,
    profileImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663294512282/7Lo4nggRFmy8FNkeNMysMy/profile-placeholder-ShbPNkLasTbVzht6qnEX9J.webp'
  },
  '4': {
    id: '4',
    childName: '陈思',
    childAge: 26,
    childGender: 'female',
    childZodiac: '马',
    childEducation: '本科',
    childOccupation: '设计师',
    childIncome: '20-30万',
    childLocation: '杭州',
    childDescription: '创意十足，热爱生活，期待遇见有趣的灵魂。独立自主，有自己的事业和梦想。',
    parentName: '陈先生',
    parentPhone: '136****3333',
    parentLocation: '杭州',
    isVerified: true,
    profileImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663294512282/7Lo4nggRFmy8FNkeNMysMy/profile-placeholder-ShbPNkLasTbVzht6qnEX9J.webp'
  },
  '5': {
    id: '5',
    childName: '刘军',
    childAge: 38,
    childGender: 'male',
    childZodiac: '蛇',
    childEducation: '硕士',
    childOccupation: '律师',
    childIncome: '100万以上',
    childLocation: '北京',
    childDescription: '专业素养高，生活品质讲究，寻找志同道合的伴侣。事业有成，家庭观念强。',
    parentName: '刘女士',
    parentPhone: '135****4444',
    parentLocation: '北京',
    isVerified: true,
    profileImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663294512282/7Lo4nggRFmy8FNkeNMysMy/profile-placeholder-ShbPNkLasTbVzht6qnEX9J.webp'
  },
  '6': {
    id: '6',
    childName: '周丽',
    childAge: 30,
    childGender: 'female',
    childZodiac: '羊',
    childEducation: '大专',
    childOccupation: '教师',
    childIncome: '20-30万',
    childLocation: '南京',
    childDescription: '温柔善良，热爱教育工作，希望找到一个稳定可靠的伴侣。有房有车，生活稳定。',
    parentName: '周女士',
    parentPhone: '134****5555',
    parentLocation: '南京',
    isVerified: true,
    profileImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663294512282/7Lo4nggRFmy8FNkeNMysMy/profile-placeholder-ShbPNkLasTbVzht6qnEX9J.webp'
  },
  '7': {
    id: '7',
    childName: '吴涛',
    childAge: 34,
    childGender: 'male',
    childZodiac: '猴',
    childEducation: '本科',
    childOccupation: '销售经理',
    childIncome: '30-50万',
    childLocation: '广州',
    childDescription: '外向热情，善于沟通，期待找到一个理解自己的伴侣。有车，生活充满活力。',
    parentName: '吴先生',
    parentPhone: '133****6666',
    parentLocation: '广州',
    isVerified: false,
    profileImage: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663294512282/7Lo4nggRFmy8FNkeNMysMy/profile-placeholder-ShbPNkLasTbVzht6qnEX9J.webp'
  }
};

export default function ProfileDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [isLiked, setIsLiked] = useState(false);
  const { userProfile, userSettings } = useData();

  let profile = null;
  
  if (userProfile && userProfile.id === id) {
    profile = {
      id: userProfile.id,
      childName: userProfile.childName,
      childAge: userProfile.childAge,
      childGender: userProfile.childGender,
      childZodiac: userProfile.zodiacSign || 'unknown',
      childEducation: userProfile.childEducation,
      childOccupation: userProfile.childOccupation,
      childIncome: userProfile.annualIncome,
      childLocation: userSettings.privacy.showLocation ? userProfile.childLocation : '隐私',
      childDescription: userProfile.childDescription,
      parentName: userProfile.parentName,
      parentPhone: userSettings.privacy.showContact ? '138****1234' : '隐私',
      parentLocation: userSettings.privacy.showLocation ? userProfile.childLocation : '隐私',
      isVerified: userProfile.isVerified,
      profileImage: userProfile.profileImage
    };
  } else {
    profile = mockProfileDetails[id || '1'];
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4">资料不存在</h2>
          <Button onClick={() => setLocation('/')}>返回首页</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-[#E8E8E6] px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <button
          onClick={() => setLocation('/')}
          className="p-2 hover:bg-[#F5F5F3] rounded-lg transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-800" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">详细资料</h1>
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Heart
            size={24}
            className={isLiked ? 'fill-red-500 text-red-500' : 'text-gray-300'}
          />
        </button>
      </div>

      {/* Profile Image */}
      <div className="relative h-64 bg-gradient-to-br from-[#FF8C42] to-[#FF7A2F] overflow-hidden">
        <img
          src={profile.profileImage}
          alt={profile.childName}
          className="w-full h-full object-cover"
        />
        {profile.isVerified && (
          <div className="absolute top-4 right-4 warm-badge warm-badge-verified flex items-center gap-1">
            <CheckCircle size={16} />
            <span>已认证</span>
          </div>
        )}
      </div>

      {/* Main Info Card */}
      <div className="mx-4 -mt-8 relative z-10 warm-card mb-4">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {profile.childName}
              <span className="text-lg ml-2 text-gray-600">{profile.childAge}岁</span>
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {profile.childGender === 'male' ? '男' : '女'} · 属{profile.childZodiac}
            </p>
          </div>
        </div>

        {/* Key Attributes */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-[#F5F5F3] rounded-lg">
            <MapPin size={18} className="text-[#FF8C42]" />
            <span className="text-gray-800">{profile.childLocation}</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-[#F5F5F3] rounded-lg">
            <BookOpen size={18} className="text-[#4A90E2]" />
            <span className="text-gray-800">{profile.childEducation}</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-[#F5F5F3] rounded-lg">
            <Briefcase size={18} className="text-[#52C41A]" />
            <span className="text-gray-800">{profile.childOccupation}</span>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="mx-4 mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-3">个人介绍</h3>
        <div className="warm-card">
          <p className="text-gray-700 leading-relaxed">{profile.childDescription}</p>
        </div>
      </div>

      {/* More Details */}
      <div className="mx-4 mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-3">更多信息</h3>
        <div className="warm-card space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-[#E8E8E6]">
            <span className="text-gray-600">年收入</span>
            <span className="font-semibold text-gray-800">{profile.childIncome}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">居住地</span>
            <span className="font-semibold text-gray-800">{profile.childLocation}</span>
          </div>
        </div>
      </div>

      {/* Parent Info Section */}
      <div className="mx-4 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-3">家长信息</h3>
        <div className="warm-card space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-[#E8E8E6]">
            <span className="text-gray-600">家长姓名</span>
            <span className="font-semibold text-gray-800">{profile.parentName}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-[#E8E8E6]">
            <span className="text-gray-600">所在地</span>
            <span className="font-semibold text-gray-800">{profile.parentLocation}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">联系方式</span>
            <span className="font-semibold text-gray-800">{profile.parentPhone}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons - Fixed at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8E8E6] px-4 py-4 flex gap-3">
        <Button
          variant="outline"
          className="flex-1 border-[#FF8C42] text-[#FF8C42] hover:bg-[#FF8C42] hover:text-white"
          onClick={() => setLocation('/')}
        >
          返回
        </Button>
        <Button
          className="flex-1 bg-[#FF8C42] hover:bg-[#FF7A2F] text-white"
          onClick={() => setLocation(`/contact/${profile.id}`)}
        >
          申请联系
        </Button>
      </div>
    </div>
  );
}
