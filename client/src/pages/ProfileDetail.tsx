/**
 * Profile Detail Page - 子女详情页
 * 展示完整的子女资料和父母信息
 * 
 * 设计理念：温暖关怀型现代主义
 * - 详细的信息展示，建立信任感
 * - 清晰的信息层级
 * - 突出的"申请联系"按钮
 * 
 * 数据来源：优先从ProfileContext获取用户资料，否则从集中管理的mockData获取
 * 字段名统一使用shared/types.ts的UserPublishedProfile接口
 */

import { useParams } from 'wouter';
import { useLocation } from 'wouter';
import { ArrowLeft, MapPin, Briefcase, BookOpen, CheckCircle, Phone, Heart, Home as HomeIcon, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { useSettings } from '@/contexts/SettingsContext';
import { maskPhone } from '@/lib/utils';
import { getMockProfileById } from '@/lib/mockData';

export default function ProfileDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [isLiked, setIsLiked] = useState(false);
  const { userProfile } = useProfile();
  const { userSettings } = useSettings();

  // 统一的资料展示数据结构
  let profile: {
    id: string;
    childName: string;
    childAge: number;
    childGender: 'male' | 'female';
    zodiacSign: string;
    childEducation: string;
    childOccupation: string;
    annualIncome: string;
    childLocation: string;
    workCity: string;
    hasHousing: string;
    hasCar: string;
    nativePlace: string;
    childDescription: string;
    parentName: string;
    parentPhone: string;
    parentLocation: string;
    isVerified: boolean;
    profileImage: string;
  } | null = null;

  if (userProfile && userProfile.id === id) {
    // 用户自己的资料 - 应用隐私设置
    const displayPhone = userSettings.privacy.showContact 
      ? userProfile.parentPhone 
      : maskPhone(userProfile.parentPhone);
    
    profile = {
      id: userProfile.id,
      childName: userProfile.childName,
      childAge: userProfile.childAge,
      childGender: userProfile.childGender,
      zodiacSign: userProfile.zodiacSign || '未知',
      childEducation: userProfile.childEducation,
      childOccupation: userProfile.childOccupation,
      annualIncome: userProfile.annualIncome,
      childLocation: userSettings.privacy.showLocation ? userProfile.childLocation : '隐私',
      workCity: userProfile.workCity,
      hasHousing: userProfile.hasHousing,
      hasCar: userProfile.hasCar,
      nativePlace: userProfile.nativePlace,
      childDescription: userProfile.childDescription,
      parentName: userProfile.parentName,
      parentPhone: displayPhone,
      parentLocation: userSettings.privacy.showLocation ? userProfile.parentLocation : '隐私',
      isVerified: userProfile.isVerified,
      profileImage: userProfile.profileImage
    };
  } else {
    // 从集中管理的mock数据获取
    const mockProfile = getMockProfileById(id || '');
    if (mockProfile) {
      profile = {
        id: mockProfile.id,
        childName: mockProfile.childName,
        childAge: mockProfile.childAge,
        childGender: mockProfile.childGender,
        zodiacSign: mockProfile.zodiacSign,
        childEducation: mockProfile.childEducation,
        childOccupation: mockProfile.childOccupation,
        annualIncome: mockProfile.annualIncome,
        childLocation: mockProfile.childLocation,
        workCity: mockProfile.workCity,
        hasHousing: mockProfile.hasHousing,
        hasCar: mockProfile.hasCar,
        nativePlace: mockProfile.nativePlace,
        childDescription: mockProfile.childDescription,
        parentName: mockProfile.parentName,
        parentPhone: mockProfile.parentPhone,
        parentLocation: mockProfile.parentLocation,
        isVerified: mockProfile.isVerified,
        profileImage: mockProfile.profileImage
      };
    }
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

  const isOwnProfile = userProfile && userProfile.id === id;

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
              {profile.childGender === 'male' ? '男' : '女'} · 属{profile.zodiacSign}
            </p>
          </div>
        </div>

        {/* Key Attributes */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-[#F5F5F3] rounded-lg">
            <MapPin size={18} className="text-[#FF8C42]" />
            <span className="text-gray-800">{profile.workCity}</span>
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

      {/* More Details - 硬通货信息 */}
      <div className="mx-4 mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-3">更多信息</h3>
        <div className="warm-card space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-[#E8E8E6]">
            <span className="text-gray-600">年收入</span>
            <span className="font-semibold text-gray-800">{profile.annualIncome || '未填写'}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-[#E8E8E6]">
            <span className="text-gray-600 flex items-center gap-1">
              <HomeIcon className="w-3.5 h-3.5" />
              住房
            </span>
            <span className="font-semibold text-[#FF8C42]">
              {profile.hasHousing === 'yes' ? '有房' : profile.hasHousing === 'no' ? '无房' : '不便透露'}
            </span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-[#E8E8E6]">
            <span className="text-gray-600 flex items-center gap-1">
              <Car className="w-3.5 h-3.5" />
              车产
            </span>
            <span className="font-semibold text-gray-800">
              {profile.hasCar === 'yes' ? '有车' : profile.hasCar === 'no' ? '无车' : '不便透露'}
            </span>
          </div>
          {profile.nativePlace && (
            <div className="flex justify-between items-center pb-3 border-b border-[#E8E8E6]">
              <span className="text-gray-600">籍贯</span>
              <span className="font-semibold text-gray-800">{profile.nativePlace}</span>
            </div>
          )}
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
            <span className="font-semibold text-gray-800">
              {isOwnProfile ? profile.parentPhone : maskPhone(profile.parentPhone)}
            </span>
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
