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
 * 
 * accepted 解锁逻辑：
 * - 当前用户发出的申请被对方接受（status === 'accepted'）→ 展示完整电话号码
 * - 其他情况 → 脱敏展示（138****8888）
 */

import { useParams } from 'wouter';
import { useLocation } from 'wouter';
import { ArrowLeft, MapPin, Briefcase, BookOpen, CheckCircle, Phone, Heart, Home as HomeIcon, Car, Clock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useAuth } from '@/contexts/AuthContext';
import { useContacts } from '@/contexts/ContactContext';
import { maskPhone } from '@/lib/utils';
import { getMockProfileById } from '@/lib/mockData';

export default function ProfileDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [isLiked, setIsLiked] = useState(false);
  const { userProfile } = useProfile();
  const { userSettings } = useSettings();
  const { userId } = useAuth();
  const { contactRequests } = useContacts();

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
    // 用户自己的资料 - 始终显示完整号码
    // 隐私设置（showContact）只影响其他人看到的内容，不影响用户查看自己的号码
    const displayPhone = userProfile.parentPhone;
    
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

  // 查找当前用户向该资料发送的申请
  const myRequest = contactRequests.find(
    req => req.fromUserId === userId && req.toProfileId === id
  );

  // accepted 解锁：当申请被接受时，展示完整电话号码
  const isAccepted = myRequest?.status === 'accepted';
  const displayPhone = isOwnProfile
    ? profile.parentPhone  // 自己的资料：已按隐私设置处理
    : isAccepted
      ? profile.parentPhone  // 申请已被接受：展示完整号码
      : maskPhone(profile.parentPhone);  // 其他情况：脱敏

  // 申请状态信息
  const getApplicationStatus = () => {
    if (!myRequest) return null;
    switch (myRequest.status) {
      case 'sent':
        return { icon: <Clock size={16} className="text-blue-500" />, text: '申请已发送，等待对方回复', color: 'bg-blue-50 border-blue-200 text-blue-700' };
      case 'viewed':
        return { icon: <Clock size={16} className="text-yellow-500" />, text: '对方已查看您的申请，请耐心等待', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' };
      case 'accepted':
        return { icon: <CheckCircle size={16} className="text-green-500" />, text: '申请已被接受！对方电话已解锁', color: 'bg-green-50 border-green-200 text-green-700' };
      case 'rejected':
        return { icon: <XCircle size={16} className="text-gray-400" />, text: '对方暂时婉拒了您的申请', color: 'bg-gray-50 border-gray-200 text-gray-500' };
      default:
        return null;
    }
  };

  const applicationStatus = getApplicationStatus();

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

      {/* 申请状态提示条 */}
      {applicationStatus && (
        <div className={`mx-4 mt-4 flex items-center gap-2 border rounded-lg px-4 py-3 ${applicationStatus.color}`}>
          {applicationStatus.icon}
          <span className="text-sm font-semibold">{applicationStatus.text}</span>
        </div>
      )}

      {/* Profile Image */}
      <div className="relative h-64 bg-gradient-to-br from-[#FF8C42] to-[#FF7A2F] overflow-hidden mt-4">
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
            <span className="text-gray-600 flex items-center gap-1">
              <Phone size={14} />
              联系方式
            </span>
            <div className="flex items-center gap-2">
              {isAccepted && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">已解锁</span>
              )}
              <span className={`font-semibold ${isAccepted ? 'text-green-700 text-base' : 'text-gray-800'}`}>
                {displayPhone}
              </span>
            </div>
          </div>
          {!isOwnProfile && !isAccepted && (
            <p className="text-xs text-gray-400 text-right">申请被接受后可查看完整号码</p>
          )}
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
        {isOwnProfile ? (
          <Button
            className="flex-1 bg-gray-300 text-gray-600 cursor-not-allowed"
            disabled
          >
            我的资料
          </Button>
        ) : myRequest && (myRequest.status === 'sent' || myRequest.status === 'viewed') ? (
          <Button
            className="flex-1 bg-blue-100 text-blue-700 cursor-not-allowed"
            disabled
          >
            已申请联系
          </Button>
        ) : myRequest?.status === 'accepted' ? (
          <Button
            className="flex-1 bg-green-500 hover:bg-green-600 text-white"
            onClick={() => window.open(`tel:${profile!.parentPhone}`)}
          >
            📞 拨打电话
          </Button>
        ) : myRequest?.status === 'rejected' ? (
          <Button
            className="flex-1 bg-gray-300 text-gray-600 cursor-not-allowed"
            disabled
          >
            已婉拒
          </Button>
        ) : (
          <Button
            className="flex-1 bg-[#FF8C42] hover:bg-[#FF7A2F] text-white"
            onClick={() => setLocation(`/contact/${profile!.id}`)}
          >
            申请联系
          </Button>
        )}
      </div>
    </div>
  );
}
